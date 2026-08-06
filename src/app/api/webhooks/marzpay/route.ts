import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendTelegramNotification } from "@/lib/notifications";
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    console.log("Webhook RAW Body:", rawBody);

    const secret = process.env.MARZPAY_WEBHOOK_SECRET;
    if (secret) {
      const signatureHeader = req.headers.get('X-MarzPay-Signature');
      const timestampHeader = req.headers.get('X-MarzPay-Timestamp');
      
      if (signatureHeader) {
        // Many webhook providers with timestamp headers (like Stripe) use timestamp.rawBody as the payload
        const signedPayload = timestampHeader ? `${timestampHeader}.${rawBody}` : rawBody;
        
        const expectedSignatureHex = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
        const expectedSignatureB64 = crypto.createHmac('sha256', secret).update(signedPayload).digest('base64');
        
        // Also check against just the rawBody in case the timestamp isn't part of the HMAC
        const expectedSignatureHexNoTs = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
        
        if (
          signatureHeader !== expectedSignatureHex && 
          signatureHeader !== expectedSignatureB64 && 
          signatureHeader !== expectedSignatureHexNoTs
        ) {
          console.error('Webhook signature mismatch!', { expectedHex: expectedSignatureHex, expectedHexNoTs: expectedSignatureHexNoTs, received: signatureHeader });
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
      } else {
        console.warn('Missing signature header, continuing without validation');
      }
    }

    // 1. Try to parse JSON. If it fails, try URL-encoded.
    let data: any = {};
    try {
      data = JSON.parse(rawBody);
    } catch (parseError) {
      try {
        const params = new URLSearchParams(rawBody);
        for (const [key, value] of params.entries()) {
          data[key] = value;
        }
      } catch (urlError) {
        console.error("Webhook payload is neither JSON nor URL-encoded", rawBody);
        return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
      }
    }

    // Log the parsed payload for debugging
    await prisma.auditLog.create({
      data: {
        adminId: "SYSTEM",
        action: "MARZPAY_WEBHOOK_RECEIVED",
        details: JSON.stringify({ body: data, headers: Object.fromEntries(req.headers.entries()) })
      }
    }).catch((e: any) => console.error("Failed to write audit log:", e));

    if (!data) {
      return NextResponse.json({ error: "Empty payload" }, { status: 400 });
    }

    // Extract transaction ID. Support multiple common field names.
    const transactionId = data.transactionId || data.transaction_id || data.reference || data.tx_ref || data.id || data.transaction?.reference;

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transaction identifier" }, { status: 400 });
    }

    // Check if status means success
    const statusStr = String(data.status || data.state || data.transaction?.status || '').toLowerCase();
    const isSuccess = ['completed', 'successful', 'success', 'paid', 'approved', '1', 'true'].includes(statusStr);

    if (isSuccess) {
      const order = await prisma.order.findUnique({
        where: { referenceId: transactionId },
        include: { package: true }
      });

      if (!order) {
        console.error("Webhook received for unknown transaction:", transactionId);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (order.status === 'COMPLETED') {
        return NextResponse.json({ message: "Order already processed" }, { status: 200 });
      }

      // Update Order
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED' }
      });

      // Activate Subscription
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (order.package?.durationDays || 14));

      if (order.userId && order.packageId) {
        const existingSub = await prisma.subscription.findFirst({
          where: { userId: order.userId, packageId: order.packageId }
        });

        if (existingSub) {
          let newExpiresAt = new Date(existingSub.expiresAt);
          if (newExpiresAt < new Date()) newExpiresAt = new Date();
          newExpiresAt.setDate(newExpiresAt.getDate() + (order.package?.durationDays || 14));

          await prisma.subscription.update({
            where: { id: existingSub.id },
            data: { status: 'ACTIVE', expiresAt: newExpiresAt }
          });
        } else {
          await prisma.subscription.create({
            data: {
              userId: order.userId,
              packageId: order.packageId,
              status: 'ACTIVE',
              expiresAt
            }
          });
        }

        // Activate User Status
        await prisma.user.update({
          where: { id: order.userId },
          data: { status: 'ACTIVE' }
        });
        
        // Notify Admin
        await sendTelegramNotification(`💰 <b>New VIP Payment!</b>\n\nPackage: ${order.package?.name}\nAmount: ${order.amount} UGX\nPhone: ${order.phone}`);
      }

      return NextResponse.json({ message: "Subscription activated" }, { status: 200 });
    } else {
      // Handle failed payment
      const order = await prisma.order.findUnique({
        where: { referenceId: transactionId }
      });

      if (order && order.status !== 'COMPLETED') {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'FAILED' }
        });
      }
      return NextResponse.json({ message: "Payment failed/ignored" }, { status: 200 });
    }

  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

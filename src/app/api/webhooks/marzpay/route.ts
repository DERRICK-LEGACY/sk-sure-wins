import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendTelegramNotification } from '@/lib/notifications';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    if (payload.event_type === 'collection.completed' && payload.transaction?.status === 'completed') {
      const referenceId = payload.transaction.reference;
      
      const order = await prisma.order.findUnique({ 
        where: { referenceId }, 
        include: { package: true } 
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Idempotency check
      if (order.status === 'COMPLETED') {
        return NextResponse.json({ success: true, message: "Already processed" }, { status: 200 });
      }

      // 1. Mark order as COMPLETED
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED' }
      });

      // 2. Activate Subscription
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (order.package?.durationDays || 14));

      const existingSub = await prisma.subscription.findFirst({
        where: { userId: order.userId!, packageId: order.packageId! }
      });

      if (existingSub) {
        await prisma.subscription.update({
          where: { id: existingSub.id },
          data: { status: 'ACTIVE', expiresAt }
        });
      } else {
        await prisma.subscription.create({
          data: {
            userId: order.userId!,
            packageId: order.packageId!,
            status: 'ACTIVE',
            expiresAt
          }
        });
      }

      // 3. Update User status to ACTIVE
      await prisma.user.update({
        where: { id: order.userId! },
        data: { status: 'ACTIVE' }
      });
      
      // Notify Admin
      await sendTelegramNotification(`💰 <b>New VIP Payment!</b>\n\nPackage: ${order.package?.name}\nAmount: ${order.amount} UGX\nPhone: ${order.phone}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

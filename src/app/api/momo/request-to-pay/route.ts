import { NextRequest, NextResponse } from 'next/server';
import { requestToPay } from '@/lib/mtn-momo';
import { createAdminClient } from '@/lib/supabase/admin';
import { validatePhone, validateName, validatePackageAndPrice, normalizePhone, toMsisdn, sanitizeText, getTierFromPackage } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, name, packageName, amount } = body;

    // ===== RATE LIMITING =====
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateCheck = checkRateLimit(`payment:${clientIp}`, RATE_LIMITS.PAYMENT_REQUEST);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many payment attempts. Try again in ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    // ===== INPUT VALIDATION =====
    const phoneCheck = validatePhone(phone);
    if (!phoneCheck.valid) {
      return NextResponse.json({ error: phoneCheck.error }, { status: 400 });
    }

    const nameCheck = validateName(name);
    if (!nameCheck.valid) {
      return NextResponse.json({ error: nameCheck.error }, { status: 400 });
    }

    const priceCheck = validatePackageAndPrice(packageName, amount);
    if (!priceCheck.valid) {
      return NextResponse.json({ error: priceCheck.error }, { status: 400 });
    }

    // ===== PREPARE TRANSACTION =====
    const normalized = normalizePhone(phone);
    const msisdn = toMsisdn(phone);
    const externalId = uuidv4();
    const sanitizedName = sanitizeText(name, 100);
    const tier = getTierFromPackage(packageName);

    // Create PENDING transaction in Supabase
    const supabase = createAdminClient();
    const { data: transaction, error: dbError } = await supabase
      .from('transactions')
      .insert({
        phone: normalized,
        name: sanitizedName,
        package: packageName,
        amount,
        currency: 'UGX',
        mtn_reference_id: externalId,
        status: 'PENDING',
        network: 'MTN',
      })
      .select()
      .single();

    if (dbError) {
      console.error('[PAYMENT] DB insert error:', dbError);
      return NextResponse.json({ error: 'Failed to create transaction.' }, { status: 500 });
    }

    // ===== CALL MTN MOMO API =====
    try {
      const { referenceId } = await requestToPay({
        amount,
        phone: msisdn,
        externalId,
        payerMessage: 'VIP Subscription',
        payeeNote: 'VIP Subscription',
      });

      // Update transaction with the MTN reference ID
      await supabase
        .from('transactions')
        .update({ mtn_reference_id: referenceId })
        .eq('id', transaction.id);

      return NextResponse.json({
        success: true,
        referenceId,
        message: 'Payment request sent. Please check your phone and enter your PIN.',
        isSandbox: process.env.MTN_MOMO_ENVIRONMENT === 'sandbox',
      });
    } catch (momoError: any) {
      // Mark transaction as failed
      await supabase
        .from('transactions')
        .update({ status: 'FAILED' })
        .eq('id', transaction.id);

      console.error('[PAYMENT] MTN MOMO error:', momoError);
      return NextResponse.json(
        { error: 'Failed to send payment request to your phone. Please try again.' },
        { status: 502 }
      );
    }
  } catch (err: any) {
    console.error('[PAYMENT] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

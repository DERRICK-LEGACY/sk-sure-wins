import { NextResponse } from 'next/server';
import { requestAirtelPayment } from '@/lib/airtel';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, name, packageName, amount } = body;

    if (!phone || !name || !packageName || !amount) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // 1. Clean up phone (Ugandan standard: 10 digits starting with 0, or 12 starting with 256)
    let msisdn = phone.replace(/[^0-9]/g, '');
    if (msisdn.startsWith('0')) {
      msisdn = '256' + msisdn.slice(1);
    } else if (msisdn.length === 9) {
      msisdn = '256' + msisdn;
    }

    // 2. Generate a reference ID for our system & Airtel
    const externalId = crypto.randomUUID();

    // 3. Create the transaction in Supabase
    const supabase = createAdminClient();
    const { data: transaction, error: dbError } = await supabase
      .from('transactions')
      .insert({
        user_name: name.trim(),
        user_phone: msisdn,
        package: packageName,
        amount: amount,
        status: 'PENDING',
        payment_method: 'AIRTEL_MONEY'
      })
      .select()
      .single();

    if (dbError) {
      console.error('[AIRTEL] DB insert error:', dbError);
      return NextResponse.json({ error: 'Failed to create transaction.' }, { status: 500 });
    }

    // 4. Call Airtel API
    try {
      const response = await requestAirtelPayment({
        amount,
        phone: msisdn,
        referenceId: externalId
      });

      // Update transaction with the reference
      await supabase
        .from('transactions')
        .update({ mtn_reference_id: externalId }) // Reusing this field or we can add airtel_reference_id
        .eq('id', transaction.id);

      return NextResponse.json({
        success: true,
        referenceId: externalId,
        message: 'Payment request sent. Please check your phone and enter your PIN.',
        isSandbox: process.env.AIRTEL_ENVIRONMENT === 'standard'
      });
    } catch (airtelError: any) {
      // Mark transaction as failed
      await supabase
        .from('transactions')
        .update({ status: 'FAILED' })
        .eq('id', transaction.id);

      console.error('[AIRTEL] Push error:', airtelError);
      return NextResponse.json(
        { error: 'Failed to send payment request to your phone. Please try again.' },
        { status: 502 }
      );
    }
  } catch (err: any) {
    console.error('[AIRTEL] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

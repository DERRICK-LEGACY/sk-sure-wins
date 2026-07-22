import { NextRequest, NextResponse } from 'next/server';
import { getTransactionStatus } from '@/lib/mtn-momo';
import { createAdminClient } from '@/lib/supabase/admin';
import { getTierFromPackage, getExpiryDate } from '@/lib/validation';

/**
 * MTN MOMO Callback Webhook.
 * MTN sends a POST to this URL when a transaction is completed.
 * This is a secondary confirmation mechanism — the status polling also handles activation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[MOMO CALLBACK] Received:', JSON.stringify(body));

    const referenceId = body.externalId || body.referenceId;
    if (!referenceId) {
      console.error('[MOMO CALLBACK] Missing referenceId in callback body');
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const supabase = createAdminClient();

    // Look up the transaction
    const { data: transaction } = await supabase
      .from('transactions')
      .select('*')
      .eq('mtn_reference_id', referenceId)
      .single();

    if (!transaction) {
      console.error('[MOMO CALLBACK] Transaction not found for referenceId:', referenceId);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Skip if already processed
    if (transaction.status === 'SUCCESSFUL' || transaction.status === 'FAILED') {
      return NextResponse.json({ received: true, already_processed: true }, { status: 200 });
    }

    // Verify with MTN directly (don't trust the callback body blindly)
    try {
      const momoStatus = await getTransactionStatus(referenceId);

      if (momoStatus.status === 'SUCCESSFUL') {
        const tier = getTierFromPackage(transaction.package);
        const expiryDate = getExpiryDate(tier);

        // Check for existing user
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('phone', transaction.phone)
          .single();

        if (existingUser) {
          await supabase
            .from('users')
            .update({
              package: transaction.package,
              expiry_date: expiryDate,
              is_active: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingUser.id);
        } else {
          await supabase
            .from('users')
            .insert({
              phone: transaction.phone,
              name: transaction.name,
              package: transaction.package,
              expiry_date: expiryDate,
              is_active: true,
            });
        }

        await supabase
          .from('transactions')
          .update({
            status: 'SUCCESSFUL',
            mtn_financial_id: momoStatus.financialTransactionId,
            completed_at: new Date().toISOString(),
          })
          .eq('mtn_reference_id', referenceId);

      } else if (momoStatus.status === 'FAILED') {
        await supabase
          .from('transactions')
          .update({
            status: 'FAILED',
            completed_at: new Date().toISOString(),
          })
          .eq('mtn_reference_id', referenceId);
      }
    } catch (verifyError) {
      console.error('[MOMO CALLBACK] Verification error:', verifyError);
    }

    // Always return 200 to MTN so they stop retrying
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('[MOMO CALLBACK] Error:', err);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

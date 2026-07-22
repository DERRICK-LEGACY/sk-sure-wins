import { NextRequest, NextResponse } from 'next/server';
import { getTransactionStatus } from '@/lib/mtn-momo';
import { createAdminClient } from '@/lib/supabase/admin';
import { getTierFromPackage, getExpiryDate } from '@/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ referenceId: string }> }
) {
  try {
    const { referenceId } = await params;

    if (!referenceId) {
      return NextResponse.json({ error: 'Missing reference ID.' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // First check our local DB
    const { data: transaction } = await supabase
      .from('transactions')
      .select('*')
      .eq('mtn_reference_id', referenceId)
      .single();

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found.' }, { status: 404 });
    }

    // If already resolved, return immediately
    if (transaction.status === 'SUCCESSFUL' || transaction.status === 'FAILED') {
      return NextResponse.json({
        status: transaction.status,
        financialTransactionId: transaction.mtn_financial_id,
      });
    }

    // Otherwise, poll MTN for the latest status
    try {
      const momoStatus = await getTransactionStatus(referenceId);

      if (momoStatus.status === 'SUCCESSFUL') {
        // ===== PAYMENT CONFIRMED — ACTIVATE USER =====
        const tier = getTierFromPackage(transaction.package);
        const expiryDate = getExpiryDate(tier);

        // Check if user already exists (upgrade/renewal)
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('phone', transaction.phone)
          .single();

        if (existingUser) {
          // Update existing user's package and expiry
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
          // Insert new user
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

        // Update transaction record
        await supabase
          .from('transactions')
          .update({
            status: 'SUCCESSFUL',
            mtn_financial_id: momoStatus.financialTransactionId,
            completed_at: new Date().toISOString(),
          })
          .eq('mtn_reference_id', referenceId);

        return NextResponse.json({
          status: 'SUCCESSFUL',
          financialTransactionId: momoStatus.financialTransactionId,
          phone: transaction.phone,
        });

      } else if (momoStatus.status === 'FAILED') {
        // Mark as failed
        await supabase
          .from('transactions')
          .update({
            status: 'FAILED',
            completed_at: new Date().toISOString(),
          })
          .eq('mtn_reference_id', referenceId);

        return NextResponse.json({
          status: 'FAILED',
          reason: momoStatus.reason?.message || 'Payment was declined or cancelled.',
        });
      }

      // Still pending
      return NextResponse.json({ status: 'PENDING' });

    } catch (momoError: any) {
      console.error('[STATUS] MTN MOMO poll error:', momoError);
      // Don't fail hard — just return pending
      return NextResponse.json({ status: 'PENDING' });
    }
  } catch (err: any) {
    console.error('[STATUS] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

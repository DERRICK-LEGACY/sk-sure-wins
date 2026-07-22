import { NextResponse } from 'next/server';
import { checkAirtelTransactionStatus } from '@/lib/airtel';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: referenceId } = await params;
    if (!referenceId) {
      return NextResponse.json({ error: 'Missing reference ID.' }, { status: 400 });
    }

    // Check with Airtel API
    const response = await checkAirtelTransactionStatus(referenceId);

    // Airtel Status Mapping:
    // TIP: It varies by integration, but standard values are usually "TS" (Success), "TF" (Failed), "TIP" (In Progress)
    const airtelStatus = response?.data?.transaction?.status;
    let finalStatus = 'PENDING';

    if (airtelStatus === 'TS') {
      finalStatus = 'SUCCESSFUL';
    } else if (airtelStatus === 'TF') {
      finalStatus = 'FAILED';
    }

    if (finalStatus !== 'PENDING') {
      const supabase = createAdminClient();
      await supabase
        .from('transactions')
        .update({ status: finalStatus })
        .eq('mtn_reference_id', referenceId);
    }

    return NextResponse.json({
      status: finalStatus,
      originalStatus: airtelStatus,
      reason: response?.data?.transaction?.message || ''
    });

  } catch (err: any) {
    console.error('[AIRTEL STATUS] Error:', err);
    // Return PENDING on network error to keep polling
    return NextResponse.json({ status: 'PENDING' });
  }
}

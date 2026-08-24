import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendExpiryWarningSMS, sendExpiredLockoutSMS } from '@/lib/sms';

// Define the API Route for the Cron Job
export async function GET(request: Request) {
  // Simple security check (replace with a stronger secret in production)
  const authHeader = request.headers.get('authorization');
  if (
    process.env.NODE_ENV === 'production' && 
    authHeader !== `Bearer ${process.env.CRON_SECRET || 'sk-cron-secret-123'}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    
    // 1. Database Housekeeping: Mark past subscriptions as EXPIRED
    const expiredUpdateResult = await prisma.subscription.updateMany({
      where: {
        status: 'ACTIVE',
        expiresAt: { lt: now }
      },
      data: {
        status: 'EXPIRED'
      }
    });

    console.log(`[CRON] Marked ${expiredUpdateResult.count} subscriptions as EXPIRED.`);

    // 2. Identify users who JUST expired (for SMS)
    // To avoid spamming them every day, we should only find ones that expired in the last 24 hours.
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentlyExpiredSubs = await prisma.subscription.findMany({
      where: {
        status: 'EXPIRED',
        expiresAt: {
          gte: yesterday,
          lt: now
        }
      },
      include: { user: true }
    });

    for (const sub of recentlyExpiredSubs) {
      if (sub.user && sub.user.phone) {
        await sendExpiredLockoutSMS(sub.user.phone);
      }
    }

    // 3. Identify users expiring SOON (e.g., within 3 days)
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    // Example: Warning for exactly 3 days out
    const expiringIn3DaysSubs = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          gte: twoDaysFromNow,
          lt: threeDaysFromNow
        }
      },
      include: { user: true }
    });

    for (const sub of expiringIn3DaysSubs) {
      if (sub.user && sub.user.phone) {
        await sendExpiryWarningSMS(sub.user.phone, 3);
      }
    }

    return NextResponse.json({
      success: true,
      housekeepingCount: expiredUpdateResult.count,
      recentlyExpiredNotified: recentlyExpiredSubs.length,
      expiringSoonNotified: expiringIn3DaysSubs.length
    });

  } catch (error: unknown) {
    console.error("[CRON ERROR]", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

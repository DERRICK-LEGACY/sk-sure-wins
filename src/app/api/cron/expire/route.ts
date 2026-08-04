import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  // Optional: add a secret token check here if not using Vercel Cron natively
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const now = new Date();

    // Find all ACTIVE subscriptions that have passed their expiresAt date
    const expiredSubs = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          lt: now,
        },
      },
    });

    if (expiredSubs.length > 0) {
      // Mark them as EXPIRED
      await prisma.subscription.updateMany({
        where: {
          id: {
            in: expiredSubs.map(sub => sub.id),
          },
        },
        data: {
          status: 'EXPIRED',
        },
      });

      // Optionally update user status if they have no other active subscriptions
      for (const sub of expiredSubs) {
        const otherActive = await prisma.subscription.findFirst({
          where: {
            userId: sub.userId,
            status: 'ACTIVE',
            id: { not: sub.id },
          },
        });

        if (!otherActive) {
          await prisma.user.update({
            where: { id: sub.userId },
            data: { status: 'PENDING' },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Expiry check completed successfully',
      expiredCount: expiredSubs.length,
    });
  } catch (error) {
    console.error('Expiry Cron Error:', error);
    return NextResponse.json({ error: 'Failed to process expiry' }, { status: 500 });
  }
}

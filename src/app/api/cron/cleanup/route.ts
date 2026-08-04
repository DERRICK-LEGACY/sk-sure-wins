import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  // Optional: add a secret token check here if not using Vercel Cron natively
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    // 1. Delete PENDING orders older than 24 hours
    const deletedOrders = await prisma.order.deleteMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: yesterday,
        },
      },
    });

    // 2. Delete PENDING users older than 24 hours
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: yesterday,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Cleanup completed successfully',
      deletedOrders: deletedOrders.count,
      deletedUsers: deletedUsers.count,
    });
  } catch (error) {
    console.error('Cleanup Cron Error:', error);
    return NextResponse.json({ error: 'Failed to cleanup' }, { status: 500 });
  }
}

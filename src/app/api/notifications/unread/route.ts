import prisma from '@/lib/db';
import { NextResponse } from 'next/server';
import { getVipSession } from '@/app/actions';

export async function GET() {
  try {
    const session = await getVipSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const unreadCount = await prisma.notification.count({
      where: { userId: session.id, isRead: false }
    });

    const notifications = await prisma.notification.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ unreadCount, notifications });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

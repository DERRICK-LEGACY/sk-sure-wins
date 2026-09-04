import prisma from '@/lib/db';
import { NextResponse } from 'next/server';
import { getVipSession } from '@/app/actions';

export async function POST() {
  try {
    const session = await getVipSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.notification.updateMany({
      where: { userId: session.id, isRead: false },
      data: { isRead: true }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

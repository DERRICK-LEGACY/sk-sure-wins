import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getVipSession } from '@/app/actions';

export async function POST(req: NextRequest) {
  try {
    const session = await getVipSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await req.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    const { endpoint, keys } = subscription;
    
    const existing = await prisma.pushSubscription.findUnique({
      where: { endpoint }
    });

    if (existing) {
      if (existing.userId !== session.id) {
         await prisma.pushSubscription.update({
            where: { endpoint },
            data: { userId: session.id, p256dh: keys.p256dh, auth: keys.auth }
         });
      }
      return NextResponse.json({ success: true, message: 'Subscription exists' });
    }

    await prisma.pushSubscription.create({
      data: {
        userId: session.id,
        endpoint: endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth
      }
    });

    return NextResponse.json({ success: true, message: 'Subscription saved' });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

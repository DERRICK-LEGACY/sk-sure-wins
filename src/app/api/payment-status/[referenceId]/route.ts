import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ referenceId: string }> }) {
  try {
    const { referenceId } = await params;
    
    const order = await prisma.order.findUnique({
      where: { referenceId }
    });

    if (!order) {
      return NextResponse.json({ status: 'NOT_FOUND' }, { status: 404 });
    }

    if (order.status === 'COMPLETED') {
      return NextResponse.json({ status: 'SUCCESSFUL' });
    } else if (order.status === 'FAILED') {
      return NextResponse.json({ status: 'FAILED', reason: 'Payment failed' });
    } else {
      return NextResponse.json({ status: 'PENDING' });
    }
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

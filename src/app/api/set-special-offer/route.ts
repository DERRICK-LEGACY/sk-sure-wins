import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // 1. Set all to false
    await prisma.package.updateMany({
      data: {
        isSpecialOffer: false
      }
    });

    // 2. Set the daily special to true
    const updated = await prisma.package.updateMany({
      where: {
        name: 'Premium: Daily Special Ticket'
      },
      data: {
        isSpecialOffer: true
      }
    });

    return NextResponse.json({ success: true, updated: updated.count });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

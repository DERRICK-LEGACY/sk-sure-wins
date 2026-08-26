import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    await prisma.package.upsert({
      where: { name: 'Book: AMAZIMA AMAKUSIKE' },
      update: { price: 35000 },
      create: {
        name: 'Book: AMAZIMA AMAKUSIKE',
        price: 35000,
        durationDays: 36500,
        isActive: true
      }
    });
    return NextResponse.json({ success: true, message: 'Book seeded' });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

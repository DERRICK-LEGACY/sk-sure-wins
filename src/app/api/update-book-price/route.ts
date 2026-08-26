import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const result = await prisma.package.update({
      where: { name: 'Book: AMAZIMA AMAKUSIKE' },
      data: { price: 35000 }
    });
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error updating price:', error);
    return NextResponse.json({ error: 'Failed to update price' }, { status: 500 });
  }
}

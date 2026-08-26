import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const pkgName = 'Book: AMAZIMA AMAKUSIKE';
    const existing = await prisma.package.findUnique({
      where: { name: pkgName }
    });
    
    if (existing) {
      await prisma.package.update({
        where: { name: pkgName },
        data: { price: 35000 }
      });
    } else {
      await prisma.package.create({
        data: {
          name: pkgName,
          price: 35000,
          durationDays: 36500,
          isActive: true
        }
      });
    }
    return NextResponse.json({ success: true, message: 'Book seeded' });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

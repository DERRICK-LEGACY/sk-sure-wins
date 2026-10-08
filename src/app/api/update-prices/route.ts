import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Update Silver VIP to 60000
    await prisma.package.updateMany({
      where: { name: 'Silver: VIP' },
      data: { price: 60000 }
    });
    
    // 2. Update Silver: ODD 8-10 to 80000
    await prisma.package.updateMany({
      where: { name: 'Silver: ODD 8-10' },
      data: { price: 80000 }
    });

    const packages = await prisma.package.findMany({
      where: { name: { startsWith: 'Silver' } }
    });

    return NextResponse.json({ success: true, message: "Prices updated successfully", packages });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

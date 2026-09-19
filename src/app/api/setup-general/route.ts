import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // 1. Create General Ticket Package
    const pkg = await prisma.package.upsert({
      where: { name: 'General Ticket' },
      update: {},
      create: {
        name: 'General Ticket',
        price: 0,
        durationDays: 365,
        isActive: true
      }
    });

    // 2. Retroactively link all existing tickets to "ALL PACKAGE"
    const allPkg = await prisma.package.findFirst({
      where: {
        name: { contains: 'ALL PACKAGE', mode: 'insensitive' }
      }
    });

    if (allPkg) {
      const tickets = await prisma.ticket.findMany();
      let linkedCount = 0;
      for (const t of tickets) {
        // Check if exists using findFirst (to avoid relying on compound unique constraint if not setup perfectly)
        const existing = await prisma.ticketAudience.findFirst({
          where: {
            ticketId: t.id,
            packageId: allPkg.id
          }
        });

        if (!existing) {
          await prisma.ticketAudience.create({
            data: { ticketId: t.id, packageId: allPkg.id }
          });
          linkedCount++;
        }
      }
      return NextResponse.json({ success: true, pkg, linkedCount, allPkgName: allPkg.name });
    }

    return NextResponse.json({ success: true, pkg, linkedCount: 0, msg: 'ALL PACKAGE not found' });
  } catch (error: any) {
    console.error("API SETUP ERROR:", error);
    return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
  }
}

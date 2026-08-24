import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { audiences: { include: { package: true } } }
    });

    let count = 0;
    for (const t of tickets) {
      if (t.imageUrl.includes('placehold.co') || t.bookingCode === 'CDMDFR' || t.imageUrl.startsWith('/uploads/ticket-17')) {
        await prisma.ticketAudience.deleteMany({ where: { ticketId: t.id } });
        await prisma.ticket.delete({ where: { id: t.id } });
        count++;
      }
    }
    return NextResponse.json({ success: true, message: `Deleted ${count} test tickets.` });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

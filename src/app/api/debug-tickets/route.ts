import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

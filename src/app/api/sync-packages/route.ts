import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  const packages = [
    // Bronze
    { name: 'Bronze: ODD 1.5 Normal', price: 10000, durationDays: 14 },
    { name: 'Bronze: ODD 2', price: 20000, durationDays: 14 },
    { name: 'Bronze: ODD 1.5 Lifechanger', price: 30000, durationDays: 14 },
    { name: 'Bronze: ODD 3', price: 30000, durationDays: 14 },
    { name: 'Bronze: ODD 4', price: 40000, durationDays: 14 },
    { name: 'Bronze: ODD 5', price: 50000, durationDays: 14 },
    // Silver
    { name: 'Silver: VIP', price: 50000, durationDays: 14 },
    { name: 'Silver: AKATAMBULA', price: 50000, durationDays: 30 },
    { name: 'Silver: ODD 8-10', price: 60000, durationDays: 14 },
    { name: 'Silver: VVIP', price: 70000, durationDays: 14 },
    { name: 'Silver: ODD 20', price: 100000, durationDays: 14 },
    // Gold (Monthly = 30 days)
    { name: 'Gold: Akatafa/Akatemu', price: 50000, durationDays: 30 },
    { name: 'Gold: FAMILY', price: 80000, durationDays: 30 },
    { name: 'Gold: BIG STAKERS', price: 100000, durationDays: 30 },
    { name: 'Gold: ALL PACKAGES', price: 300000, durationDays: 30 },
    { name: 'Gold: SK Counter Attack', price: 350000, durationDays: 30 },
    { name: 'Gold: Account Management', price: 500000, durationDays: 30 },
    // Premium (3 Weeks = 21 days)
    { name: 'Premium: Rent Project', price: 50000, durationDays: 21 },
    { name: 'Premium: Boda boda Project', price: 50000, durationDays: 21 },
    { name: 'Premium: Back to school Project', price: 50000, durationDays: 21 },
    { name: 'Premium: 1M in 5 days', price: 50000, durationDays: 21 },
    // Life Changer (2 Weeks = 14 days)
    { name: 'Life Changer: ODD 1.20', price: 50000, durationDays: 14 },
    { name: 'Life Changer: ODD 1.30', price: 50000, durationDays: 14 },
    { name: 'Life Changer: ODD 1.50', price: 50000, durationDays: 14 },
  ];

  let added = 0;
  let updated = 0;

  try {
    for (const pkg of packages) {
      const existing = await prisma.package.findUnique({
        where: { name: pkg.name }
      });

      if (existing) {
        await prisma.package.update({
          where: { id: existing.id },
          data: pkg
        });
        updated++;
      } else {
        await prisma.package.create({
          data: pkg
        });
        added++;
      }
    }

    return NextResponse.json({ success: true, message: `Successfully synced packages! Added ${added}, Updated ${updated}.` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to sync packages." }, { status: 500 });
  }
}

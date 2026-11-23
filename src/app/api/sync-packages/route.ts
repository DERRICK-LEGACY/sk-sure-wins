import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  const packages = [
    // Bronze (1 Week = 7 days)
    { name: 'Bronze: ODD 1.5 Normal', price: 10000, durationDays: 7 },
    { name: 'Bronze: ODD 2', price: 20000, durationDays: 7 },
    { name: 'Bronze: ODD 3', price: 30000, durationDays: 7 },
    { name: 'Bronze: Daily Combo', price: 30000, durationDays: 7 },
    // Silver (2 Weeks = 14 days)
    { name: 'Silver: Life Changer', price: 30000, durationDays: 14 },
    { name: 'Silver: ODD 4', price: 40000, durationDays: 14 },
    { name: 'Silver: ODD 5', price: 50000, durationDays: 14 },
    { name: 'Silver: Ballistic Straight', price: 55000, durationDays: 14 },
    // Gold (3 Weeks = 21 days)
    { name: 'Gold: Akatafa/Akatemu', price: 50000, durationDays: 21 },
    { name: 'Gold: VIP', price: 60000, durationDays: 21 },
    { name: 'Gold: VVIP', price: 70000, durationDays: 21 },
    { name: 'Gold: ODD 10', price: 100000, durationDays: 21 },
    // Platinum (1 Month = 30 days)
    { name: 'Platinum: AKATAMBULA', price: 50000, durationDays: 30 },
    { name: 'Platinum: FAMILY', price: 80000, durationDays: 30 },
    { name: 'Platinum: BIG STAKERS', price: 90000, durationDays: 30 },
    { name: 'Platinum: ODD 20', price: 100000, durationDays: 30 },
    { name: 'Platinum: ALL PACKAGES', price: 300000, durationDays: 30 },
    { name: 'Platinum: Account Management', price: 500000, durationDays: 30 },
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

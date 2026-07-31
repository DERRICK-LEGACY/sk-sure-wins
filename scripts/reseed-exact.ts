import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // First, completely delete all existing packages (this will also cascade and delete associated tickets and subscriptions)
  // This ensures a perfectly clean slate with only the exact packages the user wants.
  await prisma.package.deleteMany({});
  
  const exactPackages = [
    // Bronze
    { name: 'Bronze: ODD 1.5 Normal', price: 10000, durationDays: 14 },
    { name: 'Bronze: ODD 1.5 Lifechanger', price: 30000, durationDays: 14 },
    { name: 'Bronze: ODD 2', price: 20000, durationDays: 14 },
    { name: 'Bronze: ODD 3', price: 30000, durationDays: 14 },
    // Silver
    { name: 'Silver: ODD 8-10', price: 60000, durationDays: 14 },
    { name: 'Silver: PROBLEM SOLVER', price: 70000, durationDays: 14 },
    { name: 'Silver: ODD 20', price: 100000, durationDays: 14 },
    { name: 'Silver: AKATAMBULA (1 Month)', price: 50000, durationDays: 30 },
    // Gold
    { name: 'Gold: VIP', price: 50000, durationDays: 14 },
    { name: 'Gold: VVIP', price: 60000, durationDays: 14 },
    { name: 'Gold: FAMILY', price: 80000, durationDays: 14 },
    { name: 'Gold: BIG STAKERS', price: 100000, durationDays: 14 },
    { name: 'Gold: ALL PACKAGE MONTHLY', price: 300000, durationDays: 30 },
    // Premium
    { name: 'Premium: Rent Project', price: 50000, durationDays: 14 },
    { name: 'Premium: Boda boda Project', price: 50000, durationDays: 14 },
    { name: 'Premium: Back to school Project', price: 50000, durationDays: 14 },
    { name: 'Premium: 1M in 5 days', price: 50000, durationDays: 14 },
    // Life Changer
    { name: 'Life Changer: ODD 1.20', price: 50000, durationDays: 14 },
    { name: 'Life Changer: ODD 1.30', price: 50000, durationDays: 14 },
    { name: 'Life Changer: ODD 1.50', price: 50000, durationDays: 14 },
  ];

  let count = 0;
  for (const pkg of exactPackages) {
    await prisma.package.create({
      data: pkg,
    });
    count++;
  }
  
  console.log(`Successfully deleted old packages and inserted exactly ${count} new packages.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

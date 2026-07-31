import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const packages = [
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
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { name: pkg.name },
      update: { price: pkg.price, durationDays: pkg.durationDays },
      create: pkg,
    });
  }
  console.log("All packages seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const packages = [
    { name: 'Silver: ODD 1.8 Normal', price: 15000, durationDays: 14 },
    { name: 'Gold: ODD 2.0 Normal', price: 20000, durationDays: 14 },
    { name: 'Premium', price: 30000, durationDays: 14 },
    { name: 'Life Changer', price: 50000, durationDays: 30 },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { name: pkg.name },
      update: {},
      create: pkg,
    });
  }
  console.log("Packages added.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

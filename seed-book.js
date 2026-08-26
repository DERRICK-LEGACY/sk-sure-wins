const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.package.upsert({
    where: { name: 'Book: AMAZIMA AMAKUSIKE' },
    update: {},
    create: {
      name: 'Book: AMAZIMA AMAKUSIKE',
      price: 50000,
      durationDays: 36500,
      isActive: true
    }
  });
  console.log('Book seeded.');
}
main().catch(console.error).finally(() => prisma.$disconnect());

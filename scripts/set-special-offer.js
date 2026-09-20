const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Set all to false
  await prisma.package.updateMany({
    data: {
      isSpecialOffer: false
    }
  });

  // 2. Set the daily special to true
  const updated = await prisma.package.updateMany({
    where: {
      name: 'Premium: Daily Special Ticket'
    },
    data: {
      isSpecialOffer: true
    }
  });

  console.log('Set special offer for Daily Special Ticket. Rows updated:', updated.count);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

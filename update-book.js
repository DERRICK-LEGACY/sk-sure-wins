const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.package.update({
    where: { name: 'Book: AMAZIMA AMAKUSIKE' },
    data: { price: 35000 }
  });
  console.log('Update result:', result);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.pushSubscription.count();
  console.log('Total subscriptions:', count);
  const subs = await prisma.pushSubscription.findMany();
  console.log(subs);
}

main().finally(() => prisma.$disconnect());

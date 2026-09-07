const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.pushSubscription.count();
  console.log('Total subscriptions:', count);
  const subs = await prisma.pushSubscription.findMany();
  console.log(subs);
}

main().finally(() => prisma.$disconnect());

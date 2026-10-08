require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL missing");
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Updating package prices in DB...");
  
  // 1. Update Silver VIP to 60000
  await prisma.package.updateMany({
    where: { name: 'Silver: VIP' },
    data: { price: 60000 }
  });
  
  // 2. Update Silver: ODD 8-10 to 80000
  await prisma.package.updateMany({
    where: { name: 'Silver: ODD 8-10' },
    data: { price: 80000 }
  });

  // Verify
  const packages = await prisma.package.findMany({
    where: { name: { startsWith: 'Silver' } }
  });
  console.log(packages);
  
  await prisma.$disconnect();
}

run().catch(console.error);

const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    // 1. Create a dummy user
    const user = await prisma.user.create({
      data: { phone: 'dummy_del_' + Date.now() }
    });
    console.log('Created dummy user:', user.id);

    // 2. Add some related records that completelyDeleteClient would normally cascade
    await prisma.notification.create({
      data: { userId: user.id, title: 'Test', message: 'Test msg' }
    });
    await prisma.subscription.create({
      data: { userId: user.id, packageId: (await prisma.package.findFirst()).id, expiresAt: new Date() }
    });

    // 3. Try deleting exactly as completelyDeleteClient does
    await prisma.order.updateMany({ where: { userId: user.id }, data: { userId: null } });
    await prisma.subscription.deleteMany({ where: { userId: user.id } });
    
    console.log('Attempting to delete user...');
    await prisma.user.delete({ where: { id: user.id } });
    console.log('Successfully deleted user via Prisma');

  } catch (error) {
    console.error('ERROR deleting user:', error);
  }
}

main().finally(() => prisma.$disconnect());

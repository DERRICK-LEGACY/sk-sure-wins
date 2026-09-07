const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    // Create a dummy user
    const user = await prisma.user.create({
      data: { phone: 'dummy_' + Date.now() }
    });
    console.log('Created user:', user.id);

    // Create a notification for this user
    await prisma.notification.create({
      data: { userId: user.id, title: 'Test', message: 'Test message' }
    });
    console.log('Created notification');

    // Attempt to completely delete client logic
    await prisma.order.updateMany({ where: { userId: user.id }, data: { userId: null } });
    await prisma.subscription.deleteMany({ where: { userId: user.id } });
    
    // Now try deleting user using standard delete
    await prisma.user.delete({ where: { id: user.id } });
    console.log('Successfully deleted user using standard delete with pg adapter');
  } catch (err) {
    console.error('ERROR during deletion:', err);
  }
}

main().finally(() => prisma.$disconnect());

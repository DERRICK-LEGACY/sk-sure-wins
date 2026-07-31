import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (admin) {
    console.log("Admin found in DB:", admin);
  } else {
    console.log("No ADMIN user found in DB.");
    console.log("ENV ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

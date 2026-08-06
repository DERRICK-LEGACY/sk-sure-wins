const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const ticket = await prisma.ticket.findFirst({ orderBy: { createdAt: 'desc' } });
  console.log(ticket);
}
main().finally(() => prisma.$disconnect());

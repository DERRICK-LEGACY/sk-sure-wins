import prisma from '../src/lib/db';

async function main() {
  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log('Recent Tickets:', tickets.map(x => ({ id: x.id, imageUrl: x.imageUrl })));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

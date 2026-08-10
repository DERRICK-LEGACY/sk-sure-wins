import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

// Read .env.production and extract POSTGRES_PRISMA_URL
const envContent = fs.readFileSync('.env.production', 'utf-8');
const lines = envContent.split('\n');
let dbUrl = '';
for (const line of lines) {
  if (line.startsWith('POSTGRES_PRISMA_URL=')) {
    dbUrl = line.split('=')[1].replace(/"/g, '').trim();
    break;
  }
}

if (!dbUrl) {
  console.error("Could not find POSTGRES_PRISMA_URL in .env.production");
  process.exit(1);
}

process.env.DATABASE_URL = dbUrl;
const prisma = new PrismaClient();

async function main() {
  console.log('Fetching tickets...');
  
  const tickets = await prisma.ticket.findMany({
    include: {
      audiences: {
        include: {
          package: true,
        },
      },
    },
  });

  for (const t of tickets) {
    const isBronze = t.audiences.some(a => a.package.name.includes('BRONZE') || a.package.name.includes('Bronze'));
    console.log(`Ticket ${t.id}: Status=${t.status}, BookingCode=${t.bookingCode}, Image=${t.imageUrl.substring(0, 20)}..., IsBronze=${isBronze}`);
    
    // We want to delete tickets with placeholder image or the 'CDMDFR' one.
    if (t.imageUrl.includes('placehold.co') || t.bookingCode === 'CDMDFR' || t.imageUrl.startsWith('/uploads/ticket-17')) {
      console.log(`Deleting ticket ${t.id} ...`);
      await prisma.ticketAudience.deleteMany({ where: { ticketId: t.id } });
      await prisma.ticket.delete({ where: { id: t.id } });
      console.log(`Deleted!`);
    }
  }

  console.log('Cleanup finished.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

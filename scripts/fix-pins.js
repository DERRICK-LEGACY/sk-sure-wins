const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  let updatedCount = 0;

  for (const user of users) {
    if (user.pin && user.pin.length === 4) { // Plain text PINs are usually 4 digits
      const hashedPin = await bcrypt.hash(user.pin, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { pin: hashedPin }
      });
      updatedCount++;
      console.log(`Updated PIN for user ${user.phone}`);
    }
  }

  console.log(`Successfully updated ${updatedCount} users' PINs to bcrypt hashes.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

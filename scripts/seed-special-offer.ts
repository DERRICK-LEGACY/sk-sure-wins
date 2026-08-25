import prisma from '../src/lib/db';

async function main() {
  const existingOffer = await prisma.package.findFirst({
    where: { isSpecialOffer: true }
  });

  if (existingOffer) {
    console.log("Special offer already exists:", existingOffer.name);
  } else {
    const offer = await prisma.package.create({
      data: {
        name: "SK ROAD TO 700K OFFER",
        price: 50000,
        durationDays: 14,
        isSpecialOffer: true,
        isActive: true,
      }
    });
    console.log("Created special offer:", offer.name);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

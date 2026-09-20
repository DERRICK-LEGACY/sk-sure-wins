import prisma from '../src/lib/db';

async function main() {
  const packages = await prisma.package.findMany({
    select: { name: true, id: true }
  });
  console.log(JSON.stringify(packages, null, 2));
}

main().finally(() => prisma.$disconnect());

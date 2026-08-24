import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function main() {
  const adminPass = "SK2026!"
  await prisma.user.upsert({
    where: { phone: 'ADMIN' },
    update: {},
    create: {
      phone: 'ADMIN',
      name: 'Super Admin',
      pin: adminPass,
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  })

  const packages = [
    { name: 'Odds 2', price: 30000, durationDays: 14 },
    { name: 'Odds 3', price: 50000, durationDays: 14 },
    { name: 'Odds 4', price: 70000, durationDays: 14 }
  ]

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { name: pkg.name },
      update: {},
      create: pkg
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

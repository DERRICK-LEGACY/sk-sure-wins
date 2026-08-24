import { defineConfig } from '@prisma/config'

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  // Vercel injected environment variable
  datasource: {
    url: process.env.DATABASE_URL,
  },
})

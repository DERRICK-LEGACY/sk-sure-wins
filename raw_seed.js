const { Pool } = require('@neondatabase/serverless');
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_yGD6QIREH0ft@ep-dawn-bread-av1402hj-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

async function run() {
  await pool.query(`
    INSERT INTO "User" (id, phone, name, pin, role, status, "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), 'ADMIN', 'Super Admin', 'SK2026!', 'ADMIN', 'ACTIVE', NOW(), NOW())
    ON CONFLICT (phone) DO UPDATE SET pin = 'SK2026!';
  `);
  
  await pool.query(`
    INSERT INTO "Package" (id, name, price, "durationDays", "createdAt", "updatedAt")
    VALUES 
      (gen_random_uuid(), 'Odds 2', 30000, 14, NOW(), NOW()),
      (gen_random_uuid(), 'Odds 3', 50000, 14, NOW(), NOW()),
      (gen_random_uuid(), 'Odds 4', 70000, 14, NOW(), NOW())
    ON CONFLICT (name) DO NOTHING;
  `);
  
  console.log('Seeded successfully!');
  pool.end();
}

run().catch(console.dir);

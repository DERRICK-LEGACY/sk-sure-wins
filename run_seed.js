const { execSync } = require('child_process');
const env = Object.assign({}, process.env, {
  DATABASE_URL: 'postgresql://neondb_owner:npg_yGD6QIREH0ft@ep-dawn-bread-av1402hj-pooler.c-11.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require'
});
execSync('npx tsx seed.ts', { env, stdio: 'inherit' });

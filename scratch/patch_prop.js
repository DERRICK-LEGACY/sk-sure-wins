const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../src/app/admin/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

page = page.replace(/import \{ checkAdminAuth \} from '\.\.\/actions';/, `import { checkAdminAuth } from '../actions';\nimport { cookies } from 'next/headers';`);

page = page.replace(/const \[freeHooks/, `const cookieStore = await cookies();\n  const adminToken = cookieStore.get("sk_admin_session")?.value;\n\n  const [freeHooks`);

page = page.replace(/packages=\{packages\} \n  \/>;/, `packages={packages} \n    adminToken={adminToken}\n  />;`);

fs.writeFileSync(pagePath, page);

const adminDashboardPath = path.join(__dirname, '../src/components/AdminDashboard.tsx');
let adminDashboard = fs.readFileSync(adminDashboardPath, 'utf8');

adminDashboard = adminDashboard.replace(
  /export default function AdminDashboard\(\{ freeHooks, wonTickets, clients, premiumTickets, testimonials, packages \}: \{[\s\S]*?\}\) \{/,
  `export default function AdminDashboard({ freeHooks, wonTickets, clients, premiumTickets, testimonials, packages, adminToken }: {
  freeHooks: any[],
  wonTickets: any[],
  clients: any[],
  premiumTickets: any[],
  testimonials: any[],
  packages: any[],
  adminToken?: string
}) {`
);

// Remove getAdminToken function entirely
adminDashboard = adminDashboard.replace(/const getAdminToken = \(\) => \{[\s\S]*?return undefined;\s*\};\s*/, '');

// Replace getAdminToken() calls with adminToken prop
adminDashboard = adminDashboard.replace(/adminToken: getAdminToken\(\)/g, 'adminToken');

fs.writeFileSync(adminDashboardPath, adminDashboard);
console.log("Passed token as prop successfully!");

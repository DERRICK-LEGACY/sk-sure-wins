const fs = require('fs');
const path = require('path');

const actionsPath = path.join(__dirname, '../src/app/actions.ts');
let actions = fs.readFileSync(actionsPath, 'utf8');

// 1. Remove httpOnly: true from the extendAdminSession and loginAdmin
actions = actions.replace(/httpOnly: true, secure: IS_PRODUCTION, sameSite: "lax", maxAge: 24 \* 60 \* 60, path: "\/"/g, 'httpOnly: false, secure: IS_PRODUCTION, sameSite: "lax", maxAge: 24 * 60 * 60, path: "/"');

// 2. Modify checkAdminAuthDetailed to accept an adminToken argument
actions = actions.replace(/export async function checkAdminAuthDetailed\(\): Promise<\{ authed: boolean, reason\?: string \}> \{/, 'export async function checkAdminAuthDetailed(clientToken?: string): Promise<{ authed: boolean, reason?: string }> {');

actions = actions.replace(/let sessionValue = undefined;/, 'let sessionValue = clientToken;');

// 3. Update the actions to pass data.adminToken to checkAdminAuthDetailed
actions = actions.replace(/const auth = await checkAdminAuthDetailed\(\);/g, 'const auth = await checkAdminAuthDetailed(data.adminToken);');

fs.writeFileSync(actionsPath, actions);
console.log("actions.ts patched");

// Now patch AdminDashboard.tsx
const adminDashboardPath = path.join(__dirname, '../src/components/AdminDashboard.tsx');
let adminDashboard = fs.readFileSync(adminDashboardPath, 'utf8');

const getAdminTokenHelper = `
  const getAdminToken = () => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\\s*)sk_admin_session=([^;]*)/);
      return match ? match[1] : undefined;
    }
    return undefined;
  };
`;

// Insert the helper at the top of the component
adminDashboard = adminDashboard.replace(/const fileToBase64 = \(file: File\): Promise<string> =>/, getAdminTokenHelper + '\n  const fileToBase64 = (file: File): Promise<string> =>');

// Add adminToken to all payloads
adminDashboard = adminDashboard.replace(
  /\{ description, imageBase64, imageName \}/g,
  '{ description, imageBase64, imageName, adminToken: getAdminToken() }'
);

adminDashboard = adminDashboard.replace(
  /const payload = \{[\s\S]*?imageName\n    \};/,
  `const payload = {
      package_id: (form.elements.namedItem('package_id') as HTMLSelectElement).value,
      booking_code: (form.elements.namedItem('booking_code') as HTMLInputElement).value,
      odds_total: (form.elements.namedItem('odds_total') as HTMLInputElement).value,
      match_time: (form.elements.namedItem('match_time') as HTMLInputElement).value,
      imageBase64,
      imageName,
      adminToken: getAdminToken()
    };`
);

fs.writeFileSync(adminDashboardPath, adminDashboard);
console.log("AdminDashboard.tsx patched");


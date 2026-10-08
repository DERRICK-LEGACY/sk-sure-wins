const fs = require('fs');
let code = fs.readFileSync('src/components/VipDashboardClient.tsx', 'utf8');

code = code.replace(/shadow-\[0_20px_50px_rgba\(0,0,0,0\.5\)\]/g, 'shadow-2xl');
code = code.replace(/glow-text/g, '');
code = code.replace(/drop-shadow-\[0_0_10px_rgba\(37,211,102,0\.8\)\]/g, 'drop-shadow-sm');
code = code.replace(/blur-\[60px\]/g, 'blur-[100px] opacity-30');

fs.writeFileSync('src/components/VipDashboardClient.tsx', code);

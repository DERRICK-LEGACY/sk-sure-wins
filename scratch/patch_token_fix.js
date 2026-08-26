const fs = require('fs');
const path = require('path');

const actionsPath = path.join(__dirname, '../src/app/actions.ts');
let actions = fs.readFileSync(actionsPath, 'utf8');

actions = actions.replace(/try \{\s*const cookieStore = await cookies\(\);\s*sessionValue = cookieStore\.get\(ADMIN_COOKIE\)\?\.value;\s*\} catch \(e\) \{\s*\}/, 
`if (!sessionValue) {
    try {
      const cookieStore = await cookies();
      sessionValue = cookieStore.get(ADMIN_COOKIE)?.value;
    } catch (e) {
    }
  }`);

fs.writeFileSync(actionsPath, actions);
console.log("Fixed checkAdminAuthDetailed bug");

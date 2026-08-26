const fs = require('fs');
const path = require('path');

const actionsPath = path.join(__dirname, '../src/app/actions.ts');
let actions = fs.readFileSync(actionsPath, 'utf8');

actions = actions.replace(/export async function checkAdminAuth\(\) \{[\s\S]*?return false;\s*\}\s*\}/, 
`export async function checkAdminAuthDetailed(): Promise<{ authed: boolean, reason?: string }> {
  let sessionValue = undefined;
  
  try {
    const cookieStore = await cookies();
    sessionValue = cookieStore.get(ADMIN_COOKIE)?.value;
  } catch (e) {
  }

  if (!sessionValue) {
    try {
      const headersList = await headers();
      const cookieHeader = headersList.get('cookie') || '';
      const match = cookieHeader.match(new RegExp('(?:^|;\\\\s*)' + ADMIN_COOKIE + '=([^;]*)'));
      if (match) sessionValue = match[1];
    } catch (e) {
    }
  }

  if (!sessionValue) return { authed: false, reason: "Unauthorized: No Session Cookie Found" };

  try {
    const { payload } = await jwtVerify(sessionValue, JWT_SECRET);
    if (payload.role !== 'admin') {
       return { authed: false, reason: "Unauthorized: Role mismatch" };
    }
    return { authed: true };
  } catch (err) {
    return { authed: false, reason: "Unauthorized: JWT Verify Failed (" + err.message + ")" };
  }
}

export async function checkAdminAuth() {
  const res = await checkAdminAuthDetailed();
  return res.authed;
}`);

actions = actions.replace(/export async function addTicket\(data: any\) \{\s*const isAuthed = await checkAdminAuth\(\);\s*if \(!isAuthed\) return \{ error: "Unauthorized" \};/g, 
`export async function addTicket(data: any) {
  const auth = await checkAdminAuthDetailed();
  if (!auth.authed) return { error: auth.reason };`);

actions = actions.replace(/export async function editTicket\(id: string, data: any\) \{\s*const isAuthed = await checkAdminAuth\(\);\s*if \(!isAuthed\) return \{ error: "Unauthorized" \};/g, 
`export async function editTicket(id: string, data: any) {
  const auth = await checkAdminAuthDetailed();
  if (!auth.authed) return { error: auth.reason };`);

actions = actions.replace(/export async function updateFreeHook\(data: \{ description: string, imageBase64\?: string, imageName\?: string \}\) \{\s*const isAuthed = await checkAdminAuth\(\);\s*if \(!isAuthed\) return \{ error: "Unauthorized" \};/g, 
`export async function updateFreeHook(data: { description: string, imageBase64?: string, imageName?: string }) {
  const auth = await checkAdminAuthDetailed();
  if (!auth.authed) return { error: auth.reason };`);

actions = actions.replace(/export async function editFreeHook\(id: string, data: \{ description: string, imageBase64\?: string, imageName\?: string \}\) \{\s*const isAuthed = await checkAdminAuth\(\);\s*if \(!isAuthed\) return \{ error: "Unauthorized" \};/g, 
`export async function editFreeHook(id: string, data: { description: string, imageBase64?: string, imageName?: string }) {
  const auth = await checkAdminAuthDetailed();
  if (!auth.authed) return { error: auth.reason };`);

actions = actions.replace(/export async function addWonTicket\(data: \{ description: string, imageBase64\?: string, imageName\?: string \}\) \{\s*const isAuthed = await checkAdminAuth\(\);\s*if \(!isAuthed\) return \{ error: "Unauthorized" \};/g, 
`export async function addWonTicket(data: { description: string, imageBase64?: string, imageName?: string }) {
  const auth = await checkAdminAuthDetailed();
  if (!auth.authed) return { error: auth.reason };`);

actions = actions.replace(/export async function editWonTicket\(id: string, data: \{ description: string, imageBase64\?: string, imageName\?: string \}\) \{\s*const isAuthed = await checkAdminAuth\(\);\s*if \(!isAuthed\) return \{ error: "Unauthorized" \};/g, 
`export async function editWonTicket(id: string, data: { description: string, imageBase64?: string, imageName?: string }) {
  const auth = await checkAdminAuthDetailed();
  if (!auth.authed) return { error: auth.reason };`);

fs.writeFileSync(actionsPath, actions);
console.log("Patched successfully!");

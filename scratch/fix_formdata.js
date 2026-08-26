const fs = require('fs');
const path = require('path');

const adminDashboardPath = path.join(__dirname, '../src/components/AdminDashboard.tsx');
const actionsPath = path.join(__dirname, '../src/app/actions.ts');

// --- Patch AdminDashboard.tsx ---
let adminDashboard = fs.readFileSync(adminDashboardPath, 'utf8');

const fileToBase64Helper = `
  const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
`;

adminDashboard = adminDashboard.replace(
  'const handleUpdateHook = (e: React.FormEvent<HTMLFormElement>) => {',
  fileToBase64Helper + '\n  const handleUpdateHook = async (e: React.FormEvent<HTMLFormElement>) => {'
);

adminDashboard = adminDashboard.replace(
  /const handleUpdateHook = async \(e: React\.FormEvent<HTMLFormElement>\) => {[\s\S]*?\.then\(\(\) => \(e\.target as HTMLFormElement\)\.reset\(\)\);\s*};/,
  `const handleUpdateHook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const file = (form.elements.namedItem('image') as HTMLInputElement)?.files?.[0];
    const imageBase64 = file ? await fileToBase64(file) : undefined;
    const imageName = file?.name;
    const description = (form.elements.namedItem('description') as HTMLInputElement).value;
    
    wrapAction(async () => {
      if (editingFree) { const res = await editFreeHook(editingFree.id, { description, imageBase64, imageName }); setEditingFree(null); return res; } 
      else { return await updateFreeHook({ description, imageBase64, imageName }); }
    }, "Free slip successfully posted!")
    .then(() => form.reset());
  };`
);

adminDashboard = adminDashboard.replace(
  /const handleAddWonTicket = \(e: React\.FormEvent<HTMLFormElement>\) => {[\s\S]*?\.then\(\(\) => \(e\.target as HTMLFormElement\)\.reset\(\)\);\s*};/,
  `const handleAddWonTicket = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const file = (form.elements.namedItem('image') as HTMLInputElement)?.files?.[0];
    const imageBase64 = file ? await fileToBase64(file) : undefined;
    const imageName = file?.name;
    const description = (form.elements.namedItem('description') as HTMLInputElement).value;

    wrapAction(async () => {
      if (editingWon) { const res = await editWonTicket(editingWon.id, { description, imageBase64, imageName }); setEditingWon(null); return res; } 
      else { return await addWonTicket({ description, imageBase64, imageName }); }
    }, "Won ticket successfully posted!")
    .then(() => form.reset());
  };`
);

adminDashboard = adminDashboard.replace(
  /const handlePremiumSubmit = \(e: React\.FormEvent<HTMLFormElement>\) => {[\s\S]*?\.then\(\(\) => \(e\.target as HTMLFormElement\)\.reset\(\)\);\s*};/,
  `const handlePremiumSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const file = (form.elements.namedItem('image') as HTMLInputElement)?.files?.[0];
    const imageBase64 = file ? await fileToBase64(file) : undefined;
    const imageName = file?.name;
    const payload = {
      package_id: (form.elements.namedItem('package_id') as HTMLSelectElement).value,
      booking_code: (form.elements.namedItem('booking_code') as HTMLInputElement).value,
      odds_total: (form.elements.namedItem('odds_total') as HTMLInputElement).value,
      match_time: (form.elements.namedItem('match_time') as HTMLInputElement).value,
      imageBase64,
      imageName
    };

    wrapAction(async () => {
      if (editingPremium) { const res = await editTicket(editingPremium.id, payload); setEditingPremium(null); return res; } 
      else { return await addTicket(payload); }
    }, "VIP slip successfully posted!")
    .then(() => form.reset());
  };`
);

fs.writeFileSync(adminDashboardPath, adminDashboard);

// --- Patch actions.ts ---
let actions = fs.readFileSync(actionsPath, 'utf8');

const processBase64Helper = `
async function processBase64Image(imageBase64?: string, imageName?: string): Promise<string> {
  if (!imageBase64 || !imageName) return "https://placehold.co/600x400?text=Ticket+Uploaded";
  const base64Data = imageBase64.replace(/^data:image\\/\\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');
  const blob = new Blob([buffer]);
  const formData = new FormData();
  formData.append('image', blob, imageName);
  return handleImageUpload(formData, 'image');
}
`;

actions = actions.replace('export async function addTicket(formData: FormData) {', processBase64Helper + '\nexport async function addTicket(data: any) {');

// Update addTicket
actions = actions.replace(
  /export async function addTicket\(data: any\) \{[\s\S]*?const imageUrl = await handleImageUpload\(formData, 'image'\);/,
  `export async function addTicket(data: any) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  
  const packageId = data.package_id;
  const bookingCode = data.booking_code;
  const oddsTotal = parseFloat(data.odds_total) || null;
  const matchTimeStr = data.match_time;
  const matchTime = matchTimeStr ? new Date(matchTimeStr) : null;
  const imageUrl = await processBase64Image(data.imageBase64, data.imageName);`
);

// Update editTicket
actions = actions.replace(
  /export async function editTicket\(id: string, formData: FormData\) \{[\s\S]*?const imageFile = formData\.get\('image'\) as File \| null;\s*if \(imageFile && imageFile\.size > 0\) \{\s*updateData\.imageUrl = await handleImageUpload\(formData, 'image'\);\s*\}/,
  `export async function editTicket(id: string, data: any) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  
  const packageId = data.package_id;
  const bookingCode = data.booking_code;
  const oddsTotal = parseFloat(data.odds_total) || null;
  const matchTimeStr = data.match_time;
  const matchTime = matchTimeStr ? new Date(matchTimeStr) : null;
  
  const updateData: Record<string, unknown> = { bookingCode, oddsTotal, matchTime };
  
  if (data.imageBase64) {
    updateData.imageUrl = await processBase64Image(data.imageBase64, data.imageName);
  }`
);

// Update updateFreeHook
actions = actions.replace(
  /export async function updateFreeHook\(formData: FormData\) \{[\s\S]*?const imageUrl = await handleImageUpload\(formData, 'image'\);/,
  `export async function updateFreeHook(data: { description: string, imageBase64?: string, imageName?: string }) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  const description = data.description;
  const imageUrl = await processBase64Image(data.imageBase64, data.imageName);`
);

// Update editFreeHook
actions = actions.replace(
  /export async function editFreeHook\(id: string, formData: FormData\) \{[\s\S]*?const description = formData\.get\('description'\) as string;/,
  `export async function editFreeHook(id: string, data: { description: string, imageBase64?: string, imageName?: string }) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  const description = data.description;
  // If we wanted to update image, we would do it here, but editFreeHook currently just updates description.
  `
);

// Update addWonTicket
actions = actions.replace(
  /export async function addWonTicket\(formData: FormData\) \{[\s\S]*?const imageUrl = await handleImageUpload\(formData, 'image'\);/,
  `export async function addWonTicket(data: { description: string, imageBase64?: string, imageName?: string }) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  const description = data.description;
  const imageUrl = await processBase64Image(data.imageBase64, data.imageName);`
);

// Update editWonTicket
actions = actions.replace(
  /export async function editWonTicket\(id: string, formData: FormData\) \{[\s\S]*?const description = formData\.get\('description'\) as string;/,
  `export async function editWonTicket(id: string, data: { description: string, imageBase64?: string, imageName?: string }) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  const description = data.description;`
);

fs.writeFileSync(actionsPath, actions);
console.log("Patched successfully!");

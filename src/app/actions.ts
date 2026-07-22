"use server";

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { normalizePhone, sanitizeText, validatePhone, validateName, validatePackageTier } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { SignJWT, jwtVerify } from 'jose';
import { Filter } from 'bad-words';

// ========== CONSTANTS ==========

const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "SK2026!";
const ADMIN_COOKIE = "sk_admin_session";
const VIP_COOKIE = "sk_vip_session";
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'sk-sure-wins-super-secret-key-2026');

// ========== IMAGE UPLOAD (Supabase Storage) ==========

async function handleImageUpload(formData: FormData, fieldName: string): Promise<string | null> {
  const file = formData.get(fieldName) as File | null;
  if (!file || file.size === 0) return null;

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File too large. Maximum size is 5MB.');
  }

  const supabase = createAdminClient();
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `tickets/${filename}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from('tickets')
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('[UPLOAD] Supabase storage error:', error);
    throw new Error('Failed to upload image.');
  }

  const { data: urlData } = supabase.storage
    .from('tickets')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

// ========== ADMIN AUTH ==========

export async function getAdminPassword() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('users').select('name').eq('phone', 'ADMIN').single();
  return data?.name || DEFAULT_ADMIN_PASSWORD;
}

export async function updateAdminCredentials(newPassword: string) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  if (!newPassword || newPassword.length < 6) return { error: "Password must be at least 6 characters." };

  const supabase = createAdminClient();
  const { data } = await supabase.from('users').select('id').eq('phone', 'ADMIN').single();
  
  if (data?.id) {
    await supabase.from('users').update({ name: newPassword }).eq('id', data.id);
  } else {
    await supabase.from('users').insert([{
      phone: 'ADMIN',
      name: newPassword,
      package: 'ADMIN_CONFIG',
      expiry_date: '2099-01-01',
      is_active: false
    }]);
  }
  return { success: true };
}

export async function loginAdmin(password: string) {
  const cookieStore = await cookies();

  // Rate limit admin login by a simple key
  const rateCheck = checkRateLimit('admin_login', RATE_LIMITS.ADMIN_LOGIN);
  if (!rateCheck.allowed) {
    return { success: false, error: `Too many login attempts. Try again in ${rateCheck.retryAfterSeconds} seconds.` };
  }

  const currentPassword = await getAdminPassword();

  if (password === currentPassword) {
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(JWT_SECRET);

    cookieStore.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/"
    });
    return { success: true };
  }
  return { success: false, error: "Incorrect password." };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  return { success: true };
}

export async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE);
  if (!session?.value) return false;

  try {
    const { payload } = await jwtVerify(session.value, JWT_SECRET);
    return payload.role === 'admin';
  } catch (error) {
    return false;
  }
}

// ========== VIP AUTH ==========

export async function verifyVipLogin(phone: string) {
  // Rate limit
  const rateCheck = checkRateLimit(`vip_login:${phone}`, RATE_LIMITS.VIP_LOGIN);
  if (!rateCheck.allowed) {
    return { success: false, error: `Too many attempts. Try again in ${rateCheck.retryAfterSeconds} seconds.` };
  }

  // Validate
  const phoneCheck = validatePhone(phone);
  if (!phoneCheck.valid) {
    return { success: false, error: phoneCheck.error };
  }

  const normalized = normalizePhone(phone);
  const supabase = createAdminClient();

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone', normalized)
    .eq('is_active', true)
    .single();

  if (error || !user) {
    return { success: false, error: "This phone number is not registered as a VIP." };
  }

  const isExpired = new Date(user.expiry_date) < new Date(new Date().setHours(0, 0, 0, 0));
  if (isExpired) {
    return { success: false, error: "Your VIP subscription has expired. Please purchase a new package." };
  }

  // Set VIP cookie
  const cookieStore = await cookies();
  cookieStore.set(VIP_COOKIE, JSON.stringify({
    id: user.id,
    name: user.name,
    phone: user.phone,
    package: user.package,
    expiry_date: user.expiry_date,
  }), {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/"
  });

  return { success: true, user: { ...user } };
}

export async function getVipSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(VIP_COOKIE);
  if (!session?.value) return null;
  try {
    const user = JSON.parse(session.value);
    const isExpired = new Date(user.expiry_date) < new Date(new Date().setHours(0, 0, 0, 0));
    if (isExpired) {
      cookieStore.delete(VIP_COOKIE);
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export async function logoutVip() {
  const cookieStore = await cookies();
  cookieStore.delete(VIP_COOKIE);
  return { success: true };
}

// ========== FREE HOOKS ==========

export async function getFreeHook() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('free_hooks')
    .select('*')
    .eq('is_active', true)
    .limit(1)
    .single();
  return data;
}

export async function getAllFreeHooks() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('free_hooks')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}

export async function updateFreeHook(formData: FormData) {
  const description = sanitizeText(formData.get('description') as string);
  const imageUrl = await handleImageUpload(formData, 'image');

  const supabase = createAdminClient();

  // Deactivate all existing hooks
  await supabase.from('free_hooks').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');

  // Insert new active hook
  await supabase.from('free_hooks').insert({
    description,
    image_url: imageUrl,
    is_active: true,
  });

  revalidatePath('/');
  return { success: true };
}

export async function editFreeHook(id: string, formData: FormData) {
  const description = sanitizeText(formData.get('description') as string);
  const supabase = createAdminClient();

  const image = formData.get('image') as File | null;
  if (image && image.size > 0) {
    const imageUrl = await handleImageUpload(formData, 'image');
    await supabase.from('free_hooks').update({ description, image_url: imageUrl }).eq('id', id);
  } else {
    await supabase.from('free_hooks').update({ description }).eq('id', id);
  }

  revalidatePath('/');
  return { success: true };
}

export async function deleteFreeHook(id: string) {
  const supabase = createAdminClient();
  await supabase.from('free_hooks').delete().eq('id', id);
  revalidatePath('/');
  return { success: true };
}

// ========== WON TICKETS ==========

export async function getWonTickets() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('won_tickets')
    .select('*')
    .order('created_at', { ascending: true });
  return data || [];
}

export async function addWonTicket(formData: FormData) {
  const description = sanitizeText(formData.get('description') as string);
  const imageUrl = await handleImageUpload(formData, 'image');

  const supabase = createAdminClient();
  await supabase.from('won_tickets').insert({ description, image_url: imageUrl });

  revalidatePath('/');
  return { success: true };
}

export async function editWonTicket(id: string, formData: FormData) {
  const description = sanitizeText(formData.get('description') as string);
  const supabase = createAdminClient();

  const image = formData.get('image') as File | null;
  if (image && image.size > 0) {
    const imageUrl = await handleImageUpload(formData, 'image');
    await supabase.from('won_tickets').update({ description, image_url: imageUrl }).eq('id', id);
  } else {
    await supabase.from('won_tickets').update({ description }).eq('id', id);
  }

  revalidatePath('/');
  return { success: true };
}

export async function deleteWonTicket(id: string) {
  const supabase = createAdminClient();
  await supabase.from('won_tickets').delete().eq('id', id);
  revalidatePath('/');
  return { success: true };
}

// ========== USERS ==========

export async function getUsers() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}

export async function addUser(data: { phone: string; name: string; pkg: string; expiry_date: string }) {
  // Validate inputs
  const phoneCheck = validatePhone(data.phone);
  if (!phoneCheck.valid) throw new Error(phoneCheck.error);

  const nameCheck = validateName(data.name);
  if (!nameCheck.valid) throw new Error(nameCheck.error);

  const normalized = normalizePhone(data.phone);
  const sanitizedName = sanitizeText(data.name, 100);

  const supabase = createAdminClient();

  // Check for existing user with same phone
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('phone', normalized)
    .single();

  if (existing) {
    // Update existing
    await supabase.from('users').update({
      name: sanitizedName,
      package: data.pkg,
      expiry_date: data.expiry_date,
      is_active: true,
      updated_at: new Date().toISOString(),
    }).eq('id', existing.id);
  } else {
    // Insert new
    await supabase.from('users').insert({
      phone: normalized,
      name: sanitizedName,
      package: data.pkg,
      expiry_date: data.expiry_date,
      is_active: true,
    });
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function editUser(id: string, data: { phone: string; name: string; pkg: string; expiry_date: string }) {
  const normalized = normalizePhone(data.phone);
  const sanitizedName = sanitizeText(data.name, 100);

  const supabase = createAdminClient();
  await supabase.from('users').update({
    phone: normalized,
    name: sanitizedName,
    package: data.pkg,
    expiry_date: data.expiry_date,
    updated_at: new Date().toISOString(),
  }).eq('id', id);

  revalidatePath('/admin');
  return { success: true };
}

export async function deleteUser(id: string) {
  const supabase = createAdminClient();
  await supabase.from('users').delete().eq('id', id);
  revalidatePath('/admin');
  return { success: true };
}

// ========== PREMIUM TICKETS ==========

export async function getPremiumTickets() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('premium_tickets')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getPremiumTicketsByTier(tier: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('premium_tickets')
    .select('*')
    .eq('package_tier', tier)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function addPremiumTicket(formData: FormData) {
  const description = sanitizeText(formData.get('description') as string);
  const packageTier = formData.get('package_tier') as string;

  const tierCheck = validatePackageTier(packageTier);
  if (!tierCheck.valid) throw new Error(tierCheck.error);

  const imageUrl = await handleImageUpload(formData, 'image');

  const supabase = createAdminClient();
  await supabase.from('premium_tickets').insert({
    package_tier: packageTier,
    description,
    image_url: imageUrl,
  });

  revalidatePath('/admin');
  revalidatePath('/vip-dashboard');
  return { success: true };
}

export async function editPremiumTicket(id: string, formData: FormData) {
  const description = sanitizeText(formData.get('description') as string);
  const packageTier = formData.get('package_tier') as string;

  const tierCheck = validatePackageTier(packageTier);
  if (!tierCheck.valid) throw new Error(tierCheck.error);

  const supabase = createAdminClient();

  const image = formData.get('image') as File | null;
  if (image && image.size > 0) {
    const imageUrl = await handleImageUpload(formData, 'image');
    await supabase.from('premium_tickets').update({
      package_tier: packageTier,
      description,
      image_url: imageUrl,
    }).eq('id', id);
  } else {
    await supabase.from('premium_tickets').update({
      package_tier: packageTier,
      description,
    }).eq('id', id);
  }

  revalidatePath('/admin');
  revalidatePath('/vip-dashboard');
  return { success: true };
}

export async function deletePremiumTicket(id: string) {
  const supabase = createAdminClient();
  await supabase.from('premium_tickets').delete().eq('id', id);
  revalidatePath('/admin');
  revalidatePath('/vip-dashboard');
  return { success: true };
}

// ========== TRANSACTIONS (Admin View) ==========

export async function getTransactions() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  return data || [];
}

// ========== TESTIMONIALS ==========

export async function getAllTestimonials() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getApprovedTestimonials() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('testimonials').select('*').eq('approved', true).order('created_at', { ascending: false });
  return data || [];
}
export async function submitTestimonial(formData: FormData) {
  const rateLimitResult = await checkRateLimit("submit_testimonial", RATE_LIMITS.SUBMIT_TESTIMONIAL);
  if (!rateLimitResult.allowed) {
    const minutes = Math.ceil((rateLimitResult.retryAfterSeconds) / 60);
    return { error: `Too many submissions. Try again in ${minutes} minutes.` };
  }

  const rawName = formData.get('name') as string;
  const rawContent = formData.get('content') as string;
  
  const filter = new Filter();
  if (filter.isProfane(rawName) || filter.isProfane(rawContent)) {
    return { error: "Your review contains offensive language and cannot be submitted." };
  }

  const name = sanitizeText(rawName);
  const content = sanitizeText(rawContent);
  const rating = parseInt(formData.get('rating') as string) || 5;

  if (!name || name.length < 2) return { error: "Name is too short" };
  if (!content || content.length < 10) return { error: "Review is too short" };
  if (rating < 1 || rating > 5) return { error: "Invalid rating" };

  const supabase = createAdminClient();
  const { error } = await supabase.from('testimonials').insert([{
    name,
    content,
    rating,
    approved: true // Automatically approved if clean
  }]);

  if (error) return { error: "Failed to submit testimonial" };
  return { success: true };
}

export async function approveTestimonial(id: string) {
  const supabase = createAdminClient();
  await supabase.from('testimonials').update({ approved: true }).eq('id', id);
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const supabase = createAdminClient();
  await supabase.from('testimonials').delete().eq('id', id);
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

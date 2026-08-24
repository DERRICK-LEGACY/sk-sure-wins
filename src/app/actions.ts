"use server";

import prisma from '@/lib/db';
import { revalidatePath, unstable_cache } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { normalizePhone, sanitizeText } from '@/lib/validation';
import { jwtVerify, SignJWT } from 'jose';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendTelegramNotification } from '@/lib/notifications';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
const VIP_COOKIE = "sk_vip_session";
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'sk-sure-wins-super-secret-key-2026');

// Basic In-Memory Rate Limiter
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

function checkRateLimit(ipOrPhone: string, limit: number = 5, windowMs: number = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(ipOrPhone);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ipOrPhone, { count: 1, resetTime: now + windowMs });
    return { success: true };
  }

  if (record.count >= limit) {
    return { success: false, error: "Too many attempts. Please try again later." };
  }

  record.count += 1;
  return { success: true };
}

// ========== PAYMENT & SUBSCRIPTION FLOW (USER FLOWCHART) ==========

export async function initiatePaymentByName(phone: string, packageName: string, pin: string, name: string) {
  const normalized = normalizePhone(phone);
  const pkg = await prisma.package.findUnique({ where: { name: packageName } });
  
  if (!pkg) {
    return { success: false, error: "Invalid package selected. Please refresh the page and try again." };
  }

  // 1. Quietly create pending account if it doesn't exist
  let user = await prisma.user.findUnique({ where: { phone: normalized } });
  
  const hashedPin = await bcrypt.hash(pin, 10);

  if (!user) {
    user = await prisma.user.create({
      data: {
        phone: normalized,
        status: 'PENDING',
        role: 'CLIENT',
        name: sanitizeText(name),
        pin: hashedPin
      }
    });
  } else {
    // Update name and pin if they already exist
    await prisma.user.update({
      where: { id: user.id },
      data: { name: sanitizeText(name), pin: hashedPin }
    });
  }

  // 2. Create the pending Order (Transaction)
  const referenceId = crypto.randomUUID();
  const order = await prisma.order.create({
    data: {
      referenceId,
      amount: pkg.price,
      phone: normalized,
      status: 'PENDING',
      packageId: pkg.id,
      userId: user.id
    }
  });

  // 3. Call MarzPay to initiate collection
  const apiKey = 'marz_clTJGirR1HYLFRUt';
  const apiSecret = 'NoNkshqQ9IkznuUbWb9G0F2nPaM9XETh';
  
  if (!apiKey || !apiSecret) {
    return { success: false, error: "MarzPay API Keys are missing in Vercel Production environment." };
  }

  if (pkg.price < 500) {
    return { success: false, error: "Minimum amount for mobile money is 500 UGX." };
  }

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  const apiBase = (process.env.MARZPAY_API_BASE || 'https://wallet.wearemarz.com/api/v1').trim();
  const callbackUrl = (process.env.MARZPAY_CALLBACK_URL || 'https://www.sksurewinspredictions.com/api/webhooks/marzpay').trim();
  
  try {
    const res = await fetch(`${apiBase}/collect-money`, {
      method: 'POST',
      headers: { 
        'Authorization': `Basic ${auth}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        amount: pkg.price,
        phone_number: normalized,
        reference: referenceId,
        country: 'UG',
        description: `SK Sure Wins VIP - ${pkg.name.substring(0, 20)}`,
        callback_url: callbackUrl,
      }),
    });

    if (!res.ok) {
      await prisma.order.delete({ where: { id: order.id } });
      const errText = await res.text();
      console.error('MarzPay Error:', errText);
      try {
        const errJson = JSON.parse(errText);
        let errorMessage = errJson.message || "Payment rejected by gateway.";
        if (errJson.errors) {
          const details = Object.values(errJson.errors).flat().join(" ");
          errorMessage += " " + details;
        }
        return { success: false, error: errorMessage };
      } catch {
        return { success: false, error: "Failed to initiate payment." };
      }
    }
  } catch (error: unknown) {
    console.error('MarzPay Request Failed:', error);
    await prisma.order.delete({ where: { id: order.id } });
    return { success: false, error: "Payment gateway connection error." };
  }

  return { success: true, referenceId: order.referenceId };
}

// ========== VIP AUTHENTICATION & SESSION MANAGEMENT ==========

export async function autoLoginAfterPayment(phone: string) {
  const normalized = normalizePhone(phone);
  if (!normalized) return { success: false, error: "Invalid phone number format." };

  const user = await prisma.user.findUnique({ 
    where: { phone: normalized, status: 'ACTIVE' },
    include: { subscriptions: { where: { status: 'ACTIVE', expiresAt: { gt: new Date() } } } }
  });

  if (!user || user.subscriptions.length === 0) {
    return { success: false, error: "Account not active or no active subscriptions." };
  }

  const sessionToken = crypto.randomUUID();
  await prisma.user.update({ where: { id: user.id }, data: { sessionToken } });

  const token = await new SignJWT({ id: user.id, phone: user.phone, sessionToken })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(VIP_COOKIE, token, { httpOnly: true, secure: IS_PRODUCTION, sameSite: "strict", maxAge: 60 * 60 * 24 * 30, path: "/" });

  return { success: true };
}

export async function verifyVipLogin(phone: string, pin: string) {
  const normalized = normalizePhone(phone);
  if (!normalized) return { success: false, error: "Invalid phone number format." };

  const rl = checkRateLimit(normalized, 5, 60000); // 5 attempts per minute for login
  if (!rl.success) return rl;

  const user = await prisma.user.findUnique({ 
    where: { phone: normalized },
    include: { subscriptions: { where: { status: 'ACTIVE', expiresAt: { gt: new Date() } } } }
  });

  if (!user) return { success: false, error: "Phone number not registered or payment not completed." };
  
  if (!user.pin) {
    const hashedPin = await bcrypt.hash(pin, 10);
    await prisma.user.update({ where: { id: user.id }, data: { pin: hashedPin } });
  } else {
    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) {
      return { success: false, error: "Incorrect PIN." };
    }
  }

  const sessionToken = crypto.randomUUID();
  await prisma.user.update({ where: { id: user.id }, data: { sessionToken } });

  const token = await new SignJWT({ id: user.id, phone: user.phone, sessionToken })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(VIP_COOKIE, token, { httpOnly: true, secure: IS_PRODUCTION, sameSite: "strict", maxAge: 60 * 60 * 24 * 30, path: "/" });

  return { success: true };
}

export async function getVipSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(VIP_COOKIE);
  if (!session?.value) return null;
  
  try {
    const { payload } = await jwtVerify(session.value, JWT_SECRET);
    const parsed = payload as { id: string, phone: string, sessionToken: string };
    
    const user = await prisma.user.findUnique({
      where: { id: parsed.id },
      include: {
        subscriptions: { where: { status: 'ACTIVE', expiresAt: { gt: new Date() } } }
      }
    });

    if (!user || user.sessionToken !== parsed.sessionToken) {
      return null;
    }

    const activePackageIds = user.subscriptions.map(sub => sub.packageId);
    return { ...user, activePackageIds };
  } catch {
    return null;
  }
}

export async function logoutVip() {
  const cookieStore = await cookies();
  cookieStore.delete(VIP_COOKIE);
  return { success: true };
}


// ========== STRICT ENTITLEMENT TICKET FETCHING ==========

export async function getEntitledTickets() {
  const session = await getVipSession();
  if (!session) return [];

  const tickets = await prisma.ticket.findMany({
    where: {
      status: { not: 'VOID' },
      audiences: {
        some: {
          packageId: { in: session.activePackageIds }
        }
      }
    },
    include: { audiences: { include: { package: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return tickets;
}

// ========== PACKAGES ==========

export async function getPackages() {
  return await prisma.package.findMany({ orderBy: { price: 'asc' } });
}

// ========== PUBLIC HOMEPAGE DATA ==========

export const getAllFreeHooks = unstable_cache(
  async () => {
    return await prisma.freeHook.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  },
  ['free-hooks'],
  { tags: ['free-hooks'] }
);

export const getWonTickets = unstable_cache(
  async () => {
    return await prisma.ticket.findMany({
      where: { status: 'WON' },
      orderBy: { createdAt: 'desc' }
    });
  },
  ['won-tickets'],
  { tags: ['won-tickets'] }
);

export const getAllTestimonials = unstable_cache(
  async () => {
    return await prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' }
    });
  },
  ['testimonials'],
  { tags: ['testimonials'] }
);

export async function submitTestimonial(formData: FormData) {
  const name = formData.get('name') as string;
  const content = formData.get('content') as string;
  const rating = Number(formData.get('rating') || 5);
  
  if (!name || !content) return { success: false, error: "Name and content are required." };

  await prisma.testimonial.create({
    data: {
      name: sanitizeText(name),
      content: sanitizeText(content),
      rating,
      approved: true // Changed to auto-approve
    }
  });
  revalidatePath('/');
  return { success: true };
}

// ========== ADMIN AUTH & CONFIG ==========
const ADMIN_COOKIE = "sk_admin_session";

async function logAudit(action: string, details: Record<string, unknown>) {
  await prisma.auditLog.create({
    data: {
      adminId: 'ADMIN',
      action,
      details: JSON.stringify(details),
    }
  });
}

export async function getAdminPassword() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (admin?.pin) return admin.pin;
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  
  // Auto-seed admin user and packages if missing (for fresh Neon branches)
  await prisma.user.create({
    data: { phone: 'ADMIN', name: 'Super Admin', pin: 'SK2026!', role: 'ADMIN', status: 'ACTIVE' }
  });
  
  await prisma.package.createMany({
    data: [
      { name: 'Odds 2', price: 30000, durationDays: 14 },
      { name: 'Odds 3', price: 50000, durationDays: 14 },
      { name: 'Odds 4', price: 70000, durationDays: 14 }
    ],
    skipDuplicates: true
  });

  return 'SK2026!';
}

const loginAttempts = new Map<string, { count: number, lockedUntil: number }>();

export async function loginAdmin(password: string) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown-ip';
  const now = Date.now();
  const attempt = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };

  if (now < attempt.lockedUntil) {
    const waitTime = Math.ceil((attempt.lockedUntil - now) / 1000 / 60);
    return { success: false, error: `Too many attempts. Try again in ${waitTime} minutes.` };
  }

  const currentPassword = await getAdminPassword();
  if (password === currentPassword) {
    loginAttempts.delete(ip);
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE, token, {
      httpOnly: true, secure: IS_PRODUCTION, sameSite: "strict", maxAge: 15 * 60, path: "/"
    });
    
    await logAudit('LOGIN', { status: 'SUCCESS' });
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  }

  // Failed attempt
  attempt.count += 1;
  if (attempt.count >= 5) {
    attempt.lockedUntil = now + 15 * 60 * 1000; // Lock for 15 mins
    attempt.count = 0; // Reset count for next time
  }
  loginAttempts.set(ip, attempt);

  await logAudit('LOGIN', { status: 'FAILED' });
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
  } catch {
    return false;
  }
}

export async function extendAdminSession() {
  const isAuthed = await checkAdminAuth();
  if (isAuthed) {
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE, token, {
      httpOnly: true, secure: IS_PRODUCTION, sameSite: "strict", maxAge: 15 * 60, path: "/"
    });
    return { success: true };
  }
  return { success: false };
}

export async function updateAdminCredentials(newPassword: string) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (admin) {
    await prisma.user.update({ where: { id: admin.id }, data: { pin: newPassword } });
  } else {
    await prisma.user.create({ data: { phone: 'ADMIN', name: 'Super Admin', pin: newPassword, role: 'ADMIN', status: 'ACTIVE' } });
  }
  
  await logAudit('UPDATE_CREDENTIALS', {});
  return { success: true };
}

export async function resetVipPin(phone: string, newPin: string) {
  const normalized = normalizePhone(phone);
  const user = await prisma.user.findUnique({ where: { phone: normalized } });
  if (!user) return { success: false, error: "Phone number not found." };
  
  const hashedPin = await bcrypt.hash(newPin, 10);
  await prisma.user.update({ where: { id: user.id }, data: { pin: hashedPin } });
  await logAudit('RESET_PIN', { targetPhone: phone });
  return { success: true };
}

// ========== ADMIN USERS & SUBSCRIPTIONS ==========

export async function addClientWithSubscription(data: { phone: string; name: string; pkg: string; expiry_date: string; pin?: string }) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  
  const normalized = normalizePhone(data.phone);
  const pkg = await prisma.package.findUnique({ where: { id: data.pkg } }) || await prisma.package.findFirst({ where: { name: data.pkg } });
  
  if (!pkg) return { error: "Package not found." };

  let user = await prisma.user.findUnique({ where: { phone: normalized } });
  
  let hashedPin = null;
  if (data.pin) {
    hashedPin = await bcrypt.hash(data.pin, 10);
  }

  if (!user) {
    user = await prisma.user.create({ data: { phone: normalized, name: data.name, status: 'ACTIVE', pin: hashedPin } });
  } else {
    const updateData: Record<string, unknown> = { name: data.name, status: 'ACTIVE' };
    if (hashedPin) updateData.pin = hashedPin;
    await prisma.user.update({ where: { id: user.id }, data: updateData });
  }

  await prisma.subscription.create({
    data: {
      userId: user.id,
      packageId: pkg.id,
      expiresAt: new Date(data.expiry_date),
      status: 'ACTIVE'
    }
  });

  await logAudit('ADD_CLIENT_SUB', { phone: normalized, packageId: pkg.id });
  revalidatePath('/admin');
  revalidatePath('/vip-dashboard');
  return { success: true };
}

export async function deleteClient(id: string) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  
  // Soft Delete: Suspend the user and cancel subscriptions
  await prisma.user.update({ where: { id }, data: { status: 'SUSPENDED' } });
  await prisma.subscription.updateMany({ where: { userId: id }, data: { status: 'CANCELLED' } });
  
  await logAudit('SUSPEND_CLIENT', { userId: id });
  revalidatePath('/admin');
  revalidatePath('/vip-dashboard');
  return { success: true };
}

export async function completelyDeleteClient(id: string) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  
  // Hard Delete: Delete user and associated data. Orders are set to null instead of deleted to keep transaction history if needed.
  await prisma.order.updateMany({ where: { userId: id }, data: { userId: null } });
  await prisma.subscription.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });
  
  await logAudit('DELETE_CLIENT', { userId: id });
  revalidatePath('/admin');
  revalidatePath('/vip-dashboard');
  return { success: true };
}

// ========== ADMIN TICKETS (MOCK IMAGE UPLOAD FOR NOW) ==========
// Note: You must integrate the Supabase upload logic if you have the keys.
// For now, if formData contains an image, we will simulate the URL or you can use the real upload.

async function handleImageUpload(formData: FormData, fieldName: string): Promise<string> {
  const file = formData.get(fieldName) as File | null;
  
  if (!file || file.size === 0) {
    return "https://placehold.co/600x400?text=Ticket+Uploaded"; 
  }
  
  try {
    // ALWAYS use Vercel Blob if token is available. DO NOT store Base64 strings.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const blob = await put(file.name, file, { access: 'public' });
      return blob.url;
    }

    // Fallback for local development ONLY.
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split('.').pop() || 'png';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `ticket-${uniqueSuffix}.${ext}`;
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      
      return `/uploads/${filename}`;
    }

    console.warn("Vercel Blob is not configured! Please add BLOB_READ_WRITE_TOKEN.");
    return "https://placehold.co/600x400?text=Vercel+Blob+Not+Configured";
  } catch (error) {
    console.error("Image upload error:", error);
    return "https://placehold.co/600x400?text=Upload+Failed";
  }
}

export async function addTicket(formData: FormData) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  
  const packageId = formData.get('package_id') as string;
  const bookingCode = formData.get('booking_code') as string;
  const oddsTotal = parseFloat(formData.get('odds_total') as string) || null;
  const matchTimeStr = formData.get('match_time') as string;
  const matchTime = matchTimeStr ? new Date(matchTimeStr) : null;
  const imageUrl = await handleImageUpload(formData, 'image');

  const pkg = await prisma.package.findUnique({ where: { id: packageId } });
  if (!pkg) return { error: "Invalid package selected." };

  const ticket = await prisma.ticket.create({
    data: {
      imageUrl,
      bookingCode,
      oddsTotal,
      matchTime,
      status: 'PENDING',
    }
  });

  await prisma.ticketAudience.create({
    data: { ticketId: ticket.id, packageId: pkg.id }
  });

  await logAudit('ADD_TICKET', { ticketId: ticket.id });

  if (pkg) {
    await sendTelegramNotification(`🚨 <b>New VIP Ticket Added!</b>\n\nPackage: ${pkg.name}\nOdds: ${oddsTotal || 'TBA'}\nCheck your dashboard now!`);
  }

  revalidatePath('/admin');
  revalidatePath('/vip-dashboard');
  return { success: true };
}

export async function editTicket(id: string, formData: FormData) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  
  const packageId = formData.get('package_id') as string;
  const bookingCode = formData.get('booking_code') as string;
  const oddsTotal = parseFloat(formData.get('odds_total') as string) || null;
  const matchTimeStr = formData.get('match_time') as string;
  const matchTime = matchTimeStr ? new Date(matchTimeStr) : null;
  
  const updateData: Record<string, unknown> = { bookingCode, oddsTotal, matchTime };
  
  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0) {
    updateData.imageUrl = await handleImageUpload(formData, 'image');
  }
  
  await prisma.ticket.update({ 
    where: { id }, 
    data: updateData 
  });
  
  if (packageId) {
    await prisma.ticketAudience.deleteMany({ where: { ticketId: id } });
    await prisma.ticketAudience.create({ data: { ticketId: id, packageId } });
  }

  await logAudit('EDIT_TICKET', { ticketId: id });
  revalidatePath('/admin');
  revalidatePath('/vip-dashboard');
  return { success: true };
}

export async function deleteTicket(id: string) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  
  // Soft Delete
  await prisma.ticket.update({ where: { id }, data: { status: 'VOID' } });
  await logAudit('VOID_TICKET', { ticketId: id });
  revalidatePath('/admin');
  revalidatePath('/vip-dashboard');
  return { success: true };
}

// ========== PUBLIC CONTENT CRUD ==========

export async function updateFreeHook(formData: FormData) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  const description = formData.get('description') as string;
  const imageUrl = await handleImageUpload(formData, 'image');

  await prisma.freeHook.create({ data: { description, imageUrl, isActive: true } });
  
  revalidatePath('/');
  return { success: true };
}

export async function editFreeHook(id: string, formData: FormData) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  const description = formData.get('description') as string;
  await prisma.freeHook.update({ where: { id }, data: { description } });
  revalidatePath('/');
  return { success: true };
}

export async function deleteFreeHook(id: string) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  await prisma.freeHook.delete({ where: { id } });
  revalidatePath('/');
  return { success: true };
}

export async function addWonTicket(formData: FormData) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  const description = formData.get('description') as string;
  const imageUrl = await handleImageUpload(formData, 'image');

  await prisma.ticket.create({
    data: { imageUrl, bookingCode: description, status: 'WON' }
  });
  revalidatePath('/');
  return { success: true };
}

export async function editWonTicket(id: string, formData: FormData) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  const description = formData.get('description') as string;
  await prisma.ticket.update({ where: { id }, data: { bookingCode: description } });
  revalidatePath('/');
  return { success: true };
}

export async function deleteWonTicket(id: string) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  await prisma.ticket.update({ where: { id }, data: { status: 'VOID' } });
  revalidatePath('/');
  return { success: true };
}

export async function approveTestimonial(id: string) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  await prisma.testimonial.update({ where: { id }, data: { approved: true } });
  revalidatePath('/');
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath('/');
  return { success: true };
}

// ========== ADMIN FETCH QUERIES ==========

export async function getClientsWithSubscriptions() {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return [];
  
  return await prisma.user.findMany({
    where: { role: 'CLIENT', status: 'ACTIVE' },
    include: {
      subscriptions: {
        include: { package: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getTickets() {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return [];
  
  return await prisma.ticket.findMany({
    where: { status: 'PENDING' }, // Premium tickets are PENDING
    include: {
      audiences: {
        include: { package: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateSubscriptionExpiry(id: string, expiresAt: string) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) return { error: "Unauthorized" };
  
  await prisma.subscription.update({ 
    where: { id }, 
    data: { expiresAt: new Date(expiresAt) } 
  });
  
  revalidatePath('/');
  return { success: true };
}

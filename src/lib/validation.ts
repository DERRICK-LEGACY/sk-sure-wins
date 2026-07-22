/**
 * Input validation and sanitization utilities.
 * Prevents XSS, SQL injection, and malformed input from reaching the database.
 */

/** Valid Ugandan phone number formats: 0770..., 770..., 256770..., +256770... */
const UGANDA_PHONE_REGEX = /^(0|\+?256)?[37]\d{8}$/;

/** Package tier whitelist */
const VALID_TIERS = ['Bronze', 'Silver', 'Gold', 'Premium', 'Life Changer'] as const;
export type PackageTier = typeof VALID_TIERS[number];

/** Package price map in UGX — server-side source of truth */
export const PACKAGE_PRICES: Record<string, number> = {
  // Bronze
  "Bronze: ODD 1.5 Normal": 10000,
  "Bronze: ODD 1.2": 20000,
  "Bronze: ODD 3": 30000,
  "Bronze: ODD 4": 40000,
  "Bronze: ODD 5": 50000,
  // Silver
  "Silver: ODD 2.5": 20000,
  "Silver: ODD 5": 50000,
  "Silver: ODD 10": 70000,
  "Silver: ODD 15": 100000,
  // Gold
  "Gold: DAILY ODD": 50000,
  "Gold: WEEKLY ODDS": 200000,
  // Premium
  "Premium: DAILY ODDS": 20000,
  "Premium: WEEKLY ODD": 100000,
  // Life Changer
  "Life Changer: ODD 1.00": 10000,
  "Life Changer: ODD 1.50": 30000,
};

export function validatePhone(phone: string): { valid: boolean; error?: string } {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Phone number is required.' };
  }
  const cleaned = phone.replace(/[\s\-()]/g, '');
  if (!UGANDA_PHONE_REGEX.test(cleaned)) {
    return { valid: false, error: 'Enter a valid Ugandan phone number (e.g., 0770123456).' };
  }
  return { valid: true };
}

export function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('256')) cleaned = cleaned.slice(3);
  if (cleaned.startsWith('0')) cleaned = cleaned.slice(1);
  return '+256' + cleaned;
}

/** Format phone for MTN MOMO API (MSISDN format: 256XXXXXXXXX, no +) */
export function toMsisdn(phone: string): string {
  const normalized = normalizePhone(phone);
  return normalized.replace('+', '');
}

export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Name is required.' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters.' };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: 'Name cannot exceed 100 characters.' };
  }
  // Allow letters, spaces, hyphens, and apostrophes only
  if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes.' };
  }
  return { valid: true };
}

export function validatePackageTier(tier: string): { valid: boolean; error?: string } {
  if (!VALID_TIERS.includes(tier as PackageTier)) {
    return { valid: false, error: `Invalid package tier. Must be one of: ${VALID_TIERS.join(', ')}` };
  }
  return { valid: true };
}

export function validatePackageAndPrice(packageName: string, amount: number): { valid: boolean; error?: string } {
  const expectedPrice = PACKAGE_PRICES[packageName];
  if (!expectedPrice) {
    return { valid: false, error: 'Unknown package selected.' };
  }
  if (amount !== expectedPrice) {
    return { valid: false, error: 'Amount does not match the selected package price.' };
  }
  return { valid: true };
}

/** Sanitize text input — strip HTML tags, trim whitespace */
export function sanitizeText(text: string, maxLength: number = 500): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/<[^>]*>/g, '')    // Strip HTML tags
    .replace(/&/g, '&amp;')     // Encode ampersands
    .replace(/</g, '&lt;')      // Encode angle brackets
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .slice(0, maxLength);
}

/** Get the tier from a package name */
export function getTierFromPackage(packageName: string): PackageTier {
  if (packageName.startsWith('Life Changer')) return 'Life Changer';
  if (packageName.startsWith('Premium')) return 'Premium';
  if (packageName.startsWith('Gold')) return 'Gold';
  if (packageName.startsWith('Silver')) return 'Silver';
  return 'Bronze';
}

/** Calculate expiry date based on package tier */
export function getExpiryDate(tier: PackageTier): string {
  const now = new Date();
  switch (tier) {
    case 'Bronze':
      now.setDate(now.getDate() + 7);  // 1 week
      break;
    case 'Silver':
      now.setDate(now.getDate() + 7);  // 1 week
      break;
    case 'Gold':
      now.setDate(now.getDate() + 30); // 1 month
      break;
    case 'Premium':
      now.setDate(now.getDate() + 30); // 1 month
      break;
    case 'Life Changer':
      now.setDate(now.getDate() + 7);  // 1 week
      break;
  }
  return now.toISOString();
}

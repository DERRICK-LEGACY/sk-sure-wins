/**
 * MarzPay Card Payment Link Configuration
 * 
 * When Card Pay is selected, payments will be routed directly to this MarzPay payment link
 * instead of the automated Pegasus API collect-money endpoint.
 */

// Global/Default Card Payment Link from MarzPay Dashboard
// You can set MARZPAY_CARD_PAYMENT_LINK in .env.local, or paste the link directly below:
export const DEFAULT_CARD_PAYMENT_LINK = 
  process.env.MARZPAY_CARD_PAYMENT_LINK || 
  process.env.NEXT_PUBLIC_MARZPAY_CARD_PAYMENT_LINK || 
  "https://wallet.wearemarz.com/pay/b2d0ffd5-0a0b-4579-87d0-14a37a2b36b2";

/**
 * Price-based Card Payment Links:
 * Maps package price tiers directly to their respective fixed-price MarzPay payment links.
 * Any package with this price will automatically be routed to its fixed link.
 */
export const PRICE_CARD_PAYMENT_LINKS: Record<number, string> = {
  10000: "https://wallet.wearemarz.com/pay/b2d0ffd5-0a0b-4579-87d0-14a37a2b36b2", // 10,000 UGX Fixed Link
  20000: "", // 20,000 UGX Fixed Link
  30000: "", // 30,000 UGX Fixed Link
  40000: "", // 40,000 UGX Fixed Link
  50000: "", // 50,000 UGX Fixed Link
  70000: "", // 70,000 UGX Fixed Link
  100000: "", // 100,000 UGX Fixed Link
  200000: "", // 200,000 UGX Fixed Link
};

/**
 * Optional: Package-specific payment links if generated per specific package in MarzPay.
 * If a package name is listed here, its specific link will take precedence over price and default links.
 */
export const PACKAGE_CARD_PAYMENT_LINKS: Record<string, string> = {
  // Example:
  // "Bronze: ODD 1.5 Normal": "https://wallet.wearemarz.com/pay/xxxx-bronze-1-5",
};

interface GetCardPaymentUrlParams {
  packageName: string;
  referenceId: string;
  phone: string;
  amount: number;
}

/**
 * Resolves the payment link to redirect the customer to for card payments.
 */
export function getCardPaymentUrl({ packageName, referenceId, phone, amount }: GetCardPaymentUrlParams): string | null {
  // 1. Check for a package-specific link
  // 2. Check for a price-tier fixed link
  // 3. Fallback to default link
  let link = PACKAGE_CARD_PAYMENT_LINKS[packageName] || PRICE_CARD_PAYMENT_LINKS[amount] || DEFAULT_CARD_PAYMENT_LINK;
  
  if (!link || !link.trim()) {
    return null;
  }

  link = link.trim();

  // If the link supports dynamic query parameters, append reference, phone, and amount for reconciliation
  try {
    const url = new URL(link);
    if (!url.searchParams.has("reference") && !url.searchParams.has("ref")) {
      url.searchParams.set("reference", referenceId);
    }
    if (phone && !url.searchParams.has("phone")) {
      url.searchParams.set("phone", phone);
    }
    if (amount && !url.searchParams.has("amount")) {
      url.searchParams.set("amount", String(amount));
    }
    return url.toString();
  } catch {
    // If it's a relative URL or custom schema, return as is
    return link;
  }
}

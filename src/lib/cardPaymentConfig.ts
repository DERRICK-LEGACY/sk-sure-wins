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
 * Optional: Package-specific payment links if generated per tier or price in MarzPay.
 * If a package name is listed here, its specific link will take precedence over the default link.
 */
export const PACKAGE_CARD_PAYMENT_LINKS: Record<string, string> = {
  // Example:
  // "Bronze: ODD 1.5 Normal": "https://wallet.wearemarz.com/pay/xxxx-bronze-1-5",
  // "Silver: ODD 2.5": "https://wallet.wearemarz.com/pay/xxxx-silver-2-5",
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
  let link = PACKAGE_CARD_PAYMENT_LINKS[packageName] || DEFAULT_CARD_PAYMENT_LINK;
  
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

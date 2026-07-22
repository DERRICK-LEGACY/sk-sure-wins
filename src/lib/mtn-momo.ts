/**
 * MTN Mobile Money Collection API Client
 * Handles authentication, Request-to-Pay, and transaction status checking.
 * 
 * Sandbox: https://sandbox.momodeveloper.mtn.com
 * Docs: https://momodeveloper.mtn.com/api-documentation
 */

import { v4 as uuidv4 } from 'uuid';

const BASE_URL = process.env.MTN_MOMO_BASE_URL || 'https://sandbox.momodeveloper.mtn.com';
const SUBSCRIPTION_KEY = process.env.MTN_MOMO_SUBSCRIPTION_KEY!;
const API_USER = process.env.MTN_MOMO_API_USER!;
const API_KEY = process.env.MTN_MOMO_API_KEY!;
const CALLBACK_URL = process.env.MTN_MOMO_CALLBACK_URL || '';
const ENVIRONMENT = process.env.MTN_MOMO_ENVIRONMENT || 'sandbox';

interface RequestToPayParams {
  amount: number;
  currency?: string;
  phone: string;         // MSISDN format: 256XXXXXXXXX
  externalId: string;    // Your internal reference
  payerMessage: string;
  payeeNote: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface TransactionStatus {
  amount: string;
  currency: string;
  financialTransactionId: string;
  externalId: string;
  payer: {
    partyIdType: string;
    partyId: string;
  };
  payerMessage: string;
  payeeNote: string;
  status: 'SUCCESSFUL' | 'FAILED' | 'PENDING';
  reason?: {
    code: string;
    message: string;
  };
}

// Token cache to avoid requesting a new token for every call
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get OAuth2 access token from MTN MOMO API.
 * Uses Basic Auth with API_USER:API_KEY.
 * Caches the token until it expires.
 */
export async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.token;
  }

  const credentials = Buffer.from(`${API_USER}:${API_KEY}`).toString('base64');

  const response = await fetch(`${BASE_URL}/collection/token/`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[MTN MOMO] Token request failed:', response.status, errorText);
    throw new Error(`MTN MOMO token request failed: ${response.status}`);
  }

  const data: TokenResponse = await response.json();
  
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in * 1000),
  };

  return data.access_token;
}

/**
 * Initiate a Request-to-Pay (Collection).
 * This sends an STK push to the user's phone.
 * Returns the referenceId (UUID) used to track the transaction.
 */
export async function requestToPay(params: RequestToPayParams): Promise<{ referenceId: string }> {
  const token = await getAccessToken();
  const referenceId = uuidv4();

  const body = {
    amount: String(params.amount),
    currency: ENVIRONMENT === 'sandbox' ? 'EUR' : (params.currency || 'UGX'),
    externalId: params.externalId,
    payer: {
      partyIdType: 'MSISDN',
      partyId: params.phone,
    },
    payerMessage: params.payerMessage,
    payeeNote: params.payeeNote,
  };

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    'X-Reference-Id': referenceId,
    'X-Target-Environment': ENVIRONMENT,
    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
    ...(CALLBACK_URL.startsWith('https://') ? { 'X-Callback-Url': CALLBACK_URL } : {}),
    'Content-Type': 'application/json',
  };

  console.log('[MTN MOMO] Request-to-Pay Payload:', JSON.stringify(body, null, 2));
  console.log('[MTN MOMO] Headers:', JSON.stringify(headers, null, 2));

  const response = await fetch(`${BASE_URL}/collection/v1_0/requesttopay`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[MTN MOMO] Request-to-Pay failed:', response.status, errorText);
    throw new Error(`Request-to-Pay failed: ${response.status} — ${errorText}`);
  }

  console.log('[MTN MOMO] Request-to-Pay SUCCESS. Reference:', referenceId);

  // MTN returns 202 Accepted with no body on success
  return { referenceId };
}

/**
 * Check the status of a Request-to-Pay transaction.
 * Use this to poll for payment completion.
 */
export async function getTransactionStatus(referenceId: string): Promise<TransactionStatus> {
  const token = await getAccessToken();

  const response = await fetch(`${BASE_URL}/collection/v1_0/requesttopay/${referenceId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Target-Environment': ENVIRONMENT,
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[MTN MOMO] Status check failed:', response.status, errorText);
    throw new Error(`Transaction status check failed: ${response.status}`);
  }

  return response.json();
}

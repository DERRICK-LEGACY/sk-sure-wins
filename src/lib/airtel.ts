const AIRTEL_BASE_URL = process.env.AIRTEL_ENVIRONMENT === 'standard' 
  ? 'https://openapiuat.airtel.africa'
  : 'https://openapi.airtel.africa';

export async function getAirtelToken() {
  const clientId = process.env.AIRTEL_CLIENT_ID;
  const clientSecret = process.env.AIRTEL_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId === 'your_airtel_client_id_here') {
    throw new Error('Airtel API credentials are not configured.');
  }

  const res = await fetch(`${AIRTEL_BASE_URL}/auth/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to get Airtel token: ${JSON.stringify(data)}`);
  }

  return data.access_token;
}

export async function requestAirtelPayment({ amount, phone, referenceId }: { amount: number, phone: string, referenceId: string }) {
  const token = await getAirtelToken();
  
  const msisdn = phone.startsWith('256') ? phone : (phone.startsWith('+256') ? phone.slice(1) : `256${phone}`);

  const payload = {
    reference: "SK-SURE-WINS",
    subscriber: {
      country: "UG",
      currency: "UGX",
      msisdn: msisdn
    },
    transaction: {
      amount: amount,
      country: "UG",
      currency: "UGX",
      id: referenceId
    }
  };

  const res = await fetch(`${AIRTEL_BASE_URL}/merchant/v1/payments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'X-Country': 'UG',
      'X-Currency': 'UGX',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Airtel push failed: ${JSON.stringify(data)}`);
  }

  return data;
}

export async function checkAirtelTransactionStatus(referenceId: string) {
  const token = await getAirtelToken();
  
  const res = await fetch(`${AIRTEL_BASE_URL}/standard/v1/payments/${referenceId}`, {
    method: 'GET',
    headers: {
      'Accept': '*/*',
      'X-Country': 'UG',
      'X-Currency': 'UGX',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to check Airtel transaction status: ${JSON.stringify(data)}`);
  }

  return data;
}

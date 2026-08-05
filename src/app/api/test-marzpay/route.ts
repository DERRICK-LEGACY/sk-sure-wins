import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = (process.env.MARZPAY_API_KEY || 'marz_clTJGirR1HYLFRUt').trim();
  const apiSecret = (process.env.MARZPAY_API_SECRET || 'NoNkshqQ9IkznuUbWb9G0F2nPaM9XETh').trim();
  const apiBase = (process.env.MARZPAY_API_BASE || 'https://wallet.wearemarz.com/api/v1').trim();
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  const testNumbers = [
    "+256781360275",
    "256781360275",
    "0781360275",
    "+2560781360275",
    "781360275",
    "+256 781 360 275"
  ];

  const results: Record<string, unknown> = {};

  for (const num of testNumbers) {
    try {
      const res = await fetch(`${apiBase}/collect-money`, {
        method: 'POST',
        headers: { 
          'Authorization': `Basic ${auth}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          amount: 1000,
          phone_number: num,
          reference: crypto.randomUUID(),
          country: 'UG',
          description: `Test Number ${num}`,
          callback_url: 'https://sksurewinspredictions.com/api/webhooks/marzpay',
        }),
      });

      const text = await res.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
      results[num] = {
        status: res.status,
        response: parsed
      };
    } catch (e: unknown) {
      results[num] = { error: e instanceof Error ? e.message : String(e) };
    }
  }

  return NextResponse.json(results);
}

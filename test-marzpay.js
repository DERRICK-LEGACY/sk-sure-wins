require('dotenv').config({ path: '.env.local' });
const crypto = require('crypto');
const apiKey = process.env.MARZPAY_API_KEY;
const apiSecret = process.env.MARZPAY_API_SECRET;
const apiBase = process.env.MARZPAY_API_BASE;
const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

fetch(`${apiBase}/collect-money`, {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 5000,
    phone_number: "+256712345678",
    reference: crypto.randomUUID(),
    country: "UG",
    description: "Order #1042",
    callback_url: "https://your-app.com/webhooks/marzpay"
  })
}).then(res => res.text()).then(text => console.log('response:', text)).catch(err => console.error(err));

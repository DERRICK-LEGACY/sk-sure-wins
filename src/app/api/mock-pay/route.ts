import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { phone, name, packageName, pin } = await req.json();

    if (!phone || !name || !packageName || !pin) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Create Supabase Admin client using Service Role Key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 1. Look up package by name
    const { data: pkgData, error: pkgError } = await supabaseAdmin
      .from('packages')
      .select('id')
      .eq('name', packageName)
      .single();

    if (pkgError || !pkgData) {
      console.error("Package not found:", packageName);
      return NextResponse.json({ success: false, error: 'Invalid package selected' }, { status: 400 });
    }
    const package_id = pkgData.id;

    // 2. Format phone number and find/create client
    const normalizedPhone = '+256' + phone.replace(/[^0-9]/g, '').replace(/^256|^0/, '');
    let client_id;

    const { data: existingClient } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('phone', normalizedPhone)
      .single();

    if (existingClient) {
      client_id = existingClient.id;
      await supabaseAdmin.from('clients').update({ name, pin }).eq('id', client_id);
    } else {
      const { data: newClient, error: clientErr } = await supabaseAdmin
        .from('clients')
        .insert({ phone: normalizedPhone, name, pin })
        .select('id')
        .single();
      if (clientErr || !newClient) {
        return NextResponse.json({ success: false, error: 'Failed to create client record' }, { status: 500 });
      }
      client_id = newClient.id;
    }

    // 3. Add 30 days to current date for expiry
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    const expiryStr = expiryDate.toISOString().split('T')[0];

    // 4. Upsert subscription
    const { data: existingSub } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('client_id', client_id)
      .eq('package_id', package_id)
      .single();

    if (existingSub) {
      await supabaseAdmin.from('subscriptions').update({ expires_at: expiryStr, status: 'active' }).eq('id', existingSub.id);
    } else {
      await supabaseAdmin.from('subscriptions').insert({ client_id, package_id, expires_at: expiryStr, status: 'active' });
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({ 
      success: true, 
      referenceId: crypto.randomBytes(8).toString('hex') 
    });

  } catch (err: any) {
    console.error("Mock Pay Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

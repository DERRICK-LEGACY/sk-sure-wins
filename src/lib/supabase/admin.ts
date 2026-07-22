import { createClient } from '@supabase/supabase-js';

/**
 * Admin Supabase client using SERVICE_ROLE_KEY.
 * This bypasses Row Level Security — use ONLY in server-side code.
 * NEVER expose this in client components.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

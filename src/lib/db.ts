/**
 * Database module — Supabase PostgreSQL
 * 
 * This project uses Supabase as its database.
 * All database operations go through the Supabase clients in:
 *   - src/lib/supabase/server.ts (SSR client with cookies)
 *   - src/lib/supabase/admin.ts  (Service role client, bypasses RLS)
 * 
 * The old SQLite implementation has been removed.
 * See actions.ts for all database operations.
 */

export {};

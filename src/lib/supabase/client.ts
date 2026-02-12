import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Fallback values for Cloudflare Pages (env vars applied at build time)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || 'https://lhuwdzgchwspnewnagyy.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXdkemdjaHdzcG5ld25hZ3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDQ2OTUsImV4cCI6MjA4NTgyMDY5NX0.cd0SxyWfMGWpPaESledkPAeLwqb1UJx9jP0vLgBpMF8'
// Service role key for storage operations (bypasses RLS) 
// TODO: Move to server-side API route when switching from static export
const SUPABASE_SERVICE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY?.trim() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXdkemdjaHdzcG5ld25hZ3l5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI0NDY5NSwiZXhwIjoyMDg1ODIwNjk1fQ.3oMHxcgtzkI8iopVx148MrtaHUexME95wf9ftPOm5cI'

export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
}

/**
 * Storage client that uses service role key to bypass RLS.
 * Used only for file uploads to Supabase Storage.
 */
export function createStorageClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
}

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// Fallback values for Cloudflare Pages (env vars applied at build time)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || 'https://lhuwdzgchwspnewnagyy.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXdkemdjaHdzcG5ld25hZ3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDQ2OTUsImV4cCI6MjA4NTgyMDY5NX0.cd0SxyWfMGWpPaESledkPAeLwqb1UJx9jP0vLgBpMF8'

export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
}

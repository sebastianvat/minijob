import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
      url: supabaseUrl ? 'set' : 'MISSING',
      key: supabaseAnonKey ? 'set' : 'MISSING'
    })
    throw new Error('Missing Supabase configuration')
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

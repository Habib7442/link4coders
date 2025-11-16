import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

// Ensure these environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single supabase client for client-side operations with proper cookie handling
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Export a singleton instance for convenience
export const supabase = createClient();
export type { User };
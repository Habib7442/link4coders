import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

// Create a Supabase client for server-side operations
// This should only be used in server components or server actions
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

export type { User };
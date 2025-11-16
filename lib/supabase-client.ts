import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

// Ensure these environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single supabase client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export type { User };
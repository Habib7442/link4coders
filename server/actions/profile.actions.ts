'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

interface ProfileData {
  name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  title?: string;
}

// Get user profile
export async function getUserProfile(userId: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, error: 'Failed to fetch profile data' };
  }
  
  return { success: true, data };
}

// Update user profile
export async function updateUserProfile(userId: string, profileData: ProfileData) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('users')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Failed to update profile data' };
  }
  
  return { success: true, data };
}

// Get user's public profile
export async function getPublicProfile(username: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      projects (*),
      skills (*)
    `)
    .eq('username', username)
    .single();
  
  if (error) {
    console.error('Error fetching public profile:', error);
    return { success: false, error: 'Failed to fetch public profile data' };
  }
  
  return { success: true, data };
}
'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getFeaturedProfiles(limit: number = 6) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get public profiles with complete data
    const { data: users, error } = await supabase
      .from('users')
      .select('id, full_name, profile_slug, profile_title, bio, avatar_url, tech_stacks, github_username, theme_id')
      .eq('is_public', true)
      .eq('profile_public', true)
      .not('profile_slug', 'is', null)
      .not('avatar_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error || !users) {
      return { success: false, profiles: [] };
    }
    
    return { success: true, profiles: users };
  } catch (error) {
    console.error('Error fetching featured profiles:', error);
    return { success: false, profiles: [] };
  }
}

export async function getPublicProfile(username: string) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get user by profile_slug
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('profile_slug', username)
      .eq('is_public', true)
      .single();
    
    if (userError || !user) {
      return { success: false, user: null, links: [], appearanceSettings: null, voiceAssistant: null };
    }
    
    // Get user links
    const { data: links, error: linksError } = await supabase
      .from('user_links')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('position', { ascending: true });
    
    // Get appearance settings
    const { data: appearanceSettings } = await supabase
      .from('user_appearance_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    // Get voice assistant config (if exists)
    const { data: voiceAssistant } = await supabase
      .from('ai_voice_assistants')
      .select('assistant_id, assistant_name, first_message, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();
    
    // Organize links by category
    const linksByCategory: Record<string, unknown[]> = {
      personal: [],
      projects: [],
      blogs: [],
      achievements: [],
      contact: [],
      social: [],
      custom: []
    };
    
    links?.forEach(link => {
      const category = link.category || 'custom';
      if (linksByCategory[category]) {
        linksByCategory[category].push(link);
      }
    });
    
    return {
      success: true,
      user,
      links: linksByCategory,
      appearanceSettings,
      voiceAssistant,
      categoryOrder: user.category_order || ['personal', 'projects', 'blogs', 'achievements', 'contact', 'social', 'custom']
    };
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return { success: false, user: null, links: [], appearanceSettings: null, voiceAssistant: null };
  }
}

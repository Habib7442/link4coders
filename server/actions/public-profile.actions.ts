'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

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

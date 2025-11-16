'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

interface TemplateData {
  name: string;
  description?: string;
  category: 'free' | 'premium';
  html_content: string;
  css_content: string;
  js_content?: string;
  thumbnail_url?: string;
  is_public?: boolean;
}

// Get all templates
export async function getAllTemplates() {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching templates:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

// Get template by ID
export async function getTemplateById(templateId: string) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', templateId)
    .single();
  
  if (error) {
    console.error('Error fetching template:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

// Create a new template
export async function createTemplate(userId: string, templateData: TemplateData) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('templates')
    .insert({
      ...templateData,
      creator_id: userId
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating template:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

// Update a template
export async function updateTemplate(templateId: string, templateData: TemplateData) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('templates')
    .update(templateData)
    .eq('id', templateId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating template:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

// Delete a template
export async function deleteTemplate(templateId: string) {
  const supabase = createServerSupabaseClient();
  
  const { error } = await supabase
    .from('templates')
    .delete()
    .eq('id', templateId);
  
  if (error) {
    console.error('Error deleting template:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// Set user's selected template
export async function setUserTemplate(userId: string, templateId: string) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .update({ selected_template_id: templateId })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error setting user template:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}
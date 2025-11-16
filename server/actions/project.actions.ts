'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

interface ProjectData {
  name: string;
  description?: string;
  github_url?: string;
  demo_url?: string;
  tech_stack?: string[];
}

// Get user's projects
export async function getUserProjects(userId: string) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user projects:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

// Create a new project
export async function createProject(userId: string, projectData: ProjectData) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...projectData,
      user_id: userId,
      tech_stack: projectData.tech_stack || []
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating project:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

// Update a project
export async function updateProject(projectId: string, projectData: ProjectData) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', projectId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating project:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

// Delete a project
export async function deleteProject(projectId: string) {
  const supabase = createServerSupabaseClient();
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);
  
  if (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}
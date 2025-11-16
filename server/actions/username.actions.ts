'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'

// Check if a username (profile_slug) is available
export async function checkUsernameAvailability(username: string, currentUserId?: string) {
  // Validate input
  if (!username || username.length < 3) {
    return { 
      success: false, 
      available: false, 
      error: 'Username must be at least 3 characters long' 
    }
  }
  
  // Check for invalid characters (only allow alphanumeric and hyphens/underscores)
  const validUsernameRegex = /^[a-zA-Z0-9_-]+$/
  if (!validUsernameRegex.test(username)) {
    return { 
      success: false, 
      available: false, 
      error: 'Username can only contain letters, numbers, hyphens, and underscores' 
    }
  }
  
  try {
    const supabase = await createServerSupabaseClient()
    
    let query = supabase
      .from('users')
      .select('id')
      .eq('profile_slug', username)
    
    // If we have a current user ID, exclude that user from the check
    // This allows users to keep their current username
    if (currentUserId) {
      query = query.neq('id', currentUserId)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error checking username availability:', error)
      return { 
        success: false, 
        available: false, 
        error: 'Failed to check username availability' 
      }
    }
    
    // If no users found with this username, it's available
    const isAvailable = data.length === 0
    
    return { 
      success: true, 
      available: isAvailable,
      error: isAvailable ? null : 'Username is already taken' 
    }
  } catch (error) {
    console.error('Error checking username availability:', error)
    return { 
      success: false, 
      available: false, 
      error: 'An unexpected error occurred' 
    }
  }
}
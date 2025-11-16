'use server'

import { SupabaseUserRepository } from '@/lib/infrastructure/repositories'
import { UserUseCaseImpl } from '@/lib/application/use-cases'
import { TemplateId } from '@/lib/domain/entities/template'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

// Create singleton instances
const userRepository = new SupabaseUserRepository()
const userUseCases = new UserUseCaseImpl(userRepository)

// Helper function to get user ID from session
async function getUserId() {
  const supabase = await createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const cookieStore = await cookies()
          return cookieStore.getAll()
        },
        async setAll(cookiesToSet) {
          try {
            const cookieStore = await cookies()
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error('Authentication required')
  }
  
  return user.id
}

// Helper function to invalidate user template cache
async function invalidateUserTemplateCache(userId: string) {
  try {
    // Get user data to find username for cache invalidation
    const user = await userUseCases.getUserProfile(userId)
    const username = user?.profile_slug || user?.github_username
    
    if (username) {
      revalidateTag(`public-profile-${username}`, 'layout')
    }
    revalidateTag('public-profiles', 'layout')
  } catch (error) {
    console.warn('Cache invalidation failed:', error)
  }
}

/**
 * Get user template
 */
export async function getUserTemplate(userId: string): Promise<{ theme_id: string } | null> {
  try {
    // Get user profile which contains the theme_id
    const user = await userUseCases.getUserProfile(userId)
    return user ? { theme_id: user.theme_id || 'developer-dark' } : null
  } catch (error) {
    console.error('Error fetching user template:', error)
    throw error
  }
}

/**
 * Update user template
 */
export async function updateUserTemplate(userId: string, templateId: TemplateId): Promise<boolean> {
  try {
    // Update user profile with new theme_id
    const result = await userUseCases.updateProfile(userId, { theme_id: templateId })
    
    // Invalidate caches after successful template update
    await invalidateUserTemplateCache(userId)
    
    return result !== null
  } catch (error) {
    console.error('Error updating user template:', error)
    throw error
  }
}
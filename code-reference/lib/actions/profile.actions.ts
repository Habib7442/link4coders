'use server'

import { SupabaseUserRepository } from '@/lib/infrastructure/repositories'
import { UserUseCaseImpl } from '@/lib/application/use-cases'
import { User, UserProfile } from '@/lib/domain/entities'
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

// Helper function to invalidate user profile cache
async function invalidateUserProfileCache(userId: string) {
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
 * Get user profile
 */
export async function getUserProfile(): Promise<User | null> {
  try {
    const userId = await getUserId()
    return await userUseCases.getUserProfile(userId)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

/**
 * Update user profile
 */
export async function updateProfile(profileData: Partial<UserProfile>): Promise<User | null> {
  try {
    const userId = await getUserId()
    const updatedUser = await userUseCases.updateProfile(userId, profileData)
    
    // Invalidate caches after successful profile update
    await invalidateUserProfileCache(userId)
    
    return updatedUser
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    return await userUseCases.getUserByUsername(username)
  } catch (error) {
    console.error('Error fetching user by username:', error)
    throw error
  }
}
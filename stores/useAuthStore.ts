'use client'

import { create } from 'zustand'
import { createClient } from '@/lib/supabase-client'
import type { User, AuthError } from '@supabase/supabase-js'

interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  github_username: string | null
  profile_slug: string | null
  created_at: string
  updated_at: string
}

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  initialized: boolean
  error: string | null
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  logout: () => Promise<void>
  fetchUserProfile: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<boolean>
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<boolean>
  signInWithGoogle: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  error: null,
  
  setUser: (user) => {
    console.log('🔐 Setting user:', user?.email || 'null')
    set({ user })
  },
  
  setProfile: (profile) => {
    console.log('👤 Profile fetched:', profile?.email || 'null')
    set({ profile })
  },
  
  setLoading: (loading) => set({ loading }),
  
  setInitialized: (initialized) => set({ initialized }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  signInWithEmail: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null })
      const supabase = createClient()
      
      console.log('📧 Signing in with email:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('❌ Sign in error:', error.message)
        set({ error: error.message, loading: false })
        return false
      }
      
      if (data?.user) {
        console.log('✅ Sign in successful:', data.user.email)
        set({ user: data.user, loading: false })
        
        // Fetch profile
        get().fetchUserProfile()
        return true
      }
      
      return false
    } catch (error) {
      console.error('❌ Sign in error:', error)
      set({ error: (error as AuthError).message, loading: false })
      return false
    }
  },
  
  signUpWithEmail: async (email: string, password: string, fullName?: string) => {
    try {
      set({ loading: true, error: null })
      const supabase = createClient()
      
      console.log('📝 Signing up with email:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      
      if (error) {
        console.error('❌ Sign up error:', error.message)
        set({ error: error.message, loading: false })
        return false
      }
      
      if (data?.user) {
        console.log('✅ Sign up successful:', data.user.email)
        
        // Check if email confirmation is required
        if (!data.user.identities?.length) {
          set({ 
            error: 'Please check your email for a confirmation link.',
            loading: false 
          })
          return false
        }
        
        set({ user: data.user, loading: false })
        return true
      }
      
      return false
    } catch (error) {
      console.error('❌ Sign up error:', error)
      set({ error: (error as AuthError).message, loading: false })
      return false
    }
  },
  
  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null })
      const supabase = createClient()
      
      console.log('🔍 Signing in with Google...')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          scopes: 'email profile'
        }
      })
      
      if (error) {
        console.error('❌ Google sign in error:', error.message)
        set({ error: error.message, loading: false })
        return false
      }
      
      return true
    } catch (error) {
      console.error('❌ Google sign in error:', error)
      set({ error: (error as AuthError).message, loading: false })
      return false
    }
  },
  
  logout: async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Logout error:', error)
        throw error
      }
      
      console.log('🔓 User logged out successfully')
      set({ user: null, profile: null })
    } catch (error) {
      console.error('❌ Error in logout:', error)
      throw error
    }
  },
  
  fetchUserProfile: async () => {
    try {
      const supabase = createClient()
      
      console.log('🔍 Fetching user session...')
      
      // First check if session exists to avoid AuthSessionMissingError
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('❌ Error getting session:', sessionError)
        set({ user: null, profile: null, loading: false, initialized: true })
        return
      }
      
      if (!session) {
        console.log('🔓 No session found')
        set({ user: null, profile: null, loading: false, initialized: true })
        return
      }
      
      // Use getUser() to authenticate the session (more secure than trusting session directly)
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.log('🔓 No authenticated user found')
        set({ user: null, profile: null, loading: false, initialized: true })
        return
      }
      
      console.log('✅ User authenticated:', user.email)
      set({ user, loading: false, initialized: true })
      
      // Fetch user profile from public.users table
      console.log('🔍 Fetching user profile from database...')
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileError) {
        console.error('❌ Error fetching user profile:', profileError)
        set({ profile: null })
      } else {
        console.log('✅ Profile loaded:', profile.email)
        set({ profile: profile as Profile })
      }
    } catch (error) {
      console.error('❌ Error in fetchUserProfile:', error)
      set({ user: null, profile: null, loading: false, initialized: true })
    }
  },
}))
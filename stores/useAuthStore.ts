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
  
  setUser: (user) => set({ user }),
  
  setProfile: (profile) => set({ profile }),
  
  setLoading: (loading) => set({ loading }),
  
  setInitialized: (initialized) => set({ initialized }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  signInWithEmail: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null })
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        set({ error: error.message, loading: false })
        return false
      }
      
      if (data?.user) {
        set({ user: data.user, loading: false })
        
        // Fetch profile
        get().fetchUserProfile()
        return true
      }
      
      return false
    } catch (error) {
      set({ error: (error as AuthError).message, loading: false })
      return false
    }
  },
  
  signUpWithEmail: async (email: string, password: string, fullName?: string) => {
    try {
      set({ loading: true, error: null })
      const supabase = createClient()
      
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
        set({ error: error.message, loading: false })
        return false
      }
      
      if (data?.user) {
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
      set({ error: (error as AuthError).message, loading: false })
      return false
    }
  },
  
  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null })
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          scopes: 'email profile'
        }
      })
      
      if (error) {
        set({ error: error.message, loading: false })
        return false
      }
      
      return true
    } catch (error) {
      set({ error: (error as AuthError).message, loading: false })
      return false
    }
  },
  
  logout: async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      set({ user: null, profile: null })
    } catch (error) {
      throw error
    }
  },
  
  fetchUserProfile: async () => {
    try {
      const supabase = createClient()
      
      // First check if session exists to avoid AuthSessionMissingError
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        set({ user: null, profile: null, loading: false, initialized: true })
        return
      }
      
      if (!session) {
        set({ user: null, profile: null, loading: false, initialized: true })
        return
      }
      
      // Use getUser() to authenticate the session (more secure than trusting session directly)
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        set({ user: null, profile: null, loading: false, initialized: true })
        return
      }
      
      set({ user, loading: false, initialized: true })
      
      // Fetch user profile from public.users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileError) {
        set({ profile: null })
      } else {
        set({ profile: profile as Profile })
      }
    } catch (error) {
      set({ user: null, profile: null, loading: false, initialized: true })
    }
  },
}))
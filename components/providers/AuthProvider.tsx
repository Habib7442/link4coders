'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { createClient } from '@/lib/supabase-client'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { fetchUserProfile, setUser, setProfile, setInitialized } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()
    
    console.log('🚀 AuthProvider: Initializing auth...')
    
    // Fetch initial user profile
    fetchUserProfile()
    
    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change event:', event)
        console.log('📦 Session:', session ? 'exists' : 'null')
        
        if (session) {
          // Use getUser() to authenticate instead of trusting session.user directly
          const { data: { user }, error } = await supabase.auth.getUser()
          
          if (user && !error) {
            console.log('✅ User authenticated:', user.email)
            setUser(user)
            
            // Fetch user profile from database
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', user.id)
              .single()
            
            if (profile) {
              console.log('✅ Profile fetched:', profile.email)
              setProfile(profile)
            }
          } else {
            console.log('🔓 User authentication failed')
            setUser(null)
            setProfile(null)
          }
        } else {
          console.log('🔓 User signed out')
          setUser(null)
          setProfile(null)
        }
        
        setInitialized(true)
      }
    )
    
    return () => {
      console.log('🛑 AuthProvider: Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [fetchUserProfile, setUser, setProfile, setInitialized])

  return <>{children}</>
}
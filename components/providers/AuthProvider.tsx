'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { createClient } from '@/lib/supabase-client'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setProfile, setInitialized, setLoading } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()
    let mounted = true
    
    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          setUser(null)
          setProfile(null)
          setInitialized(true)
          setLoading(false)
          return
        }
        
        if (session?.user) {
          setUser(session.user)
          
          // Fetch profile
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (mounted && profile) {
            setProfile(profile)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
        
        if (mounted) {
          setInitialized(true)
          setLoading(false)
        }
      } catch (error) {
        if (mounted) {
          setUser(null)
          setProfile(null)
          setInitialized(true)
          setLoading(false)
        }
      }
    }
    
    // Run initial auth check
    initializeAuth()
    
    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          
          // Fetch user profile from database
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (mounted && profile) {
            setProfile(profile)
          }
          
          if (mounted) {
            setInitialized(true)
            setLoading(false)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          setInitialized(true)
          setLoading(false)
        }
      }
    )
    
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setUser, setProfile, setInitialized, setLoading])

  return <>{children}</>
}
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createServerSupabaseClient()
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
    }
    
    // Redirect to home page after successful login
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect to login if no code is present
  return NextResponse.redirect(new URL('/', request.url))
}
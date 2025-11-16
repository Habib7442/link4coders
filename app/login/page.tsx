'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import { AuthModal } from '@/components/ui/auth-modal'
import { Header } from '@/components/ui/header'

export default function LoginPage() {
  const [showAuthModal, setShowAuthModal] = useState(true)
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // If user is already authenticated, redirect to profile
    if (user) {
      router.push('/profile')
    }
  }, [user, router])

  // If user is authenticated, don't show the login page
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#18181a]">
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-62px)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Please Sign In</h1>
          <p className="text-gray-400 mb-8">You need to be signed in to access your profile</p>
        </div>
      </main>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false)
          // If user closes the modal without signing in, redirect to home
          if (!user) {
            router.push('/')
          }
        }}
        defaultMode="signin"
      />
    </div>
  )
}
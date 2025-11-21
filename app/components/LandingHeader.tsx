'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { GoogleSignInModal } from '@/components/GoogleSignInModal'
import { UserMenu } from '@/components/UserMenu'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const ViTechLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-0', className)}>
      <Image
        src="/vtech-logo.png"
        alt="ViTech Logo"
        width={120}
        height={32}
        className="h-8 w-auto"
        priority
      />
      <span className="text-3xl font-medium text-black" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>vitech.</span>
    </div>
  )
}

export default function LandingHeader() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="fixed z-50 w-full pt-6" style={{ zIndex: 60 }}>
      <div className="flex items-center justify-between w-full px-[50px]">
        {/* Logo - Left Side */}
        <ViTechLogo />

        {/* Auth Section - Right Side */}
        <div>
          {loading ? (
            // Loading skeleton
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              <div className="hidden md:block">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ) : user ? (
            // Show user menu when signed in
            <UserMenu user={user} />
          ) : (
            // Show sign-in button when not signed in
            <button
              onClick={() => setIsSignInModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 transition-all duration-200 text-sm font-medium text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Google Sign In Modal */}
      <GoogleSignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
    </header>
  )
}

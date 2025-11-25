'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { UserMenu } from '@/components/UserMenu'
import { LogIn } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface LandingHeaderProps {
  user: User | null
  loading: boolean
  onSignInClick: () => void
}

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

export default function LandingHeader({ user, loading, onSignInClick }: LandingHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={cn(
        "fixed z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm py-4 md:bg-transparent md:shadow-none md:py-6 md:backdrop-blur-none" 
          : "pt-4 md:pt-6 bg-transparent"
      )}
      style={{ zIndex: 60 }}
    >
      <div className="flex items-center justify-between w-full px-6 md:px-[50px]">
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
              onClick={onSignInClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 transition-all duration-200 text-sm font-medium text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

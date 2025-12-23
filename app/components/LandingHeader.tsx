'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { UserMenu } from '@/components/UserMenu'
import { LogIn } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import gsap from 'gsap'

interface LandingHeaderProps {
  user: User | null
  loading: boolean
  onSignInClick: () => void
}

const ViTechLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center', className)}>
      <Image
        src="/vitech-landing-logo-white.svg"
        alt="Vitech - Your Personal AI Assistant"
        width={200}
        height={56}
        className="h-14 w-auto"
        priority
      />
    </div>
  )
}

export default function LandingHeader({ user, loading, onSignInClick }: LandingHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const authRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // GSAP entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      
      tl.from(logoRef.current, {
        x: -50,
        opacity: 0,
        duration: 1,
        delay: 0.2,
      })
      .from(authRef.current, {
        x: 50,
        opacity: 0,
        duration: 1,
      }, '-=0.8')
    })

    return () => ctx.revert()
  }, [loading, user])

  return (
    <header 
      ref={headerRef}
      className={cn(
        "fixed z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#88c540]/10 py-4 md:bg-transparent md:border-none md:py-6 md:backdrop-blur-none" 
          : "pt-4 md:pt-6 bg-transparent"
      )}
      style={{ zIndex: 60 }}
    >
      <div className="flex items-center justify-between w-full px-6 md:px-[50px]">
        {/* Logo - Left Side */}
        <div ref={logoRef}>
          <ViTechLogo />
        </div>

        {/* Auth Section - Right Side */}
        <div ref={authRef}>
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
              className="flex items-center gap-2 px-5 py-2.5 bg-[#88c540] hover:bg-[#7ab636] transition-all duration-200 text-sm font-medium text-black rounded-full shadow-lg shadow-[#88c540]/20 hover:shadow-xl hover:shadow-[#88c540]/30 hover:scale-105"
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

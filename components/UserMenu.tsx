'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, User } from 'lucide-react'
import { signOut } from '@/lib/auth'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface UserMenuProps {
  user: SupabaseUser
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    console.log('User metadata:', user.user_metadata)
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]
  const userEmail = user.email

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-[#88c540]/20 group"
      >
        {/* Avatar */}
        <div className="relative">
          {userAvatar && !imageError ? (
            <Image
              src={userAvatar}
              referrerPolicy="no-referrer"
              alt={userName || 'User'}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border-2 border-[#88c540]/20 group-hover:border-[#88c540]/50 object-cover transition-colors"
              onError={(e) => {
                console.error('Error loading avatar:', userAvatar, e)
                setImageError(true)
              }}
              unoptimized={userAvatar.startsWith('http')}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#88c540]/10 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-400" />
            </div>
          )}
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#88c540] rounded-full border-2 border-[#0a0a0a]" />
        </div>

        {/* Dropdown Arrow */}
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 bg-[#0a0a0a] rounded-2xl shadow-2xl border border-[#88c540]/20 overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="px-6 py-5 bg-black/40 border-b border-[#88c540]/10 relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#88c540]/5 blur-3xl -z-10" />
              
              <p className="text-base font-bold text-white truncate tracking-tight mb-0.5">{userName}</p>
              <p className="text-xs text-gray-500 truncate font-medium">{userEmail}</p>
            </div>

            {/* Menu Items */}
            <div className="py-2 relative z-10 bg-[#0a0a0a]">
              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="w-full px-6 py-4 text-left text-sm text-gray-400 hover:text-red-500 hover:bg-red-500/5 transition-all flex items-center gap-3 group/item"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/5 flex items-center justify-center group-hover/item:bg-red-500/10 transition-colors">
                  <LogOut className="w-4 h-4 transition-transform group-hover/item:-translate-x-0.5" />
                </div>
                <span className="font-bold uppercase tracking-widest text-xs">Sign Out</span>
              </button>
            </div>

            {/* Background Grid Effect */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
              backgroundImage: `linear-gradient(#88c540 1px, transparent 1px), linear-gradient(90deg, #88c540 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

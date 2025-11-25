'use client'

import { useState, useEffect } from 'react'
import LandingHeader from './components/LandingHeader'
import HeroSection from './components/HeroSection'
import ElevenLabsWidget from './components/ElevenLabsWidget'
import DocumentDrawer from '@/components/DocumentDrawer'
import AbsenceRequestPanel from '@/components/AbsenceRequestPanel'
import { useElevenLabsTools } from '@/hooks/useElevenLabsTools'
import { GoogleSignInModal } from '@/components/GoogleSignInModal'
import { supabase } from '@/lib/supabase'
import { isVismaEmployee } from '@/lib/auth'
import type { User } from '@supabase/supabase-js'
import { track } from '@vercel/analytics/react'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  // Calculate if user is a Visma employee - this will update when user state changes
  const isVismaUser = user ? isVismaEmployee(user) : false

  // Debug log
  useEffect(() => {
    if (user) {
      console.log('🔐 User email:', user.email)
      console.log('🔐 Is Visma employee:', isVismaEmployee(user))
    }
  }, [user])

  const { 
    documentData, 
    isDrawerOpen, 
    closeDrawer,
    absenceData,
    isAbsencePanelOpen,
    closeAbsencePanel,
    setIsAbsencePanelOpen
  } = useElevenLabsTools()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (user) {
          track('User Login', { userId: user.id, email: user.email || '' })
        } else {
          setIsSignInModalOpen(true)
        }
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setAuthLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      setUser(user)
      if (user) {
        if (_event === 'SIGNED_IN') {
           track('User Login', { userId: user.id, email: user.email || '' })
        }
        setIsSignInModalOpen(false)
      } else {
        setIsSignInModalOpen(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-b from-white to-[#EFF2F5]">
      {/* Dashed Bottom Fade Grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e7e5e4 1px, transparent 1px),
            linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
             repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
          `,
          WebkitMaskImage: `
  repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
          `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      {/* Content */}
      <div className="flex flex-col min-h-screen relative z-10">
        <LandingHeader 
          user={user} 
          loading={authLoading} 
          onSignInClick={() => setIsSignInModalOpen(true)} 
        />

        <main className="flex-1 flex flex-col">
          <HeroSection 
            onOpenAbsencePanel={() => setIsAbsencePanelOpen(true)} 
            isVismaEmployee={isVismaUser}
          />
        </main>

        {/* ElevenLabs Widget - only visible for Visma employees */}
        {isVismaUser && (
          <ElevenLabsWidget agentId="agent_6701k9ma25k6e6ct0y27575m5s0w" />
        )}
      </div>

      {/* Document Drawer - appears when agent triggers open_document tool */}
      {documentData && (
        <DocumentDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          title={documentData.title}
          documentUrl={documentData.url}
        />
      )}

      {/* Absence Request Panel - appears when agent triggers or user clicks */}
      <AbsenceRequestPanel
        isOpen={isAbsencePanelOpen}
        onClose={closeAbsencePanel}
        prefilledRequest={absenceData}
      />

      {/* Sign In Modal */}
      <GoogleSignInModal
        isOpen={isSignInModalOpen}
        onClose={() => {
          if (user) setIsSignInModalOpen(false)
        }}
        hideCloseButton={!user}
      />
    </div>
  )
}

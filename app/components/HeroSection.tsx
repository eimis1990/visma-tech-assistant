'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { LayoutTextFlip } from '@/components/ui/layout-text-flip'
import { ArrowRight, Sparkles, Lock } from 'lucide-react'
import KudosCalculatorPanel from '@/components/KudosCalculatorPanel'
import DocumentsPanel from '@/components/DocumentsPanel'
import { RestrictedAccessModal } from '@/components/RestrictedAccessModal'
import { track } from '@vercel/analytics/react'

interface HeroSectionProps {
  onOpenAbsencePanel: () => void
  isVismaEmployee: boolean
}

const searchCategories = [
  {
    iconSrc: '/card icons/onboarding-icon.png',
    title: 'Onboarding',
    description: 'Get started with company processes and guidelines',
    color: '#FBBB00',
  },
  {
    iconSrc: '/card icons/documents-icon.png',
    title: 'Documents',
    description: 'Find vacation forms, policies, and important files',
    color: '#FBBB00',
  },
  {
    iconSrc: '/card icons/people-icon.png',
    title: 'Employees',
    description: 'Discover employees by technology or project',
    color: '#FBBB00',
  },
  {
    iconSrc: '/card icons/kudos-calculator-icon.png',
    title: 'Kudos Calculator',
    description: 'Calculate your kudos expenses and budget',
    color: '#FBBB00',
  },
  {
    iconSrc: '/card icons/absence-icon.png',
    title: 'Absence Requests',
    description: 'Request vacation or other type of absence',
    color: '#FBBB00',
  },
  {
    iconSrc: '/card icons/employee-handbook-icon.png',
    title: 'Employee Handbook',
    description: 'Access workplace policies, benefits, and guidelines',
    color: '#FBBB00',
  },
]

export default function HeroSection({ onOpenAbsencePanel, isVismaEmployee }: HeroSectionProps) {
  const [isKudosPanelOpen, setIsKudosPanelOpen] = useState(false)
  const [isDocumentsPanelOpen, setIsDocumentsPanelOpen] = useState(false)
  const [isRestrictedModalOpen, setIsRestrictedModalOpen] = useState(false)

  // Debug log
  useEffect(() => {
    console.log('🔐 HeroSection isVismaEmployee prop:', isVismaEmployee)
  }, [isVismaEmployee])

  const playClickSound = () => {
    console.log('🔊 Attempting to play card click sound')
    const audio = new Audio('/sounds/card-click.wav')
    audio.volume = 0.5
    audio.play().catch((err) => console.error('Error playing sound:', err))
  }

  const handleTryNow = () => {
    if (!isVismaEmployee) {
      setIsRestrictedModalOpen(true)
      return
    }
    // Open ElevenLabs widget by finding and clicking the button inside it
    const widget = document.querySelector('elevenlabs-convai')
    if (widget && widget.shadowRoot) {
      // The widget uses shadow DOM, find the button inside
      const button = widget.shadowRoot.querySelector('button')
      if (button) {
        button.click()
      }
    } else if (widget) {
      // Fallback: try clicking the widget element itself
      ;(widget as HTMLElement).click()
    }
  }

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-start lg:justify-center relative px-4 pt-24 lg:pt-0 pb-24 lg:pb-8">
      <div className="flex flex-col justify-center items-center w-[250px] sm:w-[300px] md:w-[500px] lg:w-[700px] z-50 pointer-events-auto mb-12">
        {/* AI Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 border border-[#FBBB00]/20 mb-6"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut', delay: 0.1 }}
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-xs font-medium text-white">Visma Tech Assistant</span>
        </motion.div>

        <motion.div
          className="flex flex-col items-center justify-center gap-2 text-center"
          style={{
            fontFamily:
              "var(--font-helvetica-now), var(--font-outfit), 'Helvetica Neue', sans-serif",
          }}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut', delay: 0.3 }}
        >
          <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-normal text-black leading-tight tracking-tight px-2 py-2">
            Ask anything about
          </div>
          <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl mt-1">
            <LayoutTextFlip
              text=""
              words={[
                'Onboarding',
                'Documents',
                'Employees',
                'Kudos',
                'Absence',
                'Handbook',
              ]}
              duration={3000}
            />
          </div>
        </motion.div>
      </div>

      {/* Try Now Button */}
      <motion.button
        onClick={handleTryNow}
        className="group relative mx-auto flex items-center justify-between rounded-full bg-[#1a1a1a] hover:bg-black pl-6 pr-2 py-2.5 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden min-w-[160px] mt-2 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative z-10 flex-1 text-center">Try Now</span>
        <div className="relative z-10 w-9 h-9 rounded-full bg-[#2a2a2a] group-hover:bg-[#3a3a3a] flex items-center justify-center transition-colors duration-300 flex-shrink-0">
          <ArrowRight className="w-4 h-4 duration-300 group-hover:translate-x-1" />
        </div>
      </motion.button>

      {/* Search Category Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.7 }}
      >
        {searchCategories.map((category, index) => {
          const isKudosCard = category.title === 'Kudos Calculator'
          const isDocumentsCard = category.title === 'Documents'
          const isAbsenceCard = category.title === 'Absence Requests'
          const isRestrictedCard = isKudosCard || isDocumentsCard || isAbsenceCard

          return (
            <motion.div
              key={category.title}
              onClick={() => {
                if (isRestrictedCard) {
                  if (!isVismaEmployee) {
                    setIsRestrictedModalOpen(true)
                    return
                  }
                  playClickSound()
                  track('Card Pressed', { card: category.title })
                }
                if (isKudosCard && isVismaEmployee) setIsKudosPanelOpen(true)
                if (isDocumentsCard && isVismaEmployee) setIsDocumentsPanelOpen(true)
                if (isAbsenceCard && isVismaEmployee) onOpenAbsencePanel()
              }}
              className={`relative p-5 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer group ${isRestrictedCard && !isVismaEmployee ? 'opacity-70' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
            >
              {/* Lock overlay for restricted cards */}
              {isRestrictedCard && !isVismaEmployee && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Lock className="w-3 h-3 text-gray-500" />
                </div>
              )}
              <div className="flex items-start justify-between">
                <Image
                  src={category.iconSrc}
                  alt={`${category.title} icon`}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain mb-3 group-hover:scale-110 transition-transform"
                />
                {isRestrictedCard && isVismaEmployee && (
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                )}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                {category.title}
              </h3>
              <p className="text-xs text-gray-600">{category.description}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Kudos Calculator Panel */}
      <KudosCalculatorPanel
        isOpen={isKudosPanelOpen}
        onClose={() => setIsKudosPanelOpen(false)}
      />

      {/* Documents Panel */}
      <DocumentsPanel
        isOpen={isDocumentsPanelOpen}
        onClose={() => setIsDocumentsPanelOpen(false)}
      />

      {/* Restricted Access Modal */}
      <RestrictedAccessModal
        isOpen={isRestrictedModalOpen}
        onClose={() => setIsRestrictedModalOpen(false)}
      />

      {/* Footer Links */}
      <motion.div 
        className="absolute bottom-4 left-4 flex gap-4 text-xs text-gray-500 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <a href="/privacy-policy" className="hover:text-gray-900 hover:underline transition-colors">
          Privacy Policy
        </a>
        <a href="/terms-of-service" className="hover:text-gray-900 hover:underline transition-colors">
          Terms of Service
        </a>
      </motion.div>
    </section>
  )
}

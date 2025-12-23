'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Lock } from 'lucide-react'
import KudosCalculatorPanel from '@/components/KudosCalculatorPanel'
import DocumentsPanel from '@/components/DocumentsPanel'
import HandbookPanel from '@/components/HandbookPanel'
import { RestrictedAccessModal } from '@/components/RestrictedAccessModal'
import { track } from '@vercel/analytics/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface HeroSectionProps {
  onOpenAbsencePanel: () => void
  isVismaEmployee: boolean
}

const searchCategories = [
  {
    iconSrc: '/card icons/onboarding-icon.png',
    title: 'Employee Onboarding',
    description: 'Seamlessly transition into your new role with our comprehensive onboarding guide. Access essential company information, setup your workspace, and meet your team members to start your journey at Visma with confidence and clarity.',
    color: '#88c540',
  },
  {
    iconSrc: '/card icons/documents-icon.png',
    title: 'Important Documents',
    description: 'Your central repository for all important files and templates. From vacation request forms and employment contracts to internal policies and branding assets, find everything you need to keep your work organized and compliant.',
    color: '#88c540',
  },
  {
    iconSrc: '/card icons/people-icon.png',
    title: 'Company Employees',
    description: 'Connect with colleagues across the entire organization. Search by technology stack, project involvement, or department to find the right experts and collaborators for your initiatives and expand your internal professional network.',
    color: '#88c540',
  },
  {
    iconSrc: '/card icons/kudos-calculator-icon.png',
    title: 'Kudos Calculator',
    description: 'Effortlessly manage your team recognition budget with our intuitive calculator. Track kudos distributions, plan upcoming reward cycles, and ensure you stay within your quarterly budget while fostering a culture of appreciation.',
    color: '#88c540',
  },
  {
    iconSrc: '/card icons/absence-icon.png',
    title: 'Absence Requests',
    description: 'Streamline your time-off planning with our integrated absence management tool. Submit vacation requests, report sick leave, or manage other absence types with instant status updates and clear visibility of your remaining entitlement.',
    color: '#88c540',
  },
  {
    iconSrc: '/card icons/employee-handbook-icon.png',
    title: 'Employee Handbook',
    description: 'Access the ultimate guide to life at Visma. Explore detailed workplace policies, comprehensive benefit packages, health and safety guidelines, and cultural values that define our unique working environment and professional standards.',
    color: '#88c540',
  },
]

export default function HeroSection({ onOpenAbsencePanel, isVismaEmployee }: HeroSectionProps) {
  const [isKudosPanelOpen, setIsKudosPanelOpen] = useState(false)
  const [isDocumentsPanelOpen, setIsDocumentsPanelOpen] = useState(false)
  const [isHandbookPanelOpen, setIsHandbookPanelOpen] = useState(false)
  const [isRestrictedModalOpen, setIsRestrictedModalOpen] = useState(false)
  
  const badgeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  // Debug log
  useEffect(() => {
    console.log('🔐 HeroSection isVismaEmployee prop:', isVismaEmployee)
  }, [isVismaEmployee])

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      
      // Badge entrance
      tl.from(badgeRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
      })
      
      // Title with split animation
      .from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
      }, '-=0.4')
      
      // Button
      .from(buttonRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
      }, '-=0.5')

      // Subtle parallax effect on scroll for hero
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          y: -50,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          }
        })
      }

      // Horizontal scroll effect - matching GSAP demo exactly
      if (sectionRef.current && cardsRef.current) {
        const pinWrap = cardsRef.current
        const horizontalSection = sectionRef.current
        
        let pinWrapWidth: number
        let horizontalScrollLength: number

        function refresh() {
          pinWrapWidth = pinWrap.scrollWidth
          horizontalScrollLength = pinWrapWidth - window.innerWidth
          console.log('📐 Refreshing horizontal scroll:', { pinWrapWidth, horizontalScrollLength })
        }

        refresh()
        
        // Initial refresh after a short delay to ensure layout is stable
        setTimeout(() => {
          refresh()
          ScrollTrigger.refresh()
        }, 100)
        
        // Pinning and horizontal scrolling
        gsap.to(pinWrap, {
          scrollTrigger: {
            scrub: true,
            trigger: horizontalSection,
            pin: true,
            start: 'top top',
            end: () => `+=${pinWrapWidth}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
          x: () => -horizontalScrollLength,
          ease: 'none'
        })

        ScrollTrigger.addEventListener('refreshInit', refresh)
      }
    })

    return () => ctx.revert()
  }, [])

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
    <>
    <section className="w-full min-h-screen flex flex-col items-center justify-center relative px-4 pt-24 pb-24">
      <div className="flex flex-col justify-center items-center w-full max-w-6xl z-50 pointer-events-auto mb-16">
        {/* AI Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-[#88c540]/20 to-[#88c540]/5 border-2 border-[#88c540]/30 mb-8 backdrop-blur-sm"
        >
          <Sparkles className="w-5 h-5 text-[#88c540]" />
          <span className="text-sm font-semibold text-[#88c540] tracking-wide">VISMA TECH ASSISTANT</span>
        </div>

        <div
          ref={titleRef}
          className="flex flex-col items-center justify-center gap-6 text-center max-w-7xl"
          style={{
            fontFamily:
              "var(--font-helvetica-now), var(--font-outfit), 'Helvetica Neue', sans-serif",
          }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.95] tracking-tighter px-4">
            Your Personal
            <br />
            <span className="bg-gradient-to-r from-[#88c540] via-[#9ed958] to-[#88c540] bg-clip-text text-transparent animate-gradient">
              AI Assistant
            </span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-400 mt-6 max-w-3xl px-4 font-light leading-relaxed">
            Get instant answers about onboarding, documents,<br className="hidden md:block" /> employees, and more
          </p>
        </div>
      </div>

      {/* Try Now Button */}
      <button
        ref={buttonRef}
        onClick={handleTryNow}
        className="group relative mx-auto flex items-center justify-between rounded-full bg-gradient-to-r from-[#88c540] to-[#9ed958] hover:from-[#7ab636] hover:to-[#88c540] pl-10 pr-4 py-5 text-black font-bold text-xl shadow-2xl shadow-[#88c540]/30 hover:shadow-[#88c540]/50 transition-all duration-300 overflow-hidden min-w-[220px]"
        onMouseEnter={(e) => {
          gsap.to(e.currentTarget, { scale: 1.08, duration: 0.3, ease: 'power2.out' })
        }}
        onMouseLeave={(e) => {
          gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: 'power2.out' })
        }}
      >
        <span className="relative z-10 flex-1 text-center tracking-wide">Try Now</span>
        <div className="relative z-10 w-12 h-12 rounded-full bg-black/20 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300 flex-shrink-0">
          <ArrowRight className="w-6 h-6 duration-300 group-hover:translate-x-1 text-black" />
        </div>
      </button>

    </section>

    {/* Horizontal Scroll Cards Section */}
    <section 
      ref={sectionRef}
      className="w-full h-screen flex items-center relative" 
      id="cards-section" 
      style={{ overflow: 'visible' }}
    >
      <div className="horiz-gallery-wrapper w-full" style={{ overflow: 'visible' }}>
        <div
          ref={cardsRef}
          className="horiz-gallery-strip flex flex-nowrap gap-10 px-8 md:px-16 will-change-transform"
          style={{ overflow: 'visible' }}
        >
        {searchCategories.map((category, index) => {
          const isKudosCard = category.title === 'Kudos Calculator'
          const isDocumentsCard = category.title === 'Important Documents'
          const isAbsenceCard = category.title === 'Absence Requests'
          const isHandbookCard = category.title === 'Employee Handbook'
          const isRestrictedCard = isKudosCard || isDocumentsCard || isAbsenceCard || isHandbookCard
          const hasAction = isRestrictedCard // In this case, all restricted cards open panels

          return (
            <div
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
                if (isHandbookCard && isVismaEmployee) setIsHandbookPanelOpen(true)
              }}
              className={`project-wrap relative p-10 rounded-[2.5rem] bg-[#0a0a0a] border border-[#88c540]/10 transition-all duration-500 cursor-pointer group overflow-hidden flex-shrink-0 ${hasAction && !isVismaEmployee ? 'opacity-70' : ''}`}
              style={{ 
                width: '480px',
                height: '460px',
              }}
            >
              {/* Border effect on hover */}
              <div className="absolute inset-0 border border-transparent group-hover:border-[#88c540]/30 transition-colors duration-500 rounded-[2.5rem] pointer-events-none" />
              
              {/* Top Right Arrow - Only if it has an action */}
              {hasAction && (
                <div className="absolute top-8 right-8 text-white/20 group-hover:text-[#88c540] transition-colors duration-300">
                  <motion.div
                    whileHover={{ x: 5, y: -5 }}
                    className="relative"
                  >
                    <ArrowRight className="w-8 h-8 -rotate-45" />
                  </motion.div>
                </div>
              )}
              
              {/* Fading grid effect in bottom right */}
              <div className="absolute bottom-0 right-0 w-40 h-40 opacity-10 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-br-[2.5rem]">
                <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(to right, #88c540 1px, transparent 1px), linear-gradient(to bottom, #88c540 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                  maskImage: 'radial-gradient(circle at bottom right, black, transparent 70%)',
                  WebkitMaskImage: 'radial-gradient(circle at bottom right, black, transparent 70%)'
                }} />
              </div>
              
              {/* Lock overlay for restricted cards */}
              {isRestrictedCard && !isVismaEmployee && (
                <div className="absolute top-8 right-16 w-10 h-10 rounded-xl bg-red-500/10 backdrop-blur-sm flex items-center justify-center z-10 border border-red-500/20">
                  <Lock className="w-5 h-5 text-red-500" />
                </div>
              )}
              
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-end pb-4">
                <div className="mb-6">
                  <h3 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight group-hover:translate-x-1 transition-transform duration-500">
                    {category.title.split(' ').map((word, i, arr) => (
                      <span key={i} className="block">
                        {i === arr.length - 1 ? (
                          <span className="bg-gradient-to-r from-[#88c540] to-[#9ed958] bg-clip-text text-transparent opacity-80 group-hover:opacity-100 transition-opacity">
                            {word}
                          </span>
                        ) : word}
                      </span>
                    ))}
                  </h3>
                </div>
                
                <p className="text-lg text-gray-500 leading-relaxed font-medium group-hover:text-gray-300 transition-all duration-500 max-w-[90%]">
                  {category.description}
                </p>
              </div>
            </div>
          )
        })}
        </div>
      </div>
    </section>

    {/* Footer Section */}
    <footer className="w-full py-16 flex items-center justify-center relative bg-gradient-to-b from-[#0a0a0a] to-[#000000] border-t border-[#88c540]/10">
      <div className="flex flex-col items-center justify-center gap-8 px-8">
        {/* Logo */}
        <Image
          src="/vitech-landing-logo-white.svg"
          alt="Vitech - Your Personal AI Assistant"
          width={240}
          height={67}
          className="h-16 w-auto opacity-70 hover:opacity-100 transition-opacity"
        />
        
        {/* Tagline */}
        <p className="text-gray-500 text-base text-center max-w-xl">
          Empowering your team with intelligent assistance
        </p>
        
        {/* Links */}
        <div className="flex gap-6 text-sm">
          <a 
            href="/privacy-policy" 
            className="text-gray-500 hover:text-[#88c540] transition-colors duration-300"
          >
            Privacy Policy
          </a>
          <span className="text-gray-700">•</span>
          <a 
            href="/terms-of-service" 
            className="text-gray-500 hover:text-[#88c540] transition-colors duration-300"
          >
            Terms of Service
          </a>
        </div>
        
        {/* Copyright */}
        <p className="text-gray-700 text-xs mt-4">
          © 2024 Vitech. All rights reserved.
        </p>
      </div>
    </footer>

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

      {/* Handbook Panel */}
      <HandbookPanel
        isOpen={isHandbookPanelOpen}
        onClose={() => setIsHandbookPanelOpen(false)}
      />

      {/* Restricted Access Modal */}
      <RestrictedAccessModal
        isOpen={isRestrictedModalOpen}
        onClose={() => setIsRestrictedModalOpen(false)}
      />
    </>
  )
}

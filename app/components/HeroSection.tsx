'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Lock, ArrowDown } from 'lucide-react'
import KudosCalculatorPanel from '@/components/KudosCalculatorPanel'
import DocumentsPanel from '@/components/DocumentsPanel'
import HandbookPanel from '@/components/HandbookPanel'
import { RestrictedAccessModal } from '@/components/RestrictedAccessModal'
import { track } from '@vercel/analytics/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CircularText } from '@/components/ui/CircularText'

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

const handwrittenQuestions = [
  // Left Side
  { text: "KUDOS?", top: "20%", left: "12%", rotate: "-10deg" },
  { text: "Vacation?", top: "35%", left: "8%", rotate: "5deg" },
  { text: "Benefits?", top: "50%", left: "15%", rotate: "-5deg" },
  { text: "First day?", top: "65%", left: "10%", rotate: "8deg" },
  { text: "Equipment?", top: "80%", left: "18%", rotate: "-12deg" },
  // Right Side
  { text: "Office map?", top: "20%", right: "12%", rotate: "10deg" },
  { text: "Parking?", top: "35%", right: "8%", rotate: "-5deg" },
  { text: "Insurance?", top: "50%", right: "15%", rotate: "5deg" },
  { text: "Work hours?", top: "65%", right: "10%", rotate: "-8deg" },
  { text: "Sick leave?", top: "80%", right: "18%", rotate: "12deg" },
]

export default function HeroSection({ onOpenAbsencePanel, isVismaEmployee }: HeroSectionProps) {
  const [isKudosPanelOpen, setIsKudosPanelOpen] = useState(false)
  const [isDocumentsPanelOpen, setIsDocumentsPanelOpen] = useState(false)
  const [isHandbookPanelOpen, setIsHandbookPanelOpen] = useState(false)
  const [isRestrictedModalOpen, setIsRestrictedModalOpen] = useState(false)
  
  const badgeRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
  const gallerySectionRef = useRef<HTMLElement>(null)
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
      
      // Content entrance - adding a subtle "rise up" effect that feels intentional
      .from(heroContentRef.current, {
        y: 80, // Start lower down
        opacity: 0,
        duration: 1.2,
        ease: "power4.out", // Extra smooth deceleration
        onComplete: () => {
          console.log('✅ Entrance Animation Complete, clearing props')
          gsap.set(heroContentRef.current, { clearProps: "y" })
          ScrollTrigger.refresh()
        }
      }, '-=0.6')

      // Subtle parallax effect on scroll for hero
      if (heroContentRef.current && heroSectionRef.current) {
        gsap.fromTo(heroContentRef.current, 
          { y: 0 },
          {
            y: -50,
            scrollTrigger: {
              trigger: heroSectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
              immediateRender: false,
            }
          }
        )
      }

      // Pinning and horizontal scrolling
      if (gallerySectionRef.current && cardsRef.current) {
        const pinWrap = cardsRef.current
        const horizontalSection = gallerySectionRef.current
        
        let pinWrapWidth: number
        let horizontalScrollLength: number

        const refresh = () => {
          pinWrapWidth = pinWrap.scrollWidth
          horizontalScrollLength = Math.max(0, pinWrapWidth - window.innerWidth)
        }

        refresh()
        
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
            refreshPriority: -1,
          },
          x: () => -horizontalScrollLength,
          ease: 'none'
        })

        ScrollTrigger.refresh()

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
    <section 
      ref={heroSectionRef}
      className="w-full min-h-screen flex flex-col items-center justify-center relative px-4 pt-20 pb-24 overflow-hidden"
    >
      {/* ... (handwritten questions logic) ... */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {handwrittenQuestions.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8, rotate: q.rotate }}
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.02, 1],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: q.top,
              left: q.left,
              right: q.right,
              fontFamily: "var(--font-delius), cursive",
              color: '#9ca3af', // gray-400 color to match the subheading
              fontSize: 'clamp(0.9rem, 1.8vw, 1.3rem)',
              transform: `rotate(${q.rotate})`,
              zIndex: 10,
              filter: 'drop-shadow(0 0 5px rgba(156, 163, 175, 0.1))',
            }}
            className="whitespace-nowrap transition-opacity duration-300 pointer-events-auto cursor-default select-none"
          >
            {q.text}
          </motion.div>
        ))}
      </div>

      <div 
        ref={heroContentRef}
        className="flex flex-col justify-center items-center w-full max-w-6xl z-50 pointer-events-auto"
      >
        {/* AI Badge replaced with Circular Text */}
        <div
          ref={badgeRef}
          className="mb-8"
        >
          <CircularText 
            text="VISMA TECH AI ASSISTANT • GET YOUR ANSWERS NOW • "
            radius={73}
            fontSize={10}
          >
            <div className="w-14 h-14 rounded-full bg-[#88c540]/5 flex items-center justify-center border border-[#88c540]/20 shadow-[0_0_20px_rgba(136,197,64,0.1)] group cursor-pointer hover:bg-[#88c540]/10 transition-all duration-300">
              <ArrowDown className="w-7 h-7 text-[#88c540] group-hover:translate-y-1 transition-all duration-300" />
            </div>
          </CircularText>
        </div>

        <div
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
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-400 mt-6 max-w-3xl px-4 font-normal leading-relaxed">
            Get instant Visma Tech related answers about onboarding, employees, kudos and more!
          </p>
        </div>

        {/* Try Now Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 1.2,
            ease: "easeOut"
          }}
          onClick={handleTryNow}
          className="group relative flex items-center justify-between rounded-full bg-gradient-to-r from-[#88c540] to-[#9ed958] hover:from-[#7ab636] hover:to-[#88c540] pl-8 pr-3 py-4 text-black font-bold text-lg shadow-2xl shadow-[#88c540]/30 hover:shadow-[#88c540]/50 transition-all duration-300 overflow-hidden min-w-[180px] mt-12 z-50"
        >
          <span className="relative z-10 flex-1 text-center tracking-wide">Try Now</span>
          <div className="relative z-10 w-10 h-10 rounded-full bg-black/20 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300 flex-shrink-0">
            <ArrowRight className="w-5 h-5 duration-300 group-hover:translate-x-1 text-black" />
          </div>
        </motion.button>
      </div>
    </section>

    {/* Horizontal Scroll Cards Section */}
    <section 
      ref={gallerySectionRef}
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
    <footer id="footer-section" className="w-full py-20 flex items-center justify-center relative bg-gradient-to-b from-[#0a0a0a] to-[#000000] border-t border-white/5">
      <div className="flex flex-col items-center justify-center gap-10 px-8">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/vitech-landing-logo-white.svg"
            alt="Vitech - Your Personal AI Assistant"
            width={240}
            height={67}
            className="h-14 w-auto opacity-80 hover:opacity-100 transition-opacity duration-500"
          />
          <p className="text-gray-400 text-sm md:text-base text-center max-w-xl font-light tracking-wide">
            Empowering your team with intelligent assistance
          </p>
        </div>
        
        {/* Navigation & Copyright */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-8 text-sm font-medium tracking-tight">
            <a 
              href="/privacy-policy" 
              className="text-gray-500 hover:text-[#88c540] transition-all duration-300"
            >
              Privacy Policy
            </a>
            <div className="w-1.5 h-1.5 rounded-full bg-[#88c540]" />
            <a 
              href="/terms-of-service" 
              className="text-gray-500 hover:text-[#88c540] transition-all duration-300"
            >
              Terms of Service
            </a>
          </div>
          
          <p className="text-white text-sm tracking-tight opacity-60">
            © 2025 Vitech. All rights reserved.
          </p>
        </div>
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

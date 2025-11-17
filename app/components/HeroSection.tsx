'use client'

import { useState } from 'react'
import { LayoutGroup, motion } from 'framer-motion'
import { TextRotate } from '@/components/ui/text-rotate'
import {
  FileText,
  Users,
  Building2,
  Calendar,
  Calculator,
  PlaneTakeoff,
  ArrowRight,
} from 'lucide-react'
import KudosCalculatorPanel from '@/components/KudosCalculatorPanel'

const searchCategories = [
  {
    icon: Building2,
    title: 'Onboarding',
    description: 'Get started with company processes and guidelines',
    iconBgColor: 'bg-blue-600/10',
    iconColor: 'text-blue-600',
  },
  {
    icon: FileText,
    title: 'Documents',
    description: 'Find vacation forms, policies, and important files',
    iconBgColor: 'bg-orange-600/10',
    iconColor: 'text-orange-600',
  },
  {
    icon: Users,
    title: 'People',
    description: 'Discover employees by technology or project',
    iconBgColor: 'bg-purple-600/10',
    iconColor: 'text-purple-600',
  },
  {
    icon: Calculator,
    title: 'Kudos Calculator',
    description: 'Calculate your kudos expenses and budget',
    iconBgColor: 'bg-[#FBBB00]/10',
    iconColor: 'text-[#FBBB00]',
  },
  {
    icon: PlaneTakeoff,
    title: 'Absence Requests',
    description: 'Request vacation or other type of absence',
    iconBgColor: 'bg-pink-600/10',
    iconColor: 'text-pink-600',
  },
  {
    icon: Calendar,
    title: 'Employee Handbook',
    description: 'Access workplace policies, benefits, and guidelines',
    iconBgColor: 'bg-indigo-600/10',
    iconColor: 'text-indigo-600',
  },
]

export default function HeroSection() {
  const [isKudosPanelOpen, setIsKudosPanelOpen] = useState(false)

  const handleTryNow = () => {
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
    <section className="w-full h-screen overflow-hidden flex flex-col items-center justify-center relative px-4">
      <div className="flex flex-col justify-center items-center w-[250px] sm:w-[300px] md:w-[500px] lg:w-[700px] z-50 pointer-events-auto mb-12">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-center w-full justify-center items-center flex-col flex whitespace-pre leading-tight tracking-tight space-y-1 md:space-y-4"
          style={{
            fontFamily:
              "var(--font-helvetica-now), 'Outfit', 'Helvetica Neue', sans-serif",
          }}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut', delay: 0.3 }}
        >
          <span>Get answers about </span>
          <LayoutGroup>
            <motion.span layout className="flex whitespace-pre">
              <TextRotate
                texts={[
                  'Onboarding 🚀',
                  'Documents 📄',
                  'Kudos 💰',
                  'Absence 🏖️',
                  'Handbook 📖',
                  'Employees 👨‍💼',
                  'Time Off 🌴',
                  'Benefits 🎁',
                ]}
                mainClassName="overflow-hidden pr-3 text-[#FBBB00] py-0 pb-2 md:pb-4 rounded-xl"
                staggerDuration={0.03}
                staggerFrom="last"
                rotationInterval={3000}
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              />
            </motion.span>
          </LayoutGroup>
        </motion.h1>
        <motion.p
          className="text-sm sm:text-lg md:text-xl lg:text-1xl text-center pt-2 sm:pt-3 md:pt-4 lg:pt-5 text-black font-medium"
          style={{ fontFamily: 'Outfit, sans-serif' }}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut', delay: 0.5 }}
        >
          Get instant answers to your questions with our AI Assistant
        </motion.p>
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
        <span className="relative z-10 flex-1 text-center">Try Now!</span>
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
          const Icon = category.icon
          const isKudosCard = category.title === 'Kudos Calculator'

          return (
            <motion.div
              key={category.title}
              onClick={() => isKudosCard && setIsKudosPanelOpen(true)}
              className="relative p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
            >
              <div
                className={`w-10 h-10 rounded-lg ${category.iconBgColor} flex items-center justify-center mb-3 ${category.iconColor} group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-5 h-5" />
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
    </section>
  )
}

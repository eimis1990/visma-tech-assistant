'use client'

import { LayoutGroup, motion } from 'framer-motion'
import { TextRotate } from '@/components/ui/text-rotate'
import {
  FileText,
  Users,
  Building2,
  Calendar,
  Calculator,
  PlaneTakeoff,
} from 'lucide-react'

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
    iconBgColor: 'bg-green-600/10',
    iconColor: 'text-green-600',
  },
  {
    icon: PlaneTakeoff,
    title: 'Absence Requests',
    description: 'Request vacation and manage time off',
    iconBgColor: 'bg-pink-600/10',
    iconColor: 'text-pink-600',
  },
  {
    icon: Calendar,
    title: 'Company Info',
    description: 'Access company policies, events, and resources',
    iconBgColor: 'bg-indigo-600/10',
    iconColor: 'text-indigo-600',
  },
]

export default function HeroSection() {
  return (
    <section className="w-full h-screen overflow-hidden flex flex-col items-center justify-center relative px-4">
      <div className="flex flex-col justify-center items-center w-[250px] sm:w-[300px] md:w-[500px] lg:w-[700px] z-50 pointer-events-auto mb-12">
        <motion.h1
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-center w-full justify-center items-center flex-col flex whitespace-pre leading-tight font-bold tracking-tight space-y-1 md:space-y-4"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut', delay: 0.3 }}
        >
          <span>Find answers about </span>
          <LayoutGroup>
            <motion.span layout className="flex whitespace-pre">
              <TextRotate
                texts={[
                  'onboarding 🚀',
                  'documents 📄',
                  'people 👥',
                  'kudos 💰',
                  'vacation 🏖️',
                  'policies 📋',
                  'company info 🏢',
                  'employees 👨‍💼',
                  'time off 🌴',
                  'processes ⚙️',
                ]}
                mainClassName="overflow-hidden pr-3 text-blue-600 py-0 pb-2 md:pb-4 rounded-xl"
                staggerDuration={0.03}
                staggerFrom="last"
                rotationInterval={3000}
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              />
            </motion.span>
          </LayoutGroup>
        </motion.h1>
        <motion.p
          className="text-sm sm:text-lg md:text-xl lg:text-2xl text-center pt-3 sm:pt-4 md:pt-6 lg:pt-8 text-gray-600"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut', delay: 0.5 }}
        >
          Get instant answers to your questions with our AI Assistant
        </motion.p>
      </div>

      {/* Search Category Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full mt-8 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.7 }}
      >
        {searchCategories.map((category, index) => {
          const Icon = category.icon
          return (
            <motion.div
              key={category.title}
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
    </section>
  )
}

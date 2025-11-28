'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Building2, Users, MessageSquare, Globe, Heart, Shield, MapPin, Home, Car, Flame, Wifi, Calendar, Clock, HeartPulse, Coins, Wrench, Gift, ChevronRight } from 'lucide-react'

interface HandbookPanelProps {
  isOpen: boolean
  onClose: () => void
}

const handbookTopics = [
  {
    icon: Building2,
    title: 'Visma Group',
    description: 'Learn about Visma\'s global presence and values',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Building2,
    title: 'Visma Tech Lithuania',
    description: 'Our local office, mission and team culture',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Users,
    title: 'Visma Tech Structure & Main Contacts',
    description: 'Organizational structure and key people',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Globe,
    title: 'Language of Communication',
    description: 'Guidelines for internal & external communication',
    gradient: 'from-cyan-500 to-teal-500',
  },
  {
    icon: MessageSquare,
    title: 'Intranet & Communication Tools',
    description: 'Slack, email, and collaboration platforms',
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    icon: Heart,
    title: 'Workplace Conduct & Feedback',
    description: 'Expectations and feedback culture',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Security Awareness & Policies',
    description: 'Data protection and security guidelines',
    gradient: 'from-red-500 to-rose-500',
  },
  {
    icon: Shield,
    title: 'Office Security and Rules',
    description: 'Access control and office regulations',
    gradient: 'from-slate-500 to-zinc-500',
  },
  {
    icon: MapPin,
    title: 'Office Map and Seating',
    description: 'Navigate our office spaces',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Home,
    title: 'Remote Work',
    description: 'Work from home policies and best practices',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Car,
    title: 'Parking',
    description: 'Parking options and availability',
    gradient: 'from-gray-500 to-slate-500',
  },
  {
    icon: Flame,
    title: 'Work and Fire Safety',
    description: 'Emergency procedures and safety protocols',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Wifi,
    title: 'Hardware and Network Access',
    description: 'IT equipment and connectivity setup',
    gradient: 'from-purple-500 to-violet-500',
  },
  {
    icon: Calendar,
    title: 'Vacation / Time Off',
    description: 'Leave policies and how to request time off',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Clock,
    title: 'Working Hours and Time Reporting',
    description: 'Schedules, flextime, and logging hours',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: HeartPulse,
    title: 'Well-being and Health Insurance',
    description: 'Health benefits and wellness programs',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: Coins,
    title: 'Salary, Mobility & Referral Programme',
    description: 'Compensation, internal mobility, and referrals',
    gradient: 'from-yellow-500 to-amber-500',
  },
  {
    icon: Wrench,
    title: 'Practical Stuff',
    description: 'Day-to-day tips and useful information',
    gradient: 'from-zinc-500 to-gray-500',
  },
  {
    icon: Gift,
    title: 'Benefits Overview',
    description: 'Complete list of employee perks and benefits',
    gradient: 'from-fuchsia-500 to-pink-500',
  },
]

export default function HandbookPanel({ isOpen, onClose }: HandbookPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="handbook-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
            style={{ pointerEvents: 'auto' }}
          />

          {/* Side Panel */}
          <motion.div
            key="handbook-panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
            className="fixed left-0 top-0 h-full w-full md:w-[480px] bg-gradient-to-b from-white to-gray-50 shadow-2xl z-[9999] overflow-hidden flex flex-col"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Header */}
            <div className="bg-white p-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Employee Handbook
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {handbookTopics.map((topic, index) => {
                  const Icon = topic.icon
                  return (
                    <motion.div
                      key={topic.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                      className="group relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-4 hover:border-[#FBBB00]/50 hover:shadow-lg hover:shadow-[#FBBB00]/5 transition-all duration-300 cursor-default"
                    >
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className={`relative flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${topic.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#1a1a1a] transition-colors">
                            {topic.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {topic.description}
                          </p>
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#FBBB00] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                      </div>

                      {/* Subtle hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FBBB00]/0 via-[#FBBB00]/0 to-[#FBBB00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FBBB00]/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-[#FBBB00]" />
                </div>
                <p className="text-xs text-gray-600">
                  <span className="font-medium text-gray-900">Tip:</span> Click the AI assistant button and ask about any of these topics for detailed information!
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


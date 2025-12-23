'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, BookOpen, MessageSquare } from 'lucide-react'

interface HandbookPanelProps {
  isOpen: boolean
  onClose: () => void
}

const handbookTopics = [
  {
    title: 'Visma Group',
    description: 'Learn about Visma\'s global presence and values',
  },
  {
    title: 'Visma Tech Lithuania',
    description: 'Our local office, mission and team culture',
  },
  {
    title: 'Visma Tech Structure & Main Contacts',
    description: 'Organizational structure and key people',
  },
  {
    title: 'Language of Communication',
    description: 'Guidelines for internal & external communication',
  },
  {
    title: 'Intranet & Communication Tools',
    description: 'Slack, email, and collaboration platforms',
  },
  {
    title: 'Workplace Conduct & Feedback',
    description: 'Expectations and feedback culture',
  },
  {
    title: 'Security Awareness & Policies',
    description: 'Data protection and security guidelines',
  },
  {
    title: 'Office Security and Rules',
    description: 'Access control and office regulations',
  },
  {
    title: 'Office Map and Seating',
    description: 'Navigate our office spaces',
  },
  {
    title: 'Remote Work',
    description: 'Work from home policies and best practices',
  },
  {
    title: 'Parking',
    description: 'Parking options and availability',
  },
  {
    title: 'Work and Fire Safety',
    description: 'Emergency procedures and safety protocols',
  },
  {
    title: 'Hardware and Network Access',
    description: 'IT equipment and connectivity setup',
  },
  {
    title: 'Vacation / Time Off',
    description: 'Leave policies and how to request time off',
  },
  {
    title: 'Working Hours and Time Reporting',
    description: 'Schedules, flextime, and logging hours',
  },
  {
    title: 'Well-being and Health Insurance',
    description: 'Health benefits and wellness programs',
  },
  {
    title: 'Salary, Mobility & Referral Programme',
    description: 'Compensation, internal mobility, and referrals',
  },
  {
    title: 'Practical Stuff',
    description: 'Day-to-day tips and useful information',
  },
  {
    title: 'Benefits Overview',
    description: 'Complete list of employee perks and benefits',
  },
]

export default function HandbookPanel({ isOpen, onClose }: HandbookPanelProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  }

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
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998]"
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
              damping: 35,
            }}
            className="fixed left-0 top-0 h-full w-full md:w-[480px] bg-[#0a0a0a] border-r border-[#88c540]/10 shadow-2xl z-[9999] overflow-hidden flex flex-col"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Background Grid Effect */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
              backgroundImage: `linear-gradient(#88c540 1px, transparent 1px), linear-gradient(90deg, #88c540 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />

            {/* Header */}
            <div className="relative p-6 border-b border-[#88c540]/10 bg-[#0a0a0a]/80 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#88c540]/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[#88c540]" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Employee Handbook
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative flex-1 overflow-y-auto p-6 space-y-3"
            >
              {handbookTopics.map((topic) => {
                return (
                  <motion.div
                    key={topic.title}
                    variants={itemVariants}
                    className="group relative overflow-hidden bg-[#161616] border border-[#88c540]/5 rounded-2xl p-5 hover:border-[#88c540]/30 transition-all duration-500 text-left flex flex-col justify-center min-h-[85px] cursor-default"
                  >
                    {/* Hover Glow Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#88c540]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Border effect on hover */}
                    <div className="absolute inset-0 border border-transparent group-hover:border-[#88c540]/20 transition-colors duration-500 rounded-2xl pointer-events-none" />

                    {/* Right Arrow */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-5 text-white/5 group-hover:text-[#88c540] transition-all duration-300">
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>

                    <div className="relative z-10 pr-8">
                      <h3 className="text-lg font-black text-white group-hover:text-[#88c540] transition-colors mb-0.5 tracking-tight" style={{ fontFamily: "var(--font-helvetica-now), var(--font-outfit), sans-serif" }}>
                        {topic.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1 group-hover:text-gray-300 transition-colors font-medium leading-relaxed max-w-[90%]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                        {topic.description}
                      </p>
                    </div>

                    {/* Corner Grid Effect */}
                    <div className="absolute bottom-0 right-0 w-20 h-20 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(to right, #88c540 1px, transparent 1px), linear-gradient(to bottom, #88c540 1px, transparent 1px)`,
                        backgroundSize: '10px 10px',
                        maskImage: 'radial-gradient(circle at bottom right, black, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(circle at bottom right, black, transparent 70%)'
                      }} />
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Footer */}
            <div className="relative p-6 border-t border-[#88c540]/10 bg-[#0a0a0a]/80 backdrop-blur-md">
              <div className="bg-[#88c540]/5 border border-[#88c540]/20 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#88c540]/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#88c540]" />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  <span className="font-bold text-[#88c540]">PRO TIP:</span> Ask our AI assistant about any of these topics for instant, detailed answers!
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


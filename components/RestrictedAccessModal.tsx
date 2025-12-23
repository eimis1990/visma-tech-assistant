'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ShieldX, X } from 'lucide-react'

interface RestrictedAccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RestrictedAccessModal({ isOpen, onClose }: RestrictedAccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000000]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[1000001] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#0a0a0a] rounded-2xl shadow-2xl max-w-sm w-full pointer-events-auto border border-[#88c540]/20 overflow-hidden"
            >
              {/* Background Grid Effect */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `linear-gradient(#88c540 1px, transparent 1px), linear-gradient(90deg, #88c540 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }} />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 transition-colors duration-200 group z-10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500 group-hover:text-white" />
              </button>

              {/* Content */}
              <div className="p-8 text-center relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', bounce: 0.5 }}
                  className="flex items-center justify-center mx-auto mb-6"
                >
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <ShieldX className="w-8 h-8 text-red-500" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-white mb-3 tracking-tight"
                  style={{ fontFamily: "var(--font-helvetica-now), var(--font-outfit), 'Helvetica Neue', sans-serif" }}
                >
                  Restricted Access
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-400 mb-8 font-medium leading-relaxed"
                  style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                >
                  This feature is only available for Visma employees. Please sign in with your <span className="font-bold text-white">@visma.com</span> email to access this tool.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={onClose}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#88c540] to-[#9ed958] text-black font-black rounded-xl transition-all duration-300 shadow-lg shadow-[#88c540]/20 hover:shadow-[#88c540]/40 uppercase tracking-widest text-xs"
                  style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                >
                  Got it
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}


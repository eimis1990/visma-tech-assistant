'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, FileText } from 'lucide-react'
import Image from 'next/image'

interface DocumentsPanelProps {
  isOpen: boolean
  onClose: () => void
}

const documents = [
  {
    title: 'Cancel Vacation',
    url: 'https://docs.google.com/document/d/1JBThyche5tRNDf8WTGUoHV8APcZ20m4g/edit',
    description: 'Learn how to cancel your vacation request',
  },
  {
    title: 'Expense Compensations',
    url: 'https://docs.google.com/document/d/1JRAz0Mrv1HglOJxsu5a6FoEsJ0aRYMhf/edit',
    description: 'Submit and manage your expense claims',
  },
  {
    title: 'Parental Leave 1 Month',
    url: 'https://docs.google.com/document/d/1Jn3f7FNivjvDyGfTTO9u9eKc3gZDxowz/edit',
    description: 'Request one month of parental leave',
  },
  {
    title: 'Termination',
    url: 'https://docs.google.com/document/d/1Jkz4d9G5XM-gNOieTJk1AEzHIRSO8rxc/edit',
    description: 'Information about termination procedures',
  },
]

export default function DocumentsPanel({ isOpen, onClose }: DocumentsPanelProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const handleDocumentClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="documents-backdrop"
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
            key="documents-panel"
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
                    <FileText className="w-5 h-5 text-[#88c540]" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Important Documents
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
              {documents.map((doc) => (
                <motion.button
                  key={doc.title}
                  variants={itemVariants}
                  onClick={() => handleDocumentClick(doc.url)}
                  className="w-full group relative overflow-hidden bg-[#161616] border border-[#88c540]/5 rounded-2xl p-5 hover:border-[#88c540]/30 transition-all duration-500 text-left flex flex-col justify-center min-h-[90px]"
                >
                  {/* Hover Glow Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#88c540]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Border effect on hover */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-[#88c540]/20 transition-colors duration-500 rounded-2xl pointer-events-none" />

                  {/* Top Right Arrow */}
                  <div className="absolute top-5 right-5 text-white/5 group-hover:text-[#88c540] transition-all duration-300">
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  <div className="relative z-10 pr-8">
                    <h3 className="text-lg font-black text-white group-hover:text-[#88c540] transition-colors mb-1 tracking-tight" style={{ fontFamily: "var(--font-helvetica-now), var(--font-outfit), sans-serif" }}>
                      {doc.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 group-hover:text-gray-300 transition-colors font-medium leading-relaxed max-w-[90%]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                      {doc.description}
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
                </motion.button>
              ))}
            </motion.div>

            {/* Footer */}
            <div className="relative p-6 border-t border-[#88c540]/10 bg-[#0a0a0a]/80 backdrop-blur-md">
              <a
                href="https://drive.google.com/drive/u/3/folders/129DRZY2m8DfbXPSax0dzADDSZ3Oy6kQW"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-[#88c540] to-[#9ed958] text-black font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#88c540]/20 hover:shadow-[#88c540]/40 hover:scale-[1.02]"
              >
                <ExternalLink className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="tracking-tight">View All Documents</span>
              </a>
              <p className="text-xs text-gray-500 text-center mt-4 font-medium">
                Browse the full library in Google Drive
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

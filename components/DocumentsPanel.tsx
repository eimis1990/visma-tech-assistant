'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
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
                  Important Documents
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
                {documents.map((doc, index) => (
                  <motion.button
                    key={doc.title}
                    onClick={() => handleDocumentClick(doc.url)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                    className="w-full group relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-4 hover:border-[#FBBB00]/50 hover:shadow-lg hover:shadow-[#FBBB00]/5 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <Image
                        src="/card icons/documents-icon.png"
                        alt="document icon"
                        width={44}
                        height={44}
                        className="w-11 h-11 object-contain flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      />
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#1a1a1a] transition-colors">
                          {doc.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {doc.description}
                        </p>
                      </div>

                      {/* External Link Icon */}
                      <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-[#FBBB00] transition-all duration-300 flex-shrink-0" />
                    </div>

                    {/* Subtle hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FBBB00]/0 via-[#FBBB00]/0 to-[#FBBB00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-600 text-center">
                Need help? Try asking the AI Assistant or contact HR
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

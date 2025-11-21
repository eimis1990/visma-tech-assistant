'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'

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
            className="fixed left-0 top-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-[9999] overflow-hidden flex flex-col"
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
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <motion.button
                    key={doc.title}
                    onClick={() => handleDocumentClick(doc.url)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full group relative overflow-hidden bg-white border border-gray-200 rounded-xl p-4 hover:border-[#FBBB00] hover:shadow-md transition-all duration-300 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <img
                            src="/card icons/documents-icon.png"
                            alt="document icon"
                            className="w-10 h-10 object-contain flex-shrink-0"
                          />
                          <h3 className="text-base font-semibold text-gray-900 truncate">
                            {doc.title}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {doc.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#FBBB00]/10 flex items-center justify-center transition-colors">
                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-[#FBBB00] transition-colors" />
                      </div>
                    </div>

                    {/* Hover effect gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FBBB00]/0 to-[#FBBB00]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 p-4">
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

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmailRecipientDialogProps {
  isOpen: boolean
  onClose: () => void
  onSend: (email: string) => void
  isSending: boolean
}

const DEFAULT_EMAIL = 'vacations.lt@visma.com'

export default function EmailRecipientDialog({
  isOpen,
  onClose,
  onSend,
  isSending,
}: EmailRecipientDialogProps) {
  const [customEmail, setCustomEmail] = useState('')
  const [selectedMode, setSelectedMode] = useState<'default' | 'custom'>('default')
  const [emailError, setEmailError] = useState('')

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCustomEmail('')
      setSelectedMode('default')
      setEmailError('')
    }
  }, [isOpen])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSend = () => {
    const emailToSend = selectedMode === 'default' ? DEFAULT_EMAIL : customEmail

    if (!emailToSend) {
      setEmailError('Please enter an email address')
      return
    }

    if (!validateEmail(emailToSend)) {
      setEmailError('Please enter a valid email address')
      return
    }

    setEmailError('')
    onSend(emailToSend)
  }

  const handleCustomEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomEmail(e.target.value)
    setEmailError('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="email-dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000]"
            style={{ pointerEvents: 'auto' }}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
            <motion.div
              key="email-dialog-content"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, duration: 0.15 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-[#FBBB00] to-[#e6ac00] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Send To</h2>
                  </div>
                  <button
                    onClick={onClose}
                    disabled={isSending}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Choose where to send your absence request
                </p>

                {/* Default Email Option */}
                <button
                  onClick={() => setSelectedMode('default')}
                  disabled={isSending}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 transition-all text-left',
                    selectedMode === 'default'
                      ? 'border-[#FBBB00] bg-[#FBBB00]/5'
                      : 'border-gray-200 hover:border-gray-300 bg-white',
                    isSending && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
                        selectedMode === 'default'
                          ? 'border-[#FBBB00] bg-[#FBBB00]'
                          : 'border-gray-300'
                      )}
                    >
                      {selectedMode === 'default' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-0.5">
                        Visma Vacation Bot
                      </div>
                      <div className="text-sm text-gray-500 font-mono">
                        {DEFAULT_EMAIL}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Custom Email Option */}
                <button
                  onClick={() => setSelectedMode('custom')}
                  disabled={isSending}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 transition-all text-left',
                    selectedMode === 'custom'
                      ? 'border-[#FBBB00] bg-[#FBBB00]/5'
                      : 'border-gray-200 hover:border-gray-300 bg-white',
                    isSending && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
                        selectedMode === 'custom'
                          ? 'border-[#FBBB00] bg-[#FBBB00]'
                          : 'border-gray-300'
                      )}
                    >
                      {selectedMode === 'custom' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-0.5">
                        Custom Email
                      </div>
                      <div className="text-sm text-gray-500">
                        Enter a different recipient
                      </div>
                    </div>
                  </div>
                </button>

                {/* Custom Email Input */}
                <AnimatePresence>
                  {selectedMode === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={customEmail}
                          onChange={handleCustomEmailChange}
                          disabled={isSending}
                          placeholder="example@company.com"
                          className={cn(
                            'w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors',
                            emailError
                              ? 'border-red-300 focus:border-red-500'
                              : 'border-gray-200 focus:border-[#FBBB00]',
                            isSending && 'opacity-50 cursor-not-allowed'
                          )}
                          autoFocus
                        />
                        {emailError && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-500 mt-2"
                          >
                            {emailError}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isSending}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSending || (selectedMode === 'custom' && !customEmail)}
                  className="flex-1 py-3 px-4 bg-[#1a1a1a] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}


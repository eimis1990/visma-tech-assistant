'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Trash2, Send, Briefcase, Baby, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ActionSearchBar } from '@/components/ui/action-search-bar'
import { supabase } from '@/lib/supabase'
import { Toast } from '@/components/ui/toast'
import EmailRecipientDialog from '@/components/EmailRecipientDialog'
import { track } from '@vercel/analytics/react'

interface AbsenceRequestPanelProps {
  isOpen: boolean
  onClose: () => void
  prefilledRequest?: { type: string, startDate: string, endDate: string } | null
}

type AbsenceType = 'Vacation' | 'Parental Leave' | 'Unpaid Leave'

interface AbsenceRequest {
  id: string
  type: AbsenceType
  startDate: Date
  endDate: Date
}

const ABSENCE_ITEMS = [
  { label: 'Vacation', value: 'Vacation', icon: <Briefcase className="w-4 h-4 text-[#FBBB00]" /> },
  { label: 'Parental Leave', value: 'Parental Leave', icon: <Baby className="w-4 h-4 text-[#FBBB00]" /> },
  { label: 'Unpaid Leave', value: 'Unpaid Leave', icon: <AlertCircle className="w-4 h-4 text-[#FBBB00]" /> },
]

const STORAGE_KEY = 'absence_request_draft'

// Helper to serialize requests for localStorage
const serializeRequests = (requests: AbsenceRequest[]) => {
  return JSON.stringify(requests.map(r => ({
    id: r.id,
    type: r.type,
    startDate: r.startDate.toISOString(),
    endDate: r.endDate.toISOString()
  })))
}

// Helper to deserialize requests from localStorage
const deserializeRequests = (json: string): AbsenceRequest[] => {
  try {
    const data = JSON.parse(json)
    return data.map((r: any) => ({
      id: r.id,
      type: r.type as AbsenceType,
      startDate: new Date(r.startDate),
      endDate: new Date(r.endDate)
    }))
  } catch {
    return []
  }
}

export default function AbsenceRequestPanel({ isOpen, onClose, prefilledRequest }: AbsenceRequestPanelProps) {
  const [selectedType, setSelectedType] = useState<string>('')
  const [requests, setRequests] = useState<AbsenceRequest[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selection, setSelection] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })
  const [isSending, setIsSending] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  })

  // Load from localStorage when panel opens
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        console.log('💾 Loading from localStorage:', data)
        
        if (data.selectedType) {
          setSelectedType(data.selectedType)
        }
        if (data.requests) {
          const restoredRequests = deserializeRequests(data.requests)
          setRequests(restoredRequests)
          
          // Set calendar to first request's month if exists
          if (restoredRequests.length > 0) {
            setCurrentMonth(restoredRequests[0].startDate)
          }
        }
      }
    }
  }, [isOpen])

  // Save to localStorage whenever requests or selectedType changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      const data = {
        selectedType,
        requests: serializeRequests(requests)
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      console.log('💾 Saved to localStorage:', data)
    }
  }, [requests, selectedType, isOpen])

  // Handle prefilled request from agent
  useEffect(() => {
    if (prefilledRequest && isOpen) {
        console.log('📝 Prefilled request received:', prefilledRequest)
        
        // Parse dates properly - ensure YYYY-MM-DD format is parsed correctly
        // new Date() can be unreliable, so we parse manually
        const parseDate = (dateStr: string): Date => {
            const [year, month, day] = dateStr.split('-').map(Number)
            return new Date(year, month - 1, day) // month is 0-indexed
        }
        
        const start = parseDate(prefilledRequest.startDate)
        const end = parseDate(prefilledRequest.endDate)
        
        console.log('📅 Parsed dates:', { start, end })
        
        // Validate dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.error('❌ Invalid dates:', { start, end })
            return
        }

        const newRequest: AbsenceRequest = {
            id: Math.random().toString(36).substr(2, 9),
            type: prefilledRequest.type as AbsenceType,
            startDate: start,
            endDate: end
        }
        
        console.log('✅ Creating absence request:', newRequest)
        
        // Check if this request is already added (simple duplicate check)
        setRequests(prev => {
             const exists = prev.some(r => 
                 r.startDate.getTime() === start.getTime() && 
                 r.endDate.getTime() === end.getTime() &&
                 r.type === prefilledRequest.type
             )
             if (exists) {
                 console.log('⚠️ Request already exists, skipping')
                 return prev
             }
             console.log('✅ Adding request to list')
             return [...prev, newRequest]
        })
        
        // Set the selected type in the dropdown
        setSelectedType(prefilledRequest.type)
        console.log('✅ Selected type:', prefilledRequest.type)
        
        // Jump to the start month
        setCurrentMonth(start)
        console.log('✅ Set current month to:', start)
    }
  }, [prefilledRequest, isOpen])

  // Clear selection and toast when panel closes (but keep requests and type in localStorage)
  useEffect(() => {
    if (!isOpen) {
      setSelection({ start: null, end: null })
      setToast(prev => ({ ...prev, isVisible: false }))
    }
  }, [isOpen])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true })
  }

  const formatDateForEmail = (date: Date) => {
    return date.toLocaleDateString('lt-LT', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  const handleSendEmails = async () => {
    if (requests.length === 0) return

    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      showToast('You must be signed in to Visma email', 'error')
      return
    }

    const accessToken = session.provider_token

    if (!accessToken) {
      showToast('This feature is only available for Google Sign-In with Visma email', 'error')
      return
    }

    // Show email recipient dialog
    setShowEmailDialog(true)
  }

  const handleSendToEmail = async (recipientEmail: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      showToast('You must be signed in to Visma email', 'error')
      setShowEmailDialog(false)
      return
    }

    const accessToken = session.provider_token

    if (!accessToken) {
      showToast('Please sign in again to refresh email permissions', 'error')
      setShowEmailDialog(false)
      return
    }

    setIsSending(true)

    const emailBodies = requests.map(req => {
      const start = formatDateForEmail(req.startDate)
      const end = formatDateForEmail(req.endDate)
      
      switch (req.type) {
        case 'Parental Leave':
          return `Prasau suteikti man mamadieni/tevadieni ${start}`
        case 'Unpaid Leave':
          return `Prasau suteikti man neapmokamas atostogas nuo ${start} iki ${end} imtinai`
        case 'Vacation':
        default:
          return `Prasau suteikti man kasmetines atostogas nuo ${start} iki ${end} imtinai`
      }
    })

    const body = emailBodies.join('\n')
    const subject = 'Absence Request'

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken,
          subject,
          body,
          to: recipientEmail,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email')
      }

      showToast(`Email sent successfully to ${recipientEmail}!`, 'success')
      setShowEmailDialog(false)
      
      track('Absence Request Sent', { 
        count: requests.length, 
        type: requests[0]?.type || 'Unknown',
        recipient: recipientEmail
      })
      
      // Clear localStorage and state on success
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
        console.log('💾 Cleared localStorage after successful send')
      }
      setRequests([])
      setSelectedType('')
      
      // Optional: close panel after a delay
      setTimeout(() => onClose(), 2000)

    } catch (error: any) {
      console.error('Send email error:', error)
      showToast(error.message || 'Failed to send email', 'error')
    } finally {
      setIsSending(false)
    }
  }

  const handleDateClick = (date: Date) => {
    // Prevent selecting already reserved dates (basic check for start, can be improved to block ranges intersecting reserved dates)
    if (isDateReserved(date)) return

    // Create new date object to avoid reference issues
    const clickedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    if (!selection.start || (selection.start && selection.end)) {
      // Start new selection
      setSelection({ start: clickedDate, end: null })
    } else {
      // Complete range or swap if backwards
      if (clickedDate < selection.start) {
        // Check if any date in between is reserved
        if (isRangeReserved(clickedDate, selection.start)) {
            // Can't span over reserved dates - just select the clicked date as new start
            setSelection({ start: clickedDate, end: null })
        } else {
            setSelection({ start: clickedDate, end: selection.start })
        }
      } else {
        // Check if any date in between is reserved
        if (isRangeReserved(selection.start, clickedDate)) {
             // Can't span over reserved dates - reset selection to just the new end date (as start)
             setSelection({ start: clickedDate, end: null })
        } else {
            setSelection({ ...selection, end: clickedDate })
        }
      }
    }
  }

  const addRequest = () => {
    if (!selection.start || !selectedType) return

    const newRequest: AbsenceRequest = {
      id: Math.random().toString(36).substr(2, 9),
      type: selectedType as AbsenceType,
      startDate: selection.start,
      endDate: selection.end || selection.start,
    }

    setRequests([...requests, newRequest])
    setSelection({ start: null, end: null })
  }

  const removeRequest = (id: string) => {
    setRequests(requests.filter(r => r.id !== id))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/-/g, '.')
  }

  const formatRange = (start: Date, end: Date) => {
    const startStr = formatDate(start)
    const endStr = formatDate(end)
    return startStr === endStr ? startStr : `${startStr} - ${endStr}`
  }

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay() // 0 = Sunday
    
    // Adjust for Monday start (Visma is European mostly, assuming Monday start)
    // Sunday (0) -> 6, Monday (1) -> 0
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

    return { daysInMonth, firstDayOfMonth: adjustedFirstDay }
  }

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth)
  
  const changeMonth = (delta: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1))
  }

  // Check if a specific date is already in the requests list
  const isDateReserved = (date: Date) => {
    const dateTime = date.getTime()
    return requests.some(req => {
      const start = req.startDate.getTime()
      const end = req.endDate.getTime()
      return dateTime >= start && dateTime <= end
    })
  }

  // Check if a range overlaps with reserved dates
  const isRangeReserved = (start: Date, end: Date) => {
    const startTime = start.getTime()
    const endTime = end.getTime()
    
    // Simple check: iterate through all days in range
    // Optimized: Check if any request overlaps [start, end]
    return requests.some(req => {
        const reqStart = req.startDate.getTime()
        const reqEnd = req.endDate.getTime()
        return Math.max(startTime, reqStart) <= Math.min(endTime, reqEnd)
    })
  }

  const isDateSelected = (date: Date) => {
    if (!selection.start) return false
    const dateTime = date.getTime()
    const startTime = selection.start.getTime()
    
    if (selection.end) {
      const endTime = selection.end.getTime()
      return dateTime >= startTime && dateTime <= endTime
    }
    
    return dateTime === startTime
  }

  const isDateInRange = (date: Date) => {
    if (!selection.start || !selection.end) return false
    const dateTime = date.getTime()
    return dateTime > selection.start.getTime() && dateTime < selection.end.getTime()
  }

  const isDateStart = (date: Date) => selection.start?.getTime() === date.getTime()
  const isDateEnd = (date: Date) => (selection.end || selection.start)?.getTime() === date.getTime()

  return (
    <>
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      
      <EmailRecipientDialog
        isOpen={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        onSend={handleSendToEmail}
        isSending={isSending}
      />
      
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - Lower z-index than ElevenLabs widget */}
            <motion.div
              key="absence-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
              style={{ pointerEvents: 'auto' }}
            />

            {/* Side Panel - Lower z-index than ElevenLabs widget (which is z-[999999]) */}
            <motion.div
              key="absence-panel"
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
              <div className="bg-white p-5 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Absence Request</h2>
                  <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Fixed Content Area (Subject + Calendar + Add Button) */}
              <div className="bg-white p-4 border-b border-gray-200 flex-shrink-0 space-y-4 z-10 relative shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)]">
                 {/* Subject Selection */}
                 <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Subject
                  </label>
                  <ActionSearchBar 
                    items={ABSENCE_ITEMS}
                    selected={selectedType}
                    onSelect={setSelectedType}
                    placeholder="Select absence type..."
                  />
                </div>

                {/* Calendar */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-2 flex items-center justify-between border-b border-gray-100">
                    <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="p-2">
                    <div className="grid grid-cols-7 mb-1 text-center">
                      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                        <div key={day} className="text-[10px] font-medium text-gray-400 py-1">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-0.5">
                      {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1
                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                        const isSelected = isDateSelected(date)
                        const isReserved = isDateReserved(date)
                        const isStart = isDateStart(date)
                        const isEnd = isDateEnd(date)
                        const inRange = isDateInRange(date)
                        const isToday = new Date().toDateString() === date.toDateString()

                        return (
                          <button
                            key={day}
                            onClick={() => handleDateClick(date)}
                            disabled={isReserved}
                            className={cn(
                              "relative h-8 w-full rounded-lg flex items-center justify-center text-xs transition-all",
                              // Reserved dates
                              isReserved && "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50 font-medium",
                              
                              // Selected range
                              !isReserved && isSelected && !inRange && "bg-[#FBBB00] text-white font-semibold shadow-sm z-10",
                              !isReserved && inRange && "bg-[#FBBB00]/20 text-gray-900 rounded-none",
                              !isReserved && isStart && selection.end && "rounded-r-none",
                              !isReserved && isEnd && selection.end && "rounded-l-none",
                              
                              // Today
                              isToday && !isSelected && !inRange && !isReserved && "font-bold text-[#FBBB00]",
                              
                              // Hover
                              !isSelected && !inRange && !isReserved && "hover:bg-gray-50 hover:text-gray-900 text-gray-700"
                            )}
                          >
                            {day}
                            {isReserved && <span className="absolute w-0.5 h-0.5 bg-gray-400 rounded-full bottom-1"></span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Add Date Button */}
                <button
                  onClick={addRequest}
                  disabled={!selection.start || !selectedType}
                  className="w-full py-2.5 bg-[#FBBB00] hover:bg-[#e6ac00] disabled:opacity-50 disabled:cursor-not-allowed text-[#1a1a1a] font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Date
                </button>
              </div>

              {/* Scrollable Selected Requests List */}
              <div className="flex-1 overflow-y-auto bg-gray-50/50 p-5">
                 {requests.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium text-gray-700">
                        Selected dates ({requests.length})
                      </label>
                    </div>
                    <div className="space-y-2">
                      <AnimatePresence mode="popLayout">
                      {requests.map((request) => (
                        <motion.div
                          key={request.id}
                          layout
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, height: 0, scale: 0.95 }}
                          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#FBBB00]/10 rounded-lg text-[#FBBB00]">
                               {ABSENCE_ITEMS.find(i => i.value === request.type)?.icon || <Briefcase className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-0.5">{request.type}</p>
                              <p className="text-sm font-bold text-gray-900">
                                {formatRange(request.startDate, request.endDate)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeRequest(request.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                      </AnimatePresence>
                    </div>
                  </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-4">
                     <CalendarIcon className="w-12 h-12 mb-2 opacity-20" />
                     <p className="text-sm">No dates selected yet</p>
                   </div>
                 )}
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-gray-200 bg-white">
                <button
                  onClick={handleSendEmails}
                  disabled={requests.length === 0 || isSending}
                  className="w-full py-3.5 bg-[#1a1a1a] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {isSending ? 'Sending...' : requests.length === 1 ? 'Send Email' : 'Send Emails'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

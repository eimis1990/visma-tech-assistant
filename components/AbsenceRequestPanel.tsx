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
  { label: 'Vacation', value: 'Vacation', icon: <Briefcase className="w-4 h-4 text-[#88c540]" /> },
  { label: 'Parental Leave', value: 'Parental Leave', icon: <Baby className="w-4 h-4 text-[#88c540]" /> },
  { label: 'Unpaid Leave', value: 'Unpaid Leave', icon: <AlertCircle className="w-4 h-4 text-[#88c540]" /> },
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
  const isDateEnd = (date: Date) => {
    return (selection.end || selection.start)?.getTime() === date.getTime()
  }

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

            {/* Side Panel */}
            <motion.div
              key="absence-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 35,
              }}
              className="fixed left-0 top-0 h-full w-full md:w-[450px] bg-[#0a0a0a] border-r border-[#88c540]/10 shadow-2xl z-[9999] overflow-hidden flex flex-col"
              style={{ pointerEvents: 'auto' }}
            >
              {/* Background Grid Effect */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `linear-gradient(#88c540 1px, transparent 1px), linear-gradient(90deg, #88c540 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }} />

              {/* Header */}
              <div className="relative bg-[#0a0a0a]/80 backdrop-blur-md p-6 border-b border-[#88c540]/10 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#88c540]/10 flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-[#88c540]" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Absence Request</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Selection Area (Subject + Calendar + Add Button) */}
                <div className="relative bg-[#0a0a0a]/40 p-6 space-y-6 z-10">
                   {/* Subject Selection */}
                   <div className="dark">
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                      Absence Type
                    </label>
                    <ActionSearchBar 
                      items={ABSENCE_ITEMS}
                      selected={selectedType}
                      onSelect={setSelectedType}
                      placeholder="Select type..."
                    />
                  </div>

                  {/* Calendar */}
                  <div className="bg-[#1a1a1a] rounded-2xl border border-[#88c540]/10 overflow-hidden shadow-inner">
                    <div className="p-3 flex items-center justify-between border-b border-[#88c540]/5 bg-[#1a1a1a]">
                      <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-[#88c540]">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-[#88c540]">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-7 mb-2 text-center">
                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                          <div key={day} className="text-[10px] font-black text-gray-600 py-1 uppercase">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1">
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
                                "relative h-9 w-full rounded-xl flex items-center justify-center text-xs transition-all duration-200",
                                // Reserved dates
                                isReserved && "bg-white/5 text-gray-600 cursor-not-allowed opacity-30",
                                
                                // Selected range
                                !isReserved && isSelected && !inRange && "bg-[#88c540] text-black font-black shadow-lg shadow-[#88c540]/20 z-10",
                                !isReserved && inRange && "bg-[#88c540]/20 text-[#88c540] rounded-none font-bold",
                                !isReserved && isStart && selection.end && "rounded-r-none",
                                !isReserved && isEnd && selection.end && "rounded-l-none",
                                
                                // Today
                                isToday && !isSelected && !inRange && !isReserved && "text-[#88c540] font-black ring-1 ring-inset ring-[#88c540]/30",
                                
                                // Hover
                                !isSelected && !inRange && !isReserved && "hover:bg-white/5 text-gray-400 hover:text-white"
                              )}
                            >
                              {day}
                              {isReserved && <span className="absolute w-1 h-1 bg-gray-600 rounded-full bottom-1.5"></span>}
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
                    className="w-full py-4 bg-[#88c540]/10 border border-[#88c540]/20 hover:bg-[#88c540]/20 disabled:opacity-30 disabled:cursor-not-allowed text-[#88c540] font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                    Add to Request
                  </button>
                </div>

                {/* Selected Requests List */}
                <div className="p-6 pt-0 border-t border-[#88c540]/10 bg-[#0a0a0a]">
                   {requests.length > 0 ? (
                    <div className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                          Selected Periods ({requests.length})
                        </label>
                      </div>
                      <motion.div 
                        className="space-y-3"
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: {
                            transition: {
                              staggerChildren: 0.05
                            }
                          }
                        }}
                      >
                        <AnimatePresence mode="popLayout">
                        {requests.map((request) => (
                          <motion.div
                            key={request.id}
                            layout
                            variants={{
                              hidden: { opacity: 0, x: -20, scale: 0.95 },
                              visible: { opacity: 1, x: 0, scale: 1 }
                            }}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            className="flex items-center justify-between p-4 bg-[#1a1a1a] border border-[#88c540]/5 rounded-2xl group relative overflow-hidden"
                          >
                            <div className="flex items-center gap-4 relative z-10">
                              <div className="p-2.5 bg-[#88c540]/10 rounded-xl text-[#88c540] group-hover:scale-110 transition-transform duration-300">
                                 {ABSENCE_ITEMS.find(i => i.value === request.type)?.icon || <Briefcase className="w-4 h-4" />}
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">{request.type}</p>
                                <p className="text-sm font-black text-white">
                                  {formatRange(request.startDate, request.endDate)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeRequest(request.id)}
                              className="relative z-10 p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            
                            {/* Item Grid Accent */}
                            <div className="absolute bottom-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-10 transition-opacity">
                              <div className="absolute inset-0" style={{
                                backgroundImage: `linear-gradient(to right, #88c540 1px, transparent 1px), linear-gradient(to bottom, #88c540 1px, transparent 1px)`,
                                backgroundSize: '8px 8px',
                                maskImage: 'radial-gradient(circle at bottom right, black, transparent 70%)',
                                WebkitMaskImage: 'radial-gradient(circle at bottom right, black, transparent 70%)'
                              }} />
                            </div>
                          </motion.div>
                        ))}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                   ) : (
                     <div className="py-20 flex flex-col items-center justify-center text-center text-gray-600">
                       <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                         <CalendarIcon className="w-8 h-8 opacity-20" />
                       </div>
                       <p className="text-sm font-bold uppercase tracking-widest opacity-40">Timeline is empty</p>
                     </div>
                   )}
                </div>
              </div>

              {/* Footer */}
              <div className="relative p-6 border-t border-[#88c540]/10 bg-[#0a0a0a]/80 backdrop-blur-md">
                <button
                  onClick={handleSendEmails}
                  disabled={requests.length === 0 || isSending}
                  className="group relative w-full py-4 bg-gradient-to-r from-[#88c540] to-[#9ed958] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed text-black font-black rounded-2xl transition-all duration-300 shadow-lg shadow-[#88c540]/20 hover:shadow-[#88c540]/40 flex items-center justify-center gap-3 overflow-hidden"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  )}
                  <span className="tracking-tight uppercase">
                    {isSending ? 'Sending Request...' : requests.length === 1 ? 'Submit Request' : `Submit ${requests.length} Requests`}
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

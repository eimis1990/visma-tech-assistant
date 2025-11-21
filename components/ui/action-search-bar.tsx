'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActionItem {
  label: string
  value: string
  icon?: React.ReactNode
}

interface ActionSearchBarProps {
  items: ActionItem[]
  selected: string
  onSelect: (value: string) => void
  placeholder?: string
  className?: string
}

export function ActionSearchBar({ 
  items, 
  selected, 
  onSelect, 
  placeholder = "Search...", 
  className 
}: ActionSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase())
  )

  const selectedItem = items.find(item => item.value === selected)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleContainerClick = (e: React.MouseEvent) => {
    // If clicking the input, do nothing (let input handle focus)
    if ((e.target as HTMLElement).tagName === 'INPUT') return
    
    // Toggle open state
    setIsOpen(!isOpen)
    
    // If opening, focus input
    if (!isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        onClick={handleContainerClick}
        className={cn(
          "flex items-center gap-2 w-full p-3 bg-white border rounded-xl cursor-pointer transition-all duration-200",
          isOpen ? "border-[#FBBB00] ring-2 ring-[#FBBB00]/20" : "border-gray-200 hover:border-[#FBBB00]",
          "shadow-sm"
        )}
      >
        <Search className="w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? query : selectedItem?.label || ''}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!isOpen) setIsOpen(true)
          }}
          onFocus={() => {
            setIsOpen(true)
            setQuery('')
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500 cursor-pointer"
          readOnly={!isOpen}
        />
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-xl z-50 overflow-hidden"
          >
            <div className="max-h-[240px] overflow-y-auto p-1.5 space-y-0.5">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      onSelect(item.value)
                      setIsOpen(false)
                      setQuery('')
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
                      selected === item.value 
                        ? "bg-[#FBBB00]/10 text-[#1a1a1a] font-medium" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </span>
                    {selected === item.value && (
                      <Check className="w-4 h-4 text-[#FBBB00]" />
                    )}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-gray-500">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

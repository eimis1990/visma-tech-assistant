'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
}

interface SmoothTabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
}

export function SmoothTabs({ tabs, activeTab, onChange }: SmoothTabsProps) {
  return (
    <div className="relative flex gap-1 bg-gray-50 dark:bg-[#1a1a1a] p-1 rounded-xl border border-transparent dark:border-[#88c540]/10">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id
        // Adjust flex basis for specific tabs
        const flexClass = tab.id === 'leaving'
          ? 'flex-[0.9]'
          : tab.id === 'buying-power'
          ? 'flex-[1.1]'
          : 'flex-1'

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative ${flexClass} py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 ${
              isActive
                ? 'text-[#1a1a1a] dark:text-black bg-white dark:bg-[#88c540] shadow-sm'
                : 'text-[#1a1a1a]/70 dark:text-gray-400 hover:text-[#1a1a1a] dark:hover:text-white'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

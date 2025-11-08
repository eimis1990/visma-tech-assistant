'use client'

import { Sparkles } from 'lucide-react'

export default function ChatHeader() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">
              Visma Tech Assistant
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI-powered knowledge assistant
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

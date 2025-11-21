'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const ViTechLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-0', className)}>
      <Image
        src="/vtech-logo.png"
        alt="ViTech Logo"
        width={120}
        height={32}
        className="h-8 w-auto"
        priority
      />
      <span className="text-3xl font-medium text-black" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>vitech.</span>
    </div>
  )
}

export default function PolicyHeader() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
            <ViTechLogo />
        </Link>
        
        <Link 
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group px-4 py-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>
    </header>
  )
}


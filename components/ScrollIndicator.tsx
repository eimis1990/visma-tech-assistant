'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ChevronDown } from 'lucide-react'

export default function ScrollIndicator() {
  const indicatorRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Bounce animation for the icon
      gsap.to(iconRef.current, {
        y: 8,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      })

      // Fade out on scroll
      const handleScroll = () => {
        const scrollY = window.scrollY
        const opacity = Math.max(0, 1 - scrollY / 300)
        gsap.to(indicatorRef.current, {
          opacity,
          duration: 0.3,
        })
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    })

    return () => ctx.revert()
  }, [])

  const handleClick = () => {
    const targetY = window.innerHeight * 0.8
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    })
  }

  return (
    <div
      ref={indicatorRef}
      onClick={handleClick}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 cursor-pointer group"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Scroll to explore
        </span>
        <div
          ref={iconRef}
          className="w-10 h-10 rounded-full bg-[#88c540]/20 backdrop-blur-sm border border-[#88c540]/30 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <ChevronDown className="w-5 h-5 text-[#88c540]" />
        </div>
      </div>
    </div>
  )
}


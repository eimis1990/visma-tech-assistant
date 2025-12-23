'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    
    if (!cursor || !cursorDot) return

    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      
      // Instantly move the dot
      gsap.to(cursorDot, {
        x: mouseX,
        y: mouseY,
        duration: 0,
      })
      
      // Smoothly follow with the outer circle
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.5,
        ease: 'power3.out',
      })
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target
      if (!(target instanceof Element)) return
      
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        gsap.to(cursor, { scale: 1.5, duration: 0.3, ease: 'power2.out' })
        gsap.to(cursorDot, { scale: 0.5, duration: 0.3, ease: 'power2.out' })
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target
      if (!(target instanceof Element)) return
      
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' })
        gsap.to(cursorDot, { scale: 1, duration: 0.3, ease: 'power2.out' })
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
    }
  }, [])

  return (
    <>
      {/* Outer circle */}
      <div
        ref={cursorRef}
        className="fixed w-8 h-8 border-2 border-[#88c540]/70 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          left: '-16px',
          top: '-16px',
        }}
      />
      {/* Inner dot */}
      <div
        ref={cursorDotRef}
        className="fixed w-2 h-2 bg-[#88c540] rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          left: '-4px',
          top: '-4px',
        }}
      />
    </>
  )
}


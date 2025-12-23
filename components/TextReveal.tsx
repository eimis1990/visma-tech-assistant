'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TextRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export default function TextReveal({ children, delay = 0, className = '' }: TextRevealProps) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!textRef.current) return

    const chars = textRef.current.querySelectorAll('.char')
    
    const ctx = gsap.context(() => {
      gsap.from(chars, {
        opacity: 0,
        y: 50,
        rotationX: -90,
        stagger: 0.02,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay,
      })
    })

    return () => ctx.revert()
  }, [delay])

  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
        {char}
      </span>
    ))
  }

  return (
    <div ref={textRef} className={className}>
      {typeof children === 'string' ? splitText(children) : children}
    </div>
  )
}


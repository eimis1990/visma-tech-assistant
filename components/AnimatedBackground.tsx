'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    // Create static particles
    const particleCount = 20
    const particles: HTMLDivElement[] = []

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'absolute rounded-full bg-[#88c540]/8 blur-3xl'
      
      const size = Math.random() * 150 + 80
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      particle.style.opacity = `${Math.random() * 0.3 + 0.1}`
      
      containerRef.current?.appendChild(particle)
      particles.push(particle)
    }

    particlesRef.current = particles

    return () => {
      particles.forEach(particle => particle.remove())
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}


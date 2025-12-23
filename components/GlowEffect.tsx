'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface GlowEffectProps {
  color?: string
  size?: number
  intensity?: number
}

export default function GlowEffect({ 
  color = '#88c540', 
  size = 300, 
  intensity = 0.3 
}: GlowEffectProps) {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!glowRef.current) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      gsap.to(glowRef.current, {
        x: mouseX - size / 2,
        y: mouseY - size / 2,
        duration: 1.5,
        ease: 'power2.out',
      })
    }

    document.addEventListener('mousemove', handleMouseMove)

    // Pulsing animation
    gsap.to(glowRef.current, {
      scale: 1.2,
      opacity: intensity * 1.5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [size, intensity])

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-0 rounded-full blur-[120px]"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        opacity: intensity,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}


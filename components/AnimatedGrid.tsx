'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function AnimatedGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return

    const ctx = gsap.context(() => {
      // Animate grid on scroll
      gsap.to(gridRef.current, {
        backgroundPosition: '100% 100%',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        }
      })

      // Pulsing effect
      gsap.to(gridRef.current, {
        opacity: 0.7,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={gridRef}
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(139, 195, 74, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(139, 195, 74, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 0",
        maskImage: `
           repeating-linear-gradient(
            to right,
            black 0px,
            black 3px,
            transparent 3px,
            transparent 8px
          ),
          repeating-linear-gradient(
            to bottom,
            black 0px,
            black 3px,
            transparent 3px,
            transparent 8px
          ),
          radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
        `,
        WebkitMaskImage: `
repeating-linear-gradient(
            to right,
            black 0px,
            black 3px,
            transparent 3px,
            transparent 8px
          ),
          repeating-linear-gradient(
            to bottom,
            black 0px,
            black 3px,
            transparent 3px,
            transparent 8px
          ),
          radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
        `,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    />
  )
}


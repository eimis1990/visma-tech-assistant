'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface CircularTextProps {
  text: string
  radius?: number
  fontSize?: number
  className?: string
  children?: React.ReactNode
}

export const CircularText = ({
  text,
  radius = 60,
  fontSize = 12,
  className = "",
  children
}: CircularTextProps) => {
  const diameter = radius * 2
  const center = radius
  const pathId = "circular-text-path"
  
  // The path for the text - a circle slightly smaller than the container
  const pathRadius = radius - fontSize
  const pathData = `
    M ${center}, ${center - pathRadius}
    a ${pathRadius},${pathRadius} 0 1,1 0,${pathRadius * 2}
    a ${pathRadius},${pathRadius} 0 1,1 0,-${pathRadius * 2}
  `

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: diameter, height: diameter }}>
      {/* Background Circle */}
      <div className="absolute inset-0 rounded-full bg-black/40 border border-white/5 backdrop-blur-sm shadow-2xl" />
      
      {/* Rotating SVG Text */}
      <motion.svg
        viewBox={`0 0 ${diameter} ${diameter}`}
        className="absolute inset-0 w-full h-full"
        animate={{ rotate: -360 }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <defs>
          <path id={pathId} d={pathData} />
        </defs>
        <text
          fill="white"
          fontSize={fontSize}
          fontWeight="700"
          letterSpacing="0.2em"
          className="uppercase opacity-80"
        >
          <textPath xlinkHref={`#${pathId}`} startOffset="0%">
            {text}
          </textPath>
        </text>
      </motion.svg>

      {/* Center Icon/Children */}
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

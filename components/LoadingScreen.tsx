'use client'
import { useEffect, useState } from 'react'
import { animate } from 'animejs'
import Image from 'next/image'

const BAR_WIDTH = 200 // px — harus sama dengan w di JSX
const FACE_SIZE = 44  // px

export default function LoadingScreen() {
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    // Logo entrance
    animate('.loader-logo', {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 600,
      easing: 'easeOutExpo',
    })

    animate('.loader-sub', {
      opacity: [0, 1],
      duration: 400,
      delay: 350,
      easing: 'easeOutExpo',
    })

    // Progress bar fill
    animate('.loader-bar-fill', {
      width: ['0px', `${BAR_WIDTH}px`],
      duration: 2000,
      delay: 300,
      easing: 'easeInOutSine',
    })

    // Face icon slides from left to right along the bar
    animate('.loader-face', {
      translateX: [-(FACE_SIZE / 2), BAR_WIDTH - FACE_SIZE / 2],
      duration: 2000,
      delay: 300,
      easing: 'easeInOutSine',
    })

    // Exit: slide screen up after progress done
    const exitTimer = setTimeout(() => {
      animate('.loader-wrapper', {
        translateY: [0, '-100%'],
        duration: 800,
        easing: 'cubicBezier(0.76, 0, 0.24, 1)',
      })
      setTimeout(() => {
        setMounted(false)
        window.dispatchEvent(new CustomEvent('portfolio:loaded'))
      }, 820)
    }, 2600)

    return () => clearTimeout(exitTimer)
  }, [])

  if (!mounted) return null

  return (
    <div className="loader-wrapper fixed inset-0 z-[9999] bg-[#0f0f0f] flex flex-col items-center justify-center overflow-hidden">

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, #06b6d418 0%, transparent 70%)' }}
      />

      {/* Logo */}
      <div className="loader-logo opacity-0 relative z-10 text-center mb-12">
        <div className="font-mono font-black text-6xl leading-none tracking-tight select-none">
          <span className="text-[#06b6d4]">AAZ</span>
          <span className="text-white">.</span>
        </div>
        <div className="loader-sub opacity-0 font-mono text-[10px] text-gray-600 tracking-[0.5em] uppercase mt-3">
          Alif Ardezir Zidane
        </div>
      </div>

      {/* Progress bar + face slider */}
      <div className="relative z-10" style={{ width: BAR_WIDTH }}>

        {/* Face icon — starts at left edge, slides to right */}
        <div
          className="loader-face absolute flex items-center justify-center"
          style={{
            top: -(FACE_SIZE / 2) - 6,
            left: 0,
            width: FACE_SIZE,
            height: FACE_SIZE,
            transform: `translateX(${-(FACE_SIZE / 2)}px)`,
          }}
        >
          <Image
            src="/face.png"
            alt="Alif"
            width={FACE_SIZE}
            height={FACE_SIZE}
            className="object-contain"
            style={{ mixBlendMode: 'lighten' }}
            priority
          />
        </div>

        {/* Bar track */}
        <div className="w-full h-px bg-[#1e1e1e] rounded-full overflow-hidden">
          <div
            className="loader-bar-fill h-full rounded-full"
            style={{
              width: 0,
              background: 'linear-gradient(90deg, #0e7490, #06b6d4, #22d3ee)',
              boxShadow: '0 0 8px #06b6d450',
            }}
          />
        </div>

        {/* Percentage text below bar */}
        <p className="font-mono text-[10px] text-gray-700 text-center mt-4 tracking-[0.4em] uppercase">
          Loading...
        </p>
      </div>
    </div>
  )
}

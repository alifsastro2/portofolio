'use client'
import { useEffect, useState, useRef } from 'react'
import { animate, stagger } from 'animejs'
import Image from 'next/image'
import DevRunner from './DevRunner'

export default function Hero() {
  const [statsOpen, setStatsOpen] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchShow = () => { if (hideTimer.current) clearTimeout(hideTimer.current); setStatsOpen(true) }
  const touchHide = () => { hideTimer.current = setTimeout(() => setStatsOpen(false), 1600) }

  useEffect(() => {
    const runAnimations = () => {
      animate('.hero-item', {
        opacity: [0, 1],
        translateY: [30, 0],
        delay: stagger(120, { start: 100 }),
        duration: 800,
        easing: 'easeOutExpo',
      })
      animate('.hero-photo', {
        opacity: [0, 1],
        translateX: [40, 0],
        duration: 1000,
        delay: 200,
        easing: 'easeOutExpo',
      })
    }

    // Tunggu loading screen selesai
    window.addEventListener('portfolio:loaded', runAnimations, { once: true })

    // Fallback: kalau event tidak firing (misal refresh cepat / dev mode)
    const fallback = setTimeout(runAnimations, 3500)

    return () => {
      window.removeEventListener('portfolio:loaded', runAnimations)
      clearTimeout(fallback)
    }
  }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0f0f0f]"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 w-[60%] h-[70%] bg-[radial-gradient(ellipse_at_top_right,_#06b6d418_0%,_transparent_65%)]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-[radial-gradient(ellipse_at_bottom_left,_#06b6d40a_0%,_transparent_65%)]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-20 pb-16">

        {/* ── Left: Text ── */}
        <div className="space-y-6 order-2 lg:order-1">
          <p className="hero-item opacity-0 font-mono text-[#06b6d4] text-xs tracking-[0.4em] uppercase">
            Hi, I&apos;m
          </p>

          <h1 className="hero-item opacity-0 text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.08] tracking-tight">
            Alif Ardezir
            <br />
            <span className="text-[#06b6d4]">Zidane</span>
          </h1>

          <div className="hero-item opacity-0 flex items-center gap-2 font-mono text-gray-400 text-base">
            <span className="w-6 h-px bg-[#06b6d4]" />
            Fullstack &amp; Mobile Developer
          </div>

          <p className="hero-item opacity-0 text-gray-500 max-w-md leading-relaxed text-sm">
            Building end-to-end web and Android applications with modern
            frameworks. Specialized in Flutter, Next.js, and AI-accelerated
            development workflows.
          </p>

          <div className="hero-item opacity-0 flex flex-wrap gap-4 pt-2">
            <a
              href="#projects"
              className="px-6 py-3 bg-[#06b6d4] text-black font-semibold rounded-lg hover:bg-[#22d3ee] transition-colors text-sm"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-[#06b6d4]/30 text-[#06b6d4] rounded-lg hover:bg-[#06b6d4]/10 hover:border-[#06b6d4] transition-all text-sm"
            >
              Contact Me
            </a>
            <a
              href="/cv.pdf"
              download="Alif Ardezir Zidane - CV.pdf"
              className="px-6 py-3 border border-[#2a2a2a] text-gray-300 rounded-lg hover:border-[#06b6d4]/40 hover:text-[#06b6d4] transition-all text-sm inline-flex items-center gap-2"
            >
              Download CV ↓
            </a>
          </div>

          <div className="hero-item opacity-0 flex items-center gap-5 pt-2">
            {[
              { label: 'GitHub', href: 'https://github.com/alifsastro2' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alif-ardezir-zidane-5a1b062b8' },
              { label: 'Email', href: 'mailto:alif.sastro2@gmail.com' },
            ].map((link, i) => (
              <span key={link.label} className="flex items-center gap-5">
                {i > 0 && <span className="text-gray-800">·</span>}
                <a
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-gray-600 hover:text-[#06b6d4] transition-colors"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </div>

          {/* ── Dev Runner Mini Game ── */}
          <div className="hero-item opacity-0 pt-4">
            <DevRunner />
          </div>
        </div>

        {/* ── Right: Photo + Stats ── */}
        <div className="hero-photo opacity-0 order-1 lg:order-2 flex justify-center lg:justify-end">
          {/* Outer wrapper — hover (desktop) / touch (mobile) untuk munculkan badges */}
          <div
            className="group relative flex items-center justify-center px-12 sm:px-20"
            onTouchStart={touchShow}
            onTouchEnd={touchHide}
            onTouchCancel={touchHide}
          >

            {/* Height badge — sejajar bahu (kiri) */}
            <div className={`absolute left-0 top-[24%] pointer-events-none
                            group-hover:opacity-100 group-hover:translate-x-0
                            transition-all duration-400 ease-out delay-75
                            ${statsOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'}`}>
              <div className="flex items-center gap-1.5">
                <div className="bg-[#0f0f0f] border border-[#06b6d4]/40 rounded-xl px-3 py-2 text-center shadow-lg shadow-[#06b6d4]/5">
                  <div className="text-[#06b6d4] font-bold text-lg leading-none font-mono">170</div>
                  <div className="text-gray-500 text-[9px] font-mono mt-0.5">cm</div>
                  <div className="text-gray-700 text-[8px] font-mono tracking-wider uppercase">Height</div>
                </div>
                <div className="w-4 h-px bg-[#06b6d4]/40" />
              </div>
            </div>

            {/* Weight badge — sejajar siku (kanan) */}
            <div className={`absolute right-0 top-[46%] pointer-events-none
                            group-hover:opacity-100 group-hover:translate-x-0
                            transition-all duration-400 ease-out delay-150
                            ${statsOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1'}`}>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-px bg-[#06b6d4]/40" />
                <div className="bg-[#0f0f0f] border border-[#06b6d4]/40 rounded-xl px-3 py-2 text-center shadow-lg shadow-[#06b6d4]/5">
                  <div className="text-[#06b6d4] font-bold text-lg leading-none font-mono">80</div>
                  <div className="text-gray-500 text-[9px] font-mono mt-0.5">kg</div>
                  <div className="text-gray-700 text-[8px] font-mono tracking-wider uppercase">Weight</div>
                </div>
              </div>
            </div>

            {/* Photo */}
            <div className="w-[200px] sm:w-[240px] lg:w-[280px] transition-transform duration-500 ease-out group-hover:scale-105">
              <Image
                src="/photo.png"
                alt="Alif Ardezir Zidane"
                width={280}
                height={480}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Age badge — paling atas, sejajar telinga kanan */}
            <div className={`absolute top-[7%] right-0 pointer-events-none z-10
                            group-hover:opacity-100 group-hover:translate-x-0
                            transition-all duration-400 ease-out delay-200
                            ${statsOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1'}`}>
              <div className="bg-[#0f0f0f] border border-[#06b6d4]/30 rounded-full px-4 py-1.5 flex items-center gap-2 whitespace-nowrap shadow-lg">
                <span className="text-[#06b6d4] font-bold text-sm font-mono">25</span>
                <span className="text-gray-600 text-[10px] font-mono">yo · Bekasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] tracking-[0.3em] text-gray-700 uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#06b6d4] to-transparent" />
      </div>
    </section>
  )
}

'use client'
import { useEffect } from 'react'
import { animate, stagger } from 'animejs'

const floatingTags = ['Next.js', 'Flutter', 'TypeScript', 'Supabase', 'Claude AI']

export default function Hero() {
  useEffect(() => {
    animate('.hero-item', {
      opacity: [0, 1],
      translateY: [30, 0],
      delay: stagger(140, { start: 200 }),
      duration: 900,
      easing: 'easeOutExpo',
    })

    animate('.hero-orb', {
      scale: [0.7, 1],
      opacity: [0, 1],
      duration: 1400,
      easing: 'easeOutElastic(1, 0.6)',
    })

    animate('.hero-ring-1', {
      opacity: [0, 1],
      scale: [0.5, 1],
      duration: 1200,
      delay: 300,
      easing: 'easeOutExpo',
    })

    animate('.hero-ring-2', {
      opacity: [0, 1],
      scale: [0.5, 1],
      duration: 1200,
      delay: 500,
      easing: 'easeOutExpo',
    })

    animate('.hero-tag', {
      opacity: [0, 1],
      translateX: [-10, 0],
      delay: stagger(100, { start: 800 }),
      duration: 600,
      easing: 'easeOutExpo',
    })
  }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0f0f0f]"
    >
      {/* Ambient gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 w-[60%] h-[70%] bg-[radial-gradient(ellipse_at_top_right,_#06b6d418_0%,_transparent_65%)]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-[radial-gradient(ellipse_at_bottom_left,_#06b6d40a_0%,_transparent_65%)]" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-24 pt-28">
        {/* ── Left: Text content ── */}
        <div className="space-y-6">
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
          </div>

          <div className="hero-item opacity-0 flex items-center gap-5 pt-2">
            <a
              href="https://github.com/alifsastro2"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-gray-600 hover:text-[#06b6d4] transition-colors"
            >
              GitHub
            </a>
            <span className="text-gray-800">·</span>
            <a
              href="https://www.linkedin.com/in/alif-ardezir-zidane-5a1b062b8"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-gray-600 hover:text-[#06b6d4] transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-gray-800">·</span>
            <a
              href="mailto:alif@cybergl.co.id"
              className="font-mono text-xs text-gray-600 hover:text-[#06b6d4] transition-colors"
            >
              Email
            </a>
          </div>
        </div>

        {/* ── Right: 3D Orbital Visual ── */}
        <div className="relative flex items-center justify-center h-[380px] lg:h-[520px]">
          {/* Outer spinning ring */}
          <div className="hero-ring-2 opacity-0 absolute w-[340px] h-[340px] lg:w-[440px] lg:h-[440px] rounded-full border border-dashed border-[#06b6d4]/10 spin-slow" />

          {/* Middle ring with dots */}
          <div className="hero-ring-1 opacity-0 absolute w-[260px] h-[260px] lg:w-[340px] lg:h-[340px] rounded-full border border-[#06b6d4]/20 spin-reverse">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#06b6d4]" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#06b6d4]/40" />
          </div>

          {/* Center orb */}
          <div className="hero-orb opacity-0 relative z-10 w-44 h-44 lg:w-52 lg:h-52 rounded-full glow-pulse flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #06b6d435 0%, #06b6d415 40%, #06b6d408 70%, transparent 100%)',
              border: '1px solid rgba(6,182,212,0.25)',
            }}
          >
            <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full"
              style={{
                background: 'radial-gradient(circle at 40% 40%, #06b6d425 0%, transparent 70%)',
                border: '1px solid rgba(6,182,212,0.15)',
              }}
            />
          </div>

          {/* Floating tech tags */}
          <div className="hero-tag opacity-0 absolute top-8 right-8 lg:right-12 bg-[#161616] border border-[#06b6d4]/25 rounded-lg px-3 py-1.5 text-xs text-[#06b6d4] font-mono float-1 shadow-lg">
            Next.js
          </div>
          <div className="hero-tag opacity-0 absolute bottom-16 right-4 lg:right-8 bg-[#161616] border border-[#06b6d4]/25 rounded-lg px-3 py-1.5 text-xs text-[#06b6d4] font-mono float-2 shadow-lg">
            Flutter
          </div>
          <div className="hero-tag opacity-0 absolute top-1/2 -translate-y-1/2 left-0 lg:-left-4 bg-[#161616] border border-[#06b6d4]/25 rounded-lg px-3 py-1.5 text-xs text-[#06b6d4] font-mono float-3 shadow-lg">
            TypeScript
          </div>
          <div className="hero-tag opacity-0 absolute bottom-8 left-10 bg-[#161616] border border-[#06b6d4]/25 rounded-lg px-3 py-1.5 text-xs text-[#06b6d4] font-mono float-1 shadow-lg">
            Supabase
          </div>
          <div className="hero-tag opacity-0 absolute top-10 left-6 bg-[#161616] border border-[#06b6d4]/25 rounded-lg px-3 py-1.5 text-xs text-[#06b6d4] font-mono float-2 shadow-lg">
            Claude AI
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-6 left-1/3 w-5 h-5 border border-[#06b6d4]/20 rounded rotate-45 float-2" />
          <div className="absolute bottom-10 right-1/3 w-3 h-3 bg-[#06b6d4]/15 rounded-full float-1" />
          <div className="absolute top-1/3 right-2 w-4 h-4 border border-[#06b6d4]/15 float-3" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] tracking-[0.3em] text-gray-700 uppercase">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-[#06b6d4] to-transparent" />
      </div>
    </section>
  )
}

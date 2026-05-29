'use client'
import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import type { AboutContent } from '@/lib/supabase/types'

const stats = [
  { value: '4+', label: 'Years Experience' },
  { value: '5+', label: 'Projects Shipped' },
  { value: '2', label: 'Platforms (Web & Mobile)' },
  { value: '∞', label: 'Lines of Coffee' },
]

const defaults = {
  bio_1: "I'm a final-year Information Systems student at Universitas Gunadarma with hands-on experience shipping real products — from Android apps to fullstack SaaS platforms.",
  bio_2: "I specialize in Flutter for mobile and Next.js for web, and I leverage AI-assisted workflows (Claude Code) to move fast without breaking things.",
  location: 'Kota Bekasi, Jawa Barat',
  available: true,
}

export default function About({ about }: { about: AboutContent | null }) {
  const sectionRef = useRef<HTMLElement>(null)
  const animatedRef = useRef(false)

  const bio_1    = about?.bio_1    ?? defaults.bio_1
  const bio_2    = about?.bio_2    ?? defaults.bio_2
  const location = about?.location ?? defaults.location
  const available = about?.available ?? defaults.available

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          animate('.about-item', {
            opacity: [0, 1], translateY: [30, 0],
            delay: stagger(120), duration: 800, easing: 'easeOutExpo',
          })
          animate('.stat-item', {
            opacity: [0, 1], translateY: [20, 0],
            delay: stagger(80, { start: 300 }), duration: 600, easing: 'easeOutExpo',
          })
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="relative py-28 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left: Photo */}
        <div className="about-item opacity-0 flex justify-center lg:justify-start">
          <div className="relative w-64 h-64 lg:w-80 lg:h-80">
            <div className="absolute inset-0 rounded-2xl border border-[#06b6d4]/20 bg-[#161616] flex items-center justify-center overflow-hidden">
              <div className="flex flex-col items-center gap-3 text-gray-700">
                <div className="w-20 h-20 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/20 flex items-center justify-center">
                  <span className="font-mono text-2xl text-[#06b6d4]/60">AAZ</span>
                </div>
                <span className="font-mono text-xs text-gray-600">[ photo coming soon ]</span>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-2 border-r-2 border-[#06b6d4]/40 rounded-br-2xl" />
            <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-[#06b6d4]/20 rounded-tl-2xl" />
          </div>
        </div>

        {/* Right: Text */}
        <div className="space-y-6">
          <div className="about-item opacity-0">
            <p className="font-mono text-[#06b6d4] text-xs tracking-[0.3em] uppercase mb-3">About Me</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Building things that <span className="text-[#06b6d4]">actually work</span>
            </h2>
          </div>

          <p className="about-item opacity-0 text-gray-500 leading-relaxed text-sm">{bio_1}</p>
          <p className="about-item opacity-0 text-gray-500 leading-relaxed text-sm">{bio_2}</p>

          <div className="about-item opacity-0 flex flex-wrap gap-3 pt-2">
            <span className="px-3 py-1 text-xs font-mono bg-[#06b6d4]/10 border border-[#06b6d4]/20 text-[#06b6d4] rounded">
              {location}
            </span>
            <span className={`px-3 py-1 text-xs font-mono rounded border ${
              available
                ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400'
                : 'bg-gray-600/10 border-gray-600/20 text-gray-500'
            }`}>
              {available ? 'Open to Work' : 'Not Available'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1e1e1e]">
            {stats.map((s) => (
              <div key={s.label} className="stat-item opacity-0">
                <div className="text-2xl font-bold text-[#06b6d4]">{s.value}</div>
                <div className="text-xs text-gray-600 font-mono mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'
import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'
import Image from 'next/image'
import type { AboutContent } from '@/lib/supabase/types'
import { SiNetflix } from 'react-icons/si'
import { HiSparkles } from 'react-icons/hi2'

const stats = [
  { value: '4+', label: 'Years Experience' },
  { value: '5+', label: 'Projects Shipped' },
  { value: '2', label: 'Platforms (Web & Mobile)' },
  { value: '∞', label: 'Lines of Coffee' },
]

type Hobby = {
  Icon?: typeof SiNetflix
  logo?: string
  color: string
  label: string
  desc: string
}

const hobbies: Hobby[] = [
  { Icon: SiNetflix, color: '#E50914', label: 'Netflix', desc: 'Binge-watching series & movies' },
  { logo: '/mlbb-m.png', color: '#e4c482', label: 'Mobile Legends', desc: 'Ranked with friends' },
  { Icon: HiSparkles, color: '#06b6d4', label: 'Exploring AI', desc: 'Tinkering with new AI tools & workflows' },
]

const languages = [
  { flag: '🇮🇩', name: 'Indonesian', level: 'Native', dots: 5 },
  { flag: '🇬🇧', name: 'English', level: 'Intermediate', dots: 3 },
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
  const [swapped, setSwapped] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchShow = () => { if (hideTimer.current) clearTimeout(hideTimer.current); setSwapped(true) }
  const touchHide = () => { hideTimer.current = setTimeout(() => setSwapped(false), 1600) }

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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Left: Photo + Hobbies */}
        <div className="space-y-6">
          <div className="about-item opacity-0 flex justify-center lg:justify-start">
            <div
              className="group relative w-72 sm:w-80 aspect-[3/4]"
              onTouchStart={touchShow}
              onTouchEnd={touchHide}
              onTouchCancel={touchHide}
            >
              <div className="absolute inset-0 rounded-2xl border border-[#06b6d4]/20 bg-[#161616] overflow-hidden">
                {/* Foto default (lihat samping) */}
                <Image
                  src="/about-default.png"
                  alt="Alif Ardezir Zidane"
                  fill
                  className={`object-cover transition-opacity duration-500 ease-out group-hover:opacity-0 ${swapped ? 'opacity-0' : 'opacity-100'}`}
                />
                {/* Foto kedua (lihat kamera) — hover (desktop) / tap (mobile) */}
                <Image
                  src="/about-hover.png"
                  alt="Alif Ardezir Zidane"
                  fill
                  className={`object-cover transition-opacity duration-500 ease-out group-hover:opacity-100 ${swapped ? 'opacity-100' : 'opacity-0'}`}
                />
                {/* gradient bawah biar nyatu dengan tema gelap */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0f0f0f]/60 to-transparent pointer-events-none" />
                {/* hint kecil */}
                <span className={`absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] text-gray-400/70 transition-opacity duration-300 whitespace-nowrap group-hover:opacity-0 ${swapped ? 'opacity-0' : 'opacity-100'}`}>
                  ✦ tap me
                </span>
              </div>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-2 border-r-2 border-[#06b6d4]/40 rounded-br-2xl pointer-events-none" />
              <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-[#06b6d4]/20 rounded-tl-2xl pointer-events-none" />
            </div>
          </div>

          {/* Hobbies */}
          <div className="about-item opacity-0">
            <p className="font-mono text-[9px] text-gray-600 tracking-[0.3em] uppercase mb-3">
              When I&apos;m not coding
            </p>
            <div className="space-y-2.5">
              {hobbies.map((h) => (
                <div
                  key={h.label}
                  className="flex items-center gap-3 p-3 bg-[#161616] border border-[#1e1e1e] rounded-xl hover:border-[#06b6d4]/20 active:border-[#06b6d4]/40 transition-colors group"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-transform group-hover:scale-110 group-active:scale-110"
                    style={{ backgroundColor: `${h.color}18`, border: `1px solid ${h.color}30` }}
                  >
                    {h.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={h.logo} alt={h.label} className="w-7 h-7 object-contain" />
                    ) : h.Icon ? (
                      <h.Icon size={16} style={{ color: h.color }} />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-200 font-medium">{h.label}</p>
                    <p className="text-xs text-gray-600 font-mono">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="about-item opacity-0">
            <p className="font-mono text-[9px] text-gray-600 tracking-[0.3em] uppercase mb-3">
              Languages
            </p>
            <div className="space-y-2.5">
              {languages.map((l) => (
                <div
                  key={l.name}
                  className="flex items-center gap-3 p-3 bg-[#161616] border border-[#1e1e1e] rounded-xl"
                >
                  <span className="text-lg flex-shrink-0">{l.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 font-medium">{l.name}</p>
                    <p className="text-xs text-gray-600 font-mono">{l.level}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: d <= l.dots ? '#06b6d4' : '#2a2a2a' }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
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

          {/* Founder card — Digital bNb */}
          <a
            href="http://digitalbnb.my.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="about-item opacity-0 group block rounded-xl border border-[#06b6d4]/25 p-5 transition-all duration-300 hover:border-[#06b6d4]/50"
            style={{ background: 'radial-gradient(circle at 15% 0%, #06b6d418 0%, #161616 55%)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[9px] text-[#06b6d4] tracking-[0.3em] uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rotate-45 bg-[#06b6d4]" /> Founder
              </span>
              <span className="text-[10px] font-mono text-gray-500 group-hover:text-[#06b6d4] transition-colors flex items-center gap-1">
                visit <span className="group-hover:translate-x-0.5 transition-transform inline-block">↗</span>
              </span>
            </div>
            <h3 className="text-white font-bold text-lg leading-none">
              Digital <span className="text-[#06b6d4]">bNb</span>
            </h3>
            <p className="text-gray-500 text-xs font-mono mt-1.5">Build &amp; Boost Your Business</p>
            <p className="text-gray-500 text-sm leading-relaxed mt-3">
              A digital agency I founded — turning ideas into web apps, mobile apps, POS systems &amp; digital invitations.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#1e1e1e]">
              {['Websites', 'Mobile Apps', 'POS', 'Invitations'].map((s) => (
                <span key={s} className="px-2 py-0.5 text-[10px] font-mono text-gray-400 bg-[#0f0f0f] border border-[#2a2a2a] rounded group-hover:border-[#06b6d4]/20 transition-colors">
                  {s}
                </span>
              ))}
            </div>
          </a>

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

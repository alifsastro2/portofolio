'use client'
import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'
import Image from 'next/image'

type Cert = { slug: string; title: string; issuer: string; year: string }

const certs: Cert[] = [
  { slug: 'business-intelligence', title: 'Creating Business Intelligence',      issuer: 'Universitas Gunadarma', year: 'Jun 2025' },
  { slug: 'data-analytics',        title: 'Data Analytics',                      issuer: 'RevoU',                 year: 'Mar 2025' },
  { slug: 'oracle-intermediate',   title: 'Oracle for Intermediate',            issuer: 'Universitas Gunadarma', year: 'Aug 2024' },
  { slug: 'data-prep',             title: 'Data Preparation for Business Processes', issuer: 'Universitas Gunadarma', year: 'Sep 2024' },
  { slug: 'html5',                 title: 'Building Website using HTML5',         issuer: 'Universitas Gunadarma', year: 'May 2023' },
  { slug: 'java',                  title: 'Java Programming (J2SE)',             issuer: 'Universitas Gunadarma', year: 'Feb 2023' },
  { slug: 'oracle-beginner',       title: 'Oracle for Beginner',                issuer: 'Universitas Gunadarma', year: 'Feb 2023' },
  { slug: 'dbms',                  title: 'Fundamental DBMS',                    issuer: 'Universitas Gunadarma', year: 'Aug 2022' },
  { slug: 'erp',                   title: 'Fundamental ERP',                    issuer: 'Universitas Gunadarma', year: 'Feb 2022' },
]

export default function Certificates() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const animatedRef = useRef(false)
  const [active, setActive] = useState<Cert | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          animate('.cert-header', { opacity: [0, 1], translateY: [30, 0], duration: 800, easing: 'easeOutExpo' })
          animate('.cert-card', {
            opacity: [0, 1], translateY: [30, 0],
            delay: stagger(80, { start: 150 }), duration: 700, easing: 'easeOutExpo',
          })
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // tutup lightbox dengan ESC
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  const scroll = (dir: number) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <section id="certificates" ref={sectionRef} className="py-28 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="cert-header opacity-0 mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[#06b6d4] text-xs tracking-[0.3em] uppercase mb-3">Credentials</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Certificates <span className="text-[#06b6d4]">&amp; Training</span>
            </h2>
            <p className="text-gray-600 text-sm font-mono mt-2">{certs.length} verified certificates · tap to view</p>
          </div>
          {/* arrows (desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => scroll(-1)} aria-label="Previous"
              className="w-9 h-9 rounded-lg border border-[#1e1e1e] text-gray-500 hover:text-[#06b6d4] hover:border-[#06b6d4]/30 transition-colors">‹</button>
            <button onClick={() => scroll(1)} aria-label="Next"
              className="w-9 h-9 rounded-lg border border-[#1e1e1e] text-gray-500 hover:text-[#06b6d4] hover:border-[#06b6d4]/30 transition-colors">›</button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollerRef}
          className="cert-scroll flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
        >
          {certs.map((cert) => (
            <button
              key={cert.slug}
              onClick={() => setActive(cert)}
              className="cert-card opacity-0 group flex-shrink-0 w-[220px] snap-start text-left bg-[#161616] border border-[#1e1e1e] rounded-xl overflow-hidden hover:border-[#06b6d4]/30 transition-all duration-300 hover:shadow-[0_0_30px_#06b6d410]"
            >
              <div className="relative w-full aspect-[3/4] bg-[#0f0f0f] overflow-hidden flex items-center justify-center p-2">
                <Image
                  src={`/certificates/${cert.slug}.png`}
                  alt={cert.title}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="220px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#06b6d4] text-black text-[10px] font-mono font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  View Certificate
                </span>
              </div>
              <div className="p-3.5">
                <p className="text-white text-sm font-semibold leading-snug line-clamp-2">{cert.title}</p>
                <p className="text-gray-600 text-[11px] font-mono mt-1.5">{cert.issuer} · {cert.year}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overlay-in"
          onClick={() => setActive(null)}
        >
          <div className="relative max-w-3xl w-full max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-semibold text-sm">{active.title}</p>
                <p className="text-gray-500 text-xs font-mono">{active.issuer} · {active.year}</p>
              </div>
              <button onClick={() => setActive(null)} aria-label="Close"
                className="w-8 h-8 rounded-lg border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#3a3a3a] transition-colors flex items-center justify-center flex-shrink-0">✕</button>
            </div>

            <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-[#1e1e1e] bg-[#161616]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/certificates/${active.slug}.png`} alt={active.title} className="w-full h-auto" />
            </div>

            <a
              href={`/certificates/${active.slug}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 self-center px-5 py-2 bg-[#06b6d4] text-black text-sm font-semibold rounded-lg hover:bg-[#22d3ee] transition-colors"
            >
              Open original PDF ↗
            </a>
          </div>
        </div>
      )}
    </section>
  )
}

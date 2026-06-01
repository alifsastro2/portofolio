'use client'
import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { contactIconMap } from '@/lib/icons'
import type { ContactLink } from '@/lib/supabase/types'

const brandColors: Record<string, string> = {
  'Email':    '#EA4335',
  'LinkedIn': '#0A66C2',
  'GitHub':   '#ffffff',
  'WhatsApp': '#25D366',
  'Gmail':    '#EA4335',
}

const defaultLinks = [
  { id: '1', label: 'Email',    value: 'alif.sastro2@gmail.com',     href: 'mailto:alif.sastro2@gmail.com',                                         icon: null, display_order: 0 },
  { id: '2', label: 'LinkedIn', value: 'alif-ardezir-zidane',        href: 'https://www.linkedin.com/in/alif-ardezir-zidane-5a1b062b8',          icon: null, display_order: 1 },
  { id: '3', label: 'GitHub',   value: 'alifsastro2',                href: 'https://github.com/alifsastro2',                                     icon: null, display_order: 2 },
  { id: '4', label: 'WhatsApp', value: '0813-8761-4254',             href: 'https://wa.me/6281387614254',                                        icon: null, display_order: 3 },
] as ContactLink[]

export default function Contact({ links: data }: { links?: ContactLink[] }) {
  const contactLinks = (data && data.length > 0) ? data : defaultLinks
  const sectionRef = useRef<HTMLElement>(null)
  const animatedRef = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          animate('.contact-item', {
            opacity: [0, 1],
            translateY: [30, 0],
            delay: stagger(100),
            duration: 800,
            easing: 'easeOutExpo',
          })
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-28 px-6 relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_100%,_#06b6d410,_transparent)]" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <p className="contact-item opacity-0 font-mono text-[#06b6d4] text-xs tracking-[0.3em] uppercase mb-3">
          Get In Touch
        </p>
        <h2 className="contact-item opacity-0 text-3xl lg:text-5xl font-bold text-white mb-6">
          Let&apos;s work{' '}
          <span className="text-[#06b6d4]">together</span>
        </h2>
        <p className="contact-item opacity-0 text-gray-500 text-sm leading-relaxed mb-12 max-w-lg mx-auto">
          I&apos;m currently open to freelance projects, collaborations, and full-time
          opportunities. Got something in mind? Let&apos;s talk.
        </p>

        <div className="contact-item opacity-0 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {contactLinks.map((link) => {
            const Icon = contactIconMap[link.label]
            return (
              <a
                key={link.label}
                href={link.href ?? '#'}
                target={link.href?.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-[#161616] border border-[#1e1e1e] rounded-xl hover:border-[#06b6d4]/30 hover:bg-[#06b6d4]/5 transition-all duration-200 group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: `${brandColors[link.label] ?? '#06b6d4'}18`, border: `1px solid ${brandColors[link.label] ?? '#06b6d4'}30` }}
                >
                  {Icon && <Icon size={20} style={{ color: brandColors[link.label] ?? '#06b6d4' }} />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-mono text-gray-600 mb-0.5">{link.label}</p>
                  <p className="text-sm text-gray-300 truncate group-hover:text-[#06b6d4] transition-colors">
                    {link.value}
                  </p>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

'use client'
import { useState, useEffect } from 'react'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-[#1e1e1e]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#home"
          className="font-mono font-bold text-lg tracking-wide group"
        >
          <span className="text-[#06b6d4]">AAZ</span>
          <span className="text-white">.</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm font-mono text-gray-500 hover:text-[#06b6d4] transition-colors duration-200"
            >
              {label}
            </a>
          ))}
          <a
            href="/cv.pdf"
            download="Alif Ardezir Zidane - CV.pdf"
            className="px-4 py-1.5 text-sm font-mono border border-[#06b6d4]/40 text-[#06b6d4] rounded hover:bg-[#06b6d4]/10 hover:border-[#06b6d4] transition-all duration-200"
          >
            Download CV ↓
          </a>
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-gray-400 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-400 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-400 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-96 border-b border-[#1e1e1e]' : 'max-h-0'
        } bg-[#0f0f0f]/95 backdrop-blur-xl`}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="py-2 text-sm font-mono text-gray-500 hover:text-[#06b6d4] transition-colors"
            >
              {label}
            </a>
          ))}
          <a
            href="/cv.pdf"
            download="Alif Ardezir Zidane - CV.pdf"
            onClick={() => setMenuOpen(false)}
            className="mt-2 py-2 text-center text-sm font-mono border border-[#06b6d4]/40 text-[#06b6d4] rounded hover:bg-[#06b6d4]/10 hover:border-[#06b6d4] transition-all"
          >
            Download CV ↓
          </a>
        </div>
      </div>
    </nav>
  )
}

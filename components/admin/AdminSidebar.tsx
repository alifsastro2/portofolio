'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '▦' },
  { label: 'Projects', href: '/admin/projects', icon: '◈' },
  { label: 'Skills', href: '/admin/skills', icon: '◉' },
  { label: 'Certificates', href: '/admin/certificates', icon: '❖' },
  { label: 'About', href: '/admin/about', icon: '◐' },
  { label: 'Contact', href: '/admin/contact', icon: '◌' },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1e1e1e]">
        <Link href="/" className="font-mono font-bold text-base">
          <span className="text-[#06b6d4]">AAZ</span>
          <span className="text-white">.</span>
          <span className="text-gray-600 text-xs ml-2">admin</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, href, icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all duration-150 ${
              isActive(href)
                ? 'bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20'
                : 'text-gray-500 hover:text-gray-300 hover:bg-[#1e1e1e]'
            }`}
          >
            <span className="text-base">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#1e1e1e]">
        <div className="px-3 py-2 mb-2">
          <p className="text-[10px] font-mono text-gray-700 truncate">{userEmail}</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="w-full text-left px-3 py-2 text-xs font-mono text-gray-600 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors"
          >
            Sign Out →
          </button>
        </form>
        <Link
          href="/"
          target="_blank"
          className="block mt-1 px-3 py-2 text-xs font-mono text-gray-600 hover:text-[#06b6d4] rounded-lg transition-colors"
        >
          View Portfolio ↗
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-[#161616] border-r border-[#1e1e1e] flex-col z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-[#161616] border-b border-[#1e1e1e] px-4 h-14 flex items-center justify-between">
        <Link href="/admin" className="font-mono font-bold text-sm">
          <span className="text-[#06b6d4]">AAZ</span>
          <span className="text-white">.</span>
          <span className="text-gray-600 text-xs ml-1">admin</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-400 p-1">
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-14">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-60 h-full bg-[#161616] border-r border-[#1e1e1e]">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}

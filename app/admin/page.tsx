import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: projectCount },
    { count: skillCount },
    { count: certCount },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('skills').select('*', { count: 'exact', head: true }),
    supabase.from('certificates').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Projects', count: projectCount ?? 0, href: '/admin/projects', icon: '◈' },
    { label: 'Skills', count: skillCount ?? 0, href: '/admin/skills', icon: '◉' },
    { label: 'Certificates', count: certCount ?? 0, href: '/admin/certificates', icon: '❖' },
  ]

  return (
    <div className="pt-14 md:pt-0 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-600 text-sm font-mono mt-1">Manage your portfolio content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group p-5 bg-[#161616] border border-[#1e1e1e] rounded-xl hover:border-[#06b6d4]/30 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl text-gray-600">{s.icon}</span>
              <span className="text-3xl font-bold text-white">{s.count}</span>
            </div>
            <p className="text-sm font-mono text-gray-500 group-hover:text-[#06b6d4] transition-colors">
              {s.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: 'Edit About', href: '/admin/about', desc: 'Update bio, location, availability' },
          { label: 'Edit Contact', href: '/admin/contact', desc: 'Update contact links' },
          { label: 'Add Project', href: '/admin/projects', desc: 'Add a new project to portfolio' },
          { label: 'Add Certificate', href: '/admin/certificates', desc: 'Upload a new certificate' },
        ].map((q) => (
          <Link
            key={q.label}
            href={q.href}
            className="flex items-center gap-4 p-4 bg-[#161616] border border-[#1e1e1e] rounded-xl hover:border-[#06b6d4]/20 transition-all group"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white group-hover:text-[#06b6d4] transition-colors">
                {q.label} →
              </p>
              <p className="text-xs text-gray-600 font-mono mt-0.5">{q.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

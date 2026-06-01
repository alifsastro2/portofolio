'use client'
import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'
import { projects as staticProjects } from '@/lib/data'
import type { Project } from '@/lib/supabase/types'
import { skillIconMap } from '@/lib/icons'
import { SiGithub } from 'react-icons/si'
import { FiExternalLink } from 'react-icons/fi'

const typeColors: Record<string, string> = {
  'Web App':    'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'SaaS':       'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'Mobile App': 'text-[#06b6d4] bg-[#06b6d4]/10 border-[#06b6d4]/20',
}

export default function Projects({ projects: data }: { projects?: Project[] }) {
  const projects = (data && data.length > 0 ? data : staticProjects) as Project[]
  const sectionRef = useRef<HTMLElement>(null)
  const animatedRef = useRef(false)
  const [active, setActive] = useState<number | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          animate('.project-header', { opacity: [0, 1], translateY: [30, 0], duration: 800, easing: 'easeOutExpo' })
          animate('.project-row', {
            opacity: [0, 1], translateY: [20, 0],
            delay: stagger(70, { start: 150 }), duration: 600, easing: 'easeOutExpo',
          })
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const preview = active !== null ? projects[active] : null
  const liveProjects = projects.filter((p) => p.live)

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-28 px-6"
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="project-header opacity-0 mb-12">
          <p className="font-mono text-[#06b6d4] text-xs tracking-[0.3em] uppercase mb-3">Work</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Selected <span className="text-[#06b6d4]">Projects</span>
          </h2>
          <p className="text-gray-600 text-sm font-mono mt-2 hidden lg:block">Hover a project to preview · click to open</p>
        </div>

        {/* Interactive list */}
        <div className="border-b border-[#1e1e1e]" onMouseLeave={() => setActive(null)}>
          {projects.map((project, i) => {
            const href = project.github || project.live || '#'
            return (
              <a
                key={project.title}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                onMouseEnter={() => setActive(i)}
                className="project-row opacity-0 group flex items-center justify-between gap-4 py-6 border-t border-[#1e1e1e] transition-all duration-300 hover:px-3"
              >
                {/* Left: index + title */}
                <div className="flex items-baseline gap-4 min-w-0">
                  <span className="font-mono text-xs text-gray-700 group-hover:text-[#06b6d4] transition-colors flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xl lg:text-3xl font-bold text-gray-300 group-hover:text-[#06b6d4] transition-colors truncate">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Right: tags (desktop) + type + arrow */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="hidden xl:flex items-center gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => {
                      const Icon = skillIconMap[tag]
                      return (
                        <span key={tag} className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-gray-500 bg-[#161616] border border-[#1e1e1e] rounded">
                          {Icon && <Icon size={9} />}
                          {tag}
                        </span>
                      )
                    })}
                  </div>
                  <span className={`hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded border ${typeColors[project.type ?? ''] ?? 'text-gray-400 bg-gray-400/10 border-gray-400/20'}`}>
                    {project.type}
                  </span>
                  <span className="text-gray-600 group-hover:text-[#06b6d4] group-hover:translate-x-1 transition-all text-xl">↗</span>
                </div>
              </a>
            )
          })}
        </div>

        {/* Live websites */}
        {liveProjects.length > 0 && (
          <div className="project-header opacity-0 mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="font-mono text-xs text-gray-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Websites
            </span>
            <div className="flex flex-wrap gap-3">
              {liveProjects.map((p) => (
                <a
                  key={p.title}
                  href={p.live as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2 bg-[#161616] border border-[#1e1e1e] rounded-lg hover:border-[#06b6d4]/40 hover:bg-[#06b6d4]/5 transition-all"
                >
                  <FiExternalLink size={13} className="text-[#06b6d4]" />
                  <span className="text-sm text-gray-300 group-hover:text-[#06b6d4] transition-colors">{p.title}</span>
                  <span className="text-[10px] font-mono text-gray-600 hidden sm:inline">
                    {(p.live as string).replace(/^https?:\/\//, '')}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating preview (desktop) — deskripsi saja, mengikuti kursor */}
      {preview && (
        <div
          className="hidden lg:block fixed z-50 pointer-events-none"
          style={{ left: pos.x, top: pos.y, transform: 'translate(24px, -50%)' }}
        >
          <div className="w-72 rounded-xl border border-[#06b6d4]/30 bg-[#161616] shadow-2xl shadow-[#06b6d4]/10 p-4"
            style={{ background: 'radial-gradient(circle at 30% 15%, #06b6d415 0%, #161616 60%)' }}
          >
            <p className="text-gray-300 text-sm leading-relaxed">{preview.description}</p>
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#1e1e1e] text-[10px] font-mono text-[#06b6d4]">
              <SiGithub size={11} /> View on GitHub →
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

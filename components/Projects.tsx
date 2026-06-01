'use client'
import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'
import { projects as staticProjects } from '@/lib/data'
import type { Project } from '@/lib/supabase/types'
import { skillIconMap } from '@/lib/icons'
import { SiGithub } from 'react-icons/si'
import { FiExternalLink, FiChevronDown } from 'react-icons/fi'

const typeColors: Record<string, string> = {
  'Web App':    'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'SaaS':       'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'Mobile App': 'text-[#06b6d4] bg-[#06b6d4]/10 border-[#06b6d4]/20',
}

export default function Projects({ projects: data }: { projects?: Project[] }) {
  const projects = (data && data.length > 0 ? data : staticProjects) as Project[]
  const sectionRef = useRef<HTMLElement>(null)
  const animatedRef = useRef(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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

  const liveProjects = projects.filter((p) => p.live)

  return (
    <section id="projects" ref={sectionRef} className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="project-header opacity-0 mb-12">
          <p className="font-mono text-[#06b6d4] text-xs tracking-[0.3em] uppercase mb-3">Work</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Selected <span className="text-[#06b6d4]">Projects</span>
          </h2>
          <p className="text-gray-600 text-sm font-mono mt-2">Hover or tap a project to see details</p>
        </div>

        {/* Accordion list */}
        <div className="border-b border-[#1e1e1e]">
          {projects.map((project, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={project.title}
                className="project-row opacity-0 border-t border-[#1e1e1e]"
                onMouseEnter={() => setOpenIndex(i)}
                onMouseLeave={() => setOpenIndex(null)}
              >
                {/* Row header — toggle */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full group flex items-center justify-between gap-4 py-6 text-left"
                >
                  <div className="flex items-baseline gap-4 min-w-0">
                    <span className={`font-mono text-xs flex-shrink-0 transition-colors ${isOpen ? 'text-[#06b6d4]' : 'text-gray-700'} group-hover:text-[#06b6d4]`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className={`text-xl lg:text-3xl font-bold transition-colors truncate ${isOpen ? 'text-[#06b6d4]' : 'text-gray-300'} group-hover:text-[#06b6d4]`}>
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    <span className={`hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded border ${typeColors[project.type ?? ''] ?? 'text-gray-400 bg-gray-400/10 border-gray-400/20'}`}>
                      {project.type}
                    </span>
                    <FiChevronDown
                      size={20}
                      className={`transition-all duration-300 ${isOpen ? 'rotate-180 text-[#06b6d4]' : 'text-gray-600'} group-hover:text-[#06b6d4]`}
                    />
                  </div>
                </button>

                {/* Dropdown — deskripsi + tags + links */}
                <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="pb-7 pl-8 pr-2 max-w-2xl">
                      <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.tags.map((tag) => {
                          const Icon = skillIconMap[tag]
                          return (
                            <span key={tag} className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-gray-500 bg-[#161616] border border-[#1e1e1e] rounded">
                              {Icon && <Icon size={9} />}
                              {tag}
                            </span>
                          )
                        })}
                      </div>

                      <div className="flex items-center gap-3 mt-5">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-gray-300 bg-[#161616] border border-[#1e1e1e] rounded-lg hover:border-[#06b6d4]/40 hover:text-[#06b6d4] transition-all"
                          >
                            <SiGithub size={13} /> GitHub
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-black bg-[#06b6d4] rounded-lg hover:bg-[#22d3ee] transition-all"
                          >
                            <FiExternalLink size={13} /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
    </section>
  )
}

'use client'
import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          animate('.project-header', {
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: 'easeOutExpo',
          })
          animate('.project-card', {
            opacity: [0, 1],
            translateY: [40, 0],
            delay: stagger(100, { start: 200 }),
            duration: 700,
            easing: 'easeOutExpo',
          })
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-28 px-6 bg-[#0a0a0a]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="project-header opacity-0 mb-14">
          <p className="font-mono text-[#06b6d4] text-xs tracking-[0.3em] uppercase mb-3">
            Work
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Selected <span className="text-[#06b6d4]">Projects</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className="project-card opacity-0 group relative flex flex-col bg-[#161616] border border-[#1e1e1e] rounded-xl overflow-hidden hover:border-[#06b6d4]/30 transition-all duration-300 hover:shadow-[0_0_30px_#06b6d410]"
            >
              {/* Image area */}
              <div className="relative h-44 bg-[#0f0f0f] border-b border-[#1e1e1e] flex items-center justify-center overflow-hidden">
                {project.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-800">
                    <div className="w-12 h-12 rounded-xl border border-[#1e1e1e] flex items-center justify-center">
                      <span className="text-xl">{project.type === 'Mobile App' ? '📱' : '🌐'}</span>
                    </div>
                    <span className="font-mono text-xs">[ screenshot coming soon ]</span>
                  </div>
                )}
                {/* Type badge */}
                <span
                  className={`absolute top-3 left-3 px-2 py-0.5 text-[10px] font-mono rounded border ${typeColors[project.type ?? ''] ?? 'text-gray-400 bg-gray-400/10 border-gray-400/20'}`}
                >
                  {project.type}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-4">
                <div>
                  <h3 className="text-white font-semibold text-base mb-2 group-hover:text-[#06b6d4] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag) => {
                    const Icon = skillIconMap[tag]
                    return (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-gray-500 bg-[#1e1e1e] rounded"
                      >
                        {Icon && <Icon size={9} className="text-gray-600 flex-shrink-0" />}
                        {tag}
                      </span>
                    )
                  })}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4 pt-2 border-t border-[#1e1e1e]">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-[#06b6d4] transition-colors"
                    >
                      <SiGithub size={13} />
                      GitHub
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-[#06b6d4] transition-colors"
                    >
                      <FiExternalLink size={13} />
                      Live Demo
                    </a>
                  )}
                  {!project.github && !project.live && (
                    <span className="text-xs font-mono text-gray-700">Private</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

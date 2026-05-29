'use client'
import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { skillCategories as staticSkillCategories } from '@/lib/data'
import type { SkillCategoryWithItems } from '@/lib/supabase/queries'
import { skillIconMap, categoryIconMap } from '@/lib/icons'

export default function Skills({ skillCategories: data }: { skillCategories?: SkillCategoryWithItems[] }) {
  const skillCategories = (data && data.length > 0) ? data : staticSkillCategories
  const sectionRef = useRef<HTMLElement>(null)
  const animatedRef = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          animate('.skills-header', {
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: 'easeOutExpo',
          })
          animate('.skill-category', {
            opacity: [0, 1],
            translateY: [25, 0],
            delay: stagger(80, { start: 150 }),
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
    <section id="skills" ref={sectionRef} className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="skills-header opacity-0 mb-14">
          <p className="font-mono text-[#06b6d4] text-xs tracking-[0.3em] uppercase mb-3">
            Expertise
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Skills &amp; <span className="text-[#06b6d4]">Tools</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {skillCategories.map((cat) => {
            const CatIcon = categoryIconMap[cat.name]
            return (
              <div
                key={cat.name}
                className="skill-category opacity-0 p-5 bg-[#161616] border border-[#1e1e1e] rounded-xl hover:border-[#06b6d4]/20 transition-colors duration-300"
              >
                {/* Category header */}
                <div className="flex items-center gap-2 mb-4">
                  {CatIcon && (
                    <div className="w-6 h-6 flex items-center justify-center text-[#06b6d4]/60">
                      <CatIcon size={14} />
                    </div>
                  )}
                  <h3 className="font-mono text-[#06b6d4] text-xs tracking-widest uppercase">
                    {cat.name}
                  </h3>
                </div>

                {/* Skill badges */}
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => {
                    const Icon = skillIconMap[item]
                    return (
                      <span
                        key={item}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-gray-400 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg hover:border-[#06b6d4]/30 hover:text-[#06b6d4] transition-all duration-200 cursor-default group"
                      >
                        {Icon && (
                          <Icon
                            size={12}
                            className="text-gray-600 group-hover:text-[#06b6d4] transition-colors flex-shrink-0"
                          />
                        )}
                        {item}
                      </span>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

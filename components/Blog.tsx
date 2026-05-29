'use client'
import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import type { BlogPost } from '@/lib/supabase/types'

const placeholderPosts = [
  {
    id: 'p1', title: 'Building a SaaS Invitation Platform with Next.js & Supabase',
    summary: 'How I architected a multi-client digital invitation system with per-event data isolation, admin panels, and Xendit payment integration.',
    tag: 'Next.js', created_at: '',
  },
  {
    id: 'p2', title: 'AI-Assisted Development: My Workflow with Claude Code',
    summary: 'How I use Claude Code to accelerate Flutter and Next.js development — from debugging to full feature generation — without losing code quality.',
    tag: 'AI & Dev', created_at: '',
  },
  {
    id: 'p3', title: 'Revenue Sharing Automation in a Flutter App',
    summary: "The logic behind TSAS's automated instructor revenue distribution — multi-role access, period filters, and dynamic PDF reporting.",
    tag: 'Flutter', created_at: '',
  },
]

function formatDate(iso: string) {
  if (!iso) return 'Coming Soon'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Blog({ posts }: { posts?: BlogPost[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const animatedRef = useRef(false)
  const hasPosts = posts && posts.length > 0

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          animate('.blog-header', { opacity: [0, 1], translateY: [30, 0], duration: 800, easing: 'easeOutExpo' })
          animate('.blog-card', { opacity: [0, 1], translateY: [30, 0], delay: stagger(100, { start: 150 }), duration: 700, easing: 'easeOutExpo' })
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const displayPosts = hasPosts ? posts : placeholderPosts

  return (
    <section id="blog" ref={sectionRef} className="py-28 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="blog-header opacity-0 mb-14 flex items-end justify-between">
          <div>
            <p className="font-mono text-[#06b6d4] text-xs tracking-[0.3em] uppercase mb-3">Notes</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Blog &amp; <span className="text-[#06b6d4]">Thoughts</span>
            </h2>
          </div>
          {!hasPosts && (
            <span className="hidden md:block font-mono text-xs text-gray-700 border border-[#1e1e1e] px-3 py-1.5 rounded">
              Posts dropping soon
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayPosts.map((post) => (
            <div
              key={post.id}
              className="blog-card opacity-0 group p-6 bg-[#161616] border border-[#1e1e1e] rounded-xl hover:border-[#06b6d4]/20 transition-all duration-300 flex flex-col gap-4 cursor-default"
            >
              <div className="flex items-center justify-between">
                {post.tag && (
                  <span className="px-2 py-0.5 text-[10px] font-mono text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/20 rounded">
                    {post.tag}
                  </span>
                )}
                <span className="font-mono text-[10px] text-gray-700 ml-auto">
                  {formatDate(post.created_at)}
                </span>
              </div>
              <h3 className="text-white text-sm font-semibold leading-snug group-hover:text-[#06b6d4] transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 text-xs leading-relaxed flex-1">{post.summary}</p>
              <div className="flex items-center gap-1.5 text-[#06b6d4]/40 text-xs font-mono">
                <span>Read more</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

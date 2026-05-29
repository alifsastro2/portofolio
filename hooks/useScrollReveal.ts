'use client'
import { useEffect, useRef } from 'react'
import { animate } from 'animejs'

export function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(el, {
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 700,
            delay,
            easing: 'easeOutExpo',
          })
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return ref
}

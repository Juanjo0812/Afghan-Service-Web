'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
  threshold?: number
  duration?: number
}

export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.1,
  duration = 800,
}: FadeInProps) {
  // Progressive enhancement: content must be readable even if mobile Safari
  // fails hydration/IntersectionObserver. Animations are decoration, not layout.
  const [isVisible, setIsVisible] = useState(true)
  const [canAnimate, setCanAnimate] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (
      prefersReducedMotion ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return
    }

    const rect = node.getBoundingClientRect()
    const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0

    if (alreadyInView) {
      return
    }

    const animationFrame = requestAnimationFrame(() => {
      setCanAnimate(true)
      setIsVisible(false)
    })

    // Safety timeout: force visibility if IO never fires.
    // Handles old Android WebViews, slow JS init, or IO edge cases.
    const fallbackTimer = setTimeout(() => setIsVisible(true), 2000)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(node)
            clearTimeout(fallbackTimer)
          }
        }
      },
      { threshold, rootMargin: '0px 0px 80px 0px' }
    )

    observer.observe(node)
    return () => {
      cancelAnimationFrame(animationFrame)
      observer.unobserve(node)
      clearTimeout(fallbackTimer)
    }
  }, [threshold])

  return (
    <div
      ref={ref}
      className={`${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible || !canAnimate
          ? 'translateY(0) translateX(0)'
          : `translateY(${direction === 'down' ? '-6px' : direction === 'up' ? '6px' : '0px'}) translateX(${direction === 'right' ? '-6px' : direction === 'left' ? '6px' : '0px'})`,
        transition: canAnimate
          ? `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`
          : 'none',
        willChange: canAnimate && !isVisible ? 'opacity, transform' : 'auto',
      }}
    >
      {children}
    </div>
  )
}

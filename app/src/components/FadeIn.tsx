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
  // Start invisible — the IO callback handles reveal.
  // Elements already in viewport trigger IO immediately, so the
  // opacity 0→1 transition is imperceptible on first paint.
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (
      prefersReducedMotion ||
      typeof IntersectionObserver === 'undefined'
    ) {
      // Show content immediately without animation
      const immediateTimer = setTimeout(() => setIsVisible(true), 0)
      return () => clearTimeout(immediateTimer)
    }

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

    let observerStarted = false
    // Defer observation to the next event loop tick. This ensures
    // that ScrollToTop (running in useLayoutEffect at the layout level)
    // has already reset the window scroll to 0, preventing elements
    // at the bottom of the new page from animating prematurely.
    const deferTimer = setTimeout(() => {
      observer.observe(node)
      observerStarted = true
    }, 0)

    return () => {
      clearTimeout(deferTimer)
      if (observerStarted) {
        observer.unobserve(node)
      }
      clearTimeout(fallbackTimer)
    }
  }, [threshold])

  return (
    <div
      ref={ref}
      className={`${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'translateY(0) translateX(0)'
          : `translateY(${direction === 'down' ? '-6px' : direction === 'up' ? '6px' : '0px'}) translateX(${direction === 'right' ? '-6px' : direction === 'left' ? '6px' : '0px'})`,
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollReveal<T extends HTMLElement = HTMLElement>(options?: UseScrollRevealOptions) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', once = true } = options ?? {}

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, visible }
}

export function useScrollRevealRef<T extends HTMLElement = HTMLElement>(options?: UseScrollRevealOptions) {
  const [visible, setVisible] = useState(false)
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', once = true } = options ?? {}
  const ref = useRef<T | null>(null)

  const setRef = useCallback((el: T | null) => {
    ref.current = el
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref: setRef, visible }
}

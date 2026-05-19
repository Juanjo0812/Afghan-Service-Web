'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollToTop() {
  const pathname = usePathname() || '/'

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    try {
      window.history.scrollRestoration = 'manual'
    } catch {
      // Ignore errors in older browsers
    }

    // Step 1: Reset scroll immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    // Step 2: Reset scroll in the next animation frame to ensure the layout settles
    const frameId = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })

    return () => {
      cancelAnimationFrame(frameId)
      try {
        window.history.scrollRestoration = previousRestoration
      } catch {
        // Ignore
      }
    }
  }, [pathname])

  return null
}

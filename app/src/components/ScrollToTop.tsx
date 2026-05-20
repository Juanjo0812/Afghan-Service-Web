'use client'

import { useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollToTop() {
  const pathname = usePathname() || '/'

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    try {
      window.history.scrollRestoration = 'manual'
    } catch {
      // Ignore errors in older browsers
    }

    // Step 1: Reset scroll synchronously before paint
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    // Step 2: Backup reset in the next frame for mobile browsers
    // where the synchronous scroll may not stick
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

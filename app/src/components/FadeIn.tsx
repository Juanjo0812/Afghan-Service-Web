import type { CSSProperties, ReactNode } from 'react'

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
  duration = 800
}: FadeInProps) {
  const translateClasses = {
    up: 'translate-y-12',
    down: '-translate-y-12',
    left: 'translate-x-12',
    right: '-translate-x-12',
    none: 'translate-y-0 translate-x-0'
  }

  return (
    <div
      className={`opacity-100 motion-safe:animate-fade-in-up ${translateClasses[direction]} ${className}`}
      style={{
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      } as CSSProperties}
    >
      {children}
    </div>
  )
}

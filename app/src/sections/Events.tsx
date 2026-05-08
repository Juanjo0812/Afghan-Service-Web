import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useLanguage } from '../hooks/useLanguage'
import { getSlideDirection } from '../lib/animationDirection'
import { ArrowRight } from 'lucide-react'
import { loadData } from '../lib/dataLoader'

gsap.registerPlugin(ScrollTrigger)

interface EventItem {
  title: string
  month: string
  day: string
  details: string
}

export default function Events() {
  const { t } = useTranslation('events')
  const { lang, isRTL } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const [events, setEvents] = useState<EventItem[]>([])

  useEffect(() => {
    loadData<EventItem[]>(lang, 'events').then(setEvents)
  }, [lang])

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })

      const cards = listRef.current?.querySelectorAll('.event-card')
      if (cards) {
        gsap.to(cards, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 80%',
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="events"
      ref={sectionRef}
      style={{ background: '#faf5ef', padding: 'clamp(70px, 8vw, 100px) 0' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        {/* Heading */}
        <div
          ref={headingRef}
          style={{ opacity: 0, transform: 'translateY(30px)', marginBottom: 48 }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-accent)',
              display: 'block',
              marginBottom: 16,
            }}
          >
            {t('label')}
          </span>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: '#162d5a',
            }}
          >
            {t('heading')}
          </h2>
        </div>

        {/* Event list */}
        <div ref={listRef} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {events.map((event) => (
            <div
              key={event.title}
              className="event-card"
              style={{
                opacity: 0,
                transform: `translateX(${getSlideDirection(isRTL).enterFrom * 0.4}px)`,
                background: '#ffffff',
                border: '1px solid rgba(22, 45, 90, 0.06)',
                borderInlineStart: '1px solid rgba(22, 45, 90, 0.06)',
                padding: '28px 32px',
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                transition: 'transform 0.3s ease, border-inline-start-color 0.3s ease, border-inline-start-width 0.3s ease',
                cursor: 'pointer',
                flexWrap: 'wrap',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.transform = `translateX(${isRTL ? -4 : 4}px)`
                el.style.borderInlineStart = '3px solid var(--color-accent)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateX(0)'
                el.style.borderInlineStart = '1px solid rgba(22, 45, 90, 0.06)'
              }}
            >
              {/* Date box */}
              <div style={{ width: 80, textAlign: 'center', flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: 11,
                    textTransform: 'uppercase' as const,
                    color: 'var(--color-accent)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {event.month}
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    fontSize: 36,
                    color: '#162d5a',
                    lineHeight: 1.1,
                  }}
                >
                  {event.day}
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    color: '#162d5a',
                    marginBottom: 4,
                  }}
                >
                  {event.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: 14,
                    color: '#6b6b7b',
                  }}
                >
                  {event.details}
                </p>
              </div>

              {/* Arrow */}
              <ArrowRight size={20} color="var(--color-accent)" style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

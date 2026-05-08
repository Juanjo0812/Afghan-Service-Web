import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Globe, Home, Heart, BookOpen, Briefcase, Scale } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const serviceIcons = {
  immigration: Globe,
  housing: Home,
  healthcare: Heart,
  education: BookOpen,
  employment: Briefcase,
  legal: Scale,
} as const

const serviceKeys = ['immigration', 'housing', 'healthcare', 'education', 'employment', 'legal'] as const

export default function QuickAccess() {
  const { t } = useTranslation('services')
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      // Heading animation
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

      // Cards stagger animation
      const cards = cardsRef.current?.querySelectorAll('.service-card')
      if (cards) {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{ background: '#faf5ef', padding: 'clamp(70px, 8vw, 100px) 0' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        {/* Heading */}
        <div
          ref={headingRef}
          style={{ opacity: 0, transform: 'translateY(30px)', textAlign: 'center', marginBottom: 64 }}
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
            {t('sectionLabel')}
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

        {/* Cards grid */}
        <div
          ref={cardsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 32,
          }}
        >
          {serviceKeys.map((key) => {
            const Icon = serviceIcons[key]
            return (
              <div
                key={key}
                className="service-card"
                style={{
                  opacity: 0,
                  transform: 'translateY(40px)',
                  background: '#ffffff',
                  border: '1px solid rgba(22, 45, 90, 0.08)',
                  padding: '40px 32px',
                  textAlign: 'center',
                  transition: 'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(-4px)'
                  el.style.boxShadow = '0 12px 40px rgba(22, 45, 90, 0.06)'
                  el.style.borderColor = 'rgba(var(--color-accent-rgb), 0.2)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                  el.style.borderColor = 'rgba(22, 45, 90, 0.08)'
                }}
              >
                <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
                  <Icon size={48} strokeWidth={1.5} color="var(--color-accent)" />
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    color: '#162d5a',
                    marginBottom: 12,
                  }}
                >
                  {t(`cards.${key}.title`)}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: 15,
                    color: '#6b6b7b',
                    lineHeight: 1.6,
                    marginBottom: 16,
                  }}
                >
                  {t(`cards.${key}.description`)}
                </p>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: 13,
                    color: 'var(--color-accent)',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    borderBottom: '1px solid transparent',
                    transition: 'border-color 0.3s ease',
                    display: 'inline-block',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.borderBottomColor = 'var(--color-accent)'
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.borderBottomColor = 'transparent'
                  }}
                >
                  {t('learnMore')}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

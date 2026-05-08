import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useLanguage } from '../hooks/useLanguage'
import { getSlideDirection } from '../lib/animationDirection'

gsap.registerPlugin(ScrollTrigger)

export default function KnowYourRights() {
  const { t } = useTranslation('rights')
  const { isRTL } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        opacity: 1,
        x: 0,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })

      gsap.to(textRef.current, {
        opacity: 1,
        x: 0,
        duration: 1.0,
        ease: 'power3.out',
        delay: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="rights"
      ref={sectionRef}
      style={{ background: '#faf5ef', padding: 'clamp(70px, 8vw, 120px) 0' }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 64,
          alignItems: 'center',
        }}
      >
        {/* Left column — image */}
        <div
          ref={imageRef}
          style={{
            opacity: 0,
            transform: `translateX(${getSlideDirection(isRTL).enterFrom * 0.8}px)`,
            flex: '1 1 40%',
            minWidth: 280,
            order: 1,
          }}
          className="rights-image-col"
        >
          <img
            src="/images/img-rights.jpg"
            alt={t('imageAlt')}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              boxShadow: '0 8px 32px rgba(22, 45, 90, 0.08)',
            }}
          />
        </div>

        {/* Right column — text */}
        <div
          ref={textRef}
          style={{
            opacity: 0,
            transform: `translateX(${-getSlideDirection(isRTL).enterFrom * 0.8}px)`,
            flex: '1 1 50%',
            minWidth: 300,
            order: 2,
          }}
          className="rights-text-col"
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
              marginBottom: 24,
            }}
          >
            {t('heading')}
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 17,
              color: '#1a1a2e',
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            {t('description')}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px' }}>
            {(t('rights', { returnObjects: true }) as string[]).map((right, index) => (
              <li
                key={index}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: 16,
                  color: '#1a1a2e',
                  lineHeight: 1.7,
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <span style={{ color: 'var(--color-accent)', fontSize: 18, lineHeight: 1.4, flexShrink: 0 }}>•</span>
                {right}
              </li>
            ))}
          </ul>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: '0.03em',
              border: '1px solid #162d5a',
              background: 'transparent',
              color: '#162d5a',
              borderRadius: 32,
              padding: '12px 28px',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'background 0.4s ease, color 0.4s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.target as HTMLElement
              el.style.background = '#162d5a'
              el.style.color = '#faf5ef'
            }}
            onMouseLeave={(e) => {
              const el = e.target as HTMLElement
              el.style.background = 'transparent'
              el.style.color = '#162d5a'
            }}
          >
            {t('downloadButton')}
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .rights-image-col { order: 2 !important; }
          .rights-text-col { order: 1 !important; }
        }
      `}</style>
    </section>
  )
}

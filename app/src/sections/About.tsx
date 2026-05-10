import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useLanguage } from '../hooks/useLanguage'
import { getSlideDirection } from '../lib/animationDirection'

export default function About() {
  const { t } = useTranslation('about')
  const { isRTL } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const { ref: textRef, visible: textVisible } = useScrollReveal<HTMLDivElement>()

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{ background: '#f5efe7', padding: 'clamp(70px, 8vw, 120px) 0' }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          textAlign: 'center',
        }}
      >
        <div
          ref={textRef}
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateX(0)' : `translateX(${getSlideDirection(isRTL).enterFrom * 0.6}px)`,
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
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
            }}
          >
            {t('statement')}
          </p>
        </div>
      </div>
    </section>
  )
}

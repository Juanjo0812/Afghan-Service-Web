import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useLanguage } from '../hooks/useLanguage'
import { getSlideDirection } from '../lib/animationDirection'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const { t } = useTranslation('about')
  const { isRTL } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        opacity: 1,
        x: 0,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })

      gsap.to(imageRef.current, {
        opacity: 1,
        x: 0,
        duration: 1.0,
        ease: 'power3.out',
        delay: 0.2,
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
      id="about"
      ref={sectionRef}
      style={{ background: '#f5efe7', padding: 'clamp(70px, 8vw, 120px) 0' }}
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
        {/* Left column — text */}
        <div
          ref={textRef}
          style={{
            opacity: 0,
            transform: `translateX(${getSlideDirection(isRTL).enterFrom * 0.6}px)`,
            flex: '1 1 55%',
            minWidth: 300,
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
              marginBottom: 20,
            }}
          >
            {t('paragraph1')}
          </p>
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
            {t('paragraph2')}
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: '#162d5a',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              borderBottom: '1px solid transparent',
              transition: 'border-color 0.3s ease',
              paddingBottom: 2,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderBottomColor = '#162d5a'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'
            }}
          >
            {t('cta')} <ArrowRight size={16} />
          </a>
        </div>

        {/* Right column — image */}
        <div
          ref={imageRef}
          style={{
            opacity: 0,
            transform: `translateX(${-getSlideDirection(isRTL).enterFrom * 0.6}px)`,
            flex: '1 1 35%',
            minWidth: 280,
          }}
        >
          <img
            src="/images/img-about.jpg"
            alt={t('imageAlt')}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              boxShadow: '0 8px 32px rgba(22, 45, 90, 0.08)',
            }}
          />
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../hooks/useReducedMotion'

export default function Hero() {
  const { t } = useTranslation('hero')
  const labelRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const videoRef1 = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)
  const videoRef3 = useRef<HTMLVideoElement>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    // Set playback rates for parallax effect
    if (videoRef1.current) videoRef1.current.playbackRate = 0.6
    if (videoRef2.current) videoRef2.current.playbackRate = 0.85
    if (videoRef3.current) videoRef3.current.playbackRate = 1.0

    // Entry animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(labelRef.current, { opacity: 1, y: 0, duration: 1.0, delay: 0.3 })
      .to(titleRef.current, { opacity: 1, y: 0, duration: 1.0 }, '-=0.5')
      .to(subtitleRef.current, { opacity: 1, y: 0, duration: 1.0 }, '-=0.5')
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 1.0 }, '-=0.5')
  }, [])

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const el = document.querySelector('#contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          background: 'linear-gradient(to bottom, rgba(26,26,46,0.38) 0%, rgba(26,26,46,0.18) 35%, rgba(250,245,239,0.92) 100%)',
        }}
      />

      {/* Video layer 1 — background, slowest */}
      <video
        ref={videoRef1}
        aria-hidden="true"
        role="presentation"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.0)' }}
        src="/videos/hero-main.mp4"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
      />

      {/* Video layer 2 — mid-ground */}
      <video
        ref={videoRef2}
        aria-hidden="true"
        role="presentation"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)' }}
        src="/videos/hero-main.mp4"
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
      />

      {/* Video layer 3 — foreground, fastest */}
      <video
        ref={videoRef3}
        aria-hidden="true"
        role="presentation"
        className="hidden md:block"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.3)' }}
        src="/videos/hero-main.mp4"
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
      />

      {/* Hero content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 1.5rem',
        }}
      >
        <span
          ref={labelRef}
          style={{
            opacity: 0,
            transform: 'translateY(20px)',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: 'rgba(250,245,239,0.7)',
            marginBottom: 20,
          }}
        >
          {t('label')}
        </span>

        <h1
          ref={titleRef}
          style={{
            opacity: 0,
            transform: 'translateY(20px)',
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            color: '#faf5ef',
            marginBottom: 20,
          }}
        >
          {t('title')}
        </h1>

        <p
          ref={subtitleRef}
          style={{
            opacity: 0,
            transform: 'translateY(20px)',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            color: 'rgba(250,245,239,0.85)',
            maxWidth: 520,
            lineHeight: 1.6,
            marginBottom: 36,
          }}
        >
          {t('subtitle')}
        </p>

        <a
          ref={ctaRef}
          href="#contact"
          onClick={handleCtaClick}
          style={{
            opacity: 0,
            transform: 'translateY(20px)',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 14,
            letterSpacing: '0.03em',
            background: 'var(--color-accent)',
            color: '#faf5ef',
            borderRadius: 32,
            padding: '14px 36px',
            textDecoration: 'none',
            transition: 'background 0.4s ease, color 0.4s ease',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => {
            const el = e.target as HTMLElement
            el.style.background = '#faf5ef'
            el.style.color = '#162d5a'
          }}
          onMouseLeave={(e) => {
            const el = e.target as HTMLElement
            el.style.background = 'var(--color-accent)'
            el.style.color = '#faf5ef'
          }}
        >
          {t('cta')}
        </a>
      </div>
    </section>
  )
}

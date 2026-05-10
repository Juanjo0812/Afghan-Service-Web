import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function Hero() {
  const { t } = useTranslation('hero')
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 50)
    return () => clearTimeout(id)
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

      {/* Video background */}
      <video
        aria-hidden="true"
        role="presentation"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        src="/videos/hero-main.mp4"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
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
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '0.3s',
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
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '0.55s',
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
          <span
            style={{
              display: 'block',
              fontSize: '0.6em',
              fontWeight: 400,
              color: 'rgba(250,245,239,0.75)',
              marginTop: 8,
              direction: 'rtl',
              fontFamily: "'Noto Sans Arabic', 'Cormorant Garamond', serif",
            }}
          >
            {t('dariTitle')} — خوش آمدید به فینکس
          </span>
        </h1>

        <p
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '0.8s',
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
          href="#contact"
          onClick={handleCtaClick}
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '1.05s',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 14,
            letterSpacing: '0.03em',
            background: 'var(--color-accent)',
            color: '#faf5ef',
            borderRadius: 32,
            padding: '14px 36px',
            textDecoration: 'none',
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

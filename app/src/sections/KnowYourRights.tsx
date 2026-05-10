import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Shield, Home, FileText } from 'lucide-react'

const scenarioIcons = {
  police: Shield,
  ice: Home,
  documents: FileText,
} as const

const scenarioKeys = ['police', 'ice', 'documents'] as const

export default function KnowYourRights() {
  const { t } = useTranslation('rights')
  const sectionRef = useRef<HTMLDivElement>(null)
  const { ref: headingRef, visible: headingVisible } = useScrollReveal<HTMLDivElement>()
  const { ref: cardsRef, visible: cardsVisible } = useScrollReveal<HTMLDivElement>()

  const downloads = [
    { key: 'english', label: t('downloads.english') },
    { key: 'dari', label: t('downloads.dari') },
    { key: 'pashto', label: t('downloads.pashto') },
    { key: 'uzbek', label: t('downloads.uzbek') },
  ]

  return (
    <section
      id="rights"
      ref={sectionRef}
      style={{ background: '#faf5ef', padding: 'clamp(70px, 8vw, 120px) 0' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        {/* Heading */}
        <div
          ref={headingRef}
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            textAlign: 'center',
            marginBottom: 64,
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
              maxWidth: 700,
              margin: '0 auto',
            }}
          >
            {t('description')}
          </p>
        </div>

        {/* Scenario cards */}
        <div
          ref={cardsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 32,
            marginBottom: 64,
          }}
        >
          {scenarioKeys.map((key, index) => {
            const Icon = scenarioIcons[key]
            const items = t(`scenarios.${key}.items`, { returnObjects: true }) as string[]
            return (
              <div
                key={key}
                className="scenario-card"
                style={{
                  opacity: cardsVisible ? 1 : 0,
                  transform: cardsVisible ? 'translateY(0)' : 'translateY(40px)',
                  transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease',
                  transitionDelay: `${index * 0.1}s`,
                  background: '#ffffff',
                  border: '1px solid rgba(22, 45, 90, 0.08)',
                  borderInlineStart: '4px solid var(--color-accent)',
                  padding: '36px 28px',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.boxShadow = '0 12px 40px rgba(22, 45, 90, 0.06)'
                  el.style.borderColor = 'rgba(var(--color-accent-rgb), 0.2)'
                  el.style.borderInlineStartColor = 'var(--color-accent)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.boxShadow = 'none'
                  el.style.borderColor = 'rgba(22, 45, 90, 0.08)'
                  el.style.borderInlineStartColor = 'var(--color-accent)'
                }}
              >
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                  <Icon size={40} strokeWidth={1.5} color="var(--color-accent)" />
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    color: '#162d5a',
                    marginBottom: 20,
                    textAlign: 'center',
                  }}
                >
                  {t(`scenarios.${key}.title`)}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {items.map((item, i) => (
                    <li
                      key={i}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: 15,
                        color: '#1a1a2e',
                        lineHeight: 1.7,
                        marginBottom: 12,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                      }}
                    >
                      <span style={{ color: 'var(--color-accent)', fontSize: 16, lineHeight: 1.4, flexShrink: 0 }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Downloads */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 48,
          }}
        >
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
              lineHeight: 1.3,
              color: '#162d5a',
              marginBottom: 8,
            }}
          >
            {t('downloads.title')}
          </h3>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 15,
              color: '#6b6b7b',
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            {t('downloads.subtitle')}
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            {downloads.map((dl) => (
              <a
                key={dl.key}
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
                {dl.label}
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            background: '#f0ece6',
            borderRadius: 8,
            padding: '24px 28px',
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 13,
              color: '#6b6b7b',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {t('disclaimer')}
          </p>
        </div>

        {/* Last reviewed */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 12,
            color: '#9a9aaa',
            textAlign: 'center',
            margin: 0,
          }}
        >
          {t('lastReviewed')}
        </p>
      </div>
    </section>
  )
}

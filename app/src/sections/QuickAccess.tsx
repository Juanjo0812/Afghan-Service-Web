import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Globe, Scale, Heart, BookOpen } from 'lucide-react'

const quickAccessItems = [
  { key: 'immigrationHelp', icon: Globe, href: '#immigration-help' },
  { key: 'knowYourRights', icon: Scale, href: '#rights' },
  { key: 'findResources', icon: Heart, href: '#resources' },
  { key: 'upcomingEvents', icon: BookOpen, href: '#events' },
] as const

export default function QuickAccess() {
  const { t: tServices } = useTranslation('services')
  const { t: tCommon } = useTranslation('common')
  const sectionRef = useRef<HTMLDivElement>(null)
  const { ref: headingRef, visible: headingVisible } = useScrollReveal<HTMLDivElement>()
  const { ref: cardsRef, visible: cardsVisible } = useScrollReveal<HTMLDivElement>()

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
            {tServices('sectionLabel')}
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
            {tServices('heading')}
          </h2>
        </div>

        {/* Quick access tiles */}
        <div
          ref={cardsRef}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 32,
          }}
        >
          {quickAccessItems.map((item, index) => {
            const Icon = item.icon
            return (
              <a
                key={item.key}
                href={item.href}
                className="quick-access-tile"
                style={{
                  opacity: cardsVisible ? 1 : 0,
                  transform: cardsVisible ? 'translateY(0)' : 'translateY(40px)',
                  transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease',
                  transitionDelay: `${index * 0.1}s`,
                  background: '#ffffff',
                  border: '1px solid rgba(22, 45, 90, 0.08)',
                  padding: '48px 32px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  flex: '1 1 200px',
                  maxWidth: 260,
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
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
                  <Icon size={56} strokeWidth={1.5} color="var(--color-accent)" />
                </div>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    color: '#162d5a',
                  }}
                >
                  {tCommon(`quickAccess.${item.key}`)}
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

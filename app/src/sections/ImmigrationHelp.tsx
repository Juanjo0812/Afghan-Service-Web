import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import {
  FileText,
  Briefcase,
  Shield,
  Users,
  ScrollText,
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react'

const serviceKeys = [
  { key: 'asylum', icon: FileText },
  { key: 'workPermit', icon: Briefcase },
  { key: 'tps', icon: Shield },
  { key: 'greenCard', icon: Users },
  { key: 'adjustmentAct', icon: ScrollText },
] as const

export default function ImmigrationHelp() {
  const { t } = useTranslation('immigration-help')
  const sectionRef = useRef<HTMLDivElement>(null)
  const { ref: headingRef, visible: headingVisible } = useScrollReveal<HTMLDivElement>()
  const { ref: cardsRef, visible: cardsVisible } = useScrollReveal<HTMLDivElement>()
  const { ref: contactRef, visible: contactVisible } = useScrollReveal<HTMLDivElement>()

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const el = document.querySelector('#contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="immigration-help"
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
              marginBottom: 16,
            }}
          >
            {t('heading')}
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 16,
              color: '#6b6b7b',
              lineHeight: 1.6,
              maxWidth: 640,
              margin: '0 auto',
            }}
          >
            {t('subtitle')}
          </p>
        </div>

        {/* Service Cards */}
        <div
          ref={cardsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            marginBottom: 48,
          }}
        >
          {serviceKeys.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={service.key}
                style={{
                  opacity: cardsVisible ? 1 : 0,
                  transform: cardsVisible ? 'translateY(0)' : 'translateY(40px)',
                  transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease',
                  transitionDelay: `${index * 0.1}s`,
                  background: '#ffffff',
                  border: '1px solid rgba(22, 45, 90, 0.08)',
                  padding: 32,
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
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    marginBottom: 14,
                  }}
                >
                  <Icon size={28} strokeWidth={1.5} color="var(--color-accent)" />
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 600,
                      fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)',
                      lineHeight: 1.3,
                      letterSpacing: '-0.01em',
                      color: '#162d5a',
                    }}
                  >
                    {t(`services.${service.key}.title`)}
                  </h3>
                </div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: 15,
                    color: '#6b6b7b',
                    lineHeight: 1.6,
                  }}
                >
                  {t(`services.${service.key}.description`)}
                </p>
              </div>
            )
          })}
        </div>

        {/* Language bar */}
        <div
          style={{
            textAlign: 'center',
            padding: '20px 0',
            borderTop: '1px solid rgba(22, 45, 90, 0.08)',
            borderBottom: '1px solid rgba(22, 45, 90, 0.08)',
            marginBottom: 48,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 14,
              color: '#6b6b7b',
              letterSpacing: '0.02em',
            }}
          >
            {t('languages')}
          </span>
        </div>

        {/* Daoud Contact Block */}
        <div
          ref={contactRef}
          style={{
            opacity: contactVisible ? 1 : 0,
            transform: contactVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            background: '#162d5a',
            padding: 'clamp(40px, 5vw, 64px) clamp(24px, 4vw, 48px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                lineHeight: 1.3,
                color: '#faf5ef',
                marginBottom: 8,
              }}
            >
              {t('contact.heading')}
            </h3>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 18,
                color: 'var(--color-accent)',
              }}
            >
              {t('contact.name')}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 20,
              maxWidth: 800,
              margin: '0 auto',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Phone size={18} color="var(--color-accent)" strokeWidth={1.5} />
              <a
                href={`tel:${t('contact.phone').replace(/\./g, '')}`}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: 15,
                  color: '#faf5ef',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = 'var(--color-accent)'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = '#faf5ef'
                }}
              >
                {t('contact.phone')}
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Mail size={18} color="var(--color-accent)" strokeWidth={1.5} />
              <a
                href={`mailto:${t('contact.email')}`}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: 15,
                  color: '#faf5ef',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = 'var(--color-accent)'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = '#faf5ef'
                }}
              >
                {t('contact.email')}
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <MapPin size={18} color="var(--color-accent)" strokeWidth={1.5} />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: 15,
                  color: '#faf5ef',
                }}
              >
                {t('contact.location')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Clock size={18} color="var(--color-accent)" strokeWidth={1.5} />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: 15,
                  color: '#faf5ef',
                }}
              >
                {t('contact.hours')}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <a
              href="#contact"
              onClick={handleScrollToContact}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                letterSpacing: '0.03em',
                background: 'var(--color-accent)',
                color: '#faf5ef',
                borderRadius: 32,
                padding: '12px 32px',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'background 0.4s ease, color 0.4s ease',
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
              {t('contact.cta')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

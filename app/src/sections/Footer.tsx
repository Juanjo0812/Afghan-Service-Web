import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation('common')

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer style={{ background: '#1a1a2e', padding: '60px 0 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        {/* Row 1 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 48,
          }}
        >
          {/* Column 1 */}
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: 20,
                color: '#faf5ef',
                marginBottom: 12,
              }}
            >
              {t('footer.logo')}
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: 14,
                color: 'rgba(250,245,239,0.45)',
                lineHeight: 1.6,
              }}
            >
              {t('footer.tagline')}
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 11,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
                color: 'rgba(250,245,239,0.4)',
                marginBottom: 16,
              }}
            >
              {t('footer.quickLinks')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: t('footer.home'), href: '#home' },
                { label: t('footer.immigrationHelp'), href: '#services' },
                { label: t('footer.resources'), href: '#resources' },
                { label: t('footer.events'), href: '#events' },
                { label: t('footer.contact'), href: '#contact' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: 14,
                    color: 'rgba(250,245,239,0.6)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = 'var(--color-accent)'
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = 'rgba(250,245,239,0.6)'
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3 */}
          <div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 11,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
                color: 'rgba(250,245,239,0.4)',
                marginBottom: 16,
              }}
            >
              {t('footer.languages')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: t('footer.english'), href: '#' },
                { label: t('footer.dari'), href: '#' },
                { label: t('footer.pashto'), href: '#' },
                { label: t('footer.uzbek'), href: '#' },
              ].map((lang) => (
                <span
                  key={lang.label}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: 14,
                    color: 'rgba(250,245,239,0.6)',
                  }}
                >
                  {lang.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'rgba(250,245,239,0.08)',
            margin: '40px 0',
          }}
        />

        {/* Copyright */}
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 12,
            color: 'rgba(250,245,239,0.35)',
            textAlign: 'center',
          }}
        >
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  )
}

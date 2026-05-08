import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'

const navLinks = [
  { key: 'nav.home', href: '#home' },
  { key: 'nav.immigrationHelp', href: '#services' },
  { key: 'nav.communityResources', href: '#resources' },
  { key: 'nav.knowYourRights', href: '#rights' },
  { key: 'nav.events', href: '#events' },
  { key: 'nav.contact', href: '#contact' },
]

export default function Navigation() {
  const { t } = useTranslation('common')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          height: 72,
          background: '#faf5ef',
          borderBottom: '1px solid rgba(22, 45, 90, 0.08)',
          zIndex: 1000,
          transition: 'box-shadow 0.4s ease',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 5vw, 4rem)',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: 20,
              color: '#162d5a',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {t('nav.logo')}
          </a>

          {/* Center nav - desktop */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 32,
            }}
            className="hidden lg:flex"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="nav-link"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: 14,
                  letterSpacing: '0.02em',
                  color: '#162d5a',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = 'var(--color-accent)'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = '#162d5a'
                }}
              >
                {t(link.key)}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <LanguageSwitcher />
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                letterSpacing: '0.03em',
                background: 'var(--color-accent)',
                color: '#faf5ef',
                borderRadius: 32,
                padding: '10px 28px',
                textDecoration: 'none',
                transition: 'background 0.4s ease, color 0.4s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                const el = e.target as HTMLElement
                el.style.background = '#1a1a2e'
              }}
              onMouseLeave={(e) => {
                const el = e.target as HTMLElement
                el.style.background = 'var(--color-accent)'
              }}
            >
              {t('nav.getHelp')}
            </a>
          </div>

          {/* Hamburger - mobile */}
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label={t('nav.openMenu')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#162d5a' }}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#faf5ef',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
          }}
        >
          <button
            onClick={() => setMobileOpen(false)}
            aria-label={t('nav.closeMenu')}
            style={{
              position: 'absolute',
              top: 24,
              insetInlineEnd: 24,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#162d5a',
            }}
          >
            <X size={28} />
          </button>
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 28,
                fontWeight: 600,
                color: '#162d5a',
                textDecoration: 'none',
                opacity: 0,
                animation: `fadeInUp 0.5s ease ${i * 0.1}s forwards`,
              }}
            >
              {t(link.key)}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            style={{
              marginTop: 16,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              background: 'var(--color-accent)',
              color: '#faf5ef',
              borderRadius: 32,
              padding: '12px 32px',
              textDecoration: 'none',
              opacity: 0,
              animation: `fadeInUp 0.5s ease ${navLinks.length * 0.1}s forwards`,
            }}
          >
            {t('nav.getHelp')}
          </a>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}

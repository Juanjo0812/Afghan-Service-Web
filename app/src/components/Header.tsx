'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Menu, X, Phone } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { localizePath } from '../lib/navigation'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { t } = useTranslation('common')
  const { lang } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname() || '/'

  const navItems = useMemo(() => [
    { label: t('nav.immigrationHelp'), path: localizePath('/immigration', lang) },
    { label: t('nav.communityResources'), path: localizePath('/resources', lang) },
    { label: t('nav.knowYourRights'), path: localizePath('/rights', lang) },
    { label: t('nav.events'), path: localizePath('/events', lang) },
    { label: t('nav.stories'), path: localizePath('/stories', lang) },
    { label: t('nav.contact'), path: localizePath('/contact', lang) },
  ], [t, lang])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t('skipLink')}
      </a>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-500 ease-in-out ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
          <div 
            className={`flex items-center justify-between transition-all duration-500 ease-in-out ${
              scrolled ? 'h-16 md:h-[72px]' : 'h-24 md:h-[112px]'
            }`}
          >
            {/* Logo */}
            <Link
              href={localizePath('/', lang)}
              className="flex-shrink-0 flex items-center focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 rounded-md"
              aria-label="Catholic Charities AZ - Home"
            >
              <img 
                src="/images/afghan_support_logo.png" 
                alt="Catholic Charities Logo" 
                className={`w-auto transition-all duration-500 ease-in-out ${
                  scrolled ? 'h-10 md:h-12' : 'h-14 md:h-20 brightness-0 invert'
                }`} 
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className={`hidden lg:flex flex-1 justify-center items-center mx-1 lg:mx-2 xl:mx-4 transition-all duration-500 ${scrolled ? 'gap-3 xl:gap-6' : 'gap-1 xl:gap-2'}`} aria-label="Main navigation">
              {navItems.map((item) => {
                const isActive = pathname === item.path
                
                // Determine text and background styling based on scroll state
                const activeStyle = scrolled 
                  ? 'bg-forest/5 text-amber' 
                  : 'bg-white/20 text-white'
                  
                const inactiveStyle = scrolled
                  ? 'text-forest hover:bg-forest/5 hover:text-amber'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`py-2 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 rounded-md whitespace-nowrap ${
                      scrolled ? 'px-3 xl:px-4 text-[14px] xl:text-[15px]' : 'px-2 xl:px-3 text-[16px] xl:text-[17px]'
                    } ${
                      isActive ? activeStyle : inactiveStyle
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right side: CTA + Language */}
            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
              {/* Language switcher — uses existing i18n integration */}
              <div className="hidden md:block transition-all duration-500">
                <LanguageSwitcher variant={scrolled ? 'light' : 'dark'} />
              </div>

              {/* Get Help Now CTA */}
              <Link
                href={localizePath('/contact', lang)}
                className={`btn-primary px-4 font-semibold hidden sm:inline-flex transition-all duration-500 ease-in-out ${
                  scrolled ? 'py-2 text-sm' : 'py-2.5 text-[15px]'
                }`}
              >
                <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                {t('nav.getHelp')}
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 rounded-md ${
                  scrolled ? 'text-forest hover:text-amber' : 'text-white hover:text-amber'
                }`}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              >
                {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-forest-dark p-6 pt-20 flex flex-col gap-2 shadow-dropdown overflow-y-auto"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-5 p-2 text-cream hover:text-amber transition-colors focus:outline-none focus:ring-2 focus:ring-amber rounded-md"
              aria-label={t('nav.closeMenu')}
            >
              <X className="w-6 h-6" />
            </button>

            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              <div className="mb-4">
                <p className="text-cream/50 text-xs font-semibold uppercase tracking-wider mb-2 px-4">{t('mobileNavigation')}</p>
                {navItems.map((item) => {
                  const isActive = pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`px-4 py-3 text-lg font-semibold rounded-md transition-colors block ${
                        isActive
                          ? 'text-amber bg-forest'
                          : 'text-cream hover:text-amber hover:bg-forest'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </nav>

            <div className="mt-6 pt-6 border-t border-forest-light/30">
              <p className="text-cream/60 text-sm mb-3">{t('selectLanguage')}</p>
              <LanguageSwitcher variant="dark" />
            </div>

            <Link
              href={localizePath('/contact', lang)}
              className="btn-primary mt-6 text-center justify-center"
              onClick={() => setMobileOpen(false)}
            >
              <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
              {t('nav.getHelp')}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

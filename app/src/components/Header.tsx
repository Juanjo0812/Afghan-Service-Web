import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, X, Phone } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'

const topNavItems = [
  { label: 'Events', path: '/events' },
  { label: 'Stories', path: '/stories' },
  { label: 'Contact', path: '/contact' },
]

const mainNavItems = [
  { label: 'Immigration Help', path: '/immigration' },
  { label: 'Community Resources', path: '/resources' },
  { label: 'Know Your Rights', path: '/rights' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

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
        Skip to main content
      </a>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* ─── Top Utility Bar ─── */}
        <div
          className="hidden lg:block overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out bg-forest-dark"
          style={{
            maxHeight: scrolled ? '0px' : '40px',
            opacity: scrolled ? 0 : 1,
          }}
          aria-hidden={scrolled}
        >
          <div className="container-main h-10 flex justify-center items-center">
            <nav className="flex items-center gap-12 xl:gap-24" aria-label="Secondary navigation">
              {topNavItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber rounded-sm ${
                      isActive
                        ? 'text-amber'
                        : 'text-cream/80 hover:text-amber'
                    }`}
                    tabIndex={scrolled ? -1 : 0}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* ─── Main Navigation Bar ─── */}
        <div
          className={`transition-all duration-300 ease-in-out border-b ${
            scrolled
              ? 'bg-cream/95 backdrop-blur-lg shadow-md border-forest/5'
              : 'bg-cream border-transparent'
          }`}
        >
          <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
            <div
              className="flex items-center justify-between transition-all duration-300 ease-in-out"
              style={{ height: scrolled ? '56px' : '76px' }}
            >
              {/* Logo */}
              <div className="flex-shrink-0 w-[200px] xl:w-[250px] flex items-center justify-start">
                <Link
                  to="/"
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 rounded-md"
                  aria-label="Catholic Charities AZ - Home"
                >
                  <img
                    src="/images/Catholic.png"
                    alt="Catholic Charities Logo"
                    className="w-auto transition-all duration-300 ease-in-out"
                    style={{ height: scrolled ? '36px' : '48px' }}
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex flex-1 justify-center items-center gap-8 xl:gap-16 mx-6" aria-label="Main navigation">
                {mainNavItems.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`py-2 font-medium whitespace-nowrap rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 ${
                        scrolled ? 'text-sm' : 'text-[15px]'
                      } ${
                        isActive
                          ? 'text-amber'
                          : 'text-forest hover:text-amber'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              {/* Right side: CTA + Language */}
              <div className="flex items-center justify-end gap-3 md:gap-5 flex-shrink-0 w-[200px] xl:w-[250px]">
                {/* Get Help Now CTA */}
                <Link
                  to="/contact"
                  className={`btn-primary hidden sm:inline-flex transition-all duration-300 ${
                    scrolled ? 'text-xs px-3 py-2' : 'text-sm px-4 py-2.5'
                  }`}
                >
                  <Phone className={`mr-1.5 transition-all duration-300 ${scrolled ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} aria-hidden="true" />
                  Get Help Now
                </Link>

                {/* Language switcher */}
                <div className="hidden md:block">
                  <LanguageSwitcher />
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden p-2 text-forest hover:text-amber transition-colors focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 rounded-md"
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-menu"
                  aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                >
                  {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
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
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>

            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {/* Main Nav Items in Mobile */}
              <div className="mb-4">
                <p className="text-cream/50 text-xs font-semibold uppercase tracking-wider mb-2 px-4">Services</p>
                {mainNavItems.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
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

              {/* Top Nav Items in Mobile */}
              <div className="mb-2">
                <p className="text-cream/50 text-xs font-semibold uppercase tracking-wider mb-2 px-4">More Info</p>
                {topNavItems.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-4 py-2.5 text-base font-medium rounded-md transition-colors block ${
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
              <p className="text-cream/60 text-sm mb-3">Select Language</p>
              <LanguageSwitcher variant="dark" />
            </div>

            <Link
              to="/contact"
              className="btn-primary mt-6 text-center justify-center"
              onClick={() => setMobileOpen(false)}
            >
              <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
              Get Help Now
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

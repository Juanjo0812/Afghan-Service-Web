import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, TreePine } from 'lucide-react'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Immigration Help', path: '/immigration' },
  { label: 'Community Resources', path: '/resources' },
  { label: 'Know Your Rights', path: '/rights' },
  { label: 'Events', path: '/events' },
  { label: 'Stories', path: '/stories' },
  { label: 'Contact', path: '/contact' },
]

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'dari', label: 'دری' },
  { code: 'pashto', label: 'پښتو' },
  { code: 'uzbek', label: 'ازبکی' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-250 ${
          scrolled
            ? 'bg-cream/95 backdrop-blur-lg shadow-card-hover'
            : 'bg-cream'
        }`}
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 rounded-md"
              aria-label="Afghan Community Support - Home"
            >
              <TreePine className="w-7 h-7 text-forest" aria-hidden="true" />
              <div className="hidden sm:block">
                <span className="font-semibold text-forest text-sm md:text-base leading-tight block">
                  Afghan Community Support
                </span>
                <span className="text-[11px] text-forest-light leading-tight block">
                  Catholic Charities AZ
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 text-[15px] font-medium rounded-md transition-colors duration-250 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 ${
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

            {/* Right side: Language + CTA */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Language toggle - desktop */}
              <div className="hidden md:flex items-center gap-1" role="group" aria-label="Language selection">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                      lang.code === 'en'
                        ? 'bg-forest text-white'
                        : 'text-forest-light hover:bg-cream-dark'
                    }`}
                    aria-pressed={lang.code === 'en'}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Get Help Now CTA */}
              <Link
                to="/contact"
                className="btn-primary text-sm px-4 py-2.5 hidden sm:inline-flex"
              >
                <Phone className="w-4 h-4 mr-1.5" aria-hidden="true" />
                Get Help Now
              </Link>

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
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-forest-dark p-6 pt-20 flex flex-col gap-2 shadow-dropdown"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-5 p-2 text-cream hover:text-amber transition-colors focus:outline-none focus:ring-2 focus:ring-amber rounded-md"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>

            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-3 text-lg font-semibold rounded-md transition-colors ${
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
            </nav>

            <div className="mt-6 pt-6 border-t border-forest-light/30">
              <p className="text-cream/60 text-sm mb-3">Select Language</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Language selection">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                      lang.code === 'en'
                        ? 'bg-amber text-white'
                        : 'text-cream border border-cream/30 hover:border-amber hover:text-amber'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <Link
              to="/contact"
              className="btn-primary mt-6 text-center"
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

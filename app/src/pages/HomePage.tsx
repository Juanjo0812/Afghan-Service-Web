import { Link } from 'react-router'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Briefcase, Shield, Compass, Calendar, ChevronRight, MapPin } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove('opacity-0')
          el.classList.add('animate-fade-in-up')
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

export default function HomePage() {
  const { t } = useTranslation(['common', 'hero', 'about', 'events'])
  const heroRef = useScrollReveal()
  const cardsRef = useScrollReveal()
  const aboutRef = useScrollReveal()
  const eventRef = useScrollReveal()
  const ctaRef = useScrollReveal()

  const quickCards = [
    {
      icon: Briefcase,
      title: t('quickAccess.immigrationHelp', { ns: 'common' }),
      description: t('quickAccess.immigrationDesc', { ns: 'common' }),
      path: '/immigration',
    },
    {
      icon: Shield,
      title: t('quickAccess.knowYourRights', { ns: 'common' }),
      description: t('quickAccess.rightsDesc', { ns: 'common' }),
      path: '/rights',
    },
    {
      icon: Compass,
      title: t('quickAccess.findResources', { ns: 'common' }),
      description: t('quickAccess.resourcesDesc', { ns: 'common' }),
      path: '/resources',
    },
    {
      icon: Calendar,
      title: t('quickAccess.upcomingEvents', { ns: 'common' }),
      description: t('quickAccess.eventsDesc', { ns: 'common' }),
      path: '/events',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-[100vh] flex items-center justify-center"
        aria-label="Welcome"
      >
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="sticky top-0 w-full h-[100vh]">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-top blur-[2px] scale-105"
            >
              <source src="/videos/Video_main.mp4" type="video/mp4" />
            </video>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, #FAF7F2 0%, rgba(26, 37, 24, 0.7) 15%, rgba(26, 37, 24, 0.4) 50%, rgba(26, 37, 24, 0.1) 100%)',
              }}
            />
          </div>
        </div>

        <div className="relative container-main z-10 flex flex-col items-center text-center pt-20" ref={heroRef}>
          <div className="max-w-3xl flex flex-col items-center">
            <FadeIn delay={300} duration={1200}>
              <h1 className="font-display text-4xl md:text-5xl lg:text-display-xl text-white mb-3 leading-tight">
                {t('title', { ns: 'hero' })}
              </h1>
            </FadeIn>
            <FadeIn delay={1000} duration={1000}>
              <p className="text-lg md:text-xl text-white/90 mb-2 font-arabic" dir="rtl">
                {t('dariTitle', { ns: 'hero' })} — خوش آمدید به فینکس
              </p>
            </FadeIn>
            <FadeIn delay={1700} duration={1000}>
              <p className="text-body-lg text-white/80 mb-8 max-w-lg">
                {t('subtitle', { ns: 'hero' })}
              </p>
            </FadeIn>
            <FadeIn delay={2400} duration={1000}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                <Link to="/rights" className="btn-primary text-center">
                  {t('ctaRights', { ns: 'hero' })}
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="section-padding bg-cream" aria-labelledby="quick-access-heading">
        <div className="container-main opacity-0" ref={cardsRef}>
          <div className="text-center mb-10 md:mb-12">
            <h2 id="quick-access-heading" className="font-display text-heading-1 md:text-heading-1 text-forest mb-3">
              {t('home.howCanWeHelp', { ns: 'common' })}
            </h2>
            <p className="text-body-lg text-forest-light max-w-xl mx-auto">
              {t('home.freeServices', { ns: 'common' })}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {quickCards.map((card, i) => {
              const Icon = card.icon
              return (
                <FadeIn key={card.title} delay={i * 200}>
                  <Link
                    to={card.path}
                    className="group bg-white rounded-2xl p-7 md:p-8 text-center transition-all duration-250 hover:bg-cream-dark hover:shadow-card-hover hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 border border-amber/40 shadow-sm block h-full"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-warm-sand/60 flex items-center justify-center transition-colors group-hover:bg-amber-light">
                      <Icon className="w-8 h-8 text-forest" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-heading-4 text-forest mb-2">
                      {card.title}
                    </h3>
                    <p className="text-body-sm text-forest-light leading-relaxed">
                      {card.description}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-4 text-amber text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('learnMore', { ns: 'common' })} <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </Link>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Snapshot */}
      <section className="section-padding bg-warm-sand/40" aria-labelledby="about-heading">
        <div className="container-main opacity-0" ref={aboutRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <span className="label-text block mb-3">{t('label', { ns: 'about' })}</span>
              <h2 id="about-heading" className="font-display text-heading-1 md:text-heading-1 text-forest mb-5">
                {t('homeHeadline', { ns: 'about' })}
              </h2>
              <p className="text-body-lg text-forest-light mb-4 leading-relaxed">
                {t('body1', { ns: 'about' })}
              </p>
              <p className="text-body text-forest-light mb-6 leading-relaxed">
                {t('body2', { ns: 'about' })}
              </p>
              <Link to="/immigration" className="text-link inline-flex items-center gap-1">
                {t('learnMoreServices', { ns: 'about' })} <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="relative hidden lg:block">
              {/* Decorative Afghan-inspired geometric pattern */}
              <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto opacity-20" aria-hidden="true">
                <defs>
                  <pattern id="afghan-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#2B3A2E" strokeWidth="1.5" />
                    <circle cx="40" cy="40" r="20" fill="none" stroke="#2B3A2E" strokeWidth="1" />
                    <circle cx="40" cy="40" r="10" fill="none" stroke="#2B3A2E" strokeWidth="0.5" />
                    <path d="M40 10 L40 70 M10 40 L70 40" stroke="#2B3A2E" strokeWidth="0.5" />
                    <circle cx="40" cy="10" r="3" fill="#C68B2B" />
                    <circle cx="40" cy="70" r="3" fill="#C68B2B" />
                    <circle cx="10" cy="40" r="3" fill="#C68B2B" />
                    <circle cx="70" cy="40" r="3" fill="#C68B2B" />
                  </pattern>
                </defs>
                <rect width="400" height="400" fill="url(#afghan-pattern)" />
                <circle cx="200" cy="200" r="150" fill="none" stroke="#C68B2B" strokeWidth="2" opacity="0.3" />
                <circle cx="200" cy="200" r="120" fill="none" stroke="#2B3A2E" strokeWidth="1" opacity="0.4" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Event */}
      <section className="section-padding bg-cream" aria-labelledby="event-heading">
        <div className="container-main max-w-3xl opacity-0" ref={eventRef}>
          <div className="text-center mb-10">
            <span className="label-text">{t('upcomingLabel', { ns: 'events' })}</span>
          </div>
          <div className="bg-white rounded-xl p-8 md:p-10 shadow-sm border border-amber/40 relative overflow-hidden transition-all hover:bg-cream-dark hover:shadow-card-hover">
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-36 h-36 md:w-44 md:h-44 bg-amber-light/40 rounded-bl-full" aria-hidden="true" />

            <div className="relative z-10">
              {/* Featured badge */}
              <div className="flex items-center gap-2 mb-5">
                <svg className="w-5 h-5 text-amber" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-label font-bold uppercase tracking-wider text-amber">
                  {t('featuredBadge', { ns: 'events' })}
                </span>
              </div>

              {/* Event title */}
              <h2 id="event-heading" className="font-display text-heading-1 md:text-heading-1 text-forest mb-3">
                Free Citizenship Workshop
              </h2>

              {/* Description */}
              <p className="text-body-lg text-forest-light mb-8 leading-relaxed max-w-xl">
                Get expert guidance on your naturalization application process with our legal team.
              </p>

              {/* Info rows with large icons */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-forest-light">
                  <Calendar className="w-6 h-6 text-forest flex-shrink-0" aria-hidden="true" />
                  <span className="text-body-lg font-medium text-forest">
                    June 13, 2026 &bull; 9:00 AM &ndash; 2:00 PM
                  </span>
                </div>
                <div className="flex items-center gap-4 text-forest-light">
                  <MapPin className="w-6 h-6 text-forest flex-shrink-0" aria-hidden="true" />
                  <span className="text-body text-forest">
                    Catholic Charities Community Center &mdash; 5151 N 19th Ave, Phoenix
                  </span>
                </div>
                <div className="flex items-center gap-4 text-forest-light">
                  <svg className="w-6 h-6 text-forest flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" />
                    <path d="m22 22-5-10-5 10" /><path d="M14 18h6" />
                  </svg>
                  <span className="text-body text-forest">
                    Dari &amp; Pashto interpretation provided
                  </span>
                </div>
              </div>

              {/* CTA — elegant outline button */}
              <Link
                to="/events"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-transparent border-2 border-forest text-forest font-semibold rounded-md transition-all duration-250 hover:bg-forest hover:text-white focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2 min-h-[48px] text-base"
              >
                {t('registerCta', { ns: 'events' })}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding bg-forest text-center" aria-label="Get help">
        <div className="container-main max-w-2xl opacity-0" ref={ctaRef}>
          <h2 className="font-display text-heading-1 md:text-display-l text-white mb-4">
            {t('ctaText', { ns: 'hero' })}
          </h2>
          <p className="text-body-lg text-white/80 mb-8">
            {t('ctaSubtext', { ns: 'hero' })}
          </p>
          <Link to="/contact" className="btn-primary text-lg px-10 py-4 inline-flex">
            {t('cta', { ns: 'hero' })}
          </Link>
          <p className="mt-5 text-body text-white/70">
            {t('orCallUs', { ns: 'hero' })}{' '}
            <a href="tel:4804162333" className="text-amber hover:underline focus:outline-none focus:ring-2 focus:ring-amber rounded-md px-1">
              480.416.2333
            </a>
          </p>
        </div>
      </section>
    </>
  )
}

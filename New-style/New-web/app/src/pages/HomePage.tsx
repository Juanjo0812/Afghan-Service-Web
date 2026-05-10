import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { Briefcase, Shield, Compass, Calendar, ChevronRight, MapPin } from 'lucide-react'

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-fade-in-up')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

const quickCards = [
  {
    icon: Briefcase,
    title: 'Immigration Help',
    description: 'Free assistance with asylum, work permits, and legal status',
    path: '/immigration',
  },
  {
    icon: Shield,
    title: 'Know Your Rights',
    description: 'Learn your rights when interacting with police or ICE',
    path: '/rights',
  },
  {
    icon: Compass,
    title: 'Find Resources',
    description: 'English classes, food banks, health clinics, and more',
    path: '/resources',
  },
  {
    icon: Calendar,
    title: 'Upcoming Events',
    description: 'Workshops, legal clinics, and cultural gatherings',
    path: '/events',
  },
]

export default function HomePage() {
  const heroRef = useScrollReveal()
  const cardsRef = useScrollReveal()
  const aboutRef = useScrollReveal()
  const eventRef = useScrollReveal()
  const ctaRef = useScrollReveal()

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-[70vh] md:min-h-[80vh] flex items-end"
        aria-label="Welcome"
      >
        <div className="absolute inset-0">
          <img
            src="/images/hero-home.jpg"
            alt="Afghan family in Phoenix park with warm golden sunlight"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(26, 37, 24, 0.85) 0%, rgba(26, 37, 24, 0.5) 50%, rgba(26, 37, 24, 0.2) 100%)',
            }}
          />
        </div>

        <div className="relative container-main pb-12 md:pb-20 pt-32" ref={heroRef}>
          <div className="max-w-2xl opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-display-xl text-white mb-3 leading-tight">
              Welcome Home
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-2 font-arabic" dir="rtl">
              به خانه خوش آمدید — خوش آمدید به فینکس
            </p>
            <p className="text-body-lg text-white/80 mb-8 max-w-lg">
              Free, confidential support for Afghan families in Phoenix
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="btn-primary text-center">
                Get Help Now
              </Link>
              <Link to="/rights" className="btn-white-outline text-center">
                Learn About Your Rights
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="section-padding bg-cream" aria-labelledby="quick-access-heading">
        <div className="container-main" ref={cardsRef}>
          <div className="text-center mb-10 md:mb-12">
            <h2 id="quick-access-heading" className="font-display text-heading-1 md:text-heading-1 text-forest mb-3">
              How Can We Help?
            </h2>
            <p className="text-body-lg text-forest-light max-w-xl mx-auto">
              Free services and support for Afghan families
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {quickCards.map((card, i) => {
              const Icon = card.icon
              return (
                <Link
                  key={card.title}
                  to={card.path}
                  className="group bg-cream-dark rounded-2xl p-7 md:p-8 text-center transition-all duration-250 hover:bg-white hover:shadow-card-hover hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 border border-transparent hover:border-warm-sand/50"
                  style={{ animationDelay: `${i * 0.1}s` }}
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
                    Learn more <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Snapshot */}
      <section className="section-padding bg-warm-sand/40" aria-labelledby="about-heading">
        <div className="container-main" ref={aboutRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <span className="label-text block mb-3">WHO WE ARE</span>
              <h2 id="about-heading" className="font-display text-heading-1 md:text-heading-1 text-forest mb-5">
                Supporting Afghan Families in Phoenix
              </h2>
              <p className="text-body-lg text-forest-light mb-4 leading-relaxed">
                We support Afghan individuals and families through legal services, community resources, and integration support. Our team speaks your language and understands your journey. All services are free and confidential.
              </p>
              <p className="text-body text-forest-light mb-6 leading-relaxed">
                A program of Catholic Charities Community Services, Arizona &mdash; serving our community with dignity and compassion since 1933.
              </p>
              <Link to="/immigration" className="text-link inline-flex items-center gap-1">
                Learn More About Our Services <ChevronRight className="w-4 h-4" aria-hidden="true" />
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
        <div className="container-main max-w-3xl" ref={eventRef}>
          <div className="text-center mb-8">
            <span className="label-text">UPCOMING EVENT</span>
          </div>
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-card border border-warm-sand/50 transition-shadow hover:shadow-card-hover">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 bg-amber text-white rounded-lg px-4 py-3 text-center min-w-[80px]">
                <span className="block text-xs font-semibold uppercase tracking-wider">JUN</span>
                <span className="block text-3xl font-bold font-display">13</span>
              </div>
              <div className="flex-1">
                <h2 id="event-heading" className="font-display text-heading-2 text-forest mb-2">
                  Free Citizenship Workshop
                </h2>
                <p className="text-body text-forest-light mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-olive" aria-hidden="true" />
                  Saturday, June 13, 2026 &mdash; 9:00 AM to 2:00 PM
                </p>
                <p className="text-body-sm text-forest-light mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-olive" aria-hidden="true" />
                  Catholic Charities Community Center &mdash; 5151 N 19th Ave, Phoenix, AZ 85015
                </p>
                <p className="text-body text-forest-light mb-5 leading-relaxed">
                  Join us for a free citizenship workshop. Immigration attorneys will be available to help with applications. Lunch provided. Registration is required.
                </p>
                <Link to="/events" className="btn-primary text-sm">
                  Register for This Event
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding bg-forest text-center" aria-label="Get help">
        <div className="container-main max-w-2xl" ref={ctaRef}>
          <h2 className="font-display text-heading-1 md:text-display-l text-white mb-4">
            Need help? We are here for you.
          </h2>
          <p className="text-body-lg text-white/80 mb-8">
            Our team speaks Dari, Pashto, and Uzbek. All services are free and confidential.
          </p>
          <Link to="/contact" className="btn-primary text-lg px-10 py-4 inline-flex">
            Get Help Now
          </Link>
          <p className="mt-5 text-body text-white/70">
            Or call us:{" "}
            <a href="tel:4804162333" className="text-amber hover:underline focus:outline-none focus:ring-2 focus:ring-amber rounded-md px-1">
              480.416.2333
            </a>
          </p>
        </div>
      </section>
    </>
  )
}

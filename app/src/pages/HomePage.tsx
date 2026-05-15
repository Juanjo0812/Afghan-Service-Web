'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Briefcase, Shield, Compass, Calendar, ChevronRight, ChevronDown, MapPin } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'
import { useLanguage } from '../hooks/useLanguage'
import { localizePath } from '../lib/navigation'
import type { EventContent } from '@/domain/content'
import type { LangCode } from '@/domain/language'

function toPlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

interface HomePageProps {
  featuredEvent?: EventContent | null
  lang?: LangCode
}

export default function HomePage({ featuredEvent, lang: pageLang = 'en' }: HomePageProps) {
  const { t } = useTranslation(['common', 'hero', 'about', 'events'])
  const { lang } = useLanguage()

  const quickCards = [
    {
      icon: Briefcase,
      title: t('quickAccess.immigrationHelp', { ns: 'common' }),
      description: t('quickAccess.immigrationDesc', { ns: 'common' }),
      path: localizePath('/immigration', lang),
    },
    {
      icon: Shield,
      title: t('quickAccess.knowYourRights', { ns: 'common' }),
      description: t('quickAccess.rightsDesc', { ns: 'common' }),
      path: localizePath('/rights', lang),
    },
    {
      icon: Compass,
      title: t('quickAccess.findResources', { ns: 'common' }),
      description: t('quickAccess.resourcesDesc', { ns: 'common' }),
      path: localizePath('/resources', lang),
    },
    {
      icon: Calendar,
      title: t('quickAccess.upcomingEvents', { ns: 'common' }),
      description: t('quickAccess.eventsDesc', { ns: 'common' }),
      path: localizePath('/events', lang),
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative h-[85vh] flex items-center justify-center"
        aria-label="Welcome"
      >
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="sticky top-0 w-full h-[85vh]">
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

        <div className="relative container-main z-10 flex flex-col items-center text-center pt-20">
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
                <Link href={localizePath('/rights', lang)} className="btn-primary text-center">
                  {t('ctaRights', { ns: 'hero' })}
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Animated scroll-down arrow */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
          <span className="text-white/60 text-xs font-medium tracking-wider uppercase">
            {t('scrollDown', { ns: 'hero' })}
          </span>
          <ChevronDown
            className="w-6 h-6 text-white/70 animate-bounce"
            aria-hidden="true"
          />
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="section-padding bg-cream" aria-labelledby="quick-access-heading">
        <div className="container-main">
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
                    href={card.path}
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
        <FadeIn delay={200}>
          <div className="container-main">
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
              <Link href={localizePath('/immigration', lang)} className="text-link inline-flex items-center gap-1">
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
        </FadeIn>
      </section>

      {/* Featured Event */}
      {featuredEvent && (
        <section className="section-padding bg-cream" aria-labelledby="event-heading">
          <FadeIn delay={200}>
            <div className="container-main max-w-3xl">
              <div className="text-center mb-10">
                <span className="label-text">{t('upcomingLabel', { ns: 'events' })}</span>
              </div>
              <div className="bg-white rounded-xl p-8 md:p-10 shadow-sm border border-amber/40 relative overflow-hidden transition-all hover:bg-cream-dark hover:shadow-card-hover">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-36 h-36 md:w-44 md:h-44 bg-amber-light/40 rounded-bl-full" aria-hidden="true" />

                <div className="relative z-10">
                  {/* Category badge */}
                  <div className="flex items-center gap-2 mb-5">
                    <svg className="w-5 h-5 text-amber" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-label font-bold uppercase tracking-wider text-amber">
                      {featuredEvent.categoryLabel}
                    </span>
                  </div>

                  {/* Event title */}
                  <h2 id="event-heading" className="font-display text-heading-1 md:text-heading-1 text-forest mb-3">
                    {featuredEvent.title}
                  </h2>

                  {/* Description */}
                  <p className="text-body-lg text-forest-light mb-8 leading-relaxed max-w-xl">
                    {toPlainText(featuredEvent.description)}
                  </p>

                  {/* Info rows with large icons */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4 text-forest-light">
                      <Calendar className="w-6 h-6 text-forest flex-shrink-0" aria-hidden="true" />
                      <span className="text-body-lg font-medium text-forest">
                        {new Date(featuredEvent.startDate).toLocaleDateString(
                          pageLang === 'dari' ? 'fa' : pageLang === 'uzbek' ? 'uz' : 'en-US',
                          { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                        )} &bull; {featuredEvent.timeLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-forest-light">
                      <MapPin className="w-6 h-6 text-forest flex-shrink-0" aria-hidden="true" />
                      <span className="text-body text-forest">
                        {featuredEvent.location}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={localizePath(`/events/${featuredEvent.slug}`, lang)}
                    className="btn-primary w-full sm:w-auto"
                  >
                    {t('registerCta', { ns: 'events' })}
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="section-padding bg-forest text-center" aria-label="Get help">
        <div className="container-main max-w-2xl">
          <h2 className="font-display text-heading-1 md:text-display-l text-white mb-4">
            {t('ctaText', { ns: 'hero' })}
          </h2>
          <p className="text-body-lg text-white/80 mb-8">
            {t('ctaSubtext', { ns: 'hero' })}
          </p>
          <Link href={localizePath('/contact', lang)} className="btn-primary text-lg px-10 py-4 inline-flex">
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

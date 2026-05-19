'use client'

import { BookOpen, Heart, Utensils, Stethoscope, Check, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { FadeIn } from '../components/FadeIn'

export default function ResourcesPage() {
  const { t } = useTranslation('resources')

  return (
    <>
      {/* Page Header */}
      <section className="relative min-h-[45vh]" aria-label="Community resources header">
        <div className="absolute inset-0">
          <img
            src="/images/hero-resources.jpg"
            alt="Community garden food distribution event"
            className="w-full h-full object-cover object-[center-30%]"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(26, 37, 24, 0.9) 0%, rgba(26, 37, 24, 0.6) 50%, rgba(26, 37, 24, 0.3) 100%)',
            }}
          />
        </div>
        <div className="relative container-main pt-36 pb-12 lg:pt-48 lg:pb-16">
          <div className="max-w-3xl">
            <span className="label-text text-amber block mb-3">{t('label')}</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-display-xl text-white mb-4 leading-tight">
              {t('heading')}
            </h1>
            <p className="text-body-lg text-white/85 max-w-2xl">
              {t('description')}
            </p>
          </div>
        </div>
      </section>

      {/* Bento Grid Resources */}
      <section className="section-padding bg-cream" aria-labelledby="resources-heading">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* English classes (Featured) */}
            <FadeIn className="md:col-span-2 lg:col-span-2">
              <div className="bg-white border border-amber/40 rounded-lg overflow-hidden flex flex-col md:flex-row transition-all hover:bg-cream-dark shadow-sm hover:shadow-card-hover">
                <div className="w-full md:w-2/5 h-64 md:h-auto bg-warm-sand/20 relative" />
                <div className="p-6 md:p-8 w-full md:w-3/5 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-amber" />
                    <span className="text-xs font-semibold text-amber uppercase tracking-wider">{t('categories.english.tag')}</span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl text-forest mb-3">{t('categories.english.title')}</h2>
                  <p className="text-forest-light mb-6 flex-grow">
                    {t('categories.english.desc')}
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-forest-light">
                      <Check className="w-5 h-5 text-forest flex-shrink-0" />
                      <span className="text-sm">{t('categories.english.item1')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-forest-light">
                      <Check className="w-5 h-5 text-forest flex-shrink-0" />
                      <span className="text-sm">{t('categories.english.item2')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-forest-light">
                      <Check className="w-5 h-5 text-forest flex-shrink-0" />
                      <span className="text-sm">{t('categories.english.item3')}</span>
                    </div>
                  </div>
                  <Link href="/contact" className="btn-primary w-full md:w-auto mt-auto">
                    {t('getHelp')}
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Mental health & wellness */}
            <FadeIn delay={150} duration={800} className="h-full">
              <div className="bg-white border border-amber/40 rounded-lg p-6 md:p-8 flex flex-col transition-all hover:bg-cream-dark shadow-sm hover:shadow-card-hover h-full">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-amber" />
                  <span className="text-xs font-semibold text-amber uppercase tracking-wider">{t('categories.mental.tag')}</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl text-forest mb-3">{t('categories.mental.title')}</h3>
                <p className="text-forest-light mb-6 flex-grow">
                  {t('categories.mental.desc')}
                </p>
                <div className="mt-auto pt-4 border-t border-warm-sand/50">
                  <Link href="/contact" className="text-forest font-semibold hover:text-amber transition-colors flex items-center gap-2">
                    {t('contactUs')} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Food banks */}
            <FadeIn delay={250} duration={800} className="h-full">
              <div className="bg-white border border-amber/40 rounded-lg p-6 md:p-8 flex flex-col transition-all hover:bg-cream-dark shadow-sm hover:shadow-card-hover h-full">
                <div className="flex items-center gap-2 mb-3">
                  <Utensils className="w-5 h-5 text-amber" />
                  <span className="text-xs font-semibold text-amber uppercase tracking-wider">{t('categories.food.tag')}</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl text-forest mb-3">{t('categories.food.title')}</h3>
                <p className="text-forest-light mb-6 flex-grow">
                  {t('categories.food.desc')}
                </p>
                <div className="mt-auto pt-4 border-t border-warm-sand/50">
                  <Link href="/contact" className="text-forest font-semibold hover:text-amber transition-colors flex items-center gap-2">
                    {t('contactUs')} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Health clinics */}
            <FadeIn delay={350} duration={800} className="h-full">
              <div className="bg-white border border-amber/40 rounded-lg p-6 md:p-8 flex flex-col transition-all hover:bg-cream-dark shadow-sm hover:shadow-card-hover h-full">
                <div className="flex items-center gap-2 mb-3">
                  <Stethoscope className="w-5 h-5 text-amber" />
                  <span className="text-xs font-semibold text-amber uppercase tracking-wider">{t('categories.health.tag')}</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl text-forest mb-3">{t('categories.health.title')}</h3>
                <p className="text-forest-light mb-6 flex-grow">
                  {t('categories.health.desc')}
                </p>
                <div className="mt-auto pt-4 border-t border-warm-sand/50">
                  <Link href="/contact" className="text-forest font-semibold hover:text-amber transition-colors flex items-center gap-2">
                    {t('contactUs')} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}

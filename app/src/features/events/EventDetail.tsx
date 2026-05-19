'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { localizePath } from '@/lib/navigation'
import { sanitizeHtml } from '@/lib/sanitizeHtml'
import { formatEventDate } from '@/lib/formatDate'
import type { EventContent } from '@/domain/content'

interface EventDetailProps {
  event: EventContent
}

export default function EventDetail({ event }: EventDetailProps) {
  const { t } = useTranslation('events')
  const { lang } = useLanguage()

  return (
    <article className="bg-cream min-h-screen">
      {/* Page Header */}
      <section className="relative min-h-[40vh]" aria-label="Event header">
        <div className="absolute inset-0">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <img
              src="/images/hero-events.jpg"
              alt="Community workshop"
              className="w-full h-full object-cover object-[center-50%]"
            />
          )}
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
            <span className="label-text text-amber block mb-3">{event.categoryLabel}</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-display-xl text-white mb-4 leading-tight">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Event Content */}
      <section className="section-padding">
        <div className="container-main max-w-3xl">
          <div className="bg-white border border-amber/40 rounded-xl p-8 md:p-12 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 text-forest-light mb-6 text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber" aria-hidden="true" />
                <span className="font-semibold text-forest">{t('dateLabel')}:</span>
                <span>{formatEventDate(event.startDate, lang)}</span>
              </div>
              <span className="hidden md:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber" aria-hidden="true" />
                <span className="font-semibold text-forest">{t('timeLabel')}:</span>
                <span>{event.timeLabel}</span>
              </div>
              <span className="hidden md:inline">•</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber" aria-hidden="true" />
                <span className="font-semibold text-forest">{t('locationLabel')}:</span>
                <span>{event.location}</span>
              </div>
            </div>

            <div
              className="prose prose-forest max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.description) }}
            />

            {event.ctaUrl ? (
              <a
                href={event.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                {event.ctaLabel}
              </a>
            ) : (
              <Link href={localizePath('/contact', lang)} className="btn-primary inline-block">
                {event.ctaLabel}
              </Link>
            )}

            <div className="mt-8 pt-6 border-t border-warm-sand/50">
              <Link
                href={localizePath('/events', lang)}
                className="text-link inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                {t('backToEvents')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}

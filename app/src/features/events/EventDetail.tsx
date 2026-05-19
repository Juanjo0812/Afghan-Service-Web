'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { localizePath } from '@/lib/navigation'
import { sanitizeHtml } from '@/lib/sanitizeHtml'
import { formatEventDate } from '@/lib/formatDate'
import EventRegistrationModal from './EventRegistrationModal'
import EventRegistrationToast from './EventRegistrationToast'
import type { EventContent } from '@/domain/content'

interface EventDetailProps {
  event: EventContent
}

export default function EventDetail({ event }: EventDetailProps) {
  const { t } = useTranslation('events')
  const { lang } = useLanguage()
  const [showModal, setShowModal] = useState(false)
  const [modalKey, setModalKey] = useState(0)
  const [showToast, setShowToast] = useState(false)

  const handleRegistrationSuccess = useCallback(() => {
    setShowToast(true)
  }, [])

  const handleCloseToast = useCallback(() => {
    setShowToast(false)
  }, [])

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
          <div className="bg-white border border-amber/40 rounded-xl p-8 md:p-12 shadow-sm relative overflow-hidden transition-all hover:bg-cream-dark hover:shadow-card-hover">
            {/* Decorative Background Lines */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl" aria-hidden="true">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Thin wavy amber lines */}
                <path d="M -10 15 Q 30 -15 60 35 T 150 0" fill="none" className="stroke-amber/40" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path d="M -10 80 Q 40 130 85 50 T 180 100" fill="none" className="stroke-amber/40" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col gap-4 text-forest-light mb-8 text-lg">
                <div className="flex items-start gap-3">
                  <Calendar className="w-6 h-6 text-amber flex-shrink-0" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-forest">{t('dateLabel')}: </span>
                    <span>{formatEventDate(event.startDate, lang)}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-amber flex-shrink-0" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-forest">{t('timeLabel')}: </span>
                    <span>{event.timeLabel}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-amber flex-shrink-0" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-forest">{t('locationLabel')}: </span>
                    <span>{event.location}</span>
                  </div>
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
                <button
                  type="button"
                  onClick={() => {
                    setModalKey((k) => k + 1)
                    setShowModal(true)
                  }}
                  className="btn-primary inline-block"
                >
                  {t('register')}
                </button>
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

            {/* Foreground Green Drop (covers borders) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-20" aria-hidden="true">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 80 100 C 80 85, 88 78, 92 75 C 97 72, 100 68, 100 65 L 100 100 Z" fill="#1A2518" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <EventRegistrationModal
        key={modalKey}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleRegistrationSuccess}
        eventTitle={event.title}
      />

      {/* Success Toast */}
      <EventRegistrationToast
        isVisible={showToast}
        onClose={handleCloseToast}
      />
    </article>
  )
}

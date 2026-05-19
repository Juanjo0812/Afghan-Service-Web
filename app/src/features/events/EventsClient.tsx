'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Calendar as CalendarIcon, Clock, MapPin, List, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react'
import { FadeIn } from '@/components/FadeIn'
import { useLanguage } from '@/hooks/useLanguage'
import { localizePath } from '@/lib/navigation'
import { formatEventDate, formatEventMonth, formatEventShortMonth } from '@/lib/formatDate'
import type { EventContent, EventCategory } from '@/domain/content'
import type { LangCode } from '@/domain/language'

type ViewMode = 'list' | 'calendar'

interface CalendarEvent {
  id: string
  slug: string
  title: string
  category: EventCategory
  categoryLabel: string
  date: string
  day: number
  month: string
  time: string
  location: string
  description: string
  cta: string
  ctaType: 'primary' | 'secondary' | 'text'
  ctaUrl?: string
  imageUrl?: string
}

function toPlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function toCalendarEvent(event: EventContent, lang: LangCode): CalendarEvent {
  const start = new Date(event.startDate)
  const day = start.getDate()
  const month = formatEventShortMonth(start, lang)
  const date = formatEventDate(event.startDate, lang)

  // Derive CTA type from category to preserve existing visual design
  let ctaType: CalendarEvent['ctaType']
  switch (event.category) {
    case 'immigration':
      ctaType = 'primary'
      break
    case 'legal':
    case 'cultural':
      ctaType = 'secondary'
      break
    case 'holiday':
      ctaType = 'text'
      break
    default:
      ctaType = 'primary'
  }

  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    category: event.category,
    categoryLabel: event.categoryLabel,
    date,
    day,
    month,
    time: event.timeLabel,
    location: event.location,
    description: toPlainText(event.description),
    cta: event.ctaLabel,
    ctaType,
    ctaUrl: event.ctaUrl,
    imageUrl: event.imageUrl,
  }
}

const categoryColors: Record<EventCategory | 'all', string> = {
  all: 'bg-amber',
  immigration: 'bg-amber',
  legal: 'bg-olive',
  cultural: 'bg-forest-light',
  holiday: 'bg-forest',
}

function EventCard({ event }: { event: CalendarEvent }) {
  const { t } = useTranslation('events')
  const router = useRouter()
  const { lang } = useLanguage()
  const colorClass = categoryColors[event.category] || 'bg-amber'

  const handleCtaClick = () => {
    if (event.ctaUrl) {
      window.open(event.ctaUrl, '_blank', 'noopener,noreferrer')
    } else {
      router.push(localizePath('/contact', lang))
    }
  }

  const handleDetailsClick = () => {
    router.push(localizePath(`/events/${event.slug}`, lang))
  }

  return (
    <div className="bg-white border border-amber/40 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:bg-cream-dark hover:shadow-card-hover transition-all">
      <div className="w-full md:w-2/5 h-64 md:h-auto bg-warm-sand/20 relative">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : null}
        <div className={`absolute top-4 left-4 ${colorClass} text-white px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider shadow-sm`}>
          {event.categoryLabel}
        </div>
      </div>
      <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-forest-light mb-3 text-sm">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-amber" />
              <span>{event.date}</span>
            </div>
            <span className="hidden md:inline mx-1">•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber" />
              <span>{event.time}</span>
            </div>
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-forest mb-4">{event.title}</h2>
          <p className="text-forest-light mb-6 line-clamp-3">
            {event.description}
          </p>
          <div className="flex items-start gap-2 text-forest-light text-sm mb-6">
            <MapPin className="w-4 h-4 text-amber flex-shrink-0 mt-0.5" />
            <span>{event.location}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-auto">
          {event.ctaType === 'primary' && (
            <button onClick={handleCtaClick} className="btn-primary w-full md:w-auto">
              {event.cta}
            </button>
          )}
          {event.ctaType === 'secondary' && (
            <button onClick={handleCtaClick} className="btn-secondary w-full md:w-auto">
              {event.cta}
            </button>
          )}
          {event.ctaType === 'text' && (
            <span className="text-forest-light text-sm">
              {t('contactUsInfo')}
            </span>
          )}
          {event.ctaType !== 'text' && (
            <button onClick={handleDetailsClick} className="text-forest font-medium hover:text-amber transition-colors ml-auto md:ml-0 underline underline-offset-4">
              {t('details')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function CalendarView({ filteredEvents, lang }: { filteredEvents: CalendarEvent[]; lang: LangCode }) {
  const { t } = useTranslation('events')
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthName = formatEventMonth(currentMonth, lang)
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getEventsForDay = (day: number) =>
    filteredEvents.filter((e) => e.month === formatEventShortMonth(currentMonth, lang) && e.day === day)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="p-2 rounded-md hover:bg-cream-dark transition-colors focus:outline-none focus:ring-2 focus:ring-amber" aria-label={t('aria.previousMonth')}>
          <ChevronLeft className="w-5 h-5 text-forest" />
        </button>
        <h3 className="font-display text-heading-3 text-forest">{monthName}</h3>
        <button onClick={nextMonth} className="p-2 rounded-md hover:bg-cream-dark transition-colors focus:outline-none focus:ring-2 focus:ring-amber" aria-label={t('aria.nextMonth')}>
          <ChevronRight className="w-5 h-5 text-forest" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-warm-sand/50 rounded-xl overflow-hidden border border-warm-sand/50">
        {days.map((day) => (
          <div key={day} className="bg-cream py-2 text-center text-xs font-semibold text-forest-light uppercase">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-white min-h-[80px] md:min-h-[100px]" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dayEvents = getEventsForDay(day)
          return (
            <div
              key={day}
              className="bg-white min-h-[80px] md:min-h-[100px] p-1.5 md:p-2 hover:bg-cream-dark transition-colors cursor-pointer"
            >
              <span className="text-sm text-forest font-medium">{day}</span>
              <div className="mt-1 space-y-0.5">
                {dayEvents.map((e) => (
                  <div key={e.id} className={`${categoryColors[e.category]} rounded px-1.5 py-0.5`}>
                    <span className="text-[10px] text-white font-medium truncate block">{e.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface EventsClientProps {
  events: EventContent[]
}

export default function EventsClient({ events }: EventsClientProps) {
  const { t } = useTranslation('events')
  const { lang } = useLanguage()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [activeFilter, setActiveFilter] = useState<EventCategory | 'all'>('all')

  const calendarEvents = events.map((e) => toCalendarEvent(e, lang))

  const filters: { label: string; value: EventCategory | 'all' }[] = [
    { label: t('filters.all'), value: 'all' },
    { label: t('filters.immigration'), value: 'immigration' },
    { label: t('filters.legal'), value: 'legal' },
    { label: t('filters.cultural'), value: 'cultural' },
    { label: t('filters.holiday'), value: 'holiday' },
  ]

  const filteredEvents = activeFilter === 'all'
    ? calendarEvents
    : calendarEvents.filter((e) => e.category === activeFilter)

  return (
    <>
      {/* Page Header */}
      <section className="relative min-h-[45vh]" aria-label="Events header">
        <div className="absolute inset-0">
          <img
            src="/images/hero-events.jpg"
            alt="Community workshop"
            className="w-full h-full object-cover object-[center-50%]"
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

      {/* Controls */}
      <section className="pt-8 pb-4 bg-cream">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* View toggle */}
            <div className="flex rounded-md border border-warm-sand bg-white overflow-hidden" role="group" aria-label="View mode">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber ${
                  viewMode === 'list' ? 'bg-forest text-white' : 'text-forest hover:bg-cream-dark'
                }`}
                aria-pressed={viewMode === 'list'}
              >
                <List className="w-4 h-4" aria-hidden="true" />
                {t('listView')}
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber ${
                  viewMode === 'calendar' ? 'bg-forest text-white' : 'text-forest hover:bg-cream-dark'
                }`}
                aria-pressed={viewMode === 'calendar'}
              >
                <LayoutGrid className="w-4 h-4" aria-hidden="true" />
                {t('calendarView')}
              </button>
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Event filters">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber ${
                  activeFilter === filter.value
                    ? 'bg-amber text-white'
                    : 'bg-white text-forest border border-warm-sand/60 hover:bg-cream-dark'
                }`}
                aria-pressed={activeFilter === filter.value}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Event List or Calendar */}
      <section className="section-padding bg-cream" aria-label="Events">
        <div className="container-main">
          {viewMode === 'list' ? (
            <div className="space-y-5">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <FadeIn key={event.id} delay={index * 150} duration={800}>
                    <EventCard event={event} />
                  </FadeIn>
                ))
              ) : (
                <div className="text-center py-12 text-forest-light">
                  {t('noEvents')}
                </div>
              )}
            </div>
          ) : (
            <CalendarView filteredEvents={filteredEvents} lang={lang} />
          )}
        </div>
      </section>
    </>
  )
}

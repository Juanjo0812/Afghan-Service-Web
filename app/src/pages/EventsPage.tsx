import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, MapPin, List, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react'


type ViewMode = 'list' | 'calendar'
type EventCategory = 'all' | 'immigration' | 'legal' | 'cultural' | 'holiday'

interface Event {
  id: number
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
  imageUrl?: string
}

const events: Event[] = [
  {
    id: 1,
    title: 'Free Citizenship Workshop',
    category: 'immigration',
    categoryLabel: 'Immigration Workshops',
    date: 'Saturday, June 13, 2026',
    day: 13,
    month: 'JUN',
    time: '9:00 AM \u2013 2:00 PM',
    location: 'Catholic Charities Community Center, 5151 N 19th Ave, Phoenix',
    description: 'Immigration attorneys will assist with citizenship applications. Bring your green card and passport. Lunch provided. Registration required.',
    cta: 'Register Now',
    ctaType: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Know Your Rights Training',
    category: 'legal',
    categoryLabel: 'Legal Clinics',
    date: 'Tuesday, June 23, 2026',
    day: 23,
    month: 'JUN',
    time: '6:00 PM \u2013 8:00 PM',
    location: 'Phoenix Public Library \u2014 Burton Barr Central Library',
    description: 'Learn about your rights when interacting with police and immigration agents. Materials available in Dari, Pashto, and English.',
    cta: 'Register Now',
    ctaType: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Afghan Community Eid Gathering',
    category: 'cultural',
    categoryLabel: 'Cultural Gatherings',
    date: 'Sunday, June 28, 2026',
    day: 28,
    month: 'JUN',
    time: '11:00 AM \u2013 4:00 PM',
    location: 'Encanto Park, Phoenix',
    description: 'Join the Afghan community for an Eid celebration. Food, music, children\'s activities, and community connection. All are welcome.',
    cta: 'Register Now',
    ctaType: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01c80cb8fa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Free Legal Clinic \u2014 Immigration Q&A',
    category: 'legal',
    categoryLabel: 'Legal Clinics',
    date: 'Saturday, July 11, 2026',
    day: 11,
    month: 'JUL',
    time: '10:00 AM \u2013 1:00 PM',
    location: 'Catholic Charities Community Center',
    description: 'Drop-in legal clinic. Immigration attorneys available to answer your questions. First come, first served.',
    cta: 'Register Now',
    ctaType: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    title: 'Eid al-Adha Community Celebration',
    category: 'holiday',
    categoryLabel: 'Afghan Holidays',
    date: 'Friday, September 11, 2026',
    day: 11,
    month: 'SEP',
    time: '10:00 AM \u2013 3:00 PM',
    location: 'South Mountain Park, Phoenix',
    description: 'Community celebration of Eid al-Adha. Prayer, feast, and fellowship. Bring your family.',
    cta: 'Register Now',
    ctaType: 'primary',
    imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
]

const filters: { label: string; value: EventCategory }[] = [
  { label: 'All Events', value: 'all' },
  { label: 'Immigration Workshops', value: 'immigration' },
  { label: 'Legal Clinics', value: 'legal' },
  { label: 'Cultural Gatherings', value: 'cultural' },
  { label: 'Afghan Holidays', value: 'holiday' },
]

const categoryColors: Record<EventCategory, string> = {
  all: 'bg-amber',
  immigration: 'bg-amber',
  legal: 'bg-olive',
  cultural: 'bg-forest-light',
  holiday: 'bg-forest',
}

function EventCard({ event }: { event: Event }) {
  const colorClass = categoryColors[event.category] || 'bg-amber'
  const imageUrl = event.imageUrl || 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'

  return (
    <div className="bg-white border border-amber/40 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:bg-cream-dark hover:shadow-card-hover transition-all">
      <div className="w-full md:w-2/5 h-64 md:h-auto bg-warm-sand/20 relative">
        <img alt={event.title} className="w-full h-full object-cover" src={imageUrl} />
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
            <button onClick={() => alert('Registration coming soon')} className="btn-primary w-full md:w-auto">
              {event.cta}
            </button>
          )}
          {event.ctaType === 'secondary' && (
            <button onClick={() => alert('More info coming soon')} className="btn-secondary w-full md:w-auto">
              {event.cta}
            </button>
          )}
          {event.ctaType === 'text' && (
            <button onClick={() => alert('Details coming soon')} className="btn-white-outline w-full md:w-auto">
              {event.cta}
            </button>
          )}
          {event.ctaType !== 'text' && (
            <button onClick={() => alert('Details coming soon')} className="text-forest font-medium hover:text-amber transition-colors ml-auto md:ml-0 underline underline-offset-4">
              Details
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function CalendarView({ filteredEvents }: { filteredEvents: Event[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1)) // June 2026

  const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getEventsForDay = (day: number) =>
    filteredEvents.filter((e) => e.month === currentMonth.toLocaleString('en-US', { month: 'short' }).toUpperCase() && e.day === day)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="p-2 rounded-md hover:bg-cream-dark transition-colors focus:outline-none focus:ring-2 focus:ring-amber" aria-label="Previous month">
          <ChevronLeft className="w-5 h-5 text-forest" />
        </button>
        <h3 className="font-display text-heading-3 text-forest">{monthName}</h3>
        <button onClick={nextMonth} className="p-2 rounded-md hover:bg-cream-dark transition-colors focus:outline-none focus:ring-2 focus:ring-amber" aria-label="Next month">
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

export default function EventsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [activeFilter, setActiveFilter] = useState<EventCategory>('all')

  const filteredEvents = activeFilter === 'all' ? events : events.filter((e) => e.category === activeFilter)

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
            <span className="label-text text-amber block mb-3">EVENTS</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-display-xl text-white mb-4 leading-tight">
              Events Calendar
            </h1>
            <p className="text-body-lg text-white/85 max-w-2xl">
              Join us for workshops, legal clinics, cultural gatherings, and community events.
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
                List View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber ${
                  viewMode === 'calendar' ? 'bg-forest text-white' : 'text-forest hover:bg-cream-dark'
                }`}
                aria-pressed={viewMode === 'calendar'}
              >
                <LayoutGrid className="w-4 h-4" aria-hidden="true" />
                Calendar View
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
                filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
              ) : (
                <div className="text-center py-12 text-forest-light">
                  No events found for this category.
                </div>
              )}
            </div>
          ) : (
            <CalendarView filteredEvents={filteredEvents} />
          )}
        </div>
      </section>
    </>
  )
}

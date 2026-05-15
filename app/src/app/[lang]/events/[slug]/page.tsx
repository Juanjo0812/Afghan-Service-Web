import { getEventBySlug } from '@/server/cms/wordpress'
import { generateEventDetailMetadata } from '@/server/seo/metadata'
import { notFound } from 'next/navigation'
import { localizePath } from '@/lib/navigation'
import type { LangCode } from '@/domain/language'

export function generateStaticParams() {
  return [{ lang: 'dari' }, { lang: 'uzbek' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  return generateEventDetailMetadata(slug, lang as LangCode)
}

export const revalidate = 3600

export default async function EventDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const event = await getEventBySlug(slug, lang as LangCode)

  if (!event) {
    notFound()
  }

  return (
    <article className="bg-cream min-h-screen">
      {/* Page Header */}
      <section className="relative min-h-[40vh]" aria-label="Event header">
        <div className="absolute inset-0">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
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
                <span className="font-semibold text-forest">Date:</span>
                <span>{event.timeLabel}</span>
              </div>
              <span className="hidden md:inline">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-forest">Location:</span>
                <span>{event.location}</span>
              </div>
            </div>

            <div
              className="prose prose-forest max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: event.description }}
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
              <a href={localizePath('/contact', lang as LangCode)} className="btn-primary inline-block">
                {event.ctaLabel}
              </a>
            )}
          </div>
        </div>
      </section>
    </article>
  )
}

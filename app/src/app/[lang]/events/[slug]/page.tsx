import { getEventBySlug } from '@/server/cms/cms-cache'
import { generateEventDetailMetadata } from '@/server/seo/metadata'
import EventDetail from '@/features/events/EventDetail'
import { notFound } from 'next/navigation'
import type { LangCode } from '@/domain/language'
import { assertValidLang } from '@/lib/routeGuard'

export function generateStaticParams() {
  return [{ lang: 'dari' }, { lang: 'uzbek' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  assertValidLang(lang)
  return generateEventDetailMetadata(slug, lang as LangCode)
}

export const revalidate = 3600

export default async function EventDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  assertValidLang(lang)
  const event = await getEventBySlug(slug, lang as LangCode)

  if (!event) {
    notFound()
  }

  return <EventDetail event={event} />
}

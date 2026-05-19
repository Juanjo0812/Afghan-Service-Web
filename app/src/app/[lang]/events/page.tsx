import { getEvents } from '@/server/cms/cms-cache'
import EventsClient from '@/features/events/EventsClient'
import { generatePageMetadata } from '@/server/seo/metadata'
import type { LangCode } from '@/domain/language'
import { assertValidLang } from '@/lib/routeGuard'

export function generateStaticParams() {
  return [{ lang: 'dari' }, { lang: 'uzbek' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  assertValidLang(lang)
  return generatePageMetadata('events', lang as LangCode)
}

export const revalidate = 3600

export default async function EventsPageRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  assertValidLang(lang)
  const events = await getEvents(lang as LangCode)
  return <EventsClient events={events} />
}

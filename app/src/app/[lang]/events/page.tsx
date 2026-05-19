import { getEvents } from '@/server/cms/wordpress'
import EventsClient from '@/features/events/EventsClient'
import { generatePageMetadata } from '@/server/seo/metadata'
import type { LangCode } from '@/domain/language'

export function generateStaticParams() {
  return [{ lang: 'dari' }, { lang: 'uzbek' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return generatePageMetadata('events', lang as LangCode)
}

export const revalidate = 3600

export default async function EventsPageRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const events = await getEvents(lang as LangCode)
  return <EventsClient events={events} />
}

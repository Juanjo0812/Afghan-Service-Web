import { getEvents } from '@/server/cms/wordpress'
import EventsClient from '@/features/events/EventsClient'
import { generatePageMetadata } from '@/server/seo/metadata'

export async function generateMetadata() {
  return generatePageMetadata('events', 'en')
}

export const revalidate = 3600

export default async function EventsPageRoute() {
  const events = await getEvents('en')
  return <EventsClient events={events} />
}

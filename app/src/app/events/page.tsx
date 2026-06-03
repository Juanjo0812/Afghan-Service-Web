import { getEvents } from '@/server/cms/cms-cache'
import EventsClient from '@/features/events/EventsClient'
import { generatePageMetadata } from '@/server/seo/metadata'

export async function generateMetadata() {
  return generatePageMetadata('events', 'dari')
}

export const revalidate = 3600

export default async function EventsPageRoute() {
  const events = await getEvents('dari')
  return <EventsClient events={events} />
}

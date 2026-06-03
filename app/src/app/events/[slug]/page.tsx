import { getEventBySlug } from '@/server/cms/cms-cache'
import { generateEventDetailMetadata } from '@/server/seo/metadata'
import EventDetail from '@/features/events/EventDetail'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return generateEventDetailMetadata(slug, 'dari')
}

export const revalidate = 3600

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlug(slug, 'dari')

  if (!event) {
    notFound()
  }

  return <EventDetail event={event} />
}

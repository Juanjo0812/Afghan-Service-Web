import { generatePageMetadata } from '@/server/seo/metadata'
import { getEvents } from '@/server/cms/cms-cache'
import type { EventContent } from '@/domain/content'
import HomePage from '@/page-views/HomePage'

export const revalidate = 3600

export async function generateMetadata() {
  return generatePageMetadata('home', 'en')
}

export default async function Home() {
  let featuredEvent: EventContent | null = null
  try {
    const events = await getEvents('en')
    const now = new Date()
    const upcoming = events
      .filter(e => new Date(e.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    featuredEvent = upcoming[0] ?? null
  } catch {
    // WordPress unavailable — featuredEvent remains null (graceful degradation)
  }
  return <HomePage featuredEvent={featuredEvent} lang="en" />
}

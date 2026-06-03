import { generatePageMetadata } from '@/server/seo/metadata'
import { getEvents } from '@/server/cms/cms-cache'
import type { EventContent } from '@/domain/content'
import type { LangCode } from '@/domain/language'
import { assertValidLang } from '@/lib/routeGuard'
import HomePage from '@/page-views/HomePage'

export const revalidate = 3600

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'uzbek' }, { lang: 'pashto' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  assertValidLang(lang)
  return generatePageMetadata('home', lang as LangCode)
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  assertValidLang(lang)
  let featuredEvent: EventContent | null = null
  try {
    const events = await getEvents(lang as LangCode)
    const now = new Date()
    const upcoming = events
      .filter(e => new Date(e.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    featuredEvent = upcoming[0] ?? null
  } catch {
    // WordPress unavailable — featuredEvent remains null (graceful degradation)
  }
  return <HomePage featuredEvent={featuredEvent} lang={lang as LangCode} />
}

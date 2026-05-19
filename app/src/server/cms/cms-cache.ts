import { revalidateTag } from 'next/cache'
import type { LangCode } from '@/domain/language'
import {
  getEvents as wpGetEvents,
  getEventBySlug as wpGetEventBySlug,
  getPageMetadata as wpGetPageMetadata,
} from './wordpress'
import type { EventContent, PageMetadata } from '@/domain/content'

export async function getEvents(lang: LangCode): Promise<EventContent[]> {
  try {
    return await wpGetEvents(lang)
  } catch (err) {
    console.warn('[CMS Cache] Fetch failed:', err)
    return []
  }
}

export async function getEventBySlug(
  slug: string,
  lang: LangCode
): Promise<EventContent | null> {
  try {
    return await wpGetEventBySlug(slug, lang)
  } catch (err) {
    console.warn('[CMS Cache] Fetch failed:', err)
    return null
  }
}

export async function getPageMetadata(
  routeKey: string,
  lang: LangCode
): Promise<PageMetadata | null> {
  try {
    return await wpGetPageMetadata(routeKey, lang)
  } catch (err) {
    console.warn('[CMS Cache] Fetch failed:', err)
    return null
  }
}

/**
 * Clear the CMS cache by revalidating Next.js cache tags.
 * Call this after a revalidation webhook or when you need to force fresh data.
 */
export function clearCmsCache(): void {
  revalidateTag('events', 'default')
  revalidateTag('metadata', 'default')
}

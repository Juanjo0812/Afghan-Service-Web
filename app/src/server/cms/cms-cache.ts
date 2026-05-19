import type { LangCode } from '@/domain/language'
import {
  getEvents as wpGetEvents,
  getEventBySlug as wpGetEventBySlug,
  getPageMetadata as wpGetPageMetadata,
} from './wordpress'
import type { EventContent, PageMetadata } from '@/domain/content'

// Revalidation interval in seconds (1 hour default)
const REVALIDATE_SECONDS = 3600

interface CacheEntry<T> {
  data: T
  fetchedAt: number
}

const cache = new Map<string, CacheEntry<unknown>>()

function cacheKey(fn: string, ...args: string[]): string {
  return `${fn}:${args.join(':')}`
}

function isStale(entry: CacheEntry<unknown>): boolean {
  return Date.now() - entry.fetchedAt > REVALIDATE_SECONDS * 1000
}

async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  fallback: T
): Promise<T> {
  const cached = cache.get(key)
  if (cached && !isStale(cached as CacheEntry<unknown>)) {
    return cached.data as T
  }

  try {
    const data = await fetcher()
    cache.set(key, { data, fetchedAt: Date.now() })
    return data
  } catch (err) {
    console.warn('[CMS Cache] Fetch failed, using fallback:', err)
    if (cached) {
      // Return stale data rather than falling back to empty defaults
      return cached.data as T
    }
    return fallback
  }
}

export async function getEvents(lang: LangCode): Promise<EventContent[]> {
  return withCache(
    cacheKey('getEvents', lang),
    () => wpGetEvents(lang),
    []
  )
}

export async function getEventBySlug(
  slug: string,
  lang: LangCode
): Promise<EventContent | null> {
  return withCache(
    cacheKey('getEventBySlug', slug, lang),
    () => wpGetEventBySlug(slug, lang),
    null
  )
}

export async function getPageMetadata(
  routeKey: string,
  lang: LangCode
): Promise<PageMetadata | null> {
  return withCache(
    cacheKey('getPageMetadata', routeKey, lang),
    () => wpGetPageMetadata(routeKey, lang),
    null
  )
}

/**
 * Clear the in-memory CMS cache. Call this after a revalidation webhook
 * or when you need to force fresh data.
 */
export function clearCmsCache(): void {
  cache.clear()
}

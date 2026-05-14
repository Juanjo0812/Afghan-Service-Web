import type { EventContent, PageMetadata } from '@/domain/content'
import type { LangCode } from '@/domain/language'
import {
  wpEventsListSchema,
  wpPageMetaListSchema,
} from './wordpress.schemas'
import {
  mapWPEventToDomain,
  mapWPPageMetaToDomain,
} from './wordpress.mappers'

const WP_BASE = process.env.WORDPRESS_API_BASE_URL

function getLanguageParam(lang: LangCode): string {
  // WordPress may store the language meta value as the full code
  return lang
}

async function fetchFromWP(
  endpoint: string,
  options?: RequestInit
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  if (!WP_BASE) {
    return { ok: false, error: 'WORDPRESS_API_BASE_URL not configured' }
  }

  const url = `${WP_BASE}${endpoint}`

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return { ok: false, error: `WP responded ${response.status}` }
    }

    const data = await response.json()
    return { ok: true, data }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: message }
  }
}

export async function getEvents(lang: LangCode): Promise<EventContent[]> {
  const result = await fetchFromWP(
    `/events?_embed&per_page=100&orderby=date&order=desc&lang=${getLanguageParam(lang)}`
  )

  if (!result.ok) {
    console.warn('[CMS] getEvents failed:', result.error)
    return []
  }

  const parseResult = wpEventsListSchema.safeParse(result.data)
  if (!parseResult.success) {
    console.warn('[CMS] getEvents validation failed:', parseResult.error)
    return []
  }

  return parseResult.data.map((wpEvent) => mapWPEventToDomain(wpEvent, lang))
}

export async function getEventBySlug(
  slug: string,
  lang: LangCode
): Promise<EventContent | null> {
  const result = await fetchFromWP(
    `/events?_embed&slug=${encodeURIComponent(slug)}&lang=${getLanguageParam(lang)}`
  )

  if (!result.ok) {
    console.warn('[CMS] getEventBySlug failed:', result.error)
    return null
  }

  const parseResult = wpEventsListSchema.safeParse(result.data)
  if (!parseResult.success) {
    console.warn('[CMS] getEventBySlug validation failed:', parseResult.error)
    return null
  }

  const events = parseResult.data
  if (events.length === 0) {
    return null
  }

  return mapWPEventToDomain(events[0], lang)
}

export async function getPageMetadata(
  routeKey: string,
  lang: LangCode
): Promise<PageMetadata | null> {
  const result = await fetchFromWP(
    `/site-metadata?route_key=${encodeURIComponent(routeKey)}&lang=${getLanguageParam(lang)}&per_page=1`
  )

  if (!result.ok) {
    console.warn('[CMS] getPageMetadata failed:', result.error)
    return null
  }

  const parseResult = wpPageMetaListSchema.safeParse(result.data)
  if (!parseResult.success) {
    console.warn('[CMS] getPageMetadata validation failed:', parseResult.error)
    return null
  }

  const records = parseResult.data
  if (records.length === 0) {
    return null
  }

  return mapWPPageMetaToDomain(records[0], routeKey)
}

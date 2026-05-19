import type { EventContent, PageMetadata, EventCategory } from '@/domain/content'
import type { LangCode } from '@/domain/language'
import type { ValidatedWPEvent, ValidatedWPPageMeta } from './wordpress.schemas'

const CATEGORY_LABELS: Record<EventCategory, Record<LangCode, string>> = {
  immigration: {
    en: 'Immigration Workshop',
    dari: 'کارگاه مهاجرت',
    uzbek: 'Immigratsiya seminar',
  },
  legal: {
    en: 'Legal Clinic',
    dari: 'کلینیک حقوقی',
    uzbek: 'Yuridik klinika',
  },
  cultural: {
    en: 'Cultural Gathering',
    dari: 'گردهمایی فرهنگی',
    uzbek: 'Madaniy uchrashuv',
  },
  holiday: {
    en: 'Afghan Holiday',
    dari: 'عید افغان',
    uzbek: 'Afg\'on bayrami',
  },
}

function isValidCategory(cat: string): cat is EventCategory {
  return ['immigration', 'legal', 'cultural', 'holiday'].includes(cat)
}

function buildTimeLabel(startDate: string, endDate?: string): string {
  try {
    const start = new Date(startDate)
    const startStr = start.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    if (endDate) {
      const end = new Date(endDate)
      const endStr = end.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      return `${startStr} — ${endStr}`
    }
    return startStr
  } catch {
    return startDate
  }
}

export function mapWPEventToDomain(
  wp: ValidatedWPEvent,
  lang: LangCode
): EventContent {
  const meta = wp.meta
  const category = isValidCategory(meta._asp_event_category || '')
    ? (meta._asp_event_category as EventCategory)
    : 'cultural'

  const categoryLabel = CATEGORY_LABELS[category][lang] ?? CATEGORY_LABELS[category].en

  const startDate = meta._asp_event_start_date || ''
  const endDate = meta._asp_event_end_date || undefined

  // Resolve image URL: prefer featured_image_url, then _embedded media
  let imageUrl: string | undefined
  if (wp.featured_image_url) {
    imageUrl = wp.featured_image_url
  } else if (wp._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    imageUrl = wp._embedded['wp:featuredmedia'][0].source_url
  }

  return {
    id: String(wp.id),
    slug: wp.slug,
    title: wp.title.rendered,
    description: wp.content.rendered,
    category,
    categoryLabel,
    startDate,
    endDate,
    timeLabel: buildTimeLabel(startDate, endDate),
    location: meta._asp_event_location || '',
    ctaLabel: meta._asp_cta_label || 'Learn More',
    ctaUrl: meta._asp_cta_url || undefined,
    imageUrl,
  }
}

export function mapWPPageMetaToDomain(
  wp: ValidatedWPPageMeta,
  routeKey: string
): PageMetadata {
  const meta = wp.meta
  const title = meta._asp_seo_title || wp.title.rendered
  const description = meta._asp_seo_description || ''

  let ogImage: string | undefined
  if (wp.og_image_url) {
    ogImage = wp.og_image_url
  }

  return {
    title,
    description,
    ogTitle: meta._asp_og_title || undefined,
    ogDescription: meta._asp_og_description || undefined,
    ogImage,
    canonicalPath: `/${routeKey}`,
  }
}

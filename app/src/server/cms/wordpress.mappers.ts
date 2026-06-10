import type { EventContent, PageMetadata, EventCategory } from '@/domain/content'
import type { LangCode } from '@/domain/language'
import type { ValidatedWPEvent, ValidatedWPPageMeta } from './wordpress.schemas'
import { formatEventTimeLabel } from '@/lib/formatDate'

const CATEGORY_LABELS: Record<EventCategory, Record<LangCode, string>> = {
  immigration: {
    en: 'Immigration Workshop',
    dari: 'کارگاه مهاجرت',
    uzbek: 'مهاجرت کارگاهی',
    pashto: 'د مهاجرت ورکشاپ',
  },
  legal: {
    en: 'Legal Clinic',
    dari: 'کلینیک حقوقی',
    uzbek: 'حقوقی کلینیکه',
    pashto: 'حقوقي کلینیک',
  },
  cultural: {
    en: 'Cultural Gathering',
    dari: 'گردهمایی فرهنگی',
    uzbek: 'مدنی یغین',
    pashto: 'کلتوري غونډه',
  },
  holiday: {
    en: 'Afghan Holiday',
    dari: 'عید افغان',
    uzbek: 'افغانستان بیرامی',
    pashto: 'د افغانستان رخصتي',
  },
}

function isValidCategory(cat: string): cat is EventCategory {
  return ['immigration', 'legal', 'cultural', 'holiday'].includes(cat)
}

function getTranslationMeta(
  meta: ValidatedWPEvent['meta'],
  lang: LangCode
): Pick<EventContent, 'translationStatus' | 'translationModel' | 'translationGeneratedAt'> {
  if (lang === 'en') return {}
  const m = meta as Record<string, string | undefined>
  const suffix = lang as string
  return {
    translationStatus: m[`_asp_translation_status_${suffix}`] as EventContent['translationStatus'],
    translationModel: m[`_asp_translation_model_${suffix}`],
    translationGeneratedAt: m[`_asp_translation_generated_at_${suffix}`],
  }
}

function resolveEventFields(
  wp: ValidatedWPEvent,
  lang: LangCode
): Pick<EventContent, 'title' | 'description' | 'location' | 'ctaLabel'> {
  const meta = wp.meta
  if (lang === 'en') {
    return {
      title: wp.title.rendered,
      description: wp.content.rendered,
      location: meta._asp_event_location || '',
      ctaLabel: meta._asp_cta_label || 'Learn More',
    }
  }
  const m = meta as Record<string, string | undefined>
  const suffix = lang as string
  return {
    title: m[`_asp_event_title_${suffix}`] || wp.title.rendered,
    description: m[`_asp_event_description_${suffix}`] || wp.content.rendered,
    location: m[`_asp_event_location_${suffix}`] || meta._asp_event_location || '',
    ctaLabel: m[`_asp_cta_label_${suffix}`] || meta._asp_cta_label || 'Learn More',
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

  const fields = resolveEventFields(wp, lang)
  const translationMeta = getTranslationMeta(meta, lang)

  return {
    id: String(wp.id),
    slug: wp.slug,
    ...fields,
    category,
    categoryLabel,
    startDate,
    endDate,
    timeLabel: formatEventTimeLabel(startDate, endDate, lang),
    ctaUrl: meta._asp_cta_url || undefined,
    imageUrl,
    ...translationMeta,
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

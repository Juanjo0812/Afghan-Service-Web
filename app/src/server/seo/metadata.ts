import type { Metadata } from 'next'
import type { LangCode } from '@/domain/language'
import { getPageMetadata, getEventBySlug } from '@/server/cms/cms-cache'
import { getHtmlLang, SUPPORTED_LANGUAGES } from '@/domain/language'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afghansupport.org'

const STATIC_DEFAULTS: Record<string, { title: string; description: string }> = {
  home: {
    title: 'Afghan Support Phoenix — Free Immigration & Community Help',
    description:
      'Free immigration, legal, and community support for Afghan families in Phoenix, Arizona. Asylum applications, work permits, legal rights, community resources, and events. Services provided by Catholic Charities AZ.',
  },
  events: {
    title: 'Events — Afghan Support Phoenix',
    description:
      'Community events, workshops, and legal clinics for Afghan families in Phoenix. Find immigration help, cultural gatherings, and Know Your Rights trainings.',
  },
  stories: {
    title: 'Stories — Afghan Support Phoenix',
    description:
      'Stories from the Afghan community in Phoenix. Read about journeys, resilience, and community support.',
  },
  contact: {
    title: 'Contact — Afghan Support Phoenix',
    description:
      'Get in touch with Afghan Support Phoenix. Free immigration and legal help for Afghan families in Arizona.',
  },
  immigration: {
    title: 'Immigration Help — Afghan Support Phoenix',
    description:
      'Free immigration services for Afghan families in Phoenix. Asylum, work permits, green cards, and citizenship.',
  },
  rights: {
    title: 'Know Your Rights — Afghan Support Phoenix',
    description:
      'Legal rights information for Afghan families in Arizona. Know your rights when interacting with police and immigration agents.',
  },
  resources: {
    title: 'Resources — Afghan Support Phoenix',
    description:
      'Community resources for Afghan families in Phoenix. Housing, healthcare, education, and legal aid.',
  },
}

function buildCanonicalUrl(routeKey: string, lang: LangCode): string {
  const path = routeKey === 'home' ? '/' : `/${routeKey}`
  if (lang === 'en') {
    return `${SITE_URL}${path}`
  }
  return `${SITE_URL}/${lang}${path}`
}

function buildAlternateLangs(routeKey: string): Record<string, string> {
  const path = routeKey === 'home' ? '/' : `/${routeKey}`
  const alts: Record<string, string> = {}

  for (const code of SUPPORTED_LANGUAGES) {
    const htmlLang = getHtmlLang(code)
    if (code === 'en') {
      alts[htmlLang] = `${SITE_URL}${path}`
    } else {
      alts[htmlLang] = `${SITE_URL}/${code}${path}`
    }
  }

  alts['x-default'] = `${SITE_URL}${path}`
  return alts
}

function toPlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncateDescription(value: string, maxLength = 160): string {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1).trim()}…`
}

export async function generatePageMetadata(
  routeKey: string,
  lang: LangCode
): Promise<Metadata> {
  // Resolution order: 1. WordPress metadata
  const wpMeta = await getPageMetadata(routeKey, lang)

  // 2. Static defaults
  const defaults = STATIC_DEFAULTS[routeKey] || STATIC_DEFAULTS.home
  const title = wpMeta?.title ?? defaults.title
  const description = wpMeta?.description ?? defaults.description
  const ogTitle = wpMeta?.ogTitle ?? title
  const ogDescription = wpMeta?.ogDescription ?? description
  const ogImage = wpMeta?.ogImage

  const canonicalUrl = buildCanonicalUrl(routeKey, lang)

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: 'Afghan Support Phoenix',
      locale: lang === 'dari' ? 'fa_AF' : lang === 'uzbek' ? 'uz_UZ' : 'en_US',
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternateLangs(routeKey),
    },
  }
}

export async function generateEventDetailMetadata(
  slug: string,
  lang: LangCode
): Promise<Metadata> {
  // Resolution order: 1. Event-specific metadata, 2. WordPress events page metadata, 3. static defaults
  const event = await getEventBySlug(slug, lang)

  if (event) {
    const title = event.seo?.title ?? `${event.title} — Afghan Support Phoenix`
    const description =
      event.seo?.description ??
      truncateDescription(toPlainText(event.description))
    const ogTitle = event.seo?.ogTitle ?? title
    const ogDescription = event.seo?.ogDescription ?? description
    const ogImage = event.seo?.ogImage ?? event.imageUrl

    const canonicalUrl = buildCanonicalUrl(`events/${slug}`, lang)

    return {
      title,
      description,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: canonicalUrl,
        siteName: 'Afghan Support Phoenix',
        locale: lang === 'dari' ? 'fa_AF' : lang === 'uzbek' ? 'uz_UZ' : 'en_US',
        type: 'article',
        ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title: ogTitle,
        description: ogDescription,
        ...(ogImage ? { images: [ogImage] } : {}),
      },
      alternates: {
        canonical: canonicalUrl,
        languages: buildAlternateLangs(`events/${slug}`),
      },
    }
  }

  // Fallback to events page metadata
  return generatePageMetadata('events', lang)
}

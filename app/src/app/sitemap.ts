import type { MetadataRoute } from 'next'
import { SUPPORTED_LANGUAGES } from '@/domain/language'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afghansupport.org'

const CORE_ROUTES = ['', '/immigration', '/rights', '/resources', '/events', '/contact', '/stories']

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const route of CORE_ROUTES) {
    // English (canonical)
    entries.push({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '/events' ? 'daily' : 'weekly',
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          SUPPORTED_LANGUAGES.filter(l => l !== 'en').map(lang => [
            lang === 'dari' ? 'fa' : 'uz',
            `${SITE_URL}/${lang}${route}`,
          ])
        ),
      },
    })
  }

  return entries
}

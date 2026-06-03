import type { MetadataRoute } from 'next'
import { getHtmlLang, SUPPORTED_LANGUAGES, type LangCode } from '@/domain/language'
import { localizePath } from '@/lib/navigation'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afghansupport.org'

const CORE_ROUTES = ['/', '/immigration', '/rights', '/resources', '/events', '/contact', '/stories']

function absoluteUrl(path: string, lang: LangCode): string {
  return `${SITE_URL}${localizePath(path, lang)}`
}

function alternateLanguages(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(
      SUPPORTED_LANGUAGES.map((lang) => [getHtmlLang(lang), absoluteUrl(path, lang)])
    ),
    'x-default': absoluteUrl(path, 'dari'),
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const route of CORE_ROUTES) {
    for (const lang of SUPPORTED_LANGUAGES) {
      entries.push({
        url: absoluteUrl(route, lang),
        lastModified: new Date(),
        changeFrequency: route === '/events' ? 'daily' : 'weekly',
        priority: route === '/' && lang === 'dari' ? 1 : 0.8,
        alternates: {
          languages: alternateLanguages(route),
        },
      })
    }
  }

  return entries
}

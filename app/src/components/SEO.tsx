import { Helmet } from 'react-helmet-async'
import { useLanguage, type LangCode } from '../hooks/useLanguage'
import { getHtmlLang } from '../lib/direction'

// PLACEHOLDER: Update this domain before production launch
const SITE_URL = 'https://afghansupport.org'

const DEFAULT_TITLE = 'Afghan Support Phoenix — Free Immigration & Community Help'
const DEFAULT_DESCRIPTION =
  'Free immigration, legal, and community support for Afghan families in Phoenix, Arizona. Asylum applications, work permits, legal rights, community resources, and events. Services provided by Catholic Charities AZ.'

// PLACEHOLDER: Create this image in public/images/ before production launch
const DEFAULT_OG_IMAGE = '/images/og-default.jpg'

const OG_LOCALE: Record<LangCode, string> = {
  en: 'en_US',
  dari: 'fa_AF',
  uzbek: 'uz_UZ',
}

interface SEOProps {
  title?: string
  description?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  canonicalPath?: string // e.g. '/' or '/#contact'
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  canonicalPath = '/',
}: SEOProps) {
  const { lang, supportedLanguages } = useLanguage()
  const resolvedTitle = title ?? DEFAULT_TITLE
  const htmlLang = getHtmlLang(lang)
  const ogLocale = OG_LOCALE[lang]

  const canonicalUrl =
    lang === 'en'
      ? `${SITE_URL}${canonicalPath}`
      : `${SITE_URL}/${lang}${canonicalPath === '/' ? '/' : canonicalPath}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Afghan Support Phoenix',
        url: SITE_URL,
        telephone: '+1-480-416-2333',
        email: 'Dpeshtaz@cc-az.org',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '5151 N 19th Ave',
          addressLocality: 'Phoenix',
          addressRegion: 'AZ',
          postalCode: '85015',
          addressCountry: 'US',
        },
        sameAs: ['https://wa.me/14804162333'],
      },
      {
        '@type': 'LocalBusiness',
        name: 'Afghan Support Phoenix',
        url: SITE_URL,
        telephone: '+1-480-416-2333',
        email: 'Dpeshtaz@cc-az.org',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '5151 N 19th Ave',
          addressLocality: 'Phoenix',
          addressRegion: 'AZ',
          postalCode: '85015',
          addressCountry: 'US',
        },
      },
    ],
  }

  return (
    <Helmet>
      {/* HTML lang and dir attributes */}
      <html lang={htmlLang} />

      {/* Title */}
      <title>{title ? `${title} — Afghan Support Phoenix` : DEFAULT_TITLE}</title>

      {/* Meta description */}
      <meta name="description" content={description} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Hreflang alternate links */}
      {supportedLanguages.map((code) => {
        const href =
          code === 'en'
            ? `${SITE_URL}${canonicalPath}`
            : `${SITE_URL}/${code}${canonicalPath === '/' ? '/' : canonicalPath}`
        return (
          <link
            key={code}
            rel="alternate"
            hrefLang={getHtmlLang(code)}
            href={href}
          />
        )
      })}
      {/* x-default hreflang */}
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${canonicalPath}`} />

      {/* Open Graph */}
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${SITE_URL}${ogImage}`} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Afghan Support Phoenix" />
      <meta property="og:locale" content={ogLocale} />

      {/* og:locale:alternate for other languages */}
      {supportedLanguages
        .filter((code) => code !== lang)
        .map((code) => (
          <meta key={code} property="og:locale:alternate" content={OG_LOCALE[code]} />
        ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}${ogImage}`} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}

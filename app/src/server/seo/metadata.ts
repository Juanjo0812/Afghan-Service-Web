import type { Metadata } from 'next'
import type { LangCode } from '@/domain/language'
import { getPageMetadata, getEventBySlug } from '@/server/cms/cms-cache'
import { getHtmlLang, SUPPORTED_LANGUAGES } from '@/domain/language'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afghansupport.org'

type StaticMetadataDefault = { title: string; description: string }

const STATIC_DEFAULTS: Record<string, Record<LangCode, StaticMetadataDefault>> = {
  home: {
    dari: {
      title: 'حمایت از افغان‌ها در فینیکس — کمک رایگان مهاجرت و جامعه',
      description:
        'کمک رایگان مهاجرت، حقوقی و اجتماعی برای خانواده‌های افغان در فینیکس، آریزونا. درخواست پناهندگی، اجازه کار، حقوق قانونی، منابع اجتماعی و رویدادها.',
    },
    en: {
      title: 'Afghan Support Phoenix — Free Immigration & Community Help',
      description:
        'Free immigration, legal, and community support for Afghan families in Phoenix, Arizona. Asylum applications, work permits, legal rights, community resources, and events. Services provided by Catholic Charities AZ.',
    },
    uzbek: {
      title: 'Afghan Support Phoenix — بیپول مهاجرت و جماعت یاردامی',
      description:
        'فینیکس، آریزوناده‌گی افغان عائله‌لر اوچون بیپول مهاجرت، حقوقی و جماعت یاردامی. پناهجویی اریزه‌لری، ایش رخصتنامه‌لری، قانونی حقوقلر، جماعت منبعلری و تدبیرلر.',
    },
    pashto: {
      title: 'Afghan Support Phoenix — وړیا د مهاجرت او ټولنې مرسته',
      description:
        'په فینکس، اریزونا کې افغان کورنیو لپاره وړیا د مهاجرت، حقوقي او ټولنیزې مرستې. د پناه غوښتنلیکونه، د کار اجازې، قانوني حقوق، ټولنیزې سرچینې او پېښې.',
    },
  },
  events: {
    dari: {
      title: 'رویدادها — حمایت از افغان‌ها در فینیکس',
      description:
        'رویدادهای اجتماعی، کارگاه‌ها و کلینیک‌های حقوقی برای خانواده‌های افغان در فینیکس.',
    },
    en: {
      title: 'Events — Afghan Support Phoenix',
      description:
        'Community events, workshops, and legal clinics for Afghan families in Phoenix. Find immigration help, cultural gatherings, and Know Your Rights trainings.',
    },
    uzbek: {
      title: 'تدبیرلر — Afghan Support Phoenix',
      description:
        'فینیکسده‌گی افغان عائله‌لر اوچون جماعت تدبیرلری، سیمینارلر و حقوقی کلینیکه‌لر.',
    },
    pashto: {
      title: 'پېښې — Afghan Support Phoenix',
      description:
        'په فینکس کې د افغان کورنیو لپاره ټولنیزې پېښې، کارګاهونه او حقوقي کلینیکونه.',
    },
  },
  stories: {
    dari: {
      title: 'داستان‌ها — حمایت از افغان‌ها در فینیکس',
      description:
        'داستان‌هایی از جامعه افغان در فینیکس درباره مسیر، پایداری و حمایت اجتماعی.',
    },
    en: {
      title: 'Stories — Afghan Support Phoenix',
      description:
        'Stories from the Afghan community in Phoenix. Read about journeys, resilience, and community support.',
    },
    uzbek: {
      title: 'حکایه‌لر — Afghan Support Phoenix',
      description:
        'فینیکسده‌گی افغان جماعتیدن مسیر، صبر و جماعت حمایه‌سی حقیده حکایه‌لر.',
    },
    pashto: {
      title: 'کیسې — Afghan Support Phoenix',
      description:
        'په فینکس کې د افغان ټولنې کیسې د سفر، زغم او ټولنیز ملاتړ په اړه.',
    },
  },
  contact: {
    dari: {
      title: 'تماس — حمایت از افغان‌ها در فینیکس',
      description:
        'با حمایت از افغان‌ها در فینیکس تماس بگیرید. کمک رایگان مهاجرت و حقوقی برای خانواده‌های افغان در آریزونا.',
    },
    en: {
      title: 'Contact — Afghan Support Phoenix',
      description:
        'Get in touch with Afghan Support Phoenix. Free immigration and legal help for Afghan families in Arizona.',
    },
    uzbek: {
      title: 'باغلنیش — Afghan Support Phoenix',
      description:
        'Afghan Support Phoenix بیلن باغلنیش قیلینگ. آریزوناده‌گی افغان عائله‌لر اوچون بیپول مهاجرت و حقوقی یاردام.',
    },
    pashto: {
      title: 'اړیکه — Afghan Support Phoenix',
      description:
        'له Afghan Support Phoenix سره اړیکه ونیسئ. په اریزونا کې افغان کورنیو لپاره وړیا د مهاجرت او حقوقي مرسته.',
    },
  },
  immigration: {
    dari: {
      title: 'کمک مهاجرتی — حمایت از افغان‌ها در فینیکس',
      description:
        'خدمات رایگان مهاجرت برای خانواده‌های افغان در فینیکس: پناهندگی، اجازه کار، گرین کارت و پیوستن خانواده.',
    },
    en: {
      title: 'Immigration Help — Afghan Support Phoenix',
      description:
        'Free immigration services for Afghan families in Phoenix. Asylum, work permits, green cards, and citizenship.',
    },
    uzbek: {
      title: 'مهاجرت یاردامی — Afghan Support Phoenix',
      description:
        'فینیکسده‌گی افغان عائله‌لر اوچون بیپول مهاجرت خدمات‌لری: پناهجویی، ایش رخصتنامه‌لری، گرین کارت و عائله‌نی بیرلشتریش.',
    },
    pashto: {
      title: 'د مهاجرت مرسته — Afghan Support Phoenix',
      description:
        'په فینکس کې افغان کورنیو لپاره وړیا د مهاجرت خدمتونه: پناه غوښتنه، د کار اجازې، ګرین کارت او د کورنۍ یوځای کېدل.',
    },
  },
  rights: {
    dari: {
      title: 'حقوق خود را بشناسید — حمایت از افغان‌ها در فینیکس',
      description:
        'معلومات حقوقی برای خانواده‌های افغان در آریزونا. حقوق خود را هنگام برخورد با پولیس و مأموران مهاجرت بدانید.',
    },
    en: {
      title: 'Know Your Rights — Afghan Support Phoenix',
      description:
        'Legal rights information for Afghan families in Arizona. Know your rights when interacting with police and immigration agents.',
    },
    uzbek: {
      title: 'حقوق‌لرینگیزنی بیلیب آلینگ — Afghan Support Phoenix',
      description:
        'آریزوناده‌گی افغان عائله‌لر اوچون حقوقی معلومات. پولیس و مهاجرت مأمورلری بیلن ملاقاتده حقوق‌لرینگیزنی بیلینگ.',
    },
    pashto: {
      title: 'خپل حقوق وپېژنئ — Afghan Support Phoenix',
      description:
        'په اریزونا کې افغان کورنیو لپاره حقوقي معلومات. له پولیسو او د مهاجرت له مامورینو سره د تعامل پر مهال خپل حقوق وپېژنئ.',
    },
  },
  resources: {
    dari: {
      title: 'منابع اجتماعی — حمایت از افغان‌ها در فینیکس',
      description:
        'منابع اجتماعی برای خانواده‌های افغان در فینیکس: غذا، سلامت، آموزش، مسکن و کمک حقوقی.',
    },
    en: {
      title: 'Resources — Afghan Support Phoenix',
      description:
        'Community resources for Afghan families in Phoenix. Housing, healthcare, education, and legal aid.',
    },
    uzbek: {
      title: 'جماعت منبعلری — Afghan Support Phoenix',
      description:
        'فینیکسده‌گی افغان عائله‌لر اوچون جماعت منبعلری: غذا، صحت، تعلیم، مسکن و حقوقی یاردام.',
    },
    pashto: {
      title: 'ټولنیزې سرچینې — Afghan Support Phoenix',
      description:
        'په فینکس کې افغان کورنیو لپاره ټولنیزې سرچینې: خواړه، روغتیا، زده کړې، کور او حقوقي مرسته.',
    },
  },
}

function buildCanonicalUrl(routeKey: string, lang: LangCode): string {
  const path = routeKey === 'home' ? '/' : `/${routeKey}`
  if (lang === 'dari') {
    return `${SITE_URL}${path}`
  }
  return `${SITE_URL}/${lang}${path}`
}

function buildAlternateLangs(routeKey: string): Record<string, string> {
  const path = routeKey === 'home' ? '/' : `/${routeKey}`
  const alts: Record<string, string> = {}

  for (const code of SUPPORTED_LANGUAGES) {
    const htmlLang = getHtmlLang(code)
    if (code === 'dari') {
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
  const defaults =
    STATIC_DEFAULTS[routeKey]?.[lang] ??
    STATIC_DEFAULTS[routeKey]?.en ??
    STATIC_DEFAULTS.home[lang] ??
    STATIC_DEFAULTS.home.en
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
      locale: lang === 'dari' ? 'fa_AF' : lang === 'uzbek' ? 'uz_AF' : lang === 'pashto' ? 'ps_AF' : 'en_US',
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
        locale: lang === 'dari' ? 'fa_AF' : lang === 'uzbek' ? 'uz_AF' : lang === 'pashto' ? 'ps_AF' : 'en_US',
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

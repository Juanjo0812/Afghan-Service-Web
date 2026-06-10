export interface OpenRouterTranslation {
  title: string
  description_html: string
  location: string
  cta_label: string
}

export interface OpenRouterResponse {
  dari: OpenRouterTranslation
  pashto: OpenRouterTranslation
  uzbek: OpenRouterTranslation
}

type ParseResult =
  | { ok: true; data: OpenRouterResponse }
  | {
      ok: false
      error: string
      partial: boolean
      successfulLanguages: string[]
      failedLanguages: string[]
      data: Partial<OpenRouterResponse>
    }

const REQUIRED_KEYS: (keyof OpenRouterTranslation)[] = [
  'title',
  'description_html',
  'location',
  'cta_label',
]

const LANGUAGES = ['dari', 'pashto', 'uzbek'] as const

export function parseOpenRouterResponse(raw: unknown): ParseResult {
  if (!raw || typeof raw !== 'object') {
    return {
      ok: false,
      error: 'Invalid response: expected object',
      partial: false,
      successfulLanguages: [],
      failedLanguages: LANGUAGES as unknown as string[],
      data: {},
    }
  }

  const obj = raw as Record<string, unknown>
  const successfulLanguages: string[] = []
  const failedLanguages: string[] = []
  const data: Partial<OpenRouterResponse> = {}

  for (const lang of LANGUAGES) {
    const langData = obj[lang]
    if (!langData || typeof langData !== 'object') {
      failedLanguages.push(lang)
      continue
    }

    const langObj = langData as Record<string, unknown>
    const missing = REQUIRED_KEYS.filter((key) => {
      const val = langObj[key]
      return val === undefined || val === null || (typeof val === 'string' && val === '')
    })

    if (missing.length > 0) {
      failedLanguages.push(lang)
      continue
    }

    const translation: OpenRouterTranslation = {
      title: String(langObj.title),
      description_html: String(langObj.description_html),
      location: String(langObj.location),
      cta_label: String(langObj.cta_label),
    }

    ;(data as Record<string, OpenRouterTranslation>)[lang] = translation
    successfulLanguages.push(lang)
  }

  if (failedLanguages.length === 0) {
    return { ok: true, data: data as OpenRouterResponse }
  }

  return {
    ok: false,
    error: `Missing or invalid data for languages: ${failedLanguages.join(', ')}`,
    partial: successfulLanguages.length > 0,
    successfulLanguages,
    failedLanguages,
    data,
  }
}

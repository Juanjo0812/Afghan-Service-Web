export type LangCode = 'en' | 'dari' | 'uzbek' | 'pashto'

export const SUPPORTED_LANGUAGES: LangCode[] = ['dari', 'en', 'uzbek', 'pashto']

/** Languages accepted in `[lang]` route params — Dari lives at the root. */
export type LocalizedLangCode = 'en' | 'uzbek' | 'pashto'

export const LOCALIZED_LANGUAGES: LocalizedLangCode[] = ['en', 'uzbek', 'pashto']

export const LANG_LABELS: Record<LangCode, string> = {
  en: 'English',
  dari: 'دری',
  uzbek: 'اوزبیکی',
  pashto: 'پښتو',
}

export const LANG_SUBLABELS: Record<LangCode, string> = {
  en: 'EN',
  dari: 'Dari',
  uzbek: 'Uzbek (AF)',
  pashto: 'Pashto',
}

export function getDirection(lang: LangCode): 'ltr' | 'rtl' {
  return lang === 'en' ? 'ltr' : 'rtl'
}

export function getHtmlLang(lang: LangCode): string {
  switch (lang) {
    case 'dari':
      return 'fa-AF'
    case 'uzbek':
      return 'uz-Arab-AF'
    case 'pashto':
      return 'ps-AF'
    default:
      return 'en'
  }
}

export function isValidLang(lang: string): lang is LangCode {
  return SUPPORTED_LANGUAGES.includes(lang as LangCode)
}

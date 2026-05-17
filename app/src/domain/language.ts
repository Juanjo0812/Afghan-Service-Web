export type LangCode = 'en' | 'dari' | 'uzbek'

export const SUPPORTED_LANGUAGES: LangCode[] = ['en', 'dari', 'uzbek']

/** Languages accepted in `[lang]` route params — English lives at the root. */
export type LocalizedLangCode = 'dari' | 'uzbek'

export const LOCALIZED_LANGUAGES: LocalizedLangCode[] = ['dari', 'uzbek']

export const LANG_LABELS: Record<LangCode, string> = {
  en: 'English',
  dari: 'دری',
  uzbek: "Oʻzbek",
}

export const LANG_SUBLABELS: Record<LangCode, string> = {
  en: 'EN',
  dari: 'Dari',
  uzbek: 'Uzbek',
}

export function getDirection(lang: LangCode): 'ltr' | 'rtl' {
  return lang === 'dari' ? 'rtl' : 'ltr'
}

export function getHtmlLang(lang: LangCode): string {
  switch (lang) {
    case 'dari':
      return 'fa'
    case 'uzbek':
      return 'uz'
    default:
      return 'en'
  }
}

export function isValidLang(lang: string): lang is LangCode {
  return SUPPORTED_LANGUAGES.includes(lang as LangCode)
}

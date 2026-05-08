export type LangCode = 'en' | 'dari' | 'pashto' | 'uzbek'

export const SUPPORTED_LANGUAGES: LangCode[] = ['en', 'dari', 'pashto', 'uzbek']

export function getDirection(lang: LangCode): 'ltr' | 'rtl' {
  return lang === 'dari' || lang === 'pashto' ? 'rtl' : 'ltr'
}

export function getHtmlLang(lang: LangCode): string {
  switch (lang) {
    case 'dari':
      return 'fa'
    case 'pashto':
      return 'ps'
    case 'uzbek':
      return 'uz'
    default:
      return 'en'
  }
}

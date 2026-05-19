import type { LangCode } from '@/domain/language'

const LOCALE_MAP: Record<LangCode, string> = {
  en: 'en-US',
  dari: 'fa-AF',
  uzbek: 'uz-UZ',
}

export function formatEventDate(dateStr: string, lang: LangCode): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(LOCALE_MAP[lang], {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function formatEventMonth(date: Date, lang: LangCode): string {
  return date.toLocaleString(LOCALE_MAP[lang], { month: 'long', year: 'numeric' })
}

export function formatEventShortMonth(date: Date, lang: LangCode): string {
  return date.toLocaleString(LOCALE_MAP[lang], { month: 'short' }).toUpperCase()
}

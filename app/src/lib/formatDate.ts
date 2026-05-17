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

export function formatEventTimeLabel(
  startDate: string,
  endDate: string | undefined,
  lang: LangCode,
): string {
  const locale = LOCALE_MAP[lang]
  try {
    const start = new Date(startDate)
    const startStr = start.toLocaleString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    if (endDate) {
      const end = new Date(endDate)
      const endStr = end.toLocaleString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      return `${startStr} — ${endStr}`
    }
    return startStr
  } catch {
    return startDate
  }
}

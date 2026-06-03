import type { LangCode } from '@/domain/language'

const LOCALE_MAP: Record<LangCode, string> = {
  en: 'en-US',
  dari: 'fa-AF',
  uzbek: 'uz-Arab-AF',
  pashto: 'ps-AF',
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

    if (endDate) {
      const end = new Date(endDate)
      const sameDay =
        start.getFullYear() === end.getFullYear() &&
        start.getMonth() === end.getMonth() &&
        start.getDate() === end.getDate()

      if (sameDay) {
        // Same day → show only the time range (e.g. "9:30 AM — 2:30 PM")
        const timeFmt: Intl.DateTimeFormatOptions = {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }
        return `${start.toLocaleTimeString(locale, timeFmt)} — ${end.toLocaleTimeString(locale, timeFmt)}`
      }

      // Different days → full date+time for both
      const fullFmt: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }
      return `${start.toLocaleString(locale, fullFmt)} — ${end.toLocaleString(locale, fullFmt)}`
    }

    // No end date → show start time only
    return start.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return startDate
  }
}

import type { LangCode } from '@/domain/language'

const LOCALE_MAP: Record<LangCode, string> = {
  en: 'en-US',
  dari: 'fa-AF',
  uzbek: 'uz-Arab-AF',
  pashto: 'ps-AF',
}

const RTL_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

const GREGORIAN_MONTHS: Record<Exclude<LangCode, 'en'>, string[]> = {
  dari: ['جنوری', 'فبروری', 'مارچ', 'اپریل', 'می', 'جون', 'جولای', 'آگست', 'سپتمبر', 'اکتبر', 'نومبر', 'دسمبر'],
  pashto: ['جنوري', 'فبروري', 'مارچ', 'اپرېل', 'مې', 'جون', 'جولای', 'اګست', 'سپتمبر', 'اکتوبر', 'نومبر', 'ډسمبر'],
  uzbek: ['جنوری', 'فبروری', 'مارچ', 'اپریل', 'می', 'جون', 'جولای', 'آگست', 'سپتمبر', 'اکتبر', 'نومبر', 'دسمبر'],
}

const GREGORIAN_WEEKDAYS: Record<Exclude<LangCode, 'en'>, string[]> = {
  dari: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  pashto: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  uzbek: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
}

const RTL_DAY_PERIODS: Record<Exclude<LangCode, 'en'>, { am: string; pm: string }> = {
  dari: { am: 'ق.ظ', pm: 'ب.ظ' },
  pashto: { am: 'ق.ظ', pm: 'ب.ظ' },
  uzbek: { am: 'ق.ظ', pm: 'ب.ظ' },
}

function localizeNumber(value: number, lang: LangCode): string {
  const raw = String(value)
  if (lang === 'en') return raw
  return raw.replace(/\d/g, (digit) => RTL_DIGITS[Number(digit)] ?? digit)
}

function formatGregorianDate(date: Date, lang: Exclude<LangCode, 'en'>): string {
  const weekday = GREGORIAN_WEEKDAYS[lang][date.getDay()]
  const day = localizeNumber(date.getDate(), lang)
  const month = GREGORIAN_MONTHS[lang][date.getMonth()]
  const year = localizeNumber(date.getFullYear(), lang)

  return `${weekday}، ${day} ${month} ${year}`
}

function formatGregorianMonth(date: Date, lang: Exclude<LangCode, 'en'>): string {
  return `${GREGORIAN_MONTHS[lang][date.getMonth()]} ${localizeNumber(date.getFullYear(), lang)}`
}

function formatClockTime(date: Date, lang: LangCode): string {
  if (lang === 'en') {
    return date.toLocaleTimeString(LOCALE_MAP.en, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const period = date.getHours() < 12 ? RTL_DAY_PERIODS[lang].am : RTL_DAY_PERIODS[lang].pm
  const hour = date.getHours() % 12 || 12
  const minute = date.getMinutes().toString().padStart(2, '0')

  return `${localizeNumber(hour, lang)}:${localizeNumber(Number(minute), lang).padStart(2, RTL_DIGITS[0])} ${period}`
}

export function formatEventDate(dateStr: string, lang: LangCode): string {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  if (lang !== 'en') return formatGregorianDate(date, lang)

  return date.toLocaleDateString(LOCALE_MAP[lang], {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function formatEventMonth(date: Date, lang: LangCode): string {
  if (Number.isNaN(date.getTime())) return ''
  if (lang !== 'en') return formatGregorianMonth(date, lang)

  return date.toLocaleString(LOCALE_MAP[lang], { month: 'long', year: 'numeric' })
}

export function formatEventShortMonth(date: Date, lang: LangCode): string {
  if (Number.isNaN(date.getTime())) return ''
  if (lang !== 'en') return GREGORIAN_MONTHS[lang][date.getMonth()]

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
        return `${formatClockTime(start, lang)} — ${formatClockTime(end, lang)}`
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
      if (lang !== 'en') {
        return `${formatEventDate(startDate, lang)} ${formatClockTime(start, lang)} — ${formatEventDate(endDate, lang)} ${formatClockTime(end, lang)}`
      }
      return `${start.toLocaleString(locale, fullFmt)} — ${end.toLocaleString(locale, fullFmt)}`
    }

    // No end date → show start time only
    return formatClockTime(start, lang)
  } catch {
    return startDate
  }
}

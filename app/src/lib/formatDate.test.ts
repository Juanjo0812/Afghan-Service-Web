import { describe, expect, it } from 'vitest'
import { formatEventDate, formatEventTimeLabel } from './formatDate'

describe('formatEventDate', () => {
  const date = '2026-06-20T09:00:00'

  it('formats English dates with browser Intl', () => {
    expect(formatEventDate(date, 'en')).toContain('June')
  })

  it('formats Pashto dates without falling back to Spanish browser locale', () => {
    const result = formatEventDate(date, 'pashto')

    expect(result).toContain('جون')
    expect(result).toContain('۲۰۲۶')
    expect(result).not.toContain('sábado')
    expect(result).not.toContain('junio')
  })

  it('formats Dari dates with deterministic Gregorian labels', () => {
    const result = formatEventDate(date, 'dari')

    expect(result).toContain('جون')
    expect(result).toContain('۲۰۲۶')
  })

  it('formats Afghan Uzbek dates with deterministic Gregorian labels', () => {
    const result = formatEventDate(date, 'uzbek')

    expect(result).toContain('جون')
    expect(result).toContain('۲۰۲۶')
  })
})

describe('formatEventTimeLabel', () => {
  it('formats Pashto time ranges without English AM/PM markers', () => {
    const result = formatEventTimeLabel('2026-06-20T09:00:00', '2026-06-20T14:00:00', 'pashto')

    expect(result).toContain('۹:۰۰')
    expect(result).toContain('۲:۰۰')
    expect(result).not.toContain('AM')
    expect(result).not.toContain('PM')
  })
})

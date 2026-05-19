import { describe, it, expect } from 'vitest'
import { localizePath } from './navigation'

describe('localizePath', () => {
  it('returns path unchanged for English', () => {
    expect(localizePath('/rights', 'en')).toBe('/rights')
    expect(localizePath('/', 'en')).toBe('/')
  })

  it('prepends language for Dari', () => {
    expect(localizePath('/rights', 'dari')).toBe('/dari/rights')
    expect(localizePath('/', 'dari')).toBe('/dari/')
  })

  it('prepends language for Uzbek', () => {
    expect(localizePath('/events', 'uzbek')).toBe('/uzbek/events')
  })
})

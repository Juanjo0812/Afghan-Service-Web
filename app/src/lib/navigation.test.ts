import { describe, it, expect } from 'vitest'
import { localizePath } from './navigation'

describe('localizePath', () => {
  it('returns path unchanged for Dari', () => {
    expect(localizePath('/rights', 'dari')).toBe('/rights')
    expect(localizePath('/', 'dari')).toBe('/')
  })

  it('prepends language for English', () => {
    expect(localizePath('/rights', 'en')).toBe('/en/rights')
    expect(localizePath('/', 'en')).toBe('/en/')
  })

  it('prepends language for Uzbek', () => {
    expect(localizePath('/events', 'uzbek')).toBe('/uzbek/events')
  })

  it('prepends language for Pashto', () => {
    expect(localizePath('/rights', 'pashto')).toBe('/pashto/rights')
  })
})

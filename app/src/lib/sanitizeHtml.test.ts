import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from './sanitizeHtml'

describe('sanitizeHtml', () => {
  it('allows safe tags', () => {
    const result = sanitizeHtml('<p>Hello <strong>world</strong></p>')
    expect(result).toContain('<p>')
    expect(result).toContain('<strong>')
  })

  it('strips unsafe tags', () => {
    const result = sanitizeHtml('<script>alert(1)</script><p>safe</p>')
    expect(result).not.toContain('<script>')
    expect(result).toContain('<p>safe</p>')
  })

  it('allows safe links', () => {
    const result = sanitizeHtml('<a href="https://example.com">link</a>')
    expect(result).toContain('href="https://example.com"')
    expect(result).toContain('rel="noopener noreferrer"')
  })

  it('strips javascript: links', () => {
    const result = sanitizeHtml('<a href="javascript:alert(1)">click</a>')
    expect(result).not.toContain('href')
  })
})

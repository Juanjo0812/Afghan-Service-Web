import { describe, it, expect } from 'vitest'
import { hashPhone } from './fingerprint'

describe('hashPhone', () => {
  it('produces consistent output for same input', async () => {
    const a = await hashPhone('480.416.2333')
    const b = await hashPhone('480.416.2333')
    expect(a).toBe(b)
  })

  it('normalizes whitespace', async () => {
    const a = await hashPhone('480 416 2333')
    const b = await hashPhone('480.416.2333')
    expect(a).toBe(b)
  })

  it('produces different output for different input', async () => {
    const a = await hashPhone('480.416.2333')
    const b = await hashPhone('480.416.2334')
    expect(a).not.toBe(b)
  })
})

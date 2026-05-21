import { describe, it, expect } from 'vitest'
import { hashIP, hashPhone } from './fingerprint'

process.env.RATE_LIMIT_HASH_SECRET = 'test-secret'

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

  it('depends on the secret key', async () => {
    const phone = '480.416.2333'
    const a = await hashPhone(phone)
    process.env.RATE_LIMIT_HASH_SECRET = 'another-secret'
    const b = await hashPhone(phone)
    expect(a).not.toBe(b)
    process.env.RATE_LIMIT_HASH_SECRET = 'test-secret' // restore
  })
})

describe('hashIP', () => {
  it('produces consistent output', async () => {
    const a = await hashIP('192.168.1.1')
    const b = await hashIP('192.168.1.1')
    expect(a).toBe(b)
  })

  it('produces different output for different IPs', async () => {
    const a = await hashIP('192.168.1.1')
    const b = await hashIP('10.0.0.1')
    expect(a).not.toBe(b)
  })
})

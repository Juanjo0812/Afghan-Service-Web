import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('getEvents', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.stubEnv('WORDPRESS_API_BASE_URL', 'https://wp.example.com/wp-json/wp/v2')
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })
    )
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('always requests lang=en even when called with pashto', async () => {
    const { getEvents } = await import('./wordpress')
    await getEvents('pashto')

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const url = new URL((fetchSpy.mock.calls[0] as [string])[0])
    expect(url.searchParams.get('lang')).toBe('en')
  })

  it('always requests lang=en even when called with dari', async () => {
    const { getEvents } = await import('./wordpress')
    await getEvents('dari')

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const url = new URL((fetchSpy.mock.calls[0] as [string])[0])
    expect(url.searchParams.get('lang')).toBe('en')
  })

  it('always requests lang=en even when called with uzbek', async () => {
    const { getEvents } = await import('./wordpress')
    await getEvents('uzbek')

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const url = new URL((fetchSpy.mock.calls[0] as [string])[0])
    expect(url.searchParams.get('lang')).toBe('en')
  })

  it('still requests lang=en when called with en', async () => {
    const { getEvents } = await import('./wordpress')
    await getEvents('en')

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const url = new URL((fetchSpy.mock.calls[0] as [string])[0])
    expect(url.searchParams.get('lang')).toBe('en')
  })
})

describe('getEventBySlug', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.stubEnv('WORDPRESS_API_BASE_URL', 'https://wp.example.com/wp-json/wp/v2')
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })
    )
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('always requests lang=en even when called with pashto', async () => {
    const { getEventBySlug } = await import('./wordpress')
    await getEventBySlug('my-event', 'pashto')

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const url = new URL((fetchSpy.mock.calls[0] as [string])[0])
    expect(url.searchParams.get('lang')).toBe('en')
  })
})

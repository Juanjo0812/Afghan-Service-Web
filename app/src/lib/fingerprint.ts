function getHMACSecret(): string {
  const secret = process.env.RATE_LIMIT_HASH_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'development') {
      return 'dev-hmac-secret-do-not-use-in-production'
    }
    throw new Error('RATE_LIMIT_HASH_SECRET is required in production')
  }
  return secret
}

export async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(getHMACSecret())
  const key = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(ip))
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function hashPhone(phone: string): Promise<string> {
  const normalized = phone.trim().replace(/[^\d]/g, '')
  const encoder = new TextEncoder()
  const data = encoder.encode(normalized)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

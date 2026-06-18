import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDirection, LOCALIZED_LANGUAGES, type LangCode } from './domain/language'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Detect language from first path segment
  const firstSegment = pathname.split('/')[1]
  const lang: LangCode = (LOCALIZED_LANGUAGES as readonly string[]).includes(firstSegment)
    ? (firstSegment as LangCode)
    : 'dari'
  const dir = getDirection(lang)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-lang', lang)
  requestHeaders.set('x-dir', dir)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set('x-lang', lang)
  response.headers.set('x-dir', dir)

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|videos|favicon.ico).*)'],
}

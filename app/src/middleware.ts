import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUPPORTED_LANGS = ['en', 'dari', 'uzbek']
const LANG_DIR: Record<string, string> = {
  en: 'ltr',
  dari: 'rtl',
  uzbek: 'ltr',
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permanent redirect: /pashto/* → equivalent English path
  if (pathname.startsWith('/pashto')) {
    const newPath = pathname.replace(/^\/pashto/, '') || '/'
    return NextResponse.redirect(new URL(newPath, request.url), 301)
  }

  // Detect language from first path segment
  const firstSegment = pathname.split('/')[1]
  const lang = SUPPORTED_LANGS.includes(firstSegment) ? firstSegment : 'en'
  const dir = LANG_DIR[lang] || 'ltr'

  const response = NextResponse.next()
  response.headers.set('x-lang', lang)
  response.headers.set('x-dir', dir)

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|videos|favicon.ico).*)'],
}

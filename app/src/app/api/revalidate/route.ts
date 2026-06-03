import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { clearCmsCache } from '@/server/cms/cms-cache'

const SECRET = process.env.WORDPRESS_REVALIDATE_SECRET

const DEFAULT_PATHS = [
  '/',
  '/events',
  '/events/[slug]',
  '/contact',
  '/immigration',
  '/resources',
  '/rights',
  '/stories',
  '/en',
  '/en/events',
  '/en/events/[slug]',
  '/en/contact',
  '/en/immigration',
  '/en/resources',
  '/en/rights',
  '/en/stories',
  '/uzbek',
  '/uzbek/events',
  '/uzbek/events/[slug]',
  '/uzbek/contact',
  '/uzbek/immigration',
  '/uzbek/resources',
  '/uzbek/rights',
  '/uzbek/stories',
  '/pashto',
  '/pashto/events',
  '/pashto/events/[slug]',
  '/pashto/contact',
  '/pashto/immigration',
  '/pashto/resources',
  '/pashto/rights',
  '/pashto/stories',
]

export async function POST(request: NextRequest) {
  if (!SECRET) {
    return NextResponse.json(
      { success: false, error: 'Revalidation not configured' },
      { status: 500 }
    )
  }

  let body: { secret?: string; paths?: string[] } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  if (body.secret !== SECRET) {
    return NextResponse.json(
      { success: false, error: 'Invalid secret' },
      { status: 401 }
    )
  }

  const pathsToRevalidate =
    body.paths && body.paths.length > 0 ? body.paths : DEFAULT_PATHS

  const results: { path: string; success: boolean; error?: string }[] = []

  for (const path of pathsToRevalidate) {
    try {
      if (path.includes('[slug]')) {
        revalidatePath(path, 'page')
      } else {
        revalidatePath(path)
      }
      results.push({ path, success: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      results.push({ path, success: false, error: message })
    }
  }

  if (results.some((r) => r.success)) {
    clearCmsCache()
  }

  const allOk = results.every((r) => r.success)

  return NextResponse.json(
    {
      success: allOk,
      revalidated: results.filter((r) => r.success).length,
      results,
    },
    { status: allOk ? 200 : 207 }
  )
}

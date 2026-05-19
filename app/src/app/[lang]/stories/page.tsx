import { generatePageMetadata } from '@/server/seo/metadata'
import type { LangCode } from '@/domain/language'
import { assertValidLang } from '@/lib/routeGuard'
import StoriesPage from '@/pages/StoriesPage'

export function generateStaticParams() {
  return [{ lang: 'dari' }, { lang: 'uzbek' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  assertValidLang(lang)
  return generatePageMetadata('stories', lang as LangCode)
}

export default async function Stories({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  assertValidLang(lang)
  return <StoriesPage />
}

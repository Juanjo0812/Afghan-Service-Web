import { generatePageMetadata } from '@/server/seo/metadata'
import type { LangCode } from '@/domain/language'
import { assertValidLang } from '@/lib/routeGuard'
import RightsPage from '@/page-views/RightsPage'

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'uzbek' }, { lang: 'pashto' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  assertValidLang(lang)
  return generatePageMetadata('rights', lang as LangCode)
}

export default async function Rights({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  assertValidLang(lang)
  return <RightsPage />
}

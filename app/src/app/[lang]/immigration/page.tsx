import { generatePageMetadata } from '@/server/seo/metadata'
import type { LangCode } from '@/domain/language'
import { assertValidLang } from '@/lib/routeGuard'
import ImmigrationPage from '@/page-views/ImmigrationPage'

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'uzbek' }, { lang: 'pashto' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  assertValidLang(lang)
  return generatePageMetadata('immigration', lang as LangCode)
}

export default async function Immigration({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  assertValidLang(lang)
  return <ImmigrationPage />
}

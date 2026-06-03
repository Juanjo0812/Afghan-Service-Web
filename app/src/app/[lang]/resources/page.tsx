import { generatePageMetadata } from '@/server/seo/metadata'
import type { LangCode } from '@/domain/language'
import { assertValidLang } from '@/lib/routeGuard'
import ResourcesPage from '@/page-views/ResourcesPage'

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'uzbek' }, { lang: 'pashto' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  assertValidLang(lang)
  return generatePageMetadata('resources', lang as LangCode)
}

export default async function Resources({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  assertValidLang(lang)
  return <ResourcesPage />
}

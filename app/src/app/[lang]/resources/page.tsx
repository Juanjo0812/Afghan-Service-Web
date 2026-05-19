import { generatePageMetadata } from '@/server/seo/metadata'
import type { LangCode } from '@/domain/language'
import ResourcesPage from '@/pages/ResourcesPage'

export function generateStaticParams() {
  return [{ lang: 'dari' }, { lang: 'uzbek' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return generatePageMetadata('resources', lang as LangCode)
}

export default function Resources() {
  return <ResourcesPage />
}

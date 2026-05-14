import { generatePageMetadata } from '@/server/seo/metadata'
import type { LangCode } from '@/domain/language'
import ImmigrationPage from '@/pages/ImmigrationPage'

export function generateStaticParams() {
  return [{ lang: 'dari' }, { lang: 'uzbek' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return generatePageMetadata('immigration', lang as LangCode)
}

export default function Immigration() {
  return <ImmigrationPage />
}

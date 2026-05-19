import { generatePageMetadata } from '@/server/seo/metadata'
import type { LangCode } from '@/domain/language'
import RightsPage from '@/pages/RightsPage'

export function generateStaticParams() {
  return [{ lang: 'dari' }, { lang: 'uzbek' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return generatePageMetadata('rights', lang as LangCode)
}

export default function Rights() {
  return <RightsPage />
}

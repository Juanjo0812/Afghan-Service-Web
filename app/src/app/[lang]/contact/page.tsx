import { generatePageMetadata } from '@/server/seo/metadata'
import type { LangCode } from '@/domain/language'
import ContactPage from '@/pages/ContactPage'

export function generateStaticParams() {
  return [{ lang: 'dari' }, { lang: 'uzbek' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return generatePageMetadata('contact', lang as LangCode)
}

export default function Contact() {
  return <ContactPage />
}

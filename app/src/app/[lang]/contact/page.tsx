import { generatePageMetadata } from '@/server/seo/metadata'
import type { LangCode } from '@/domain/language'
import { assertValidLang } from '@/lib/routeGuard'
import ContactPage from '@/page-views/ContactPage'

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'uzbek' }, { lang: 'pashto' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  assertValidLang(lang)
  return generatePageMetadata('contact', lang as LangCode)
}

export default async function Contact({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  assertValidLang(lang)
  return <ContactPage />
}

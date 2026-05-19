import type { Metadata } from 'next'
import { headers } from 'next/headers'
import '../globals.css'
import AppShell from '@/components/AppShell'
import { isValidLang, getHtmlLang } from '@/domain/language'

export const metadata: Metadata = {
  title: 'Afghan Support Phoenix — Free Immigration & Community Help',
  description:
    'Free immigration, legal, and community support for Afghan families in Phoenix, Arizona. Asylum applications, work permits, legal rights, community resources, and events. Services provided by Catholic Charities AZ.',
}

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const headersList = await headers()
  const rawLang = headersList.get('x-lang') || lang || 'en'
  const dir = headersList.get('x-dir') || (lang === 'dari' ? 'rtl' : 'ltr')
  const validatedLang = isValidLang(rawLang) ? rawLang : 'en'
  const htmlLang = getHtmlLang(validatedLang)

  return (
    <html lang={htmlLang} dir={dir}>
      <body>
        <AppShell initialLang={validatedLang}>{children}</AppShell>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import AppShell from '@/components/AppShell'
import { isValidLang, getHtmlLang } from '@/domain/language'

export const metadata: Metadata = {
  title: 'Afghan Support Phoenix — Free Immigration & Community Help',
  description:
    'Free immigration, legal, and community support for Afghan families in Phoenix, Arizona. Asylum applications, work permits, legal rights, community resources, and events. Services provided by Catholic Charities AZ.',
  metadataBase: new URL('https://afghansupport.org'),
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const h = await headers()
  const rawLang = h.get('x-lang') || 'en'
  const dir = h.get('x-dir') || 'ltr'
  const lang = isValidLang(rawLang) ? rawLang : 'en'
  const htmlLang = getHtmlLang(lang)

  return (
    <html lang={htmlLang} dir={dir}>
      <body>
        <AppShell initialLang={lang}>{children}</AppShell>
      </body>
    </html>
  )
}

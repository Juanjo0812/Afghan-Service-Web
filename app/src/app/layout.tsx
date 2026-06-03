import type { Metadata } from 'next'
import './globals.css'
import AppShell from '@/components/AppShell'
import { Analytics } from '@vercel/analytics/next'

import { headers } from 'next/headers'
import { isValidLang, getHtmlLang, getDirection } from '@/domain/language'
import { SITE_URL } from '@/server/seo/metadata'

export const metadata: Metadata = {
  title: 'Afghan Support Phoenix — Free Immigration & Community Help',
  description:
    'Free immigration, legal, and community support for Afghan families in Phoenix, Arizona. Asylum applications, work permits, legal rights, community resources, and events. Services provided by Catholic Charities AZ.',
  metadataBase: new URL(SITE_URL),
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const rawLang = headersList.get('x-lang') || 'dari'
  const validatedLang = isValidLang(rawLang) ? rawLang : 'dari'
  const dir = headersList.get('x-dir') || getDirection(validatedLang)
  const htmlLang = getHtmlLang(validatedLang)

  return (
    <html lang={htmlLang} dir={dir}>
      <body>
        <AppShell initialLang={validatedLang}>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  )
}

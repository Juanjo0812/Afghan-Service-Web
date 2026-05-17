import type { Metadata } from 'next'
import './globals.css'
import AppShell from '@/components/AppShell'

import { SITE_URL } from '@/server/seo/metadata'

export const metadata: Metadata = {
  title: 'Afghan Support Phoenix — Free Immigration & Community Help',
  description:
    'Free immigration, legal, and community support for Afghan families in Phoenix, Arizona. Asylum applications, work permits, legal rights, community resources, and events. Services provided by Catholic Charities AZ.',
  metadataBase: new URL(SITE_URL),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <AppShell initialLang="en">{children}</AppShell>
      </body>
    </html>
  )
}

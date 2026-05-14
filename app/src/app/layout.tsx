import type { Metadata } from 'next'
import './globals.css'
import AppShell from '@/components/AppShell'

export const metadata: Metadata = {
  title: 'Afghan Support Phoenix — Free Immigration & Community Help',
  description:
    'Free immigration, legal, and community support for Afghan families in Phoenix, Arizona. Asylum applications, work permits, legal rights, community resources, and events. Services provided by Catholic Charities AZ.',
  metadataBase: new URL('https://afghansupport.org'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}

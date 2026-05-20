import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Afghan Support Phoenix — Free Immigration & Community Help',
  description:
    'Free immigration, legal, and community support for Afghan families in Phoenix, Arizona. Asylum applications, work permits, legal rights, community resources, and events. Services provided by Catholic Charities AZ.',
}

export default function LocalizedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

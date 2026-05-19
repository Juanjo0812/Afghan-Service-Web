export function generateStaticParams() {
  return [{ lang: 'dari' }, { lang: 'uzbek' }]
}

import ResourcesPage from '@/pages/ResourcesPage'

export default function Resources() {
  return <ResourcesPage />
}

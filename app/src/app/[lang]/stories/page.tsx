export function generateStaticParams() {
  return [{ lang: 'dari' }, { lang: 'uzbek' }]
}

import StoriesPage from '@/pages/StoriesPage'

export default function Stories() {
  return <StoriesPage />
}

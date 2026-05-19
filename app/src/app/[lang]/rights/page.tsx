export function generateStaticParams() {
  return [{ lang: 'dari' }, { lang: 'uzbek' }]
}

import RightsPage from '@/pages/RightsPage'

export default function Rights() {
  return <RightsPage />
}

export function generateStaticParams() {
  return [{ lang: 'dari' }, { lang: 'uzbek' }]
}

import ImmigrationPage from '@/pages/ImmigrationPage'

export default function Immigration() {
  return <ImmigrationPage />
}

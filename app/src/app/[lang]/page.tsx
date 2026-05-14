export function generateStaticParams() {
  return [{ lang: 'dari' }, { lang: 'uzbek' }]
}

import HomePage from '@/pages/HomePage'

export default function Home() {
  return <HomePage />
}

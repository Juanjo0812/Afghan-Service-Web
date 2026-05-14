export function generateStaticParams() {
  return [{ lang: 'dari' }, { lang: 'uzbek' }]
}

import EventsPage from '@/pages/EventsPage'

export default function Events() {
  return <EventsPage />
}

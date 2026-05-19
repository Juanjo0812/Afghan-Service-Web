export function generateStaticParams() {
  return [{ lang: 'dari' }, { lang: 'uzbek' }]
}

import ContactPage from '@/pages/ContactPage'

export default function Contact() {
  return <ContactPage />
}

import { generatePageMetadata } from '@/server/seo/metadata'
import ContactPage from '@/page-views/ContactPage'

export async function generateMetadata() {
  return generatePageMetadata('contact', 'dari')
}

export default function Contact() {
  return <ContactPage />
}

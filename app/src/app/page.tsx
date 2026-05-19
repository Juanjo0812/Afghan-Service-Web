import { generatePageMetadata } from '@/server/seo/metadata'
import HomePage from '@/pages/HomePage'

export async function generateMetadata() {
  return generatePageMetadata('home', 'en')
}

export default function Home() {
  return <HomePage />
}

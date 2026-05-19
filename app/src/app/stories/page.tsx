import { generatePageMetadata } from '@/server/seo/metadata'
import StoriesPage from '@/page-views/StoriesPage'

export async function generateMetadata() {
  return generatePageMetadata('stories', 'en')
}

export default function Stories() {
  return <StoriesPage />
}

import { generatePageMetadata } from '@/server/seo/metadata'
import StoriesPage from '@/page-views/StoriesPage'

export async function generateMetadata() {
  return generatePageMetadata('stories', 'dari')
}

export default function Stories() {
  return <StoriesPage />
}

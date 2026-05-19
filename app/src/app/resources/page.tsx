import { generatePageMetadata } from '@/server/seo/metadata'
import ResourcesPage from '@/page-views/ResourcesPage'

export async function generateMetadata() {
  return generatePageMetadata('resources', 'en')
}

export default function Resources() {
  return <ResourcesPage />
}

import { generatePageMetadata } from '@/server/seo/metadata'
import ResourcesPage from '@/page-views/ResourcesPage'

export async function generateMetadata() {
  return generatePageMetadata('resources', 'dari')
}

export default function Resources() {
  return <ResourcesPage />
}

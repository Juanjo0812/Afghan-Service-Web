import { generatePageMetadata } from '@/server/seo/metadata'
import RightsPage from '@/page-views/RightsPage'

export async function generateMetadata() {
  return generatePageMetadata('rights', 'en')
}

export default function Rights() {
  return <RightsPage />
}

import { generatePageMetadata } from '@/server/seo/metadata'
import RightsPage from '@/page-views/RightsPage'

export async function generateMetadata() {
  return generatePageMetadata('rights', 'dari')
}

export default function Rights() {
  return <RightsPage />
}

import { generatePageMetadata } from '@/server/seo/metadata'
import ImmigrationPage from '@/page-views/ImmigrationPage'

export async function generateMetadata() {
  return generatePageMetadata('immigration', 'dari')
}

export default function Immigration() {
  return <ImmigrationPage />
}

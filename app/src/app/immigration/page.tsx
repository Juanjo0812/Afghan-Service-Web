import { generatePageMetadata } from '@/server/seo/metadata'
import ImmigrationPage from '@/page-views/ImmigrationPage'

export async function generateMetadata() {
  return generatePageMetadata('immigration', 'en')
}

export default function Immigration() {
  return <ImmigrationPage />
}

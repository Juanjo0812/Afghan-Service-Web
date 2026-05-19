export type EventCategory = 'immigration' | 'legal' | 'cultural' | 'holiday'

export interface EventContent {
  id: string
  slug: string
  title: string
  description: string
  category: EventCategory
  categoryLabel: string
  startDate: string
  endDate?: string
  timeLabel: string
  location: string
  ctaLabel: string
  ctaUrl?: string
  imageUrl?: string
  seo?: PageMetadata
}

export interface PageMetadata {
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonicalPath: string
}

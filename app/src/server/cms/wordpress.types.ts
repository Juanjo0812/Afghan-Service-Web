// Raw WordPress REST response shapes — NOT consumed by UI components directly.
// These are validated by Zod before mapping to internal domain models.

export interface WPRenderedField {
  rendered: string
}

export interface WPEventMeta {
  _asp_event_category?: string
  _asp_event_start_date?: string
  _asp_event_end_date?: string
  _asp_event_location?: string
  _asp_cta_label?: string
  _asp_cta_url?: string
  _asp_event_language?: string
  _asp_featured_image_id?: string | number
}

export interface WPPageMetaMeta {
  _asp_route_key?: string
  _asp_seo_title?: string
  _asp_seo_description?: string
  _asp_og_title?: string
  _asp_og_description?: string
  _asp_og_image_id?: string | number
  _asp_page_meta_language?: string
}

export interface WPEmbeddedMedia {
  source_url?: string
}

export interface WPEventResponse {
  id: number
  slug: string
  title: WPRenderedField
  content: WPRenderedField
  meta: WPEventMeta
  featured_image_url?: string | null
  _embedded?: {
    'wp:featuredmedia'?: WPEmbeddedMedia[]
  }
}

export interface WPPageMetaResponse {
  id: number
  slug: string
  title: WPRenderedField
  meta: WPPageMetaMeta
  og_image_url?: string | null
}

export type WPEventsListResponse = WPEventResponse[]
export type WPPageMetaListResponse = WPPageMetaResponse[]

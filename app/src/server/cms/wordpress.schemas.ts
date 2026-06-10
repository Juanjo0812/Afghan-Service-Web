import { z } from 'zod'

const renderedFieldSchema = z.object({
  rendered: z.string(),
})

const eventMetaSchema = z.object({
  _asp_event_category: z.string().optional(),
  _asp_event_start_date: z.string().optional(),
  _asp_event_end_date: z.string().optional(),
  _asp_event_location: z.string().optional(),
  _asp_cta_label: z.string().optional(),
  _asp_cta_url: z.string().optional(),
  _asp_event_language: z.string().optional(),
  _asp_featured_image_id: z.union([z.string(), z.number()]).optional(),
  // Translation content fields
  _asp_event_title_dari: z.string().optional(),
  _asp_event_title_pashto: z.string().optional(),
  _asp_event_title_uzbek: z.string().optional(),
  _asp_event_description_dari: z.string().optional(),
  _asp_event_description_pashto: z.string().optional(),
  _asp_event_description_uzbek: z.string().optional(),
  _asp_event_location_dari: z.string().optional(),
  _asp_event_location_pashto: z.string().optional(),
  _asp_event_location_uzbek: z.string().optional(),
  _asp_cta_label_dari: z.string().optional(),
  _asp_cta_label_pashto: z.string().optional(),
  _asp_cta_label_uzbek: z.string().optional(),
  // Translation control fields
  _asp_translation_status_dari: z.string().optional(),
  _asp_translation_status_pashto: z.string().optional(),
  _asp_translation_status_uzbek: z.string().optional(),
  _asp_translation_model_dari: z.string().optional(),
  _asp_translation_model_pashto: z.string().optional(),
  _asp_translation_model_uzbek: z.string().optional(),
  _asp_translation_generated_at_dari: z.string().optional(),
  _asp_translation_generated_at_pashto: z.string().optional(),
  _asp_translation_generated_at_uzbek: z.string().optional(),
  // Shared translation fields
  _asp_translation_source_hash: z.string().optional(),
  _asp_translation_error: z.string().optional(),
})

const pageMetaSchema = z.object({
  _asp_route_key: z.string().optional(),
  _asp_seo_title: z.string().optional(),
  _asp_seo_description: z.string().optional(),
  _asp_og_title: z.string().optional(),
  _asp_og_description: z.string().optional(),
  _asp_og_image_id: z.union([z.string(), z.number()]).optional(),
  _asp_page_meta_language: z.string().optional(),
})

export const wpEventSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: renderedFieldSchema,
  content: renderedFieldSchema,
  meta: eventMetaSchema,
  featured_image_url: z.string().nullable().optional(),
  _embedded: z
    .object({
      'wp:featuredmedia': z
        .array(
          z.object({
            source_url: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
})

export const wpPageMetaSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: renderedFieldSchema,
  meta: pageMetaSchema,
  og_image_url: z.string().nullable().optional(),
})

export const wpEventsListSchema = z.array(wpEventSchema)
export const wpPageMetaListSchema = z.array(wpPageMetaSchema)

export type ValidatedWPEvent = z.infer<typeof wpEventSchema>
export type ValidatedWPPageMeta = z.infer<typeof wpPageMetaSchema>

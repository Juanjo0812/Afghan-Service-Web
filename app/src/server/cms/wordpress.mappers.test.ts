import { describe, it, expect } from 'vitest'
import { mapWPEventToDomain } from './wordpress.mappers'
import type { ValidatedWPEvent } from './wordpress.schemas'

function makeWPEvent(overrides: Partial<ValidatedWPEvent> = {}): ValidatedWPEvent {
  return {
    id: 42,
    slug: 'test-event',
    title: { rendered: 'English Title' },
    content: { rendered: '<p>English description</p>' },
    meta: {
      _asp_event_category: 'immigration',
      _asp_event_start_date: '2026-06-15T10:00:00Z',
      _asp_event_location: 'Phoenix Community Center',
      _asp_cta_label: 'Register Now',
    },
    featured_image_url: null,
    ...overrides,
  } as ValidatedWPEvent
}

describe('mapWPEventToDomain', () => {
  describe('lang === "en"', () => {
    it('uses English source fields directly', () => {
      const wp = makeWPEvent()
      const result = mapWPEventToDomain(wp, 'en')

      expect(result.title).toBe('English Title')
      expect(result.description).toBe('<p>English description</p>')
      expect(result.location).toBe('Phoenix Community Center')
      expect(result.ctaLabel).toBe('Register Now')
    })

    it('ignores translation fields even when present', () => {
      const wp = makeWPEvent({
        meta: {
          _asp_event_category: 'immigration',
          _asp_event_start_date: '2026-06-15T10:00:00Z',
          _asp_event_location: 'Phoenix Community Center',
          _asp_cta_label: 'Register Now',
          _asp_event_title_dari: 'عنوان دری',
          _asp_event_description_dari: '<p>توضیحات دری</p>',
        },
      })
      const result = mapWPEventToDomain(wp, 'en')

      expect(result.title).toBe('English Title')
      expect(result.description).toBe('<p>English description</p>')
    })
  })

  describe('lang === "dari"', () => {
    it('uses translated fields when present', () => {
      const wp = makeWPEvent({
        meta: {
          _asp_event_category: 'immigration',
          _asp_event_start_date: '2026-06-15T10:00:00Z',
          _asp_event_location: 'Phoenix Community Center',
          _asp_cta_label: 'Register Now',
          _asp_event_title_dari: 'عنوان دری',
          _asp_event_description_dari: '<p>توضیحات دری</p>',
          _asp_event_location_dari: 'مرکز جامعه فینیکس',
          _asp_cta_label_dari: 'ثبت نام کنید',
          _asp_translation_status_dari: 'draft',
          _asp_translation_model_dari: 'moonshotai/kimi-k2.6:free',
          _asp_translation_generated_at_dari: '2026-06-03T14:30:00Z',
        },
      })
      const result = mapWPEventToDomain(wp, 'dari')

      expect(result.title).toBe('عنوان دری')
      expect(result.description).toBe('<p>توضیحات دری</p>')
      expect(result.location).toBe('مرکز جامعه فینیکس')
      expect(result.ctaLabel).toBe('ثبت نام کنید')
      expect(result.translationStatus).toBe('draft')
      expect(result.translationModel).toBe('moonshotai/kimi-k2.6:free')
      expect(result.translationGeneratedAt).toBe('2026-06-03T14:30:00Z')
    })

    it('falls back to English when translation is missing', () => {
      const wp = makeWPEvent()
      const result = mapWPEventToDomain(wp, 'dari')

      expect(result.title).toBe('English Title')
      expect(result.description).toBe('<p>English description</p>')
      expect(result.location).toBe('Phoenix Community Center')
      expect(result.ctaLabel).toBe('Register Now')
      expect(result.translationStatus).toBeUndefined()
    })

    it('falls back when translation is empty string', () => {
      const wp = makeWPEvent({
        meta: {
          _asp_event_category: 'immigration',
          _asp_event_start_date: '2026-06-15T10:00:00Z',
          _asp_event_location: 'Phoenix Community Center',
          _asp_cta_label: 'Register Now',
          _asp_event_title_dari: '',
          _asp_event_location_dari: '',
        },
      })
      const result = mapWPEventToDomain(wp, 'dari')

      expect(result.title).toBe('English Title')
      expect(result.location).toBe('Phoenix Community Center')
    })

    it('maps stale status correctly', () => {
      const wp = makeWPEvent({
        meta: {
          _asp_event_category: 'immigration',
          _asp_event_start_date: '2026-06-15T10:00:00Z',
          _asp_event_location: 'Phoenix Community Center',
          _asp_cta_label: 'Register Now',
          _asp_event_title_dari: 'عنوان دری',
          _asp_translation_status_dari: 'stale',
        },
      })
      const result = mapWPEventToDomain(wp, 'dari')

      expect(result.translationStatus).toBe('stale')
    })
  })

  describe('lang === "pashto"', () => {
    it('uses translated fields when present', () => {
      const wp = makeWPEvent({
        meta: {
          _asp_event_category: 'immigration',
          _asp_event_start_date: '2026-06-15T10:00:00Z',
          _asp_event_location: 'Phoenix Community Center',
          _asp_cta_label: 'Register Now',
          _asp_event_title_pashto: 'دری عنوان',
          _asp_event_description_pashto: '<p>دری توضیحات</p>',
          _asp_event_location_pashto: 'د فینیکس ټولنیز مرکز',
          _asp_cta_label_pashto: 'ثبت نام وکړئ',
        },
      })
      const result = mapWPEventToDomain(wp, 'pashto')

      expect(result.title).toBe('دری عنوان')
      expect(result.location).toBe('د فینیکس ټولنیز مرکز')
    })

    it('falls back to English when translation is missing', () => {
      const wp = makeWPEvent()
      const result = mapWPEventToDomain(wp, 'pashto')

      expect(result.title).toBe('English Title')
      expect(result.location).toBe('Phoenix Community Center')
    })
  })

  describe('lang === "uzbek"', () => {
    it('uses translated fields when present', () => {
      const wp = makeWPEvent({
        meta: {
          _asp_event_category: 'immigration',
          _asp_event_start_date: '2026-06-15T10:00:00Z',
          _asp_event_location: 'Phoenix Community Center',
          _asp_cta_label: 'Register Now',
          _asp_event_title_uzbek: 'Узбек сарлавҳаси',
          _asp_event_description_uzbek: '<p>Узбек тавсифи</p>',
          _asp_event_location_uzbek: 'Финикс жамоат маркази',
          _asp_cta_label_uzbek: 'Рўйхатдан ўтинг',
        },
      })
      const result = mapWPEventToDomain(wp, 'uzbek')

      expect(result.title).toBe('Узбек сарлавҳаси')
      expect(result.location).toBe('Финикс жамоат маркази')
      expect(result.ctaLabel).toBe('Рўйхатдан ўтинг')
    })

    it('falls back to English when translation is missing', () => {
      const wp = makeWPEvent()
      const result = mapWPEventToDomain(wp, 'uzbek')

      expect(result.title).toBe('English Title')
      expect(result.location).toBe('Phoenix Community Center')
      expect(result.ctaLabel).toBe('Register Now')
    })
  })
})

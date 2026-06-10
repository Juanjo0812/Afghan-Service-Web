import { describe, it, expect } from 'vitest'
import { parseOpenRouterResponse } from './openrouterParser'

describe('parseOpenRouterResponse', () => {
  it('parses valid response with all three languages', () => {
    const response = {
      dari: {
        title: 'کارگاه مهاجرت',
        description_html: '<p>به ما بپیوندید</p>',
        location: 'مرکز جامعه فینیکس',
        cta_label: 'ثبت نام کنید',
      },
      pashto: {
        title: 'د مهاجرت ورکشاپ',
        description_html: '<p>موږ سره یوځای شئ</p>',
        location: 'د فینیکس ټولنیز مرکز',
        cta_label: 'ثبت نام وکړئ',
      },
      uzbek: {
        title: 'Муҳоҷират семинари',
        description_html: '<p>Бизга қўшилинг</p>',
        location: 'Финикс жамоат маркази',
        cta_label: 'Рўйхатдан ўтинг',
      },
    }

    const result = parseOpenRouterResponse(response)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.dari.title).toBe('کارگاه مهاجرت')
      expect(result.data.pashto.title).toBe('د مهاجرت ورکشاپ')
      expect(result.data.uzbek.title).toBe('Муҳоҷират семинари')
    }
  })

  it('rejects non-object response', () => {
    const result = parseOpenRouterResponse(null)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain('Invalid')
    }
  })

  it('rejects response with missing language keys', () => {
    const response = {
      dari: { title: 'کارگاه مهاجرت', description_html: '<p>text</p>', location: 'loc', cta_label: 'cta' },
    }
    const result = parseOpenRouterResponse(response)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain('Missing or invalid data for languages')
      expect(result.failedLanguages).toEqual(['pashto', 'uzbek'])
    }
  })

  it('partial response preserves successful languages and marks failed', () => {
    const response = {
      dari: {
        title: 'کارگاه مهاجرت',
        description_html: '<p>text</p>',
        location: 'loc',
        cta_label: 'cta',
      },
      pashto: {
        title: 'د مهاجرت ورکشاپ',
        description_html: '<p>text</p>',
        location: 'loc',
        cta_label: 'cta',
      },
      uzbek: null,
    }

    const result = parseOpenRouterResponse(response)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.partial).toBe(true)
      expect(result.successfulLanguages).toEqual(['dari', 'pashto'])
      expect(result.failedLanguages).toEqual(['uzbek'])
      expect(result.data.dari!.title).toBe('کارگاه مهاجرت')
      expect(result.data.pashto!.title).toBe('د مهاجرت ورکشاپ')
    }
  })

  it('rejects response with missing required field', () => {
    const response = {
      dari: { title: 'کارگاه مهاجرت' }, // missing description_html, location, cta_label
      pashto: { title: 'title', description_html: '<p>t</p>', location: 'l', cta_label: 'c' },
      uzbek: { title: 'title', description_html: '<p>t</p>', location: 'l', cta_label: 'c' },
    }
    const result = parseOpenRouterResponse(response)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.partial).toBe(true)
      expect(result.successfulLanguages).toEqual(['pashto', 'uzbek'])
      expect(result.failedLanguages).toEqual(['dari'])
    }
  })
})

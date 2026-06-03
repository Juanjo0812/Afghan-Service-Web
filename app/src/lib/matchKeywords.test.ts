import { describe, it, expect } from 'vitest'
import { matchKeywords, type KBEntry } from './matchKeywords'

const entries: KBEntry[] = [
  {
    id: 'asylum',
    keywords_en: ['asylum', 'refugee'],
    response_en: 'Asylum help available.',
    section: 'services',
  },
  {
    id: 'rights-police',
    keywords_en: ['police', 'rights', 'remain silent'],
    response_en: 'You have the right to remain silent.',
    section: 'rights',
  },
  {
    id: 'food',
    keywords_en: ['food', 'hungry', 'meals'],
    keywords_pashto: ['خوراک', 'وږی'],
    response_en: 'Food banks available.',
    response_pashto: 'د خوړو بانکونه شتون لري.',
    section: 'resources',
  },
]

describe('matchKeywords', () => {
  it('matches exact keyword', () => {
    const result = matchKeywords('asylum', entries, 'en')
    expect(result.matched).toBe(true)
    expect(result.entry?.id).toBe('asylum')
  })

  it('matches Pashto keywords', () => {
    const result = matchKeywords('خوراک', entries, 'pashto')
    expect(result.matched).toBe(true)
    expect(result.entry?.id).toBe('food')
  })

  it('returns multiCandidate for ambiguous queries', () => {
    const result = matchKeywords('help', entries, 'en')
    expect(result.matched).toBe(true)
    expect(result.candidates.length).toBeGreaterThanOrEqual(1)
  })

  it('returns no match for irrelevant input', () => {
    const result = matchKeywords('xyzabc', entries, 'en')
    expect(result.matched).toBe(false)
  })
})

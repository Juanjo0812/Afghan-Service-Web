export interface KBEntry {
  id: string
  title?: string
  keywords_en: string[]
  keywords_dari?: string[]
  keywords_uzbek?: string[]
  response_en: string
  response_dari?: string
  response_uzbek?: string
  section?: string
  actions?: { label: string; href: string }[]
}

export interface ScoredEntry {
  entry: KBEntry
  score: number
}

export interface MatchResult {
  entry: KBEntry | null
  candidates: ScoredEntry[]
  score: number
  matched: boolean
  multiCandidate: boolean
}

export type LangCode = 'en' | 'dari' | 'uzbek'

const stopWords = new Set([
  'a', 'an', 'the',
  'i', 'me', 'my', 'we', 'our', 'us', 'you', 'your',
  'he', 'him', 'his', 'she', 'her', 'they', 'them', 'their',
  'it', 'its',
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'can', 'could',
  'to', 'of', 'in', 'on', 'at', 'by', 'from', 'as',
])

function normalizeInput(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function filterStopWords(tokens: string[]): string[] {
  return tokens.filter((token) => !stopWords.has(token))
}

// Section mention maps: word/phrase -> section name
// If user input contains any of these, ALL entries in that section get +6.
const sectionMentions: { words: string[]; section: string }[] = [
  { words: ['immigration', 'asylum', 'visa', 'permit', 'green card', 'tps', 'work permit'], section: 'services' },
  { words: ['rights', 'ice', 'police', 'warrant', 'deportation'], section: 'rights' },
  { words: ['resource', 'help', 'assistance', 'support', 'service'], section: 'resources' },
  { words: ['event', 'workshop', 'calendar', 'happening', 'schedule', 'upcoming'], section: 'events' },
  { words: ['contact', 'call', 'phone', 'whatsapp', 'email', 'speak'], section: 'contact' },
]

/**
 * Additive weighted scoring for chatbot keyword matching.
 *
 * Scoring tiers (per entry):
 *   +10 exact keyword match (single-word keyword equals input token)
 *   +8  phrase match (multi-word keyword appears as substring in normalized input)
 *   +6  section mention (input contains words associated with entry's section)
 *   +4  partial/substring match (token↔keyword substring, not exact, min 3 chars)
 *   +2  body text match (input token appears in response text, min 3 chars)
 */
export function matchKeywords(
  input: string,
  entries: KBEntry[],
  lang: LangCode = 'en'
): MatchResult {
  if (!input.trim()) {
    return { entry: null, candidates: [], score: 0, matched: false, multiCandidate: false }
  }

  const normalized = normalizeInput(input)
  const rawInputTokens = normalized.split(/\s+/).filter(Boolean)
  const inputTokens = filterStopWords(rawInputTokens)

  if (inputTokens.length === 0) {
    return { entry: null, candidates: [], score: 0, matched: false, multiCandidate: false }
  }

  const keywordsKey = `keywords_${lang}` as keyof KBEntry
  const responseKey = `response_${lang}` as keyof KBEntry

  // Determine which sections get the +6 bonus based on user input
  const bonusSections = new Set<string>()
  for (const { words, section } of sectionMentions) {
    for (const word of words) {
      if (normalized.includes(word)) {
        bonusSections.add(section)
        break
      }
    }
  }

  const scored: ScoredEntry[] = []

  for (const entry of entries) {
    const keywords = ((entry[keywordsKey] as string[] | undefined) || entry.keywords_en || []).filter(
      (k): k is string => typeof k === 'string' && k.length > 0
    )

    const responseText = ((entry[responseKey] as string | undefined) || entry.response_en || '').toLowerCase()

    let score = 0

    // Build a set of single-word keywords and list of multi-word keywords for this entry
    const singleWordKeywords = new Set<string>()
    const multiWordKeywords: string[] = []

    for (const keyword of keywords) {
      const nk = normalizeInput(keyword)
      if (nk.includes(' ')) {
        multiWordKeywords.push(nk)
      } else {
        singleWordKeywords.add(nk)
      }
    }

    // +10 exact keyword match (single-word)
    for (const token of inputTokens) {
      if (singleWordKeywords.has(token)) {
        score += 10
      }
    }

    // +8 phrase match (multi-word keyword as substring in normalized input)
    for (const phrase of multiWordKeywords) {
      if (normalized.includes(phrase)) {
        score += 8
      }
    }

    // +6 section mention
    if (entry.section && bonusSections.has(entry.section)) {
      score += 6
    }

    // +4 partial/substring match (not exact, min 3 chars)
    for (const token of inputTokens) {
      if (token.length < 3) continue
      for (const kw of singleWordKeywords) {
        if (kw === token) continue // exact already counted
        if (kw.length < 3) continue
        if (kw.includes(token) || token.includes(kw)) {
          score += 4
          break // only +4 once per token, even if multiple keywords partially match
        }
      }
    }

    // +2 body text match (input token appears in response text, min 3 chars)
    for (const token of inputTokens) {
      if (token.length < 3) continue
      if (responseText.includes(token)) {
        score += 2
      }
    }

    if (score > 0) {
      scored.push({ entry, score })
    }
  }

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score)

  const topScore = scored.length > 0 ? scored[0].score : 0
  const secondScore = scored.length > 1 ? scored[1].score : 0

  // Decision logic
  // 1. Clear winner: topScore >= 10 AND (topScore - secondScore) > 4
  if (topScore >= 10 && topScore - secondScore > 4) {
    return {
      entry: scored[0].entry,
      candidates: [scored[0]],
      score: topScore,
      matched: true,
      multiCandidate: false,
    }
  }

  // 2. Multiple candidates: topScore >= 5 AND (topScore - secondScore) <= 4
  if (topScore >= 5 && topScore - secondScore <= 4) {
    const top3 = scored.slice(0, 3)
    return {
      entry: top3[0].entry,
      candidates: top3,
      score: topScore,
      matched: true,
      multiCandidate: true,
    }
  }

  // 3. Single strong candidate: topScore >= 5 (scores 5-9 with clear lead or sole match)
  if (topScore >= 5) {
    return {
      entry: scored[0].entry,
      candidates: [scored[0]],
      score: topScore,
      matched: true,
      multiCandidate: false,
    }
  }

  // 4. Fallback: topScore < 5
  return {
    entry: null,
    candidates: [],
    score: topScore,
    matched: false,
    multiCandidate: false,
  }
}

import { useMemo } from 'react'
import entries from '../data/chatbot-kb.json'
import { matchKeywords, type LangCode, type MatchResult } from '../lib/matchKeywords'

export function useChatbotKB(lang: LangCode = 'en') {
  const kbEntries = useMemo(() => entries as import('../lib/matchKeywords').KBEntry[], [])

  const findResponse = (input: string): MatchResult => {
    return matchKeywords(input, kbEntries, lang)
  }

  return {
    findResponse,
    isLoaded: true,
  }
}

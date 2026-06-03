import { createContext, useContext } from 'react'
import type { LangCode } from '../domain/language'

export type { LangCode }


export interface LanguageContextValue {
  lang: LangCode
  dir: 'ltr' | 'rtl'
  isRTL: boolean
  changeLanguage: (lang: LangCode) => void
  supportedLanguages: readonly LangCode[]
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}

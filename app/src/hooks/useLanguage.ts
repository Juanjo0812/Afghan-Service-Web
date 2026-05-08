import { createContext, useContext } from 'react'

export type LangCode = 'en' | 'dari' | 'pashto' | 'uzbek'

export const SUPPORTED_LANGUAGES: LangCode[] = ['en', 'dari', 'pashto', 'uzbek']

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

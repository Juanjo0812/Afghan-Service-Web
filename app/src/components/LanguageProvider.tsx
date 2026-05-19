'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import i18n from '../lib/i18n'
import {
  getDirection,
  getHtmlLang,
  type LangCode,
  SUPPORTED_LANGUAGES,
} from '../lib/direction'
import { LanguageContext } from '../hooks/useLanguage'

interface LanguageProviderProps {
  children: React.ReactNode
  initialLang?: LangCode
}

export function LanguageProvider({ children, initialLang = 'en' }: LanguageProviderProps) {
  const pathname = usePathname() || '/'
  const router = useRouter()
  const [lang, setLang] = useState<LangCode>(initialLang)

  const detectLangFromPath = useCallback((): LangCode => {
    const firstSegment = pathname.split('/')[1]
    return SUPPORTED_LANGUAGES.includes(firstSegment as LangCode)
      ? (firstSegment as LangCode)
      : 'en'
  }, [pathname])

  useEffect(() => {
    const detected = detectLangFromPath()
    if (detected !== i18n.language) {
      i18n.changeLanguage(detected)
    }
    if (detected !== lang) {
      // Defer state update to avoid react-hooks/set-state-in-effect.
      // Language is derived from URL; this effect syncs React state with
      // the external navigation system (Next.js router/pathname).
      queueMicrotask(() => setLang(detected))
    }
  }, [detectLangFromPath, lang])

  useEffect(() => {
    const dir = getDirection(lang)
    const htmlLang = getHtmlLang(lang)
    document.documentElement.lang = htmlLang
    document.documentElement.dir = dir
    try {
      localStorage.setItem('i18nextLng', lang)
    } catch {
      // Safari private mode / locked-down WebViews can reject storage writes.
      // Language still works from the URL, so storage must not break hydration.
    }
  }, [lang])

  useEffect(() => {
    if (getDirection(lang) === 'rtl') {
      import('@fontsource/noto-sans-arabic/400.css').catch(() => {})
      import('@fontsource/noto-sans-arabic/500.css').catch(() => {})
    }
  }, [lang])

  const changeLanguage = useCallback(
    (newLang: LangCode) => {
      const segments = pathname.split('/').filter(Boolean)
      const hasLangPrefix = SUPPORTED_LANGUAGES.includes(segments[0] as LangCode)
      const suffix = typeof window !== 'undefined'
        ? `${window.location.search}${window.location.hash}`
        : ''

      let newPath: string

      if (newLang === 'en') {
        if (hasLangPrefix) {
          segments.shift()
        }
        newPath = '/' + segments.join('/') + suffix
      } else {
        if (hasLangPrefix) {
          segments[0] = newLang
        } else {
          segments.unshift(newLang)
        }
        newPath = '/' + segments.join('/') + suffix
      }

      router.replace(newPath || '/')
    },
    [pathname, router]
  )

  const dir = getDirection(lang)

  const value = {
    lang,
    dir,
    isRTL: dir === 'rtl',
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES as readonly LangCode[],
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

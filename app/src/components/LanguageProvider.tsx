import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import i18n from '../lib/i18n'
import {
  getDirection,
  getHtmlLang,
  type LangCode,
  SUPPORTED_LANGUAGES,
} from '../lib/direction'
import { LanguageContext } from '../hooks/useLanguage'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [lang, setLang] = useState<LangCode>('en')

  const detectLangFromPath = useCallback((): LangCode => {
    const firstSegment = location.pathname.split('/')[1]
    return SUPPORTED_LANGUAGES.includes(firstSegment as LangCode)
      ? (firstSegment as LangCode)
      : 'en'
  }, [location.pathname])

  useEffect(() => {
    const detected = detectLangFromPath()
    if (detected !== i18n.language) {
      i18n.changeLanguage(detected)
    }
    if (detected !== lang) {
      setLang(detected)
    }
  }, [detectLangFromPath, lang])

  useEffect(() => {
    const dir = getDirection(lang)
    const htmlLang = getHtmlLang(lang)
    document.documentElement.lang = htmlLang
    document.documentElement.dir = dir
    localStorage.setItem('i18nextLng', lang)
  }, [lang])

  useEffect(() => {
    if (getDirection(lang) === 'rtl') {
      import('@fontsource/noto-sans-arabic/400.css').catch(() => {})
      import('@fontsource/noto-sans-arabic/500.css').catch(() => {})
    }
  }, [lang])

  const changeLanguage = useCallback(
    (newLang: LangCode) => {
      const segments = location.pathname.split('/').filter(Boolean)
      const hasLangPrefix = SUPPORTED_LANGUAGES.includes(segments[0] as LangCode)

      let newPath: string

      if (newLang === 'en') {
        if (hasLangPrefix) {
          segments.shift()
        }
        newPath =
          '/' + segments.join('/') + location.search + location.hash
      } else {
        if (hasLangPrefix) {
          segments[0] = newLang
        } else {
          segments.unshift(newLang)
        }
        newPath =
          '/' + segments.join('/') + location.search + location.hash
      }

      navigate(newPath || '/', { replace: true })
    },
    [location, navigate]
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

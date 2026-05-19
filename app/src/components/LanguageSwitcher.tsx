'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLanguage, type LangCode } from '../hooks/useLanguage'
import { ChevronDown } from 'lucide-react'

const LANGUAGE_LABELS: Record<LangCode, string> = {
  en: 'English',
  dari: 'دری',
  uzbek: "Oʻzbek",
}

const LANGUAGE_SUBLABELS: Record<LangCode, string> = {
  en: 'EN',
  dari: 'Dari',
  uzbek: 'Uzbek',
}

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark'
}

export default function LanguageSwitcher({ variant = 'light' }: LanguageSwitcherProps) {
  const { lang, supportedLanguages } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const handleSelect = (code: LangCode) => {
    const segments = (pathname ?? '/').split('/').filter(Boolean)
    const hasLangPrefix = supportedLanguages.includes(segments[0] as LangCode)

    let newPath: string
    if (code === 'en') {
      if (hasLangPrefix) segments.shift()
      newPath = '/' + segments.join('/')
    } else {
      if (hasLangPrefix) {
        segments[0] = code
      } else {
        segments.unshift(code)
      }
      newPath = '/' + segments.join('/')
    }

    router.replace(newPath || '/')
    setOpen(false)
  }

  const buttonClasses = variant === 'dark' 
    ? "flex items-center gap-1.5 px-3 py-2 border border-cream/30 rounded-md text-cream font-medium text-sm transition-all hover:bg-white/10 hover:border-amber/50 focus:outline-none focus:ring-2 focus:ring-amber"
    : "flex items-center gap-1.5 px-3 py-2 border border-warm-sand/60 rounded-md text-forest font-medium text-sm transition-all hover:bg-cream-dark hover:border-amber/50 focus:outline-none focus:ring-2 focus:ring-amber"

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        onClick={() => setOpen((prev) => !prev)}
        className={buttonClasses}
      >
        <span>{LANGUAGE_LABELS[lang]}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''} ${variant === 'dark' ? 'text-cream' : 'text-forest'}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Languages"
          className="absolute top-[calc(100%+8px)] left-0 md:left-auto md:right-0 min-w-[160px] bg-white border border-warm-sand/50 rounded-xl shadow-dropdown p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {supportedLanguages.map((code) => {
            const selected = code === lang
            return (
              <li key={code} role="presentation">
                <button
                  role="option"
                  aria-selected={selected}
                  onClick={() => handleSelect(code)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left ${
                    selected
                      ? 'bg-amber/10 text-forest font-semibold'
                      : 'text-forest hover:bg-cream-dark'
                  }`}
                >
                  <span>{LANGUAGE_LABELS[code]}</span>
                  <span className="text-xs text-forest-light">
                    {LANGUAGE_SUBLABELS[code]}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

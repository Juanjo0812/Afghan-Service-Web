import { useState, useRef, useEffect } from 'react'
import { useLanguage, type LangCode } from '../hooks/useLanguage'
import { ChevronDown } from 'lucide-react'

const LANGUAGE_LABELS: Record<LangCode, string> = {
  en: 'English',
  dari: 'دری',
  pashto: 'پښتو',
  uzbek: "Oʻzbek",
}

const LANGUAGE_SUBLABELS: Record<LangCode, string> = {
  en: 'EN',
  dari: 'Dari',
  pashto: 'Pashto',
  uzbek: 'Uzbek',
}

export default function LanguageSwitcher() {
  const { lang, changeLanguage, supportedLanguages } = useLanguage()
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
    changeLanguage(code)
    setOpen(false)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: '1px solid rgba(22, 45, 90, 0.12)',
          borderRadius: 8,
          padding: '6px 12px',
          cursor: 'pointer',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: 12,
          color: '#162d5a',
          transition: 'border-color 0.2s ease, background 0.2s ease',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(22, 45, 90, 0.25)'
          el.style.background = 'rgba(22, 45, 90, 0.04)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(22, 45, 90, 0.12)'
          el.style.background = 'none'
        }}
      >
        <span>{LANGUAGE_LABELS[lang]}</span>
        <ChevronDown
          size={14}
          color="#162d5a"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Languages"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            insetInlineEnd: 0,
            minWidth: 160,
            background: '#ffffff',
            border: '1px solid rgba(22, 45, 90, 0.08)',
            borderRadius: 12,
            boxShadow: '0 12px 40px rgba(22, 45, 90, 0.12)',
            padding: '6px',
            margin: 0,
            listStyle: 'none',
            zIndex: 3000,
            animation: 'langDropdownIn 0.2s ease forwards',
          }}
        >
          {supportedLanguages.map((code) => {
            const selected = code === lang
            return (
              <li key={code} role="presentation">
                <button
                  role="option"
                  aria-selected={selected}
                  onClick={() => handleSelect(code)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: selected ? 'rgba(22, 45, 90, 0.06)' : 'transparent',
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: selected ? 600 : 400,
                    fontSize: 13,
                    color: '#162d5a',
                    transition: 'background 0.15s ease',
                    textAlign: 'start',
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) {
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(22, 45, 90, 0.04)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) {
                      ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                    }
                  }}
                >
                  <span>{LANGUAGE_LABELS[code]}</span>
                  <span
                    style={{
                      fontSize: 11,
                      color: '#6b6b7b',
                      fontWeight: 400,
                    }}
                  >
                    {LANGUAGE_SUBLABELS[code]}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <style>{`
        @keyframes langDropdownIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

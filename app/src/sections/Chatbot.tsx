'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, X, User, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useChatbotKB } from '../hooks/useChatbotKB'
import { useLanguage } from '../hooks/useLanguage'
import type { ScoredEntry, KBEntry } from '../lib/matchKeywords'

interface QuickActionDef {
  label: string
  section: string
  response: string
  ctaLabel: string
}

interface Message {
  text: string
  from: 'bot' | 'user'
  actions?: { label: string; href: string }[]
  candidates?: ScoredEntry[]
}

export default function Chatbot() {
  const { t } = useTranslation('chatbot')
  const { lang } = useLanguage()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { text: t('welcome'), from: 'bot' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [hasTypedFreeText, setHasTypedFreeText] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const { findResponse } = useChatbotKB(lang)

  const quickActions: QuickActionDef[] = useMemo(
    () => [
      {
        label: t('actions.immigration.label'),
        section: '/immigration',
        response: t('actions.immigration.response'),
        ctaLabel: t('actions.immigration.cta'),
      },
      {
        label: t('actions.community.label'),
        section: '/resources',
        response: t('actions.community.response'),
        ctaLabel: t('actions.community.cta'),
      },
      {
        label: t('actions.rights.label'),
        section: '/rights',
        response: t('actions.rights.response'),
        ctaLabel: t('actions.rights.cta'),
      },
      {
        label: t('actions.events.label'),
        section: '/events',
        response: t('actions.events.response'),
        ctaLabel: t('actions.events.cta'),
      },
      {
        label: t('actions.contact.label'),
        section: '/contact',
        response: t('actions.contact.response'),
        ctaLabel: t('actions.contact.cta'),
      },
      {
        label: t('actions.speak.label'),
        section: '/contact',
        response: t('actions.speak.response'),
        ctaLabel: t('actions.speak.cta'),
      },
    ],
    [t]
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const getEntryResponse = (entry: KBEntry): string => {
    const key = `response_${lang}` as keyof KBEntry
    const response = entry[key]
    return typeof response === 'string' && response.length > 0 ? response : entry.response_en
  }

  const handleActionClick = (action: QuickActionDef) => {
    setMessages((prev) => [...prev, { text: action.label, from: 'user' }])
    setTyping(true)

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: action.response,
          from: 'bot',
          actions: [{ label: action.ctaLabel, href: action.section }],
        },
      ])
      setTyping(false)
    }, 1500)
  }

  const handleKBAction = (href: string) => {
    setOpen(false)
    if (href.startsWith('http://') || href.startsWith('https://')) {
      window.open(href, '_blank', 'noopener,noreferrer')
    } else if (href.startsWith('tel:')) {
      window.open(href, '_self')
    } else if (href.startsWith('/') && href.endsWith('.pdf')) {
      window.open(href, '_blank')
    } else {
      router.push(href)
    }
  }

  const handleCandidateSelect = (scoredEntry: ScoredEntry) => {
    const entry = scoredEntry.entry
    setMessages((prev) => [
      ...prev,
      { text: getEntryResponse(entry), from: 'bot', actions: entry.actions },
    ])
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userInput = input.trim()
    setMessages((prev) => [...prev, { text: userInput, from: 'user' }])
    setInput('')
    setHasTypedFreeText(true)
    setTyping(true)

    setTimeout(() => {
      const result = findResponse(userInput)

      if (result.matched && result.multiCandidate && result.candidates.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            text: t('multiCandidate'),
            from: 'bot',
            candidates: result.candidates,
          },
        ])
      } else if (result.matched && result.entry) {
        const entry = result.entry
        setMessages((prev) => [
          ...prev,
          { text: getEntryResponse(entry), from: 'bot', actions: entry.actions },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            text: t('fallback'),
            from: 'bot',
          },
        ])
      }
      setTyping(false)
    }, 1500)
  }

  const showQuickActions = !typing && !hasTypedFreeText

  const typingIndicator = (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'var(--color-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <MessageCircle size={14} color="#faf5ef" />
      </div>
      <div
        style={{
          background: '#f0e8dc',
          padding: '10px 16px',
          borderStartStartRadius: 16,
          borderStartEndRadius: 16,
          borderEndEndRadius: 16,
          borderEndStartRadius: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#162d5a',
            opacity: 0.4,
            display: 'inline-block',
            animation: 'typingBounce 1.4s infinite',
          }}
        />
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#162d5a',
            opacity: 0.4,
            display: 'inline-block',
            animation: 'typingBounce 1.4s infinite 0.2s',
          }}
        />
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#162d5a',
            opacity: 0.4,
            display: 'inline-block',
            animation: 'typingBounce 1.4s infinite 0.4s',
          }}
        />
      </div>
    </div>
  )

  return (
    <>
      {/* Floating Notification Bubble */}
      {!hasInteracted && !open && (
        <div 
          className="fixed bottom-24 right-7 z-[9999] bg-forest text-white px-4 py-3 rounded-xl shadow-lg"
          style={{
            animation: 'chatFloat 3s ease-in-out infinite'
          }}
        >
          <div className="font-medium text-sm flex items-center gap-2">
            <span>{t('notification.title')}</span>
            <span className="text-amber animate-pulse">👋</span>
          </div>
          {/* Triangle pointer */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-forest transform rotate-45" />
          
          <button 
            onClick={(e) => { e.stopPropagation(); setHasInteracted(true); }}
            className="absolute -top-2 -right-2 bg-white text-forest rounded-full p-1 shadow-sm hover:bg-gray-100 transition-colors"
            aria-label="Close notification"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => { setOpen(!open); setHasInteracted(true); }}
        aria-label={open ? t('closeAssistant') : t('openAssistant')}
        className={`fixed bottom-7 right-7 z-[9999] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 ${
          open ? 'bg-forest w-14 h-14 rounded-full' : 'bg-amber rounded-full px-5 py-3.5 gap-2'
        }`}
        style={{
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {open ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
        {!open && <span className="font-medium text-white text-[15px] whitespace-nowrap">{t('openButton.label')}</span>}
      </button>

      <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            bottom: 108,
            insetInlineEnd: 28,
            width: 'clamp(320px, 92vw, 400px)',
            maxHeight: 560,
            background: '#faf5ef',
            borderRadius: 24,
            boxShadow: open 
              ? '0 24px 64px rgba(26,37,24,0.18), 0 0 0 1px rgba(26,37,24,0.06)' 
              : '0 4px 16px rgba(26,37,24,0), 0 0 0 1px rgba(26,37,24,0)',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            
            // Premium Organic Animation
            transformOrigin: 'calc(100% - 20px) calc(100% + 40px)',
            transform: open ? 'scale(1) translateY(0)' : 'scale(0.3) translateY(60px)',
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
            visibility: open ? 'visible' : 'hidden',
            transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out, box-shadow 0.65s ease-out, visibility 0.65s',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1a2518 0%, #2a3a28 100%)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexShrink: 0,
              borderBottom: '1px solid rgba(250,245,239,0.1)',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MessageCircle size={18} color="#faf5ef" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 16,
                  color: '#faf5ef',
                  lineHeight: 1.3,
                }}
              >
                {t('title')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#22c55e',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    color: 'rgba(250,245,239,0.6)',
                  }}
                >
                  {t('status')}
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={t('closeChat')}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(250,245,239,0.5)',
                cursor: 'pointer',
                fontSize: 20,
                lineHeight: 1,
                padding: 4,
                borderRadius: 8,
                transition: 'color 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.color = '#faf5ef'
                el.style.background = 'rgba(250,245,239,0.1)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.color = 'rgba(250,245,239,0.5)'
                el.style.background = 'transparent'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages scroll area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 8,
                  flexDirection: msg.from === 'user' ? 'row-reverse' : 'row',
                  alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: msg.from === 'user' ? '#96592a' : '#1a2518',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {msg.from === 'user' ? (
                    <User size={14} color="#faf5ef" />
                  ) : (
                    <MessageCircle size={14} color="#faf5ef" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  style={{
                    maxWidth: '82%',
                    background: msg.from === 'user' ? '#96592a' : '#ffffff',
                    color: msg.from === 'user' ? '#ffffff' : '#1a2518',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    lineHeight: 1.5,
                    borderStartStartRadius: 20,
                    borderStartEndRadius: 20,
                    borderEndEndRadius: msg.from === 'user' ? 4 : 20,
                    borderEndStartRadius: msg.from === 'user' ? 20 : 4,
                    boxShadow: msg.from === 'bot' ? '0 2px 8px rgba(26,37,24,0.06)' : 'none',
                    wordBreak: 'break-word',
                  }}
                >
                  <span>
                    {msg.text}
                  </span>
                  {msg.from === 'bot' && msg.actions && msg.actions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                      {msg.actions.map((action) => (
                        <button
                          key={action.label}
                          onClick={() => handleKBAction(action.href)}
                          style={{
                            background: '#ffffff',
                            color: '#1a2518',
                            border: '1px solid #1a2518',
                            padding: '8px 16px',
                            borderRadius: 9999,
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            const el = e.target as HTMLElement
                            el.style.background = '#1a2518'
                            el.style.color = '#ffffff'
                          }}
                          onMouseLeave={(e) => {
                            const el = e.target as HTMLElement
                            el.style.background = '#ffffff'
                            el.style.color = '#1a2518'
                          }}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {msg.from === 'bot' && msg.candidates && msg.candidates.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                      {(() => {
                        const seen = new Set<string>()
                        return msg.candidates!
                          .filter((scored) => {
                            const label =
                              scored.entry.title ??
                              scored.entry.actions?.[0]?.label ??
                              scored.entry.id
                            if (seen.has(label)) return false
                            seen.add(label)
                            return true
                          })
                          .map((scored) => {
                            const label =
                              scored.entry.title ??
                              scored.entry.actions?.[0]?.label ??
                              scored.entry.id
                            return (
                              <button
                                key={scored.entry.id}
                                onClick={() => handleCandidateSelect(scored)}
                                style={{
                                  background: '#ffffff',
                                  color: '#1a2518',
                                  border: '1px solid #1a2518',
                                  padding: '10px 16px',
                                  borderRadius: 9999,
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: 13,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  textAlign: 'start',
                                }}
                                onMouseEnter={(e) => {
                                  const el = e.target as HTMLElement
                                  el.style.background = '#1a2518'
                                  el.style.color = '#ffffff'
                                }}
                                onMouseLeave={(e) => {
                                  const el = e.target as HTMLElement
                                  el.style.background = '#ffffff'
                                  el.style.color = '#1a2518'
                                }}
                              >
                                {label}
                              </button>
                            )
                          })
                      })()}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && typingIndicator}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions — fixed area above input */}
          {showQuickActions && (
            <div
              style={{
                padding: '12px 20px 8px',
                borderTop: '1px solid rgba(26,37,24,0.06)',
                flexShrink: 0,
                background: '#faf5ef',
              }}
            >
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.06em',
                  color: 'rgba(22,45,90,0.45)',
                  marginBottom: 8,
                }}
              >
                {t('quickTopics')}
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                }}
              >
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleActionClick(action)}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid rgba(26, 37, 24, 0.25)',
                      padding: '10px 14px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: 13,
                      color: '#1a2518',
                      cursor: 'pointer',
                      borderRadius: 9999,
                      transition: 'all 0.2s ease',
                      textAlign: 'center',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.target as HTMLElement
                      el.style.background = '#1a2518'
                      el.style.borderColor = '#1a2518'
                      el.style.color = '#ffffff'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.target as HTMLElement
                      el.style.background = '#ffffff'
                      el.style.borderColor = 'rgba(26, 37, 24, 0.25)'
                      el.style.color = '#1a2518'
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSend}
            style={{
              borderTop: '1px solid rgba(26,37,24,0.08)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexShrink: 0,
              background: '#ffffff',
            }}
          >
            <input
              type="text"
              placeholder={t('inputPlaceholder')}
              aria-label={t('inputAriaLabel')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontFamily: "'Inter', sans-serif",
                fontSize: 15,
                color: '#1a2518',
                background: 'transparent',
                padding: '8px 0',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label={t('sendAriaLabel')}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: input.trim() ? 'var(--color-accent)' : 'rgba(150,89,42,0.25)',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.25s ease, transform 0.2s ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!input.trim()) return
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'scale(1.08)'
                el.style.background = '#a6683a'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'scale(1)'
                el.style.background = input.trim() ? 'var(--color-accent)' : 'rgba(150,89,42,0.25)'
              }}
            >
              <Send size={16} color="#faf5ef" />
            </button>
          </form>
        </div>

      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes chatFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </>
  )
}

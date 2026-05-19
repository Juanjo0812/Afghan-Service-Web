'use client'

import { createContext, useContext } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'
import Header from './Header'
import Footer from './Footer'
import Chatbot from '@/sections/Chatbot'
import { Toaster } from './ui/sonner'
import { ScrollToTop } from './ScrollToTop'
import { LanguageProvider } from './LanguageProvider'
import type { LangCode } from '@/domain/language'

// Context to detect nested AppShell instances
const AppShellContext = createContext(false)

interface AppShellProps {
  children: React.ReactNode
  initialLang?: LangCode
}

export default function AppShell({ children, initialLang = 'en' }: AppShellProps) {
  const isNested = useContext(AppShellContext)

  // If this is a nested AppShell inside another AppShell, bypass rendering duplicate chrome
  if (isNested) {
    return <>{children}</>
  }

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider initialLang={initialLang}>
        <ScrollToTop />
        <AppShellContext.Provider value={true}>
          <div className="min-h-screen flex flex-col bg-cream">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <Chatbot />
            <Toaster position="bottom-right" richColors />
          </div>
        </AppShellContext.Provider>
      </LanguageProvider>
    </I18nextProvider>
  )
}

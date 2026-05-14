'use client'

import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'
import Header from './Header'
import Footer from './Footer'
import Chatbot from '@/sections/Chatbot'
import { Toaster } from './ui/sonner'
import { ScrollToTop } from './ScrollToTop'
import { LanguageProvider } from './LanguageProvider'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-cream">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <Chatbot />
            <Toaster position="bottom-right" richColors />
          </div>
        </LanguageProvider>
      </I18nextProvider>
    </HelmetProvider>
  )
}

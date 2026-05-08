import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import './index.css'
import i18n from './lib/i18n.ts'
import App from './App.tsx'
import { LanguageProvider } from './components/LanguageProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </I18nextProvider>
    </HelmetProvider>
  </BrowserRouter>
)

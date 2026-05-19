import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'

/* English */
import enCommon from '../locales/en/common.json'
import enHero from '../locales/en/hero.json'
import enServices from '../locales/en/services.json'
import enAbout from '../locales/en/about.json'
import enRights from '../locales/en/rights.json'
import enResources from '../locales/en/resources.json'
import enEvents from '../locales/en/events.json'
import enContact from '../locales/en/contact.json'
import enTestimonials from '../locales/en/testimonials.json'
import enChatbot from '../locales/en/chatbot.json'
import enImmigrationHelp from '../locales/en/immigration-help.json'

/* Dari */
import faCommon from '../locales/dari/common.json'
import faHero from '../locales/dari/hero.json'
import faServices from '../locales/dari/services.json'
import faAbout from '../locales/dari/about.json'
import faRights from '../locales/dari/rights.json'
import faResources from '../locales/dari/resources.json'
import faEvents from '../locales/dari/events.json'
import faContact from '../locales/dari/contact.json'
import faTestimonials from '../locales/dari/testimonials.json'
import faChatbot from '../locales/dari/chatbot.json'
import faImmigrationHelp from '../locales/dari/immigration-help.json'

/* Uzbek */
import uzCommon from '../locales/uzbek/common.json'
import uzHero from '../locales/uzbek/hero.json'
import uzServices from '../locales/uzbek/services.json'
import uzAbout from '../locales/uzbek/about.json'
import uzRights from '../locales/uzbek/rights.json'
import uzResources from '../locales/uzbek/resources.json'
import uzEvents from '../locales/uzbek/events.json'
import uzContact from '../locales/uzbek/contact.json'
import uzTestimonials from '../locales/uzbek/testimonials.json'
import uzChatbot from '../locales/uzbek/chatbot.json'
import uzImmigrationHelp from '../locales/uzbek/immigration-help.json'

export const NAMESPACES = [
  'common',
  'hero',
  'services',
  'about',
  'rights',
  'resources',
  'events',
  'contact',
  'testimonials',
  'chatbot',
  'immigration-help',
] as const

export type Namespace = (typeof NAMESPACES)[number]

// LanguageDetector removed: it ran during SSR where browser APIs don't
// exist, producing a different initial language than the server render.
// This caused a React hydration mismatch on mobile browsers, which
// silently killed all onClick handlers and IntersectionObserver effects.
// Language detection is already handled by LanguageProvider via URL path
// + middleware headers, so the detector was redundant and harmful.

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: { escapeValue: false },
    ns: NAMESPACES,
    defaultNS: 'common',
    resources: {
      en: {
        common: enCommon,
        hero: enHero,
        services: enServices,
        about: enAbout,
        rights: enRights,
        resources: enResources,
        events: enEvents,
        contact: enContact,
        testimonials: enTestimonials,
        chatbot: enChatbot,
        'immigration-help': enImmigrationHelp,
      },
      dari: {
        common: faCommon,
        hero: faHero,
        services: faServices,
        about: faAbout,
        rights: faRights,
        resources: faResources,
        events: faEvents,
        contact: faContact,
        testimonials: faTestimonials,
        chatbot: faChatbot,
        'immigration-help': faImmigrationHelp,
      },
      uzbek: {
        common: uzCommon,
        hero: uzHero,
        services: uzServices,
        about: uzAbout,
        rights: uzRights,
        resources: uzResources,
        events: uzEvents,
        contact: uzContact,
        testimonials: uzTestimonials,
        chatbot: uzChatbot,
        'immigration-help': uzImmigrationHelp,
      },
    },
  })

export default i18n

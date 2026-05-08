import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
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

/* Pashto */
import psCommon from '../locales/pashto/common.json'
import psHero from '../locales/pashto/hero.json'
import psServices from '../locales/pashto/services.json'
import psAbout from '../locales/pashto/about.json'
import psRights from '../locales/pashto/rights.json'
import psResources from '../locales/pashto/resources.json'
import psEvents from '../locales/pashto/events.json'
import psContact from '../locales/pashto/contact.json'
import psTestimonials from '../locales/pashto/testimonials.json'
import psChatbot from '../locales/pashto/chatbot.json'

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
] as const

export type Namespace = (typeof NAMESPACES)[number]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    interpolation: { escapeValue: false },
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
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
      },
      pashto: {
        common: psCommon,
        hero: psHero,
        services: psServices,
        about: psAbout,
        rights: psRights,
        resources: psResources,
        events: psEvents,
        contact: psContact,
        testimonials: psTestimonials,
        chatbot: psChatbot,
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
      },
    },
  })

export default i18n

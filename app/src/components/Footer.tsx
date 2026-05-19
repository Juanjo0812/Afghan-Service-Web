'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { localizePath } from '../lib/navigation'
import LanguageSwitcher from './LanguageSwitcher'

export default function Footer() {
  const { t } = useTranslation('common')
  const { lang } = useLanguage()

  const quickLinks = useMemo(() => [
    { label: t('footer.home'), path: localizePath('/', lang) },
    { label: t('nav.immigrationHelp'), path: localizePath('/immigration', lang) },
    { label: t('nav.communityResources'), path: localizePath('/resources', lang) },
    { label: t('nav.knowYourRights'), path: localizePath('/rights', lang) },
    { label: t('footer.events'), path: localizePath('/events', lang) },
    { label: t('footer.stories'), path: localizePath('/stories', lang) },
    { label: t('footer.contact'), path: localizePath('/contact', lang) },
  ], [t, lang])

  const resourceLinks = useMemo(() => [
    { label: t('footer.resourceLinks.englishClasses'), path: localizePath('/resources', lang) },
    { label: t('footer.resourceLinks.foodBanks'), path: localizePath('/resources', lang) },
    { label: t('footer.resourceLinks.mentalHealth'), path: localizePath('/resources', lang) },
    { label: t('footer.resourceLinks.healthClinics'), path: localizePath('/resources', lang) },
  ], [t, lang])

  return (
    <footer className="bg-forest-dark text-cream">
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Organization Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <img src="/images/Catholic.png" alt="Catholic Charities Logo" className="h-12 w-auto brightness-0 invert" />
            </div>
            <p className="text-cream/70 text-sm mb-4">
              {t('footer.organization')}
            </p>
            <div className="space-y-2">
              <a
                href="tel:4804162333"
                className="flex items-center gap-2 text-cream/80 hover:text-amber transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 focus:ring-offset-forest-dark rounded-md"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                480.416.2333
              </a>
              <a
                href="mailto:Dpeshtaz@cc-az.org"
                className="flex items-center gap-2 text-cream/80 hover:text-amber transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 focus:ring-offset-forest-dark rounded-md"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                Dpeshtaz@cc-az.org
              </a>
              <div className="flex items-start gap-2 text-cream/80 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>5151 N 19th Ave<br />Phoenix, AZ 85015</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="label-text text-olive mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path + link.label}>
                  <Link
                    href={link.path}
                    className="text-cream/80 hover:text-amber transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 focus:ring-offset-forest-dark rounded-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="label-text text-olive mb-4">{t('footer.resourcesHeading')}</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.path}
                    className="text-cream/80 hover:text-amber transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 focus:ring-offset-forest-dark rounded-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Language */}
          <div>
            <h3 className="label-text text-olive mb-4">{t('footer.legal')}</h3>
            <p className="text-cream/60 text-xs mb-4 leading-relaxed">
              {t('footer.legalDisclaimer')}
            </p>
            <div className="mb-4">
              <LanguageSwitcher variant="dark" />
            </div>
            <p className="text-cream/50 text-xs">
              {t('footer.copyright')}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-forest-light/20 text-center">
          <p className="text-cream/50 text-xs">
            {t('footer.bottomText')}
          </p>
        </div>
      </div>
    </footer>
  )
}

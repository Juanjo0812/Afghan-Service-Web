'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Download, Info, Play, Pause } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'

function AccordionItem({
  section,
  isOpen,
  onToggle,
}: {
  section: { id: string; title: string; bullets: string[] }
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-warm-sand last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-6 text-left hover:bg-cream-dark/50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber"
        aria-expanded={isOpen}
        aria-controls={`panel-${section.id}`}
      >
        <h3 className="font-semibold text-heading-4 text-forest pr-4">{section.title}</h3>
        <ChevronDown
          className={`w-5 h-5 text-forest-light flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        id={`panel-${section.id}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-5">
          <ul className="space-y-2.5">
            {section.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3 text-body text-forest-light leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-amber mt-2 flex-shrink-0" aria-hidden="true" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function RightsPage() {
  const { t } = useTranslation('rights')
  const [openSection, setOpenSection] = useState<string>('police')
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  const rightsSections = [
    {
      id: 'police',
      title: t('sections.police.title'),
      bullets: [
        t('sections.police.bullet1'),
        t('sections.police.bullet2'),
        t('sections.police.bullet3'),
        t('sections.police.bullet4'),
        t('sections.police.bullet5'),
        t('sections.police.bullet6'),
      ],
    },
    {
      id: 'ice',
      title: t('sections.ice.title'),
      bullets: [
        t('sections.ice.bullet1'),
        t('sections.ice.bullet2'),
        t('sections.ice.bullet3'),
        t('sections.ice.bullet4'),
        t('sections.ice.bullet5'),
        t('sections.ice.bullet6'),
        t('sections.ice.bullet7'),
      ],
    },
    {
      id: 'documents',
      title: t('sections.documents.title'),
      bullets: [
        t('sections.documents.bullet1'),
        t('sections.documents.bullet2'),
        t('sections.documents.bullet3'),
        t('sections.documents.bullet4'),
        t('sections.documents.bullet5'),
        t('sections.documents.bullet6'),
      ],
    },
  ]

  const downloadCards = [
    { label: t('downloads.english'), lang: 'en', href: '/PDFs_Rights/Rights_EN.pdf' },
    { label: t('downloads.dari'), lang: 'dari', dir: 'rtl' as const, href: '/PDFs_Rights/Rigths_Dari.pdf' },
    { label: t('downloads.uzbek'), lang: 'uzbek', href: '/PDFs_Rights/Rigths_Uzbek.pdf' },
  ]

  return (
    <>
      {/* Page Header */}
      <section className="relative min-h-[45vh]" aria-label="Know your rights header">
        <div className="absolute inset-0">
          <img
            src="/images/hero-rights.png"
            alt="Community meeting in circle discussing rights"
            className="w-full h-full object-cover object-[center-30%]"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(26, 37, 24, 0.9) 0%, rgba(26, 37, 24, 0.6) 50%, rgba(26, 37, 24, 0.3) 100%)',
            }}
          />
        </div>
        <div className="relative container-main pt-36 pb-12 lg:pt-48 lg:pb-16">
          <div className="max-w-3xl">
            <span className="label-text text-amber block mb-3">{t('label')}</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-display-xl text-white mb-4 leading-tight">
              {t('heading')}
            </h1>
            <p className="text-body-lg text-white/85 max-w-2xl">
              {t('description')}
            </p>
          </div>
        </div>
      </section>

      {/* Rights Accordion */}
      <section className="section-padding bg-cream" aria-labelledby="rights-heading">
        <div className="container-main max-w-4xl">
          <div className="mb-8">
            <h2 id="rights-heading" className="font-display text-heading-1 text-forest mb-2">
              {t('accordionHeading')}
            </h2>
            <p className="text-body text-forest-light">
              {t('accordionSubtext')}
            </p>
          </div>

          <FadeIn delay={200} duration={800}>
            <div className="bg-white rounded-xl border border-warm-sand/50 shadow-card overflow-hidden">
              {rightsSections.map((section) => (
                <AccordionItem
                  key={section.id}
                  section={section}
                  isOpen={openSection === section.id}
                  onToggle={() =>
                    setOpenSection(openSection === section.id ? '' : section.id)
                  }
                />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Download Cards */}
      <section className="section-padding bg-warm-sand/40" aria-labelledby="download-heading">
        <div className="container-main">
          <div className="text-center mb-8">
            <h2 id="download-heading" className="font-display text-heading-1 text-forest mb-2">
              {t('downloads.heading')}
            </h2>
            <p className="text-body text-forest-light max-w-xl mx-auto">
              {t('downloads.subtext')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
            {downloadCards.map((card, i) => (
              <FadeIn key={card.lang} delay={i * 150} duration={800} className="h-full">
                <a
                  href={card.href}
                  download
                  className="bg-white w-full h-full rounded-xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-card border border-warm-sand/50 transition-all duration-300 hover:bg-cream-dark hover:shadow-card-hover hover:border-amber"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-forest/5 flex items-center justify-center">
                    <Download className="w-5 h-5 text-forest" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-heading-4 text-forest" dir={card.dir}>
                    {card.label}
                  </h3>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Video Resources */}
      <section className="section-padding bg-cream" aria-labelledby="video-heading">
        <div className="container-main">
          <div className="mb-8">
            <h2 id="video-heading" className="font-display text-heading-1 text-forest mb-2">
              {t('videos.heading')}
            </h2>
            <p className="text-body text-forest-light">
              {t('videos.subtext')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Community Leaders Video */}
            <FadeIn delay={100} duration={800} className="h-full">
              <div className="bg-white rounded-xl shadow-card border border-warm-sand/50 overflow-hidden h-full flex flex-col">
                <div className="relative aspect-video bg-forest-dark flex items-center justify-center">
                  <img
                    src="/images/hero-events.jpg"
                    alt="Community workshop setting"
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                  />
                  <button
                    onClick={() => setPlayingVideo(playingVideo === 'community' ? null : 'community')}
                    className="relative z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label={playingVideo === 'community' ? t('videos.pauseCommunity') : t('videos.playCommunity')}
                  >
                    {playingVideo === 'community' ? (
                      <Pause className="w-6 h-6 text-white" aria-hidden="true" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <div className="p-5 md:p-6 flex-grow">
                  <h3 className="font-semibold text-heading-4 text-forest mb-1">
                    {t('videos.community.title')}
                  </h3>
                  <p className="text-body-sm text-forest-light">
                    {t('videos.community.desc')}
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Client Stories Video */}
            <FadeIn delay={300} duration={800} className="h-full">
              <div className="bg-white rounded-xl shadow-card border border-warm-sand/50 overflow-hidden h-full flex flex-col">
                <div className="relative aspect-video bg-forest-dark flex items-center justify-center">
                  <img
                    src="/images/hero-stories.jpg"
                    alt="Community member portrait"
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                  />
                  <button
                    onClick={() => setPlayingVideo(playingVideo === 'clients' ? null : 'clients')}
                    className="relative z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label={playingVideo === 'clients' ? t('videos.pauseClients') : t('videos.playClients')}
                  >
                    {playingVideo === 'clients' ? (
                      <Pause className="w-6 h-6 text-white" aria-hidden="true" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <div className="p-5 md:p-6 flex-grow">
                  <h3 className="font-semibold text-heading-4 text-forest mb-1">
                    {t('videos.clients.title')}
                  </h3>
                  <p className="text-body-sm text-forest-light">
                    {t('videos.clients.desc')}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-8 bg-cream-dark" aria-label="Legal disclaimer">
        <div className="container-main max-w-4xl">
          <div className="bg-white border-l-4 border-amber rounded-r-md p-5 md:p-6 flex items-start gap-4">
            <Info className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-body-sm text-forest-light leading-relaxed">
                {t('disclaimer')}
              </p>
              <p className="text-body-sm text-forest-light mt-2">
                {t('lastReviewed')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

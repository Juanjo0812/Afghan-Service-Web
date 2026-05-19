'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Download, Info, Play, X } from 'lucide-react'
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
  const [showVideoModal, setShowVideoModal] = useState(false)

  useEffect(() => {
    if (!showVideoModal) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowVideoModal(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showVideoModal])

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
            src="/images/hero-rights.jpg"
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
                  className="bg-white w-full h-full rounded-xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-card border-2 border-amber/50 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-2 hover:scale-[1.03]"
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
          <div className="text-center mb-8">
            <h2 id="video-heading" className="font-display text-heading-1 text-forest mb-2">
              {t('videos.heading')}
            </h2>
            <p className="text-body text-forest-light">
              {t('videos.subtext')}
            </p>
          </div>

          <FadeIn delay={100} duration={800}>
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setShowVideoModal(true)}
                className="w-full text-left bg-white rounded-xl shadow-card border border-amber/40 overflow-hidden flex flex-col sm:flex-row transition-all hover:shadow-card-hover cursor-pointer group transform-gpu isolate"
                aria-label={t('videos.playCommunity')}
              >
                <div className="w-full sm:w-3/5 relative overflow-hidden shrink-0 rounded-t-xl sm:rounded-tr-none sm:rounded-bl-xl" style={{ aspectRatio: '4/3' }}>
                  <img
                    src="/images/Story_leader.png"
                    alt="Community leader portrait"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Play className="w-7 h-7 text-white ml-1" aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center flex-grow">
                  <h3 className="font-display text-xl md:text-2xl text-forest mb-6">
                    {t('videos.community.title')}
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="font-semibold text-forest text-lg">{t('videos.community.speaker1.name')}</div>
                      <div className="text-sm text-forest-light">{t('videos.community.speaker1.role')}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-forest text-lg">{t('videos.community.speaker2.name')}</div>
                      <div className="text-sm text-forest-light">{t('videos.community.speaker2.role')}</div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-forest/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Community video"
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="relative aspect-video bg-neutral-900 flex items-center justify-center">
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur-md transition-colors z-10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <video
                src="/videos/Stories/Story_5.mp4"
                className="absolute inset-0 w-full h-full object-contain"
                controls
                autoPlay
                playsInline
              />
            </div>
            <div className="p-6 md:p-8">
              <h3 className="font-display text-xl text-forest mb-6">
                {t('videos.community.title')}
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="font-semibold text-forest text-lg">{t('videos.community.speaker1.name')}</div>
                  <div className="text-sm text-forest-light">{t('videos.community.speaker1.role')}</div>
                </div>
                <div>
                  <div className="font-semibold text-forest text-lg">{t('videos.community.speaker2.name')}</div>
                  <div className="text-sm text-forest-light">{t('videos.community.speaker2.role')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

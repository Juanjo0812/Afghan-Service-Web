import { useState } from 'react'
import { ChevronDown, Download, Info, Play, Pause } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'

const rightsSections = [
  {
    id: 'police',
    title: 'When Interacting with Police or Immigration Agents',
    bullets: [
      'You have the right to remain silent. You do not have to answer questions about your immigration status.',
      'You have the right to refuse a search of yourself, your car, or your home without a warrant.',
      'You have the right to ask for a lawyer. Say: "I want to speak with a lawyer."',
      'You have the right to refuse to sign any documents without speaking to a lawyer first.',
      'Do not run away, lie, or provide false documents. Stay calm and polite.',
      'If you are arrested, you have the right to make a phone call.',
    ],
  },
  {
    id: 'ice',
    title: 'If ICE Comes to Your Home',
    bullets: [
      'ICE cannot enter your home without a warrant signed by a judge. Ask them to slide the warrant under the door.',
      'You have the right to remain silent. Do not open the door unless they show a valid judicial warrant.',
      'Do not sign any documents without speaking to a lawyer first.',
      'If ICE enters without permission, say: "I do not consent to this search."',
      'Prepare a family safety plan: Know who will care for children if a family member is detained.',
      'Keep important documents in a safe, accessible place.',
      'Memorize important phone numbers, including your lawyer\'s number.',
    ],
  },
  {
    id: 'documents',
    title: 'Carrying Documents Safely',
    bullets: [
      'Carry copies of your important documents, not originals. Keep originals in a safe place at home.',
      'Important documents include: passport, I-94, work permit, driver\'s license, court papers.',
      'Make digital copies and store them securely (cloud storage, email to trusted family).',
      'Do not carry false documents — this can lead to serious legal consequences.',
      'If you have a valid work permit or driver\'s license, carry it with you.',
      'Consider carrying a "Know Your Rights" card (download below) to hand to officers.',
    ],
  },
]

const downloadCards = [
  { label: 'English', lang: 'en' },
  { label: 'دری (Dari)', lang: 'dari', dir: 'rtl' as const },
  { label: 'پښتو (Pashto)', lang: 'pashto', dir: 'rtl' as const },
  { label: 'ازبکی (Uzbek)', lang: 'uzbek' },
]

function AccordionItem({
  section,
  isOpen,
  onToggle,
}: {
  section: (typeof rightsSections)[0]
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
  const [openSection, setOpenSection] = useState<string>('police')
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

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
            <span className="label-text text-amber block mb-3">EMPOWERMENT</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-display-xl text-white mb-4 leading-tight">
              Know Your Rights
            </h1>
            <p className="text-body-lg text-white/85 max-w-2xl">
              Understanding your rights is the first step toward protecting yourself and your family.
            </p>
          </div>
        </div>
      </section>

      {/* Rights Accordion */}
      <section className="section-padding bg-cream" aria-labelledby="rights-heading">
        <div className="container-main max-w-4xl">
          <div className="mb-8">
            <h2 id="rights-heading" className="font-display text-heading-1 text-forest mb-2">
              Your Rights in Key Situations
            </h2>
            <p className="text-body text-forest-light">
              Click each topic to learn more about your rights
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
              Download Your Rights Cards
            </h2>
            <p className="text-body text-forest-light max-w-xl mx-auto">
              Wallet-size cards you can carry with you. Available in multiple languages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {downloadCards.map((card, i) => (
              <FadeIn key={card.lang} delay={i * 150} duration={800} className="h-full">
                <button
                  className="bg-white w-full h-full rounded-xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-card border border-warm-sand/50 transition-all duration-250 hover:shadow-card-hover hover:border-amber/50 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 group"
                  onClick={() => alert('Download coming soon for ' + card.label)}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-forest/5 flex items-center justify-center group-hover:bg-amber/10 transition-colors">
                    <Download className="w-5 h-5 text-forest group-hover:text-amber transition-colors" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-heading-4 text-forest" dir={card.dir}>
                    {card.label}
                  </h3>
                </button>
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
              Video Resources
            </h2>
            <p className="text-body text-forest-light">
              Learn from community leaders and those who have been through the process
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
                    aria-label={playingVideo === 'community' ? 'Pause video' : 'Play community leaders video'}
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
                    Community Leaders Speak
                  </h3>
                  <p className="text-body-sm text-forest-light">
                    Hear from Afghan community leaders about your rights and resources in Phoenix.
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
                    aria-label={playingVideo === 'clients' ? 'Pause video' : 'Play client stories video'}
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
                    Client Experiences
                  </h3>
                  <p className="text-body-sm text-forest-light">
                    Learn how understanding their rights helped these families build a new life.
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
                This information is for educational purposes only and does not constitute legal advice. Every situation is different. Please consult with a qualified immigration attorney for advice about your specific circumstances.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

import { useState } from 'react'
import { Link } from 'react-router'
import { FadeIn } from '../components/FadeIn'

type StoryFilter = 'all' | 'clients' | 'leaders'

const filters: { label: string; value: StoryFilter }[] = [
  { label: 'All Stories', value: 'all' },
  { label: 'Client Stories', value: 'clients' },
  { label: 'Community Leaders', value: 'leaders' },
]

export default function StoriesPage() {
  const [activeFilter, setActiveFilter] = useState<StoryFilter>('all')

  return (
    <>
      {/* Page Header */}
      <section className="relative min-h-[45vh]" aria-label="Stories header">
        <div className="absolute inset-0">
          <img
            src="/images/hero-stories.jpg"
            alt="Afghan community member portrait"
            className="w-full h-full object-cover object-[center-10%]"
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
            <span className="label-text text-amber block mb-3">STORIES</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-display-xl text-white mb-4 leading-tight">
              Community Impact
            </h1>
            <p className="text-body-lg text-white/85 max-w-2xl">
              Real stories from Afghan families who have found support and success in Phoenix.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pt-8 pb-4 bg-cream">
        <div className="container-main">
          <div className="flex flex-wrap gap-3 justify-center" role="group" aria-label="Story filters">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-5 py-2.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber ${
                  activeFilter === filter.value
                    ? 'bg-amber text-white'
                    : 'bg-white text-forest border border-warm-sand/60 hover:bg-cream-dark'
                }`}
                aria-pressed={activeFilter === filter.value}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Placeholder Card */}
      <section className="section-padding bg-cream" aria-label="Stories">
        <div className="container-main max-w-3xl">
          <FadeIn delay={150} duration={800}>
            <div className="bg-white border border-amber/40 rounded-xl p-8 md:p-12 text-center shadow-sm">
              <h2 className="font-display text-2xl md:text-3xl text-forest mb-4">
                Community Stories Coming Soon
              </h2>
              <p className="text-body text-forest-light mb-6 leading-relaxed">
                We are collecting and reviewing stories from Afghan families and community leaders.
                Check back soon to hear real experiences from our community.
              </p>
              <p className="text-body text-forest-light">
                If you would like to share your story, please{' '}
                <Link to="/contact" className="text-forest font-semibold hover:text-amber transition-colors underline underline-offset-4">
                  contact us
                </Link>.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding bg-forest text-center" aria-label="Get help">
        <div className="container-main max-w-2xl">
          <h2 className="font-display text-heading-1 md:text-heading-1 text-white mb-4">
            Be Part of Our Story
          </h2>
          <p className="text-body-lg text-white/80 mb-8">
            Whether you need help or want to support our community, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary">
              Get Help Now
            </Link>
            <Link to="/contact" className="btn-white-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

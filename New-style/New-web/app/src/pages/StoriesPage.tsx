import { useState } from 'react'
import { Quote } from 'lucide-react'
import { Link } from 'react-router-dom'

type StoryFilter = 'all' | 'clients' | 'leaders'

interface Story {
  id: number
  type: StoryFilter
  image?: string
  quote: string
  name: string
  context: string
}

const stories: Story[] = [
  {
    id: 1,
    type: 'clients',
    image: '/images/story-1.jpg',
    quote: "When we arrived in Phoenix, we didn't know where to turn. Catholic Charities helped us with everything \u2014 from legal papers to finding a doctor for my children.",
    name: 'Fatima H.',
    context: 'Client since 2022',
  },
  {
    id: 2,
    type: 'clients',
    image: '/images/story-2.jpg',
    quote: "After two years apart, the immigration team helped bring my wife and daughter to Phoenix. I will never forget what they did for my family.",
    name: 'Ahmad S.',
    context: 'Family reunification client',
  },
  {
    id: 3,
    type: 'clients',
    image: '/images/story-3.jpg',
    quote: "The English classes and job support changed everything. I now work as a teacher's aide and my children are thriving in school.",
    name: 'Maryam K.',
    context: 'Client since 2021',
  },
  {
    id: 4,
    type: 'leaders',
    quote: "As community leaders, we work with Catholic Charities to make sure every Afghan family knows their rights and has access to resources.",
    name: 'Community Leader',
    context: 'Afghan Community Council, Phoenix',
  },
  {
    id: 5,
    type: 'leaders',
    quote: "We help translate not just language, but culture \u2014 making sure Afghan families feel understood and respected when they seek help.",
    name: 'Community Liaison',
    context: 'Catholic Charities Afghan Services',
  },
  {
    id: 6,
    type: 'leaders',
    quote: "The community events bring us together. In Phoenix, we have built a new home while keeping our traditions alive.",
    name: 'Elder, Afghan Community',
    context: 'Phoenix, Arizona',
  },
]

const filters: { label: string; value: StoryFilter }[] = [
  { label: 'All Stories', value: 'all' },
  { label: 'Client Stories', value: 'clients' },
  { label: 'Community Leaders', value: 'leaders' },
]

function StoryCard({ story }: { story: Story }) {
  return (
    <div className="bg-white rounded-xl shadow-card border border-warm-sand/50 overflow-hidden transition-all duration-250 hover:shadow-card-hover group">
      {story.image ? (
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={story.image}
            alt={`Portrait of ${story.name}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-[3/4] bg-gradient-to-br from-olive/20 to-warm-sand/60 flex items-center justify-center">
          <Quote className="w-12 h-12 text-amber/40" aria-hidden="true" />
        </div>
      )}
      <div className="p-5 md:p-6">
        <blockquote className="text-body text-forest italic leading-relaxed mb-4">
          &ldquo;{story.quote}&rdquo;
        </blockquote>
        <cite className="not-italic">
          <p className="font-semibold text-heading-4 text-forest">{story.name}</p>
          <p className="text-body-sm text-forest-light">{story.context}</p>
        </cite>
      </div>
    </div>
  )
}

export default function StoriesPage() {
  const [activeFilter, setActiveFilter] = useState<StoryFilter>('all')
  const filteredStories = activeFilter === 'all' ? stories : stories.filter((s) => s.type === activeFilter)

  return (
    <>
      {/* Page Header */}
      <section className="relative min-h-[45vh] flex items-end" aria-label="Stories header">
        <div className="absolute inset-0">
          <img
            src="/images/hero-stories.jpg"
            alt="Afghan community member portrait"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(26, 37, 24, 0.9) 0%, rgba(26, 37, 24, 0.6) 50%, rgba(26, 37, 24, 0.3) 100%)',
            }}
          />
        </div>
        <div className="relative container-main pb-10 pt-32">
          <span className="label-text text-amber block mb-3">STORIES</span>
          <h1 className="font-display text-3xl md:text-4xl lg:text-display-l text-white max-w-2xl mb-4">
            Community Impact
          </h1>
          <p className="text-body-lg text-white/85 max-w-xl">
            Real stories from Afghan families who have found support and success in Phoenix.
          </p>
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
                className={`px-5 py-2.5 text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber ${
                  activeFilter === filter.value
                    ? 'bg-forest text-white'
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

      {/* Story Cards Grid */}
      <section className="section-padding bg-cream" aria-label="Stories">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
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

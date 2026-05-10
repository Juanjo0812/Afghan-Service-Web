import { BookOpen, Heart, Apple, Stethoscope, ExternalLink } from 'lucide-react'

const resourceCategories = [
  {
    icon: BookOpen,
    title: 'English Classes',
    description: 'Free and low-cost English language classes throughout Phoenix. Programs for all levels, from beginner to advanced.',
    resources: [
      'Literacy Volunteers of Maricopa County — Free ESL classes',
      'Phoenix Public Library — Adult literacy programs',
      'Local Community Colleges — Affordable ESL courses',
    ],
  },
  {
    icon: Heart,
    title: 'Mental Health & Wellness',
    description: 'Culturally sensitive mental health services for Afghan families. Support groups, counseling, and crisis resources.',
    resources: [
      'Catholic Charities Counseling Services — Sliding fee scale',
      'National Alliance on Mental Illness (NAMI) Phoenix — Support groups',
      'Crisis Text Line — Text HOME to 741741 for 24/7 support',
    ],
  },
  {
    icon: Apple,
    title: 'Food Banks',
    description: 'Free food assistance and nutrition programs in the Phoenix area. No documentation required at most locations.',
    resources: [
      "St. Mary's Food Bank — Largest food bank in Arizona",
      'Community Food Bank of Arizona — Multiple locations',
      'Desert Mission Food Bank — North Phoenix',
    ],
  },
  {
    icon: Stethoscope,
    title: 'Health Clinics',
    description: 'Low-cost and free health clinics in Phoenix. Medical, dental, and vision services available.',
    resources: [
      'BMC Family Health Center — Sliding fee scale',
      'Mountain Park Health Center — Multiple Phoenix locations',
      'Phoenix Indian Medical Center — Federal health services',
    ],
  },
]

export default function ResourcesPage() {
  return (
    <>
      {/* Page Header */}
      <section className="relative min-h-[45vh] flex items-end" aria-label="Community resources header">
        <div className="absolute inset-0">
          <img
            src="/images/hero-resources.jpg"
            alt="Community garden food distribution event"
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
          <span className="label-text text-amber block mb-3">RESOURCES</span>
          <h1 className="font-display text-3xl md:text-4xl lg:text-display-l text-white max-w-2xl mb-4">
            Community Resources
          </h1>
          <p className="text-body-lg text-white/85 max-w-xl">
            Essential services and programs to support you and your family in Phoenix.
          </p>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="section-padding bg-cream" aria-labelledby="resources-heading">
        <div className="container-main">
          <div className="mb-10">
            <h2 id="resources-heading" className="font-display text-heading-1 text-forest mb-2">
              Find the Support You Need
            </h2>
            <p className="text-body text-forest-light">
              Browse resources by category
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {resourceCategories.map((category) => {
              const Icon = category.icon
              return (
                <div
                  key={category.title}
                  className="bg-white rounded-xl p-6 md:p-8 shadow-card border border-warm-sand/50 transition-all duration-250 hover:shadow-card-hover"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-olive/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-forest" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-heading-2 text-forest">
                      {category.title}
                    </h3>
                  </div>
                  <p className="text-body text-forest-light mb-5 leading-relaxed">
                    {category.description}
                  </p>
                  <ul className="space-y-2.5 mb-6">
                    {category.resources.map((resource, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-body-sm text-forest-light"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber mt-2 flex-shrink-0" aria-hidden="true" />
                        {resource}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => alert('External resource directory coming soon')}
                    className="btn-secondary text-sm"
                  >
                    <span>Find {category.title.split('&')[0].trim()}</span>
                    <ExternalLink className="w-4 h-4 ml-1.5" aria-hidden="true" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

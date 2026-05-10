import { Link } from 'react-router-dom'
import { Shield, Briefcase, Clock, CreditCard, Landmark, Phone, Mail, Clock3 } from 'lucide-react'

const services = [
  {
    icon: Shield,
    title: 'Asylum Applications',
    description:
      'We provide legal assistance for asylum seekers, including application preparation, documentation support, and representation guidance. Our experienced team will walk you through every step of the process.',
  },
  {
    icon: Briefcase,
    title: 'Work Permit Assistance',
    description:
      'Get help applying for and renewing work permits (EAD). We assist with Form I-765 preparation, required documentation, and filing procedures to help you obtain authorization to work legally.',
  },
  {
    icon: Clock,
    title: 'TPS (Temporary Protected Status)',
    description:
      'Assistance with Temporary Protected Status applications and renewals. We help you understand eligibility requirements, prepare forms, and meet deadlines to maintain your protected status.',
  },
  {
    icon: CreditCard,
    title: 'Green Card & Family Reunification',
    description:
      'Support for green card applications and family reunification petitions. We guide you through the complex process of bringing family members to the United States.',
  },
  {
    icon: Landmark,
    title: 'Afghan Adjustment Act Assistance',
    description:
      'Specialized assistance for Afghan Adjustment Act applications. We help eligible Afghan nationals navigate this pathway to lawful permanent residence.',
  },
]

const languages = ['English', 'پښتو (Pashto)', 'دری (Dari)', 'ازبکی (Uzbek)']

export default function ImmigrationPage() {
  return (
    <>
      {/* Page Header */}
      <section className="relative min-h-[45vh] flex items-end" aria-label="Immigration services header">
        <div className="absolute inset-0">
          <img
            src="/images/hero-immigration.jpg"
            alt="Community worker helping Afghan family with documents"
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
          <span className="label-text text-amber block mb-3">FREE SERVICES</span>
          <h1 className="font-display text-3xl md:text-4xl lg:text-display-l text-white max-w-3xl mb-4">
            Free Immigration Assistance for Afghan Families in Phoenix
          </h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            All services are free, confidential, and available in Dari, Pashto, Uzbek, and English.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-cream" aria-labelledby="services-heading">
        <div className="container-main">
          <div className="mb-10">
            <h2 id="services-heading" className="font-display text-heading-1 md:text-heading-1 text-forest mb-2">
              Our Services
            </h2>
            <p className="text-body text-forest-light">
              Click on any service to learn more or request assistance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.title}
                  className="bg-white rounded-xl p-6 md:p-8 shadow-card border border-warm-sand/50 border-l-4 border-l-amber transition-all duration-250 hover:shadow-card-hover hover:border-l-[6px]"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-forest" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-heading-3 text-forest">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-body text-forest-light leading-relaxed">
                    {service.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Languages & Contact */}
      <section className="section-padding bg-warm-sand/40" aria-labelledby="contact-heading">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Languages */}
            <div>
              <h2 id="contact-heading" className="font-display text-heading-2 text-forest mb-5">
                Languages Available
              </h2>
              <div className="flex flex-wrap gap-3 mb-5">
                {languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-4 py-2 bg-white text-forest font-medium text-sm rounded-full border border-warm-sand/60"
                  >
                    {lang}
                  </span>
                ))}
              </div>
              <p className="text-body text-forest-light leading-relaxed">
                Our staff speaks your language. Interpretation services are also available.
              </p>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-card border border-warm-sand/50">
              <h2 className="font-display text-heading-2 text-forest mb-5">
                Contact Our Immigration Team
              </h2>
              <div className="space-y-5">
                <div>
                  <p className="font-semibold text-forest mb-1">Daoud &mdash; Immigration Case Manager</p>
                </div>
                <a
                  href="tel:4804162333"
                  className="flex items-center gap-3 text-forest hover:text-amber transition-colors focus:outline-none focus:ring-2 focus:ring-amber rounded-md p-1 -m-1"
                >
                  <Phone className="w-5 h-5 text-olive" aria-hidden="true" />
                  <span className="text-body-lg font-medium">480.416.2333</span>
                </a>
                <a
                  href="mailto:Dpeshtaz@cc-az.org"
                  className="flex items-center gap-3 text-forest-light hover:text-amber transition-colors focus:outline-none focus:ring-2 focus:ring-amber rounded-md p-1 -m-1"
                >
                  <Mail className="w-5 h-5 text-olive" aria-hidden="true" />
                  <span className="text-body">Dpeshtaz@cc-az.org</span>
                </a>
                <div className="flex items-center gap-3 text-forest-light">
                  <Clock3 className="w-5 h-5 text-olive" aria-hidden="true" />
                  <span className="text-body-sm">Monday&ndash;Friday, 9:00 AM&ndash;5:00 PM</span>
                </div>
                <Link to="/contact" className="btn-primary w-full text-center mt-2">
                  Request a Call Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

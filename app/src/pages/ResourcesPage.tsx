import { Home, Stethoscope, Briefcase, GraduationCap, Bus, Utensils, Check, ArrowRight } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'

export default function ResourcesPage() {
  return (
    <>
      {/* Page Header */}
      <section className="relative min-h-[45vh]" aria-label="Community resources header">
        <div className="absolute inset-0">
          <img
            src="/images/hero-resources.jpg"
            alt="Community garden food distribution event"
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
            <span className="label-text text-amber block mb-3">RESOURCES</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-display-xl text-white mb-4 leading-tight">
              Community Resources
            </h1>
            <p className="text-body-lg text-white/85 max-w-2xl">
              Essential services and programs to support you and your family in Phoenix.
            </p>
          </div>
        </div>
      </section>

      {/* Bento Grid Resources */}
      <section className="section-padding bg-cream" aria-labelledby="resources-heading">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Housing (Featured) */}
            <FadeIn className="md:col-span-2 lg:col-span-2">
              <div className="bg-white border border-amber/40 rounded-lg overflow-hidden flex flex-col md:flex-row transition-all hover:bg-cream-dark shadow-sm hover:shadow-card-hover">
                <div className="w-full md:w-2/5 h-64 md:h-auto bg-warm-sand/20 relative">
                  <img 
                    alt="Housing support meeting" 
                    className="w-full h-full object-cover" 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  />
                </div>
                <div className="p-6 md:p-8 w-full md:w-3/5 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Home className="w-5 h-5 text-amber" />
                    <span className="text-xs font-semibold text-amber uppercase tracking-wider">Housing</span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl text-forest mb-3">Housing Assistance</h2>
                  <p className="text-forest-light mb-6 flex-grow">
                    Emergency shelter placement, transitional housing programs, and rental assistance for newly arrived families. We work with local partners to find safe, affordable homes.
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-forest-light">
                      <Check className="w-5 h-5 text-forest flex-shrink-0" />
                      <span className="text-sm">Emergency shelter referrals</span>
                    </div>
                    <div className="flex items-center gap-3 text-forest-light">
                      <Check className="w-5 h-5 text-forest flex-shrink-0" />
                      <span className="text-sm">Rental deposit assistance</span>
                    </div>
                    <div className="flex items-center gap-3 text-forest-light">
                      <Check className="w-5 h-5 text-forest flex-shrink-0" />
                      <span className="text-sm">Lease review and translation</span>
                    </div>
                  </div>
                  <button className="btn-primary w-full md:w-auto mt-auto">
                    Get Housing Help
                  </button>
                </div>
              </div>
            </FadeIn>

            {/* Healthcare */}
            <FadeIn delay={150} duration={800} className="h-full">
              <div className="bg-white border border-amber/40 rounded-lg p-6 md:p-8 flex flex-col transition-all hover:bg-cream-dark shadow-sm hover:shadow-card-hover h-full">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="w-5 h-5 text-amber" />
                <span className="text-xs font-semibold text-amber uppercase tracking-wider">Healthcare</span>
              </div>
              <h3 className="font-display text-xl md:text-2xl text-forest mb-3">Health & Wellness</h3>
              <p className="text-forest-light mb-6 flex-grow">
                Free and low-cost clinics, AHCCCS enrollment assistance, mental health support, and dental care referrals.
              </p>
              <div className="mt-auto pt-4 border-t border-warm-sand/50">
                <a href="#" className="text-forest font-semibold hover:text-amber transition-colors flex items-center gap-2">
                  View Resources <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              </div>
            </FadeIn>

            {/* Employment */}
            <FadeIn delay={250} duration={800} className="h-full">
              <div className="bg-white border border-amber/40 rounded-lg p-6 md:p-8 flex flex-col transition-all hover:bg-cream-dark shadow-sm hover:shadow-card-hover h-full">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-5 h-5 text-amber" />
                <span className="text-xs font-semibold text-amber uppercase tracking-wider">Employment</span>
              </div>
              <h3 className="font-display text-xl md:text-2xl text-forest mb-3">Job Readiness</h3>
              <p className="text-forest-light mb-6 flex-grow">
                Resume workshops, job placement services, interview coaching, and connections with employers who hire refugees.
              </p>
              <div className="mt-auto pt-4 border-t border-warm-sand/50">
                <a href="#" className="text-forest font-semibold hover:text-amber transition-colors flex items-center gap-2">
                  View Resources <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              </div>
            </FadeIn>

            {/* Education */}
            <FadeIn delay={350} duration={800} className="h-full">
              <div className="bg-white border border-amber/40 rounded-lg p-6 md:p-8 flex flex-col transition-all hover:bg-cream-dark shadow-sm hover:shadow-card-hover h-full">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-amber" />
                <span className="text-xs font-semibold text-amber uppercase tracking-wider">Education</span>
              </div>
              <h3 className="font-display text-xl md:text-2xl text-forest mb-3">Education & ESL</h3>
              <p className="text-forest-light mb-6 flex-grow">
                English language classes, GED programs, school enrollment help for children, and tutoring services.
              </p>
              <div className="mt-auto pt-4 border-t border-warm-sand/50">
                <a href="#" className="text-forest font-semibold hover:text-amber transition-colors flex items-center gap-2">
                  View Resources <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              </div>
            </FadeIn>

            {/* Transportation */}
            <FadeIn delay={150} duration={800} className="h-full">
              <div className="bg-white border border-amber/40 rounded-lg p-6 md:p-8 flex flex-col transition-all hover:bg-cream-dark shadow-sm hover:shadow-card-hover h-full">
              <div className="flex items-center gap-2 mb-3">
                <Bus className="w-5 h-5 text-amber" />
                <span className="text-xs font-semibold text-amber uppercase tracking-wider">Transportation</span>
              </div>
              <h3 className="font-display text-xl md:text-2xl text-forest mb-3">Getting Around</h3>
              <p className="text-forest-light mb-6 flex-grow">
                Bus pass assistance, driver's license guidance, and ride-sharing for medical and legal appointments.
              </p>
              <div className="mt-auto pt-4 border-t border-warm-sand/50">
                <a href="#" className="text-forest font-semibold hover:text-amber transition-colors flex items-center gap-2">
                  View Resources <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              </div>
            </FadeIn>

            {/* Food & Basic Needs */}
            <FadeIn delay={250} duration={800} className="h-full">
              <div className="bg-white border border-amber/40 rounded-lg p-6 md:p-8 flex flex-col transition-all hover:bg-cream-dark shadow-sm hover:shadow-card-hover h-full">
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="w-5 h-5 text-amber" />
                <span className="text-xs font-semibold text-amber uppercase tracking-wider">Basic Needs</span>
              </div>
              <h3 className="font-display text-xl md:text-2xl text-forest mb-3">Food & Essentials</h3>
              <p className="text-forest-light mb-6 flex-grow">
                Food bank locations, SNAP benefits enrollment, halal food resources, and clothing distribution events.
              </p>
              <div className="mt-auto pt-4 border-t border-warm-sand/50">
                <a href="#" className="text-forest font-semibold hover:text-amber transition-colors flex items-center gap-2">
                  View Resources <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            </FadeIn>

          </div>
        </div>
      </section>
    </>
  )
}

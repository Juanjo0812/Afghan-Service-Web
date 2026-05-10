import { BookOpen, Heart, Utensils, Stethoscope, Check, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
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
            {/* English classes (Featured) */}
            <FadeIn className="md:col-span-2 lg:col-span-2">
              <div className="bg-white border border-amber/40 rounded-lg overflow-hidden flex flex-col md:flex-row transition-all hover:bg-cream-dark shadow-sm hover:shadow-card-hover">
                <div className="w-full md:w-2/5 h-64 md:h-auto bg-warm-sand/20 relative" />
                <div className="p-6 md:p-8 w-full md:w-3/5 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-amber" />
                    <span className="text-xs font-semibold text-amber uppercase tracking-wider">Education</span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl text-forest mb-3">English Classes</h2>
                  <p className="text-forest-light mb-6 flex-grow">
                    ESL programs, GED prep, and school enrollment help for children and adults.
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-forest-light">
                      <Check className="w-5 h-5 text-forest flex-shrink-0" />
                      <span className="text-sm">ESL programs for all levels</span>
                    </div>
                    <div className="flex items-center gap-3 text-forest-light">
                      <Check className="w-5 h-5 text-forest flex-shrink-0" />
                      <span className="text-sm">GED preparation classes</span>
                    </div>
                    <div className="flex items-center gap-3 text-forest-light">
                      <Check className="w-5 h-5 text-forest flex-shrink-0" />
                      <span className="text-sm">School enrollment help</span>
                    </div>
                  </div>
                  <Link to="/contact" className="btn-primary w-full md:w-auto mt-auto">
                    Get Help
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Mental health & wellness */}
            <FadeIn delay={150} duration={800} className="h-full">
              <div className="bg-white border border-amber/40 rounded-lg p-6 md:p-8 flex flex-col transition-all hover:bg-cream-dark shadow-sm hover:shadow-card-hover h-full">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-amber" />
                  <span className="text-xs font-semibold text-amber uppercase tracking-wider">Wellness</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl text-forest mb-3">Mental Health & Wellness</h3>
                <p className="text-forest-light mb-6 flex-grow">
                  Counseling, support groups, and trauma-informed care for individuals and families.
                </p>
                <div className="mt-auto pt-4 border-t border-warm-sand/50">
                  <Link to="/contact" className="text-forest font-semibold hover:text-amber transition-colors flex items-center gap-2">
                    Contact Us <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Food banks */}
            <FadeIn delay={250} duration={800} className="h-full">
              <div className="bg-white border border-amber/40 rounded-lg p-6 md:p-8 flex flex-col transition-all hover:bg-cream-dark shadow-sm hover:shadow-card-hover h-full">
                <div className="flex items-center gap-2 mb-3">
                  <Utensils className="w-5 h-5 text-amber" />
                  <span className="text-xs font-semibold text-amber uppercase tracking-wider">Basic Needs</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl text-forest mb-3">Food Banks</h3>
                <p className="text-forest-light mb-6 flex-grow">
                  Food bank locations, SNAP enrollment assistance, and halal food resources.
                </p>
                <div className="mt-auto pt-4 border-t border-warm-sand/50">
                  <Link to="/contact" className="text-forest font-semibold hover:text-amber transition-colors flex items-center gap-2">
                    Contact Us <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Health clinics */}
            <FadeIn delay={350} duration={800} className="h-full">
              <div className="bg-white border border-amber/40 rounded-lg p-6 md:p-8 flex flex-col transition-all hover:bg-cream-dark shadow-sm hover:shadow-card-hover h-full">
                <div className="flex items-center gap-2 mb-3">
                  <Stethoscope className="w-5 h-5 text-amber" />
                  <span className="text-xs font-semibold text-amber uppercase tracking-wider">Healthcare</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl text-forest mb-3">Health Clinics</h3>
                <p className="text-forest-light mb-6 flex-grow">
                  Free and low-cost clinics, AHCCCS enrollment assistance, and dental care referrals.
                </p>
                <div className="mt-auto pt-4 border-t border-warm-sand/50">
                  <Link to="/contact" className="text-forest font-semibold hover:text-amber transition-colors flex items-center gap-2">
                    Contact Us <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}

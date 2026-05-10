import { useState } from 'react'
import { Phone, Mail, Clock, MapPin, MessageCircle, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Please enter your name'
    if (!formData.phone.trim()) newErrors.phone = 'Please enter your phone number'
    if (!formData.message.trim()) newErrors.message = 'Please enter your question or message'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setSubmitted(true)
    }
  }

  return (
    <>
      {/* Page Header */}
      <section className="relative min-h-[45vh] flex items-end" aria-label="Contact header">
        <div className="absolute inset-0">
          <img
            src="/images/hero-home.jpg"
            alt="Afghan support team"
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
          <span className="label-text text-amber block mb-3">CONTACT US</span>
          <h1 className="font-display text-3xl md:text-4xl lg:text-display-l text-white max-w-2xl mb-4">
            We're Here to Help
          </h1>
          <p className="text-body-lg text-white/90 max-w-xl">
            Reach out for free, confidential assistance. Our team speaks your language.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding bg-cream" aria-labelledby="form-heading">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form - 60% */}
            <div className="lg:col-span-3">
              <h2 id="form-heading" className="font-display text-heading-2 text-forest mb-6">
                Send Us a Message
              </h2>

              {submitted ? (
                <div className="bg-white rounded-xl p-8 md:p-10 shadow-card border border-success/20 text-center">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" aria-hidden="true" />
                  <h3 className="font-display text-heading-3 text-forest mb-2">Thank You!</h3>
                  <p className="text-body text-forest-light">
                    We will contact you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <label htmlFor="name" className="block text-label text-forest mb-1.5">
                      Your Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onBlur={validate}
                      className={`w-full px-4 py-3.5 rounded-md border-2 bg-white text-forest placeholder-forest-light/50 focus:outline-none focus:border-amber focus:shadow-sm transition-colors min-h-[48px] ${
                        errors.name ? 'border-error bg-error/5' : 'border-warm-sand'
                      }`}
                      placeholder="Enter your full name"
                      aria-required="true"
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-body-sm text-error" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-label text-forest mb-1.5">
                      Phone Number <span className="text-error">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      onBlur={validate}
                      className={`w-full px-4 py-3.5 rounded-md border-2 bg-white text-forest placeholder-forest-light/50 focus:outline-none focus:border-amber focus:shadow-sm transition-colors min-h-[48px] ${
                        errors.phone ? 'border-error bg-error/5' : 'border-warm-sand'
                      }`}
                      placeholder="Enter your phone number"
                      aria-required="true"
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-body-sm text-error" role="alert">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-label text-forest mb-1.5">
                      How Can We Help? <span className="text-error">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      onBlur={validate}
                      className={`w-full px-4 py-3.5 rounded-md border-2 bg-white text-forest placeholder-forest-light/50 focus:outline-none focus:border-amber focus:shadow-sm transition-colors resize-y ${
                        errors.message ? 'border-error bg-error/5' : 'border-warm-sand'
                      }`}
                      placeholder="Describe your question or what you need help with..."
                      aria-required="true"
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-body-sm text-error" role="alert">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button type="submit" className="btn-primary w-full sm:w-auto">
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info - 40% */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-warm-sand/50">
                <h2 className="font-display text-heading-3 text-forest mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/14804162333"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 group focus:outline-none focus:ring-2 focus:ring-amber rounded-lg p-1 -m-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-body text-forest font-medium">Message us on WhatsApp</p>
                      <p className="text-body-lg text-forest group-hover:text-amber transition-colors">
                        480.416.2333
                      </p>
                    </div>
                  </a>

                  {/* Phone */}
                  <a
                    href="tel:4804162333"
                    className="flex items-start gap-4 group focus:outline-none focus:ring-2 focus:ring-amber rounded-lg p-1 -m-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-forest" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-body text-forest font-medium">Call us</p>
                      <p className="text-body-lg text-forest group-hover:text-amber transition-colors">
                        480.416.2333 <span className="text-body text-forest-light">(Daoud)</span>
                      </p>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:Dpeshtaz@cc-az.org"
                    className="flex items-start gap-4 group focus:outline-none focus:ring-2 focus:ring-amber rounded-lg p-1 -m-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-forest" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-body text-forest font-medium">Email us</p>
                      <p className="text-body text-forest-light group-hover:text-amber transition-colors">
                        Dpeshtaz@cc-az.org
                      </p>
                    </div>
                  </a>

                  {/* Office Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-forest" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-body text-forest font-medium">Office Hours</p>
                      <p className="text-body text-forest-light">
                        Monday&ndash;Friday, 9:00 AM&ndash;5:00 PM
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-forest" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-body text-forest font-medium">Visit us</p>
                      <p className="text-body text-forest-light">
                        5151 N 19th Ave<br />
                        Phoenix, AZ 85015
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Map */}
                <div className="mt-8 aspect-video bg-warm-sand/20 rounded-xl overflow-hidden border border-warm-sand/50">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3326.697424610738!2d-112.1017830245084!3d33.51052304618797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b130db50b3e5b%3A0xe54e2079de936f4c!2s5151%20N%2019th%20Ave%2C%20Phoenix%2C%20AZ%2085015!5e0!3m2!1sen!2sus!4v1715000000000!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location Map"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

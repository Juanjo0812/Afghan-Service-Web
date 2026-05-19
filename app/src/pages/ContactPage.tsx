'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, Clock, MapPin, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react'

type FormStatus =
  | 'idle'
  | 'sending'
  | 'success'
  | 'validation-error'
  | 'rate-limited'
  | 'generic-error'

export default function ContactPage() {
  const { t } = useTranslation('contact')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    website_url: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [submissionId] = useState(() => crypto.randomUUID())
  const [retryAfter, setRetryAfter] = useState<number | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState('')

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = t('form.errors.name')
    if (!formData.phone.trim()) newErrors.phone = t('form.errors.phone')
    if (!formData.message.trim())
      newErrors.message = t('form.errors.message')
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      setStatus('validation-error')
      return
    }

    setStatus('sending')
    setRetryAfter(undefined)
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          website_url: formData.website_url,
          submissionId,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 429) {
        setStatus('rate-limited')
        setRetryAfter(data.retryAfterSeconds)
        return
      }

      if (response.status === 400 && data.fields) {
        setStatus('validation-error')
        setErrors(data.fields)
        return
      }

      if (!response.ok || !data.success) {
        setStatus('generic-error')
        setErrorMessage(
          data.error || t('form.error')
        )
        return
      }

      setStatus('success')
    } catch {
      setStatus('generic-error')
      setErrorMessage(t('form.error'))
    }
  }

  return (
    <>
      {/* Page Header */}
      <section className="relative min-h-[45vh]" aria-label="Contact header">
        <div className="absolute inset-0">
          <img
            src="/images/hero-home.jpg"
            alt="Afghan support team"
            className="w-full h-full object-cover object-[center_30%]"
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
            <p className="text-body-lg text-white/90 max-w-2xl">
              {t('description')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding bg-cream" aria-labelledby="form-heading">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form - 60% */}
            <div className="lg:col-span-3">
              <h2
                id="form-heading"
                className="font-display text-heading-2 text-forest mb-6"
              >
                {t('form.heading')}
              </h2>

              {status === 'success' ? (
                <div className="bg-white rounded-xl p-8 md:p-10 shadow-card border border-success/20 text-center">
                  <CheckCircle
                    className="w-12 h-12 text-success mx-auto mb-4"
                    aria-hidden="true"
                  />
                  <h3 className="font-display text-heading-3 text-forest mb-2">
                    {t('success.title')}
                  </h3>
                  <p className="text-body text-forest-light">
                    {t('success.message')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Honeypot */}
                  <div className="absolute opacity-0 -z-10 w-0 h-0 overflow-hidden">
                    <input
                      type="text"
                      name="website_url"
                      id="website_url"
                      value={formData.website_url}
                      onChange={(e) => {
                        setFormData({ ...formData, website_url: e.target.value })
                      }}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-label text-forest mb-1.5"
                    >
                      {t('form.name.label')} <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value })
                        clearError('name')
                      }}
                      onBlur={validate}
                      className={`w-full px-4 py-3.5 rounded-md border-2 bg-white text-forest placeholder-forest-light/50 focus:outline-none focus:border-amber focus:shadow-sm transition-colors min-h-[48px] ${
                        errors.name
                          ? 'border-error bg-error/5'
                          : 'border-warm-sand'
                      }`}
                      placeholder={t('form.name.placeholder')}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      disabled={status === 'sending'}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-body-sm text-error" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-label text-forest mb-1.5"
                    >
                      {t('form.phone.label')} <span className="text-error">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value })
                        clearError('phone')
                      }}
                      onBlur={validate}
                      className={`w-full px-4 py-3.5 rounded-md border-2 bg-white text-forest placeholder-forest-light/50 focus:outline-none focus:border-amber focus:shadow-sm transition-colors min-h-[48px] ${
                        errors.phone
                          ? 'border-error bg-error/5'
                          : 'border-warm-sand'
                      }`}
                      placeholder={t('form.phone.placeholder')}
                      aria-required="true"
                      aria-invalid={!!errors.phone}
                      disabled={status === 'sending'}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-body-sm text-error" role="alert">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-label text-forest mb-1.5"
                    >
                      {t('form.message.label')} <span className="text-error">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value })
                        clearError('message')
                      }}
                      onBlur={validate}
                      className={`w-full px-4 py-3.5 rounded-md border-2 bg-white text-forest placeholder-forest-light/50 focus:outline-none focus:border-amber focus:shadow-sm transition-colors resize-y ${
                        errors.message
                          ? 'border-error bg-error/5'
                          : 'border-warm-sand'
                      }`}
                      placeholder={t('form.message.placeholder')}
                      aria-required="true"
                      aria-invalid={!!errors.message}
                      disabled={status === 'sending'}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-body-sm text-error" role="alert">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {status === 'rate-limited' && (
                    <div
                      className="bg-amber/10 border border-amber/30 rounded-lg p-4 text-forest"
                      role="alert"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          className="w-5 h-5 text-amber mt-0.5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="font-medium">
                            {t('form.rateLimited.title')}
                          </p>
                          <p className="text-sm text-forest-light mt-1">
                            {retryAfter
                              ? t('form.rateLimited.retry', { minutes: Math.ceil(retryAfter / 60) })
                              : t('form.rateLimited.wait')}
                          </p>
                          <p className="text-sm text-forest-light mt-1">
                            {t('form.rateLimited.urgent')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {status === 'generic-error' && (
                    <div
                      className="bg-error/10 border border-error/30 rounded-lg p-4 text-forest"
                      role="alert"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          className="w-5 h-5 text-error mt-0.5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="font-medium">
                            {errorMessage || t('form.error')}
                          </p>
                          <p className="text-sm text-forest-light mt-1">
                            {t('form.errorFallback')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-auto"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? t('form.sending') : t('form.submit')}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info - 40% */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-warm-sand/50">
                <h2 className="font-display text-heading-3 text-forest mb-6">
                  {t('info.heading')}
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
                      <MessageCircle
                        className="w-5 h-5 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-body text-forest font-medium">
                        {t('info.whatsapp')}
                      </p>
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
                      <p className="text-body text-forest font-medium">
                        {t('info.phone')}
                      </p>
                      <p className="text-body-lg text-forest group-hover:text-amber transition-colors">
                        480.416.2333{' '}
                        <span className="text-body text-forest-light">(Daoud)</span>
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
                      <p className="text-body text-forest font-medium">
                        {t('info.email')}
                      </p>
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
                      <p className="text-body text-forest font-medium">
                        {t('info.hours')}
                      </p>
                      <p className="text-body text-forest-light">
                        Monday&ndash;Friday, 9:00 AM&ndash;5:00 PM
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center flex-shrink-0">
                      <MapPin
                        className="w-5 h-5 text-forest"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-body text-forest font-medium">
                        {t('info.address')}
                      </p>
                      <p className="text-body text-forest-light">
                        5151 N 19th Ave
                        <br />
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

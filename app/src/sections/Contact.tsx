import { useRef, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useLanguage } from '../hooks/useLanguage'
import { getSlideDirection } from '../lib/animationDirection'
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react'

interface ContactDetail {
  icon: typeof Phone
  label: string
  value: string
  href?: string
}

export default function Contact() {
  const { t } = useTranslation('contact')
  const { isRTL } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const { ref: leftRef, visible: leftVisible } = useScrollReveal<HTMLDivElement>()
  const { ref: rightRef, visible: rightVisible } = useScrollReveal<HTMLDivElement>()
  const [submitted, setSubmitted] = useState(false)

  const contactFormSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t('validation.nameMin')),
        phone: z
          .string()
          .min(1, t('validation.phoneRequired'))
          .regex(/^[\d\s\-+()]+$/, t('validation.phoneInvalid')),
        email: z.string().email(t('validation.emailInvalid')),
        message: z
          .string()
          .min(10, t('validation.messageMin'))
          .max(2000, t('validation.messageMax')),
        website_url: z.string().optional(),
      }),
    [t]
  )

  type ContactFormData = z.infer<typeof contactFormSchema>

  const contactDetails: ContactDetail[] = useMemo(
    () => [
      { icon: Phone, label: t('details.phone.label'), value: t('details.phone.value'), href: 'tel:+14804162333' },
      { icon: MessageCircle, label: t('details.whatsapp.label'), value: t('details.whatsapp.value'), href: 'https://wa.me/14804162333' },
      { icon: Mail, label: t('details.email.label'), value: t('details.email.value'), href: 'mailto:Dpeshtaz@cc-az.org' },
      { icon: MapPin, label: t('details.address.label'), value: t('details.address.value') },
    ],
    [t]
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
      website_url: '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(15000),
      })

      if (response.status === 429) {
        toast.error(t('toast.rateLimit'))
        return
      }

      if (!response.ok) {
        toast.error(t('toast.error'))
        return
      }

      toast.success(t('toast.success'))
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 5000)
    } catch {
      toast.error(t('toast.error'))
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{ background: '#162d5a', padding: 'clamp(70px, 8vw, 120px) 0' }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 64,
        }}
      >
        {/* Left column */}
        <div
          ref={leftRef}
          style={{
            opacity: leftVisible ? 1 : 0,
            transform: leftVisible ? 'translateX(0)' : `translateX(${getSlideDirection(isRTL).enterFrom * 0.6}px)`,
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
            flex: '1 1 45%',
            minWidth: 280,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-accent)',
              display: 'block',
              marginBottom: 16,
            }}
          >
            {t('label')}
          </span>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: '#faf5ef',
              marginBottom: 20,
            }}
          >
            {t('heading')}
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 16,
              color: 'rgba(250,245,239,0.75)',
              lineHeight: 1.6,
              marginBottom: 40,
            }}
          >
            {t('description')}
          </p>

          {/* Contact details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {contactDetails.map((detail) => {
              const Icon = detail.icon
              return (
                <div key={detail.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <Icon size={20} color="var(--color-accent)" strokeWidth={1.5} />
                  <div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        fontSize: 11,
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.08em',
                        color: 'rgba(250,245,239,0.5)',
                        marginBottom: 2,
                      }}
                    >
                      {detail.label}
                    </div>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        target={detail.href.startsWith('http') ? '_blank' : undefined}
                        rel={detail.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 400,
                          fontSize: 15,
                          color: '#faf5ef',
                          textDecoration: 'none',
                          transition: 'color 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.color = 'var(--color-accent)'
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.color = '#faf5ef'
                        }}
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 400,
                          fontSize: 15,
                          color: '#faf5ef',
                        }}
                      >
                        {detail.value}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Map with floating frame effect */}
          <div style={{ marginTop: 40 }}>
            <div
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                background: '#faf5ef',
                padding: 8,
                boxShadow:
                  '0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(250,245,239,0.12), 0 12px 40px rgba(150,89,42,0.15)',
              }}
            >
              <div
                style={{
                  borderRadius: 14,
                  overflow: 'hidden',
                  height: 220,
                  position: 'relative',
                }}
              >
                <iframe
                  title={t('mapTitle')}
                  src="https://www.google.com/maps?q=5151+N+19th+Ave,+Phoenix,+AZ+85015&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div
                style={{
                  padding: '10px 8px 4px',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase' as const,
                    color: '#162d5a',
                    opacity: 0.5,
                  }}
                >
                  {t('mapCaption')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — form */}
        <div
          ref={rightRef}
          style={{
            opacity: rightVisible ? 1 : 0,
            transform: rightVisible ? 'translateX(0)' : `translateX(${-getSlideDirection(isRTL).enterFrom * 0.6}px)`,
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '0.2s',
            flex: '1 1 45%',
            minWidth: 280,
          }}
        >
          {submitted ? (
            <div
              style={{
                background: 'rgba(250,245,239,0.08)',
                border: '1px solid rgba(var(--color-accent-rgb), 0.3)',
                padding: 40,
                textAlign: 'center',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontSize: 24,
                  color: '#faf5ef',
                  marginBottom: 12,
                }}
              >
                {t('success.title')}
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: 'rgba(250,245,239,0.7)' }}>
                {t('success.message')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Honeypot field */}
              <input
                {...register('website_url')}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: 'absolute', insetInlineStart: '-9999px', opacity: 0 }}
              />

              {[
                { name: 'name' as const, label: t('form.name.label'), placeholder: t('form.name.placeholder'), type: 'text', id: 'contact-name' },
                { name: 'phone' as const, label: t('form.phone.label'), placeholder: t('form.phone.placeholder'), type: 'tel', id: 'contact-phone' },
                { name: 'email' as const, label: t('form.email.label'), placeholder: t('form.email.placeholder'), type: 'email', id: 'contact-email' },
              ].map((field) => (
                <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label htmlFor={field.id} className="sr-only">{field.label}</label>
                  <input
                    {...register(field.name)}
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    disabled={isSubmitting}
                    style={{
                      background: 'rgba(250,245,239,0.08)',
                      border: `1px solid ${errors[field.name] ? 'rgba(220, 38, 38, 0.6)' : 'rgba(250,245,239,0.15)'}`,
                      borderRadius: 0,
                      padding: '14px 16px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: 14,
                      color: '#faf5ef',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                    }}
                    onFocus={(e) => {
                      if (!errors[field.name]) {
                        e.target.style.borderColor = 'rgba(var(--color-accent-rgb), 0.5)'
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors[field.name]) {
                        e.target.style.borderColor = 'rgba(250,245,239,0.15)'
                      }
                    }}
                  />
                  {errors[field.name] && (
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        color: 'rgba(220, 38, 38, 0.9)',
                      }}
                    >
                      {errors[field.name]?.message}
                    </span>
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="contact-message" className="sr-only">{t('form.message.label')}</label>
                <textarea
                  {...register('message')}
                  id="contact-message"
                  placeholder={t('form.message.placeholder')}
                  rows={5}
                  disabled={isSubmitting}
                  style={{
                    background: 'rgba(250,245,239,0.08)',
                    border: `1px solid ${errors.message ? 'rgba(220, 38, 38, 0.6)' : 'rgba(250,245,239,0.15)'}`,
                    borderRadius: 0,
                    padding: '14px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: 14,
                    color: '#faf5ef',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'border-color 0.3s ease',
                  }}
                  onFocus={(e) => {
                    if (!errors.message) {
                      e.target.style.borderColor = 'rgba(var(--color-accent-rgb), 0.5)'
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.message) {
                      e.target.style.borderColor = 'rgba(250,245,239,0.15)'
                    }
                  }}
                />
                {errors.message && (
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12,
                      color: 'rgba(220, 38, 38, 0.9)',
                    }}
                  >
                    {errors.message?.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  letterSpacing: '0.03em',
                  background: isSubmitting ? 'rgba(var(--color-accent-rgb), 0.5)' : 'var(--color-accent)',
                  color: '#faf5ef',
                  borderRadius: 32,
                  padding: 14,
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'background 0.4s ease, color 0.4s ease',
                  marginTop: 8,
                }}
                onMouseEnter={(e) => {
                  if (isSubmitting) return
                  const el = e.target as HTMLElement
                  el.style.background = '#faf5ef'
                  el.style.color = '#162d5a'
                }}
                onMouseLeave={(e) => {
                  if (isSubmitting) return
                  const el = e.target as HTMLElement
                  el.style.background = 'var(--color-accent)'
                  el.style.color = '#faf5ef'
                }}
              >
                {isSubmitting ? t('form.submitting') : t('form.submit')}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

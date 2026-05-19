'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Phone, Mail } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

type ContactMethod = 'phone' | 'email'

interface EventRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  eventTitle: string
}

export default function EventRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
  eventTitle,
}: EventRegistrationModalProps) {
  const { t } = useTranslation('events')
  const { lang } = useLanguage()
  const nameRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [contactMethod, setContactMethod] = useState<ContactMethod>('phone')
  const [contactValue, setContactValue] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')

  // Focus name input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to let animation start
      const timer = setTimeout(() => nameRef.current?.focus(), 150)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = t('registration.errors.name')
    }

    if (!contactValue.trim()) {
      newErrors.contactValue =
        contactMethod === 'phone'
          ? t('registration.errors.phone')
          : t('registration.errors.email')
    } else if (contactMethod === 'email') {
      // Basic email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(contactValue.trim())) {
        newErrors.contactValue = t('registration.errors.email')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [name, contactValue, contactMethod, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('sending')

    try {
      const response = await fetch('/api/event-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          contactMethod,
          contactValue: contactValue.trim(),
          eventTitle,
          language: lang,
          website_url: honeypot,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.success) {
        setStatus('error')
        return
      }

      // Success — close modal and trigger toast
      onClose()
      onSuccess()
    } catch {
      setStatus('error')
    }
  }

  const handleMethodChange = (method: ContactMethod) => {
    setContactMethod(method)
    setContactValue('')
    setErrors((prev) => {
      const next = { ...prev }
      delete next.contactValue
      return next
    })
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-modal-title"
    >
      {/* Overlay */}
      <div
        className="modal-overlay absolute inset-0 bg-forest/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="modal-content relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-warm-sand/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2
            id="registration-modal-title"
            className="font-display text-xl text-forest"
          >
            {t('registration.modalTitle')}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-forest-light hover:text-forest hover:bg-cream-dark transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-5" noValidate>
          {/* Honeypot */}
          <div className="absolute opacity-0 -z-10 w-0 h-0 overflow-hidden">
            <input
              type="text"
              name="website_url"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="reg-name"
              className="block text-label text-forest mb-1.5"
            >
              {t('registration.nameLabel')}{' '}
              <span className="text-error">*</span>
            </label>
            <input
              ref={nameRef}
              type="text"
              id="reg-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) {
                  setErrors((prev) => {
                    const next = { ...prev }
                    delete next.name
                    return next
                  })
                }
              }}
              className={`w-full px-4 py-3 rounded-md border-2 bg-white text-forest placeholder-forest-light/50 focus:outline-none focus:border-amber focus:shadow-sm transition-colors min-h-[48px] ${
                errors.name
                  ? 'border-error bg-error/5'
                  : 'border-warm-sand'
              }`}
              placeholder={t('registration.namePlaceholder')}
              disabled={status === 'sending'}
              aria-required="true"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="mt-1.5 text-body-sm text-error" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Contact Method Question */}
          <div>
            <p className="text-label text-forest mb-3">
              {t('registration.contactQuestion')}{' '}
              <span className="text-error">*</span>
            </p>

            {/* Toggle Pill */}
            <div className="flex rounded-lg border-2 border-warm-sand overflow-hidden">
              <button
                type="button"
                onClick={() => handleMethodChange('phone')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  contactMethod === 'phone'
                    ? 'bg-amber text-white'
                    : 'bg-white text-forest hover:bg-cream-dark'
                }`}
                aria-pressed={contactMethod === 'phone'}
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                {t('registration.phone')}
              </button>
              <button
                type="button"
                onClick={() => handleMethodChange('email')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  contactMethod === 'email'
                    ? 'bg-amber text-white'
                    : 'bg-white text-forest hover:bg-cream-dark'
                }`}
                aria-pressed={contactMethod === 'email'}
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                {t('registration.email')}
              </button>
            </div>
          </div>

          {/* Dynamic Contact Input */}
          <div>
            <label
              htmlFor="reg-contact"
              className="sr-only"
            >
              {contactMethod === 'phone'
                ? t('registration.phone')
                : t('registration.email')}
            </label>
            <input
              type={contactMethod === 'phone' ? 'tel' : 'email'}
              id="reg-contact"
              value={contactValue}
              onChange={(e) => {
                setContactValue(e.target.value)
                if (errors.contactValue) {
                  setErrors((prev) => {
                    const next = { ...prev }
                    delete next.contactValue
                    return next
                  })
                }
              }}
              className={`w-full px-4 py-3 rounded-md border-2 bg-white text-forest placeholder-forest-light/50 focus:outline-none focus:border-amber focus:shadow-sm transition-colors min-h-[48px] ${
                errors.contactValue
                  ? 'border-error bg-error/5'
                  : 'border-warm-sand'
              }`}
              placeholder={
                contactMethod === 'phone'
                  ? t('registration.phonePlaceholder')
                  : t('registration.emailPlaceholder')
              }
              disabled={status === 'sending'}
              aria-required="true"
              aria-invalid={!!errors.contactValue}
            />
            {errors.contactValue && (
              <p className="mt-1.5 text-body-sm text-error" role="alert">
                {errors.contactValue}
              </p>
            )}
          </div>

          {/* Error Message */}
          {status === 'error' && (
            <div
              className="bg-error/10 border border-error/30 rounded-lg p-3 text-sm text-forest"
              role="alert"
            >
              {t('registration.error')}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={status === 'sending'}
          >
            {status === 'sending'
              ? t('registration.sending')
              : t('registration.submit')}
          </button>
        </form>
      </div>
    </div>
  )
}

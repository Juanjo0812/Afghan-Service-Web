'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle, X } from 'lucide-react'

interface EventRegistrationToastProps {
  isVisible: boolean
  onClose: () => void
}

export default function EventRegistrationToast({
  isVisible,
  onClose,
}: EventRegistrationToastProps) {
  const { t } = useTranslation('events')

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!isVisible) return
    const timer = setTimeout(onClose, 8000)
    return () => clearTimeout(timer)
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center"
      aria-live="assertive"
    >
      <div className="toast-bubble pointer-events-auto fixed top-1/2 left-1/2 max-w-md w-[90vw] bg-white rounded-2xl shadow-xl border border-amber/30 p-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-forest-light hover:text-forest hover:bg-cream-dark transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <CheckCircle
          className="w-12 h-12 text-green-600 mx-auto mb-3"
          aria-hidden="true"
        />
        <h3 className="font-display text-xl text-forest mb-2">
          {t('registration.successTitle')}
        </h3>
        <p className="text-body text-forest-light leading-relaxed">
          {t('registration.successMessage')}
        </p>
      </div>
    </div>
  )
}

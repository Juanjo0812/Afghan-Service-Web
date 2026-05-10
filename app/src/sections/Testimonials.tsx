import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { X, Play, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { loadData } from '../lib/dataLoader'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Testimonial {
  id: string
  name: string
  role: string
  avatar: string
  /** If present the modal plays a video, otherwise shows the image */
  videoUrl?: string
  quote: string
}

/* ------------------------------------------------------------------ */
/*  TestimonialCard                                                    */
/* ------------------------------------------------------------------ */
function TestimonialCard({
  testimonial,
  onClick,
  index,
  isVisible,
}: {
  testimonial: Testimonial
  onClick: () => void
  index: number
  isVisible: boolean
}) {
  const { t } = useTranslation('testimonials')
  return (
    <button
      onClick={onClick}
      className="group flex-shrink-0 flex flex-col items-center gap-3 cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm"
      style={{
        width: 110,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        transitionDelay: `${index * 0.08}s`,
      }}
      aria-label={t('aria.viewTestimonial', { name: testimonial.name })}
    >
      {/* Avatar ring */}
      <div
        className="relative"
        style={{ width: 80, height: 80 }}
      >
        {/* Gradient ring */}
        <div
          className="absolute inset-0 rounded-full transition-transform duration-300 group-hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent) 0%, #162d5a 100%)',
            padding: 3,
            borderRadius: '50%',
          }}
        >
          <div
            className="w-full h-full rounded-full overflow-hidden"
            style={{ background: '#faf5ef', padding: 2, borderRadius: '50%' }}
          >
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-full h-full object-cover rounded-full transition-[filter] duration-300 group-hover:brightness-110"
              draggable={false}
            />
          </div>
        </div>

        {/* Play badge for video testimonials */}
        {testimonial.videoUrl && (
          <span
            className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full"
            style={{
              width: 24,
              height: 24,
              background: 'var(--color-accent)',
              border: '2px solid #faf5ef',
            }}
          >
            <Play size={10} color="#faf5ef" fill="#faf5ef" />
          </span>
        )}
      </div>

      {/* Name */}
      <span
        className="text-center leading-tight transition-colors duration-300 group-hover:text-[var(--color-accent)]"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: 13,
          color: '#162d5a',
        }}
      >
        {testimonial.name}
      </span>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  TestimonialModal                                                   */
/* ------------------------------------------------------------------ */
function TestimonialModal({
  testimonial,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  testimonial: Testimonial
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}) {
  const { t } = useTranslation('testimonials')

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrev) onPrev()
      if (e.key === 'ArrowRight' && hasNext) onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext, hasPrev, hasNext])

  /* Lock body scroll */
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalCardIn { from { opacity: 0; transform: translateY(30px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
      <div
        style={{
          animation: 'fadeIn 0.25s ease forwards',
          background: 'rgba(26, 26, 46, 0.72)',
          backdropFilter: 'blur(8px)',
        }}
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={t('aria.modalLabel', { name: testimonial.name })}
      >
        {/* Card */}
        <div
          style={{
            animation: 'modalCardIn 0.3s ease-out forwards',
            background: '#ffffff',
            border: '1px solid rgba(22, 45, 90, 0.06)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
          }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg overflow-hidden"
        >
          {/* Close */}
          <button
            onClick={onClose}
            aria-label={t('aria.closeTestimonial')}
            className="absolute top-4 z-10 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-[rgba(22,45,90,0.06)]"
            style={{ width: 36, height: 36, insetInlineEnd: 16, background: 'rgba(250,245,239,0.85)', border: 'none', cursor: 'pointer' }}
          >
            <X size={18} color="#162d5a" />
          </button>

          {/* Media */}
          {testimonial.videoUrl ? (
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#1a1a2e' }}>
              <video
                src={testimonial.videoUrl}
                controls
                autoPlay
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#f5efe7' }}>
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Content */}
          <div style={{ padding: 'clamp(24px, 4vw, 36px)' }}>
            {/* Quote */}
            <div className="flex gap-3 mb-5">
              <Quote
                size={28}
                className="flex-shrink-0 mt-0.5"
                style={{ color: 'var(--color-accent)', opacity: 0.4 }}
              />
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: '#1a1a2e',
                }}
              >
                {testimonial.quote}
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(22,45,90,0.06)' }}>
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="rounded-full object-cover"
                style={{ width: 44, height: 44 }}
              />
              <div>
                <span
                  className="block"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    fontSize: 18,
                    color: '#162d5a',
                    lineHeight: 1.2,
                  }}
                >
                  {testimonial.name}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: 13,
                    color: '#6b6b7b',
                  }}
                >
                  {testimonial.role}
                </span>
              </div>
            </div>
          </div>

          {/* Prev / Next controls */}
          <div
            className="flex justify-between px-5 pb-5"
            style={{ marginTop: -8 }}
          >
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              aria-label={t('aria.previousTestimonial')}
              className="flex items-center gap-1 transition-colors duration-200 disabled:opacity-30"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 13,
                color: '#162d5a',
                background: 'none',
                border: 'none',
                cursor: hasPrev ? 'pointer' : 'default',
              }}
            >
              <ChevronLeft size={16} /> {t('aria.previous')}
            </button>
            <button
              onClick={onNext}
              disabled={!hasNext}
              aria-label={t('aria.nextTestimonial')}
              className="flex items-center gap-1 transition-colors duration-200 disabled:opacity-30"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 13,
                color: '#162d5a',
                background: 'none',
                border: 'none',
                cursor: hasNext ? 'pointer' : 'default',
              }}
            >
              {t('aria.next')} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  TestimonialsSection (main export)                                  */
/* ------------------------------------------------------------------ */
export default function Testimonials() {
  const { t } = useTranslation('testimonials')
  const { lang, isRTL } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const { ref: headingRef, visible: headingVisible } = useScrollReveal<HTMLDivElement>()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { ref: scrollRevealRef, visible: scrollVisible } = useScrollReveal<HTMLDivElement>()
  const { ref: featuredRef, visible: featuredVisible } = useScrollReveal<HTMLDivElement>()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    loadData<Testimonial[]>(lang, 'testimonials').then(setTestimonials)
  }, [lang])

  /* Scroll state detection */
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    if (isRTL) {
      setCanScrollLeft(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
      setCanScrollRight(el.scrollLeft > 4)
    } else {
      setCanScrollLeft(el.scrollLeft > 4)
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }
  }, [isRTL])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = 240
    const delta = direction === 'left' ? (isRTL ? amount : -amount) : (isRTL ? -amount : amount)
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <>
      <section
        id="stories"
        ref={sectionRef}
        style={{ background: '#faf5ef', padding: 'clamp(70px, 8vw, 100px) 0' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          {/* ---- Heading ---- */}
          <div
            ref={headingRef}
            style={{
              opacity: headingVisible ? 1 : 0,
              transform: headingVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              textAlign: 'center',
              marginBottom: 56,
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
                color: '#162d5a',
                marginBottom: 12,
              }}
            >
              {t('heading')}
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: 16,
                color: '#6b6b7b',
                lineHeight: 1.6,
                maxWidth: 520,
                margin: '0 auto',
              }}
            >
              {t('description')}
            </p>
          </div>

          {/* ---- Horizontal avatar strip ---- */}
          <div className="relative">
            {/* Left fade + arrow (mobile only) */}
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                aria-label={t('aria.scrollLeft')}
                className="absolute top-0 bottom-0 z-10 flex md:hidden items-center ps-1 pe-4"
                style={{
                  insetInlineStart: 0,
                  background: isRTL
                    ? 'linear-gradient(to left, #faf5ef 40%, transparent)'
                    : 'linear-gradient(to right, #faf5ef 40%, transparent)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={22} color="#162d5a" />
              </button>
            )}

            {/* Avatar row — centered on all screens */}
            <div
              ref={(el) => {
                scrollRef.current = el
                ;(scrollRevealRef as React.MutableRefObject<HTMLDivElement | null>).current = el
              }}
              className="flex gap-8 py-4 scrollbar-hide overflow-x-auto md:overflow-x-visible justify-center"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {testimonials.map((testimonial, i) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  index={i}
                  isVisible={scrollVisible}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>

            {/* Right fade + arrow (mobile only) */}
            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                aria-label={t('aria.scrollRight')}
                className="absolute top-0 bottom-0 z-10 flex md:hidden items-center pe-1 ps-4"
                style={{
                  insetInlineEnd: 0,
                  background: isRTL
                    ? 'linear-gradient(to right, #faf5ef 40%, transparent)'
                    : 'linear-gradient(to left, #faf5ef 40%, transparent)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <ChevronRight size={22} color="#162d5a" />
              </button>
            )}
          </div>

          {/* ---- Featured quote (the first testimonial with video) ---- */}
          {testimonials[0] && (
            <div
              ref={featuredRef}
              className="mt-14 mx-auto"
              style={{
                opacity: featuredVisible ? 1 : 0,
                transform: featuredVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                transitionDelay: '0.25s',
                maxWidth: 720,
                background: '#ffffff',
                border: '1px solid rgba(22,45,90,0.06)',
                padding: 'clamp(28px, 4vw, 44px)',
                position: 'relative',
              }}
            >
              <Quote
                size={36}
                className="absolute"
                style={{ top: 'clamp(16px, 2vw, 24px)', insetInlineStart: 'clamp(16px, 2vw, 24px)', color: 'var(--color-accent)', opacity: 0.12 }}
              />
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 500,
                  fontSize: 'clamp(1.15rem, 2vw, 1.4rem)',
                  lineHeight: 1.7,
                  color: '#162d5a',
                  marginBottom: 24,
                  fontStyle: 'italic',
                }}
              >
                "{testimonials[0].quote}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonials[0].avatar}
                  alt={testimonials[0].name}
                  className="rounded-full object-cover"
                  style={{ width: 40, height: 40 }}
                />
                <div>
                  <span
                    className="block"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: 14,
                      color: '#162d5a',
                      lineHeight: 1.3,
                    }}
                  >
                    {testimonials[0].name}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: 13,
                      color: '#6b6b7b',
                    }}
                  >
                    {testimonials[0].role}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ---- Modal ---- */}
      {activeIndex !== null && testimonials[activeIndex] && (
        <TestimonialModal
          testimonial={testimonials[activeIndex]}
          onClose={() => setActiveIndex(null)}
          onPrev={() => setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))}
          onNext={() =>
            setActiveIndex((prev) =>
              prev !== null && prev < testimonials.length - 1 ? prev + 1 : prev,
            )
          }
          hasPrev={activeIndex > 0}
          hasNext={activeIndex < testimonials.length - 1}
        />
      )}
    </>
  )
}

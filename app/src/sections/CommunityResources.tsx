import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useLanguage } from '../hooks/useLanguage'
import { loadData } from '../lib/dataLoader'

gsap.registerPlugin(ScrollTrigger)

interface ResourceItem {
  num: string
  title: string
  links: string[]
}

export default function CommunityResources() {
  const { t } = useTranslation('resources')
  const { lang } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const [resources, setResources] = useState<ResourceItem[]>([])

  useEffect(() => {
    loadData<ResourceItem[]>(lang, 'resources').then(setResources)
  }, [lang])

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })

      const cards = gridRef.current?.querySelectorAll('.resource-card')
      if (cards) {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="resources"
      ref={sectionRef}
      style={{ background: '#f5efe7', padding: 'clamp(70px, 8vw, 100px) 0' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        {/* Heading */}
        <div
          ref={headingRef}
          style={{ opacity: 0, transform: 'translateY(30px)', textAlign: 'center', marginBottom: 64 }}
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
            }}
          >
            {t('heading')}
          </h2>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {resources.map((res) => (
            <div
              key={res.num}
              className="resource-card"
              style={{
                opacity: 0,
                transform: 'translateY(30px)',
                background: '#ffffff',
                border: '1px solid rgba(22, 45, 90, 0.06)',
                padding: 32,
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(var(--color-accent-rgb), 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(22, 45, 90, 0.06)'
              }}
            >
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontSize: 32,
                  color: 'rgba(var(--color-accent-rgb), 0.25)',
                  display: 'block',
                  marginBottom: 12,
                }}
              >
                {res.num}
              </span>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em',
                  color: '#162d5a',
                  marginBottom: 16,
                }}
              >
                {res.title}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {res.links.map((link) => (
                  <li key={link} style={{ marginBottom: 8 }}>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: 14,
                        color: '#6b6b7b',
                        textDecoration: 'none',
                        transition: 'color 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = 'var(--color-accent)'
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = '#6b6b7b'
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

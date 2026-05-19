'use client'

import { useState, useEffect } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Quote, X, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { FadeIn } from '../components/FadeIn'
import { useLanguage } from '../hooks/useLanguage'
import { localizePath } from '../lib/navigation'

interface Story {
  id: number
  image: string
  videoUrl: string
  title: string
  quote: string
  name: string
  context: string
}



function StoryCard({ story, onClick, isWide, reverse }: { story: Story; onClick: (story: Story) => void; isWide?: boolean; reverse?: boolean }) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(story)
    }
  }

  return (
    <button
      onClick={() => onClick(story)}
      onKeyDown={handleKeyDown}
      className={`text-left bg-white border border-amber/40 rounded-xl overflow-hidden flex transition-all hover:bg-cream-dark hover:shadow-card-hover cursor-pointer group shadow-sm w-full h-full ${
        isWide ? (reverse ? 'flex-col lg:flex-row-reverse' : 'flex-col lg:flex-row') : 'flex-col'
      }`}
      aria-label={`Play community story video: ${story.name}`}
    >
      <div className={`relative bg-warm-sand/20 overflow-hidden shrink-0 ${isWide ? 'h-48 lg:h-auto lg:w-2/5' : 'h-48 w-full'}`}>
        <img
          alt={story.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          src={story.image}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <Play className="w-6 h-6 text-white fill-current ml-1" />
          </div>
        </div>
      </div>
      <div className={`flex flex-col flex-grow ${isWide ? 'p-6 lg:p-8 justify-center' : 'p-6'}`}>
        <p className={`text-forest italic ${isWide ? 'text-lg lg:text-xl mb-6' : 'text-body mb-6 flex-grow'}`}>"{story.quote}"</p>
        <div className={isWide ? 'mt-4' : 'mt-auto'}>
          <div className="font-semibold text-forest">{story.name}</div>
          <div className="text-sm text-forest-light">{story.context}</div>
        </div>
      </div>
    </button>
  )
}

export default function StoriesPage() {
  const { t } = useTranslation('testimonials')
  const { lang } = useLanguage()
  const [selectedVideo, setSelectedVideo] = useState<Story | null>(null)

  const videoStories: Story[] = [
    {
      id: 1,
      image: '/images/front_2.png',
      videoUrl: '/videos/Stories/Story_2.mp4',
      title: t('stories.story2.name'),
      quote: t('stories.story2.quote'),
      name: t('stories.story2.name'),
      context: t('stories.context'),
    },
    {
      id: 2,
      image: '/images/front_4.png',
      videoUrl: '/videos/Stories/Story_3.mp4',
      title: t('stories.story4.name'),
      quote: t('stories.story4.quote'),
      name: t('stories.story4.name'),
      context: t('stories.context'),
    },
    {
      id: 3,
      image: '/images/front_3.png',
      videoUrl: '/videos/Stories/Story_4.mp4',
      title: t('stories.story3.name'),
      quote: t('stories.story3.quote'),
      name: t('stories.story3.name'),
      context: t('stories.context'),
    },
    {
      id: 4,
      image: '/images/front_1.png',
      videoUrl: '/videos/Stories/Story_1.mp4',
      title: t('stories.story1.name'),
      quote: t('stories.story1.quote'),
      name: t('stories.story1.name'),
      context: t('stories.context'),
    }
  ]

  const handleNextVideo = () => {
    if (!selectedVideo) return
    const idx = videoStories.findIndex((s) => s.id === selectedVideo.id)
    if (idx === -1) return
    setSelectedVideo(videoStories[(idx + 1) % videoStories.length])
  }

  const handlePrevVideo = () => {
    if (!selectedVideo) return
    const idx = videoStories.findIndex((s) => s.id === selectedVideo.id)
    if (idx === -1) return
    setSelectedVideo(videoStories[(idx - 1 + videoStories.length) % videoStories.length])
  }

  useEffect(() => {
    if (!selectedVideo) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedVideo(null)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedVideo])

  return (
    <>
      {/* Page Header */}
      <section className="relative min-h-[45vh]" aria-label="Stories header">
        <div className="absolute inset-0">
          <img
            src="/images/hero-stories.jpg"
            alt="Afghan community member portrait"
            className="w-full h-full object-cover object-[center-10%]"
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
            <p className="text-body-lg text-white/85 max-w-2xl">{t('description')}</p>
          </div>
        </div>
      </section>

      {/* Story Cards Grid */}
      <section className="section-padding bg-cream" aria-label="Stories">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {videoStories.map((story, index) => {
              const isWide = index === 0 || index === 3;
              const reverse = index === 3;
              return (
                <FadeIn key={story.id} delay={index * 150} duration={800} className={`h-full ${isWide ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
                  <StoryCard story={story} onClick={setSelectedVideo} isWide={isWide} reverse={reverse} />
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding bg-forest text-center" aria-label="Get help">
        <div className="container-main max-w-2xl">
          <div className="flex justify-center mb-6">
            <img src="/images/Catholic.png" alt="" aria-hidden="true" className="h-14 w-auto" />
          </div>
          <h2 className="font-display text-heading-1 md:text-heading-1 text-white mb-4">
            {t('bottomCta.heading')}
          </h2>
          <p className="text-body-lg text-white/80 mb-8">
            <Trans
              i18nKey="bottomCta.text"
              ns="testimonials"
              components={{
                1: <a href="https://www.catholiccharitiesaz.org/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline underline-offset-4 decoration-1 transition-colors" />
              }}
            />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={localizePath('/contact', lang)} className="btn-primary text-lg px-10 py-4 inline-flex">
              {t('bottomCta.secondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* Video Modal Overlay */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-forest/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Community story video"
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="relative aspect-video bg-neutral-900 flex items-center justify-center">
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur-md transition-colors z-10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {selectedVideo.videoUrl ? (
                <video
                  src={selectedVideo.videoUrl}
                  className="absolute inset-0 w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              )}
            </div>

            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="flex gap-4 mb-8">
                <Quote className="w-10 h-10 text-amber flex-shrink-0" />
                <p className="text-forest text-lg leading-relaxed">{selectedVideo.quote}</p>
              </div>

              <div className="flex items-center gap-4 border-b border-warm-sand/40 pb-6 mb-6">
                <img
                  src={selectedVideo.image}
                  alt={selectedVideo.name}
                  className="w-14 h-14 rounded-full object-cover bg-warm-sand/20"
                />
                <div>
                  <h4 className="font-display text-xl text-forest">{selectedVideo.name}</h4>
                  <p className="text-forest-light text-sm">{selectedVideo.context}</p>
                </div>
              </div>

              {videoStories.length > 1 && (
                <div className="flex justify-between items-center text-sm font-medium text-forest-light">
                  <button
                    onClick={handlePrevVideo}
                    className="flex items-center gap-2 hover:text-amber transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={handleNextVideo}
                    className="flex items-center gap-2 text-forest hover:text-amber transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

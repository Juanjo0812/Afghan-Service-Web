import { useState } from 'react'
import { Quote, X, Play, Volume2, Maximize, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { FadeIn } from '../components/FadeIn'

type StoryFilter = 'all' | 'clients' | 'leaders'

interface TextReview {
  quote: string
  name: string
  context: string
  image?: string
}

interface Story {
  id: number
  type: StoryFilter
  image?: string
  videoUrl?: string
  title?: string
  quote?: string
  name?: string
  context?: string
  isFeatured?: boolean
  isTextOnly?: boolean
  reviews?: TextReview[]
}

// IMPORTANT: Replace this placeholder array with real approved stories
// when client assets (names, quotes, photos, videos) are available.
// The StoryCard, TextStoryCarousel, and video modal components are
// fully built and ready — just swap the data.
const stories: Story[] = [
  {
    id: 1,
    type: 'clients',
    isTextOnly: true,
    reviews: [
      {
        quote:
          'We are collecting and reviewing stories from Afghan families and community leaders. Check back soon to hear real experiences from our community. If you would like to share your story, please contact us.',
        name: 'Afghan Support Phoenix',
        context: 'Community Program — Catholic Charities',
      },
    ],
  },
]

const filters: { label: string; value: StoryFilter }[] = [
  { label: 'All Stories', value: 'all' },
  { label: 'Client Stories', value: 'clients' },
  { label: 'Community Leaders', value: 'leaders' },
]

function TextStoryCarousel({ story }: { story: Story }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  if (!story.reviews || story.reviews.length === 0) return null
  
  const review = story.reviews[currentIndex]

  const nextReview = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % story.reviews!.length)
  }

  const prevReview = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + story.reviews!.length) % story.reviews!.length)
  }

  return (
    <article className="bg-forest border border-warm-sand/50 rounded-xl overflow-hidden flex flex-col transition-all hover:shadow-card-hover relative h-full">
      <div className="p-8 flex flex-col flex-grow justify-center relative min-h-[300px]">
        <Quote className="w-24 h-24 text-amber/20 absolute top-4 left-4" />
        
        <div key={currentIndex} className="animate-in fade-in zoom-in-95 duration-300 flex flex-col flex-grow px-10 md:px-12">
          <p className="font-display text-xl md:text-2xl text-white mb-8 relative z-10">"{review.quote}"</p>
          <div className="mt-auto relative z-10 flex items-center gap-3">
            {review.image && (
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-warm-sand/20">
                <img alt={review.name} className="w-full h-full object-cover" src={review.image} />
              </div>
            )}
            <div>
              <div className="font-semibold text-white">{review.name}</div>
              <div className="text-sm text-white/80">{review.context}</div>
            </div>
          </div>
        </div>

        {story.reviews.length > 1 && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-forest/90 via-forest/60 to-transparent flex items-center justify-start px-2 z-20">
              <button 
                onClick={prevReview}
                className="bg-white/10 hover:bg-white/30 text-white rounded-full p-1 backdrop-blur-md transition-colors border border-white/20"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-forest/90 via-forest/60 to-transparent flex items-center justify-end px-2 z-20">
              <button 
                onClick={nextReview}
                className="bg-white/10 hover:bg-white/30 text-white rounded-full p-1 backdrop-blur-md transition-colors border border-white/20"
                aria-label="Next review"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  )
}

function StoryCard({ story, onClick }: { story: Story, onClick: (story: Story) => void }) {
  if (story.isTextOnly) {
    return <TextStoryCarousel story={story} />
  }

  // Placeholder card: no image = static info card, not clickable
  if (!story.image) {
    return (
      <article className="w-full bg-white border border-amber/40 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm h-full">
        <div className="md:w-1/2 min-h-[300px] bg-gradient-to-br from-forest/10 via-warm-sand/40 to-amber/10 flex items-center justify-center">
          <Quote className="w-16 h-16 text-amber/30" aria-hidden="true" />
        </div>
        <div className="p-8 md:w-1/2 flex flex-col justify-center">
          <div className="text-amber font-semibold text-xs uppercase tracking-wider mb-2">
            {story.type === 'clients' ? 'Client Story' : 'Community Leader'}
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-forest mb-4">{story.title}</h2>
          <p className="text-body text-forest-light mb-6 flex-grow">{story.quote}</p>
          <div>
            <div className="font-semibold text-forest">{story.name}</div>
            <div className="text-sm text-forest-light">{story.context}</div>
          </div>
        </div>
      </article>
    )
  }

  if (story.isFeatured) {
    return (
      <article 
        onClick={() => onClick(story)} 
        className="w-full bg-white border border-amber/40 rounded-xl overflow-hidden flex flex-col md:flex-row group cursor-pointer hover:bg-cream-dark hover:shadow-card-hover transition-all shadow-sm h-full"
      >
        <div className="md:w-1/2 relative bg-warm-sand/20 min-h-[300px]">
          <img alt={story.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" src={story.image} />
          <div className="absolute inset-0 flex items-center justify-center bg-forest/20 group-hover:bg-transparent transition-colors">
            <div className="w-16 h-16 bg-forest/90 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-amber transition-all shadow-lg">
              <Play className="w-8 h-8 text-white fill-current ml-1" />
            </div>
          </div>
        </div>
        <div className="p-8 md:w-1/2 flex flex-col justify-center">
          <div className="text-amber font-semibold text-xs uppercase tracking-wider mb-2">
            {story.type === 'clients' ? 'Client Story' : 'Community Leader'}
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-forest mb-4">{story.title}</h2>
          <p className="text-body text-forest-light mb-6 flex-grow">{story.quote}</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-warm-sand/20">
              <img alt={story.name} className="w-full h-full object-cover" src={story.image} />
            </div>
            <div>
              <div className="font-semibold text-forest">{story.name}</div>
              <div className="text-sm text-forest-light">{story.context}</div>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article 
      onClick={() => onClick(story)}
      className="bg-white border border-amber/40 rounded-xl overflow-hidden flex flex-col transition-all hover:bg-cream-dark hover:shadow-card-hover cursor-pointer group shadow-sm h-full"
    >
      <div className="h-48 relative bg-warm-sand/20 overflow-hidden shrink-0">
        <img alt={story.name || ''} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" src={story.image} />
        <div className="absolute inset-0 flex items-center justify-center bg-forest/20 group-hover:bg-transparent transition-colors">
          <div className="w-14 h-14 bg-forest/90 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-amber transition-all shadow-lg">
            <Play className="w-6 h-6 text-white fill-current ml-1" />
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-amber font-semibold text-xs uppercase tracking-wider mb-2">
          {story.type === 'clients' ? 'Client Story' : 'Community Leader'}
        </div>
        <p className="text-body text-forest mb-6 italic flex-grow">"{story.quote}"</p>
        <div className="mt-auto">
          <div className="font-semibold text-forest">{story.name}</div>
          <div className="text-sm text-forest-light">{story.context}</div>
        </div>
      </div>
    </article>
  )
}

export default function StoriesPage() {
  const [activeFilter, setActiveFilter] = useState<StoryFilter>('all')
  const [selectedVideo, setSelectedVideo] = useState<Story | null>(null)
  
  const filteredStories = activeFilter === 'all' ? stories : stories.filter((s) => s.type === activeFilter)
  
  const videoStories = filteredStories.filter(s => !s.isTextOnly)

  const handleNextVideo = () => {
    if (!selectedVideo) return
    const currentIndex = videoStories.findIndex(s => s.id === selectedVideo.id)
    if (currentIndex === -1) return
    const nextIndex = (currentIndex + 1) % videoStories.length
    setSelectedVideo(videoStories[nextIndex])
  }

  const handlePrevVideo = () => {
    if (!selectedVideo) return
    const currentIndex = videoStories.findIndex(s => s.id === selectedVideo.id)
    if (currentIndex === -1) return
    const prevIndex = (currentIndex - 1 + videoStories.length) % videoStories.length
    setSelectedVideo(videoStories[prevIndex])
  }

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
            <span className="label-text text-amber block mb-3">STORIES</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-display-xl text-white mb-4 leading-tight">
              Community Impact
            </h1>
            <p className="text-body-lg text-white/85 max-w-2xl">
              Real stories from Afghan families who have found support and success in Phoenix.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pt-8 pb-4 bg-cream">
        <div className="container-main">
          <div className="flex flex-wrap gap-3 justify-center" role="group" aria-label="Story filters">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-5 py-2.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber ${
                  activeFilter === filter.value
                    ? 'bg-amber text-white'
                    : 'bg-white text-forest border border-warm-sand/60 hover:bg-cream-dark'
                }`}
                aria-pressed={activeFilter === filter.value}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Story Cards Grid */}
      <section className="section-padding bg-cream" aria-label="Stories">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredStories.map((story, index) => (
              <FadeIn 
                key={story.id} 
                delay={index * 150} 
                duration={800} 
                className={`h-full ${story.isFeatured ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''}`}
              >
                <StoryCard story={story} onClick={setSelectedVideo} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding bg-forest text-center" aria-label="Get help">
        <div className="container-main max-w-2xl">
          <h2 className="font-display text-heading-1 md:text-heading-1 text-white mb-4">
            Be Part of Our Story
          </h2>
          <p className="text-body-lg text-white/80 mb-8">
            Whether you need help or want to support our community, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary">
              Get Help Now
            </Link>
            <Link to="/contact" className="btn-white-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Video Modal Overlay */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-forest/90 backdrop-blur-sm">
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
                />
              ) : (
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              )}
              
              {!selectedVideo.videoUrl && (
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white/80 text-sm">
                  <div className="flex items-center gap-4">
                    <Play className="w-5 h-5 fill-current" />
                    <span>0:00</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Volume2 className="w-5 h-5 cursor-pointer hover:text-white" />
                    <Maximize className="w-5 h-5 cursor-pointer hover:text-white" />
                    <MoreVertical className="w-5 h-5 cursor-pointer hover:text-white" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="flex gap-4 mb-8">
                <Quote className="w-10 h-10 text-amber flex-shrink-0" />
                <p className="text-forest text-lg leading-relaxed">
                  {selectedVideo.quote}
                </p>
              </div>
              
              <div className="flex items-center gap-4 border-b border-warm-sand/40 pb-6 mb-6">
                {selectedVideo.image && (
                  <img src={selectedVideo.image} alt={selectedVideo.name} className="w-14 h-14 rounded-full object-cover bg-warm-sand/20" />
                )}
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

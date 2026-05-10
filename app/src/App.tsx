import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router'
import SEO from './components/SEO'
import Layout from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'

const HomePage = lazy(() => import('./pages/HomePage'))
const ImmigrationPage = lazy(() => import('./pages/ImmigrationPage'))
const RightsPage = lazy(() => import('./pages/RightsPage'))
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const StoriesPage = lazy(() => import('./pages/StoriesPage'))

function App() {
  return (
    <>
      <ScrollToTop />
      <SEO />
      <Suspense fallback={<div className="min-h-screen bg-cream" aria-busy="true" />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/:lang?" element={<HomePage />} />
            <Route path="/:lang?/immigration" element={<ImmigrationPage />} />
            <Route path="/:lang?/rights" element={<RightsPage />} />
            <Route path="/:lang?/resources" element={<ResourcesPage />} />
            <Route path="/:lang?/events" element={<EventsPage />} />
            <Route path="/:lang?/contact" element={<ContactPage />} />
            <Route path="/:lang?/stories" element={<StoriesPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App

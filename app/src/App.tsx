import { Routes, Route } from 'react-router'
import SEO from './components/SEO'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ImmigrationPage from './pages/ImmigrationPage'
import RightsPage from './pages/RightsPage'
import ResourcesPage from './pages/ResourcesPage'
import EventsPage from './pages/EventsPage'
import ContactPage from './pages/ContactPage'
import StoriesPage from './pages/StoriesPage'

function App() {
  return (
    <>
      <SEO />
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
    </>
  )
}

export default App

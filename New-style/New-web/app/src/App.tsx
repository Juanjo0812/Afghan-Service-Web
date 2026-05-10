import { Routes, Route } from 'react-router-dom'
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
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/immigration" element={<ImmigrationPage />} />
        <Route path="/rights" element={<RightsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/stories" element={<StoriesPage />} />
      </Route>
    </Routes>
  )
}

export default App

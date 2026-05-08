import { Routes, Route } from 'react-router'
import { useLenis } from './hooks/useLenis'
import { Toaster } from './components/ui/sonner'
import SEO from './components/SEO'
import Navigation from './sections/Navigation'
import Hero from './sections/Hero'
import QuickAccess from './sections/QuickAccess'
import About from './sections/About'
import KnowYourRights from './sections/KnowYourRights'
import CommunityResources from './sections/CommunityResources'
import Events from './sections/Events'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import Testimonials from './sections/Testimonials'
import Chatbot from './sections/Chatbot'

function AppShell() {
  return (
    <>
      <SEO />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 9999,
          padding: '16px 24px',
          background: '#faf5ef',
          color: '#162d5a',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: 16,
          textDecoration: 'none',
          outline: 'none',
        }}
      >
        Skip to main content
      </a>
      <Navigation />
      <main id="main-content">
        <Hero />
        <QuickAccess />
        <About />
        <KnowYourRights />
        <CommunityResources />
        <Events />
        <Contact />
        <Testimonials />
      </main>
      <Footer />
      <Chatbot />
      <Toaster position="bottom-right" richColors />
    </>
  )
}

function App() {
  useLenis()

  return (
    <Routes>
      <Route path="/:lang?" element={<AppShell />} />
    </Routes>
  )
}

export default App

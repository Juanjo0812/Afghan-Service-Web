import { Outlet } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import Chatbot from '../sections/Chatbot'
import { Toaster } from './ui/sonner'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <ScrollToTop />
      <Header />
      <main id="main-content" className="flex-1 pt-16 md:pt-[72px]">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
      <Toaster position="bottom-right" richColors />
    </div>
  )
}

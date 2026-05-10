import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <ScrollToTop />
      <Header />
      <main id="main-content" className="flex-1 pt-16 md:pt-[72px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

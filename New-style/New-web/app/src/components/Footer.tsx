import { Link } from 'react-router-dom'
import { TreePine, Phone, Mail, MapPin } from 'lucide-react'

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Immigration Help', path: '/immigration' },
  { label: 'Community Resources', path: '/resources' },
  { label: 'Know Your Rights', path: '/rights' },
  { label: 'Events', path: '/events' },
  { label: 'Stories', path: '/stories' },
  { label: 'Contact', path: '/contact' },
]

const resourceLinks = [
  { label: 'English Classes', path: '/resources' },
  { label: 'Food Banks', path: '/resources' },
  { label: 'Mental Health', path: '/resources' },
  { label: 'Health Clinics', path: '/resources' },
]

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'dari', label: 'دری' },
  { code: 'pashto', label: 'پښتو' },
  { code: 'uzbek', label: 'ازبکی' },
]

export default function Footer() {
  return (
    <footer className="bg-forest-dark text-cream">
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Organization Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <TreePine className="w-6 h-6 text-cream" aria-hidden="true" />
              <span className="font-semibold text-cream">Afghan Community Support</span>
            </div>
            <p className="text-cream/70 text-sm mb-4">
              A program of Catholic Charities Community Services, Arizona
            </p>
            <div className="space-y-2">
              <a
                href="tel:4804162333"
                className="flex items-center gap-2 text-cream/80 hover:text-amber transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 focus:ring-offset-forest-dark rounded-md"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                480.416.2333
              </a>
              <a
                href="mailto:Dpeshtaz@cc-az.org"
                className="flex items-center gap-2 text-cream/80 hover:text-amber transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 focus:ring-offset-forest-dark rounded-md"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                Dpeshtaz@cc-az.org
              </a>
              <div className="flex items-start gap-2 text-cream/80 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>5151 N 19th Ave<br />Phoenix, AZ 85015</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="label-text text-olive mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path + link.label}>
                  <Link
                    to={link.path}
                    className="text-cream/80 hover:text-amber transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 focus:ring-offset-forest-dark rounded-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="label-text text-olive mb-4">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-cream/80 hover:text-amber transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 focus:ring-offset-forest-dark rounded-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Language */}
          <div>
            <h3 className="label-text text-olive mb-4">Legal</h3>
            <p className="text-cream/60 text-xs mb-4 leading-relaxed">
              This information is for educational purposes only and does not constitute legal advice.
            </p>
            <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Language selection">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                    lang.code === 'en'
                      ? 'bg-cream text-forest-dark'
                      : 'text-cream/70 border border-cream/20 hover:border-amber hover:text-amber'
                  }`}
                  aria-pressed={lang.code === 'en'}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <p className="text-cream/50 text-xs">
              &copy; 2026 Catholic Charities Community Services, Arizona
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-forest-light/20 text-center">
          <p className="text-cream/50 text-xs">
            Catholic Charities AZ &mdash; Serving Arizona since 1933
          </p>
        </div>
      </div>
    </footer>
  )
}

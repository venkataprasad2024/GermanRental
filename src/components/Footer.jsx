import { Link } from 'react-router-dom'
import { Logo } from './Logo'

const footerLinks = [
  {
    title: 'Discover',
    links: [
      { label: 'Browse Properties', to: '/properties' },
      { label: 'Popular Cities', to: '/properties?focus=cities' },
      { label: 'How it works', to: '/#how-it-works' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', to: '/login' },
      { label: 'Create account', to: '/register' },
      { label: 'Tenant dashboard', to: '/dashboard/tenant' },
      { label: 'Landlord dashboard', to: '/dashboard/landlord' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/#about' },
      { label: 'Contact', to: '/#contact' },
      { label: 'Admin', to: '/dashboard/admin' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-100 bg-ink-50">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-600">
              DeutschHome helps Indian students, professionals and international
              residents find trusted rental homes across Germany — from WG rooms
              to family houses.
            </p>
            <p className="mt-4 text-xs text-ink-500">
              Made for Indians moving to Germany.
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-ink-900">{group.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-ink-600 transition hover:text-brand-700"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-900 ring-1 ring-amber-200">
          <strong className="font-semibold">Disclaimer.</strong>{' '}
          All property information, landlords and documents on DeutschHome are
          fictional and for demonstration purposes only. Always independently
          verify landlords, rental documents and conditions before making any
          payment or signing a contract.
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-ink-200 pt-6 text-xs text-ink-500 sm:flex-row">
          <p>{`© ${new Date().getFullYear()} DeutschHome. A demo prototype.`}</p>
          <p>Berlin · Munich · Frankfurt · Hamburg · Cologne</p>
        </div>
      </div>
    </footer>
  )
}

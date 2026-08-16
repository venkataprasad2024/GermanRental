import { Link } from 'react-router-dom'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-7xl font-extrabold text-transparent sm:text-9xl">404</p>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">This page moved or never existed.</h1>
      <p className="mt-3 max-w-md text-sm text-ink-600">The link you followed may be broken, or the page may have been removed. Let's get you back to finding a home.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/" className="btn-primary"><Home className="h-4 w-4" /> Back home</Link>
        <Link to="/properties" className="btn-secondary"><Search className="h-4 w-4" /> Browse properties</Link>
      </div>
      <Link to="/" className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-700"><ArrowLeft className="h-4 w-4" /> Return to DeutschHome</Link>
    </div>
  )
}

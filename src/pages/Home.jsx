import { Link } from 'react-router-dom'
import {
  Search, ShieldCheck, MapPin, ArrowRight, Building2, GraduationCap,
  Briefcase, HeartHandshake, FileText, Bell, Languages, Wallet,
} from 'lucide-react'
import { SearchBar } from '../components/SearchBar'
import { PropertyCard } from '../components/PropertyCard'
import { SectionHeader, DisclaimerBanner } from '../components/ui'
import { GERMAN_CITIES } from '../data/cities'
import { useListings } from '../context/ListingsContext'
import { formatEUR } from '../utils/format'

export default function Home() {
  const { listings } = useListings()
  const featured = listings.filter((p) => p.status === 'approved').slice(0, 6)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
          <div className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-brand-100/50 blur-3xl" />
        </div>

        <div className="container-page pt-12 pb-16 sm:pt-16 lg:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="section-eyebrow animate-fade-up">
              <MapPin className="h-3.5 w-3.5" /> Made for Indians moving to Germany
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl text-balance animate-fade-up" style={{ animationDelay: '80ms' }}>
              Find your German{' '}
              <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
                home
              </span>
              , the easy way.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-600 animate-fade-up" style={{ animationDelay: '160ms' }}>
              Browse verified rentals across Berlin, Munich, Frankfurt and more.
              Understand the deposit, utilities and rental conditions before you
              ever contact a landlord.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-4xl animate-fade-up" style={{ animationDelay: '240ms' }}>
            <SearchBar variant="hero" />
          </div>

          <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-500 animate-fade-in" style={{ animationDelay: '320ms' }}>
            <span className="font-semibold uppercase tracking-wide text-ink-400">Popular:</span>
            {['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne'].map((c) => (
              <Link
                key={c}
                to={`/properties?city=${c}`}
                className="rounded-full bg-white px-3 py-1 font-medium text-ink-700 ring-1 ring-ink-200 transition hover:ring-brand-300 hover:text-brand-700"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-ink-100 bg-white">
        <div className="container-page grid grid-cols-2 divide-x divide-ink-100 sm:grid-cols-4">
          {[
            { value: '18+', label: 'Curated listings' },
            { value: '10', label: 'German cities' },
            { value: '5,200+', label: 'Happy movers' },
            { value: '4.7★', label: 'Average rating' },
          ].map((s) => (
            <div key={s.label} className="px-4 py-6 text-center">
              <p className="text-2xl font-extrabold text-ink-900 sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-ink-500 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured properties */}
      <section className="container-page py-16">
        <SectionHeader
          eyebrow="Featured"
          title="Homes our community loves"
          description="A hand-picked selection of furnished apartments, studios and WG rooms across Germany."
          action={
            <Link to="/properties" className="btn-secondary">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      </section>

      {/* Popular cities */}
      <section className="bg-ink-50 py-16">
        <div className="container-page">
          <SectionHeader
            eyebrow="Popular cities"
            title="Where Indians are settling"
            description="Average rents, listings and a quick guide to each city."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GERMAN_CITIES.slice(0, 8).map((c, i) => (
              <Link
                key={c.name}
                to={`/properties?city=${c.name}`}
                className="group relative overflow-hidden rounded-2xl shadow-card ring-1 ring-ink-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="aspect-[4/5] w-full bg-ink-200">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{c.name}</h3>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium backdrop-blur">
                      {formatEUR(c.avgRent)} avg
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-white/80">{c.blurb}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white">
                    {c.listings.toLocaleString('de-DE')} listings <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="container-page py-16">
        <SectionHeader
          eyebrow="How it works"
          title="From search to signed contract"
          description="A simple path designed for newcomers to Germany."
          align="center"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: <Search className="h-5 w-5" />, title: 'Discover', text: 'Search by city, rent and type across 10 German cities.' },
            { icon: <FilterIcon />, title: 'Filter', text: 'Narrow by bedrooms, furnishing and the amenities you need.' },
            { icon: <FileText className="h-5 w-5" />, title: 'Understand', text: 'See deposit, utilities, rental conditions and house rules upfront.' },
            { icon: <HeartHandshake className="h-5 w-5" />, title: 'Save & contact', text: 'Shortlist favorites and message the landlord directly.' },
            { icon: <ShieldCheck className="h-5 w-5" />, title: 'Move in', text: 'Verify documents independently, then sign with confidence.' },
          ].map((s, i) => (
            <div
              key={s.title}
              className="relative card p-5 animate-fade-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className="absolute right-4 top-4 text-3xl font-extrabold text-ink-100">
                {i + 1}
              </span>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                {s.icon}
              </div>
              <h3 className="mt-4 text-base font-bold text-ink-900">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section id="about" className="bg-ink-50 py-16">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="section-eyebrow">Why DeutschHome</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl text-balance">
              Built for the way Indians move to Germany.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-600">
              Moving countries is hard enough. Finding a home shouldn't be a
              guessing game. DeutschHome explains German rental terms in plain
              English and shows you exactly what you'll pay and what's expected.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                { icon: <Wallet className="h-5 w-5" />, title: 'Transparent costs', text: 'Rent, deposit (Kaution) and utilities (Nebenkosten) shown clearly.' },
                { icon: <Languages className="h-5 w-5" />, title: 'Plain-English terms', text: 'Rental conditions and house rules translated and explained.' },
                { icon: <GraduationCap className="h-5 w-5" />, title: 'Student-friendly', text: 'WG rooms and studios with Bürgschaft and semester contracts.' },
                { icon: <Briefcase className="h-5 w-5" />, title: 'For professionals', text: 'Furnished apartments ready for your first week in Germany.' },
                { icon: <Bell className="h-5 w-5" />, title: 'Save & track', text: 'Keep favorites and recently viewed homes in your dashboard.' },
                { icon: <ShieldCheck className="h-5 w-5" />, title: 'Verified landlords', text: 'Look for the verified badge and still do your own checks.' },
              ].map((b) => (
                <div key={b.title} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 ring-1 ring-ink-100">
                    {b.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink-900">{b.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600">{b.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Modern living room"
                className="aspect-[3/4] w-full rounded-2xl object-cover shadow-card"
                loading="lazy"
              />
              <img
                src="https://images.pexels.com/photos/30475302/pexels-photo-30475302.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Frankfurt skyline"
                className="mt-8 aspect-[3/4] w-full rounded-2xl object-cover shadow-card"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-2xl bg-white px-5 py-3 shadow-cardHover ring-1 ring-ink-100">
              <p className="text-xs text-ink-500">Trusted across</p>
              <p className="text-sm font-bold text-ink-900">10 German cities</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="container-page py-16">
        <div className="overflow-hidden rounded-3xl bg-brand-600 px-6 py-12 text-center text-white sm:px-12">
          <Building2 className="mx-auto h-10 w-10 text-brand-100" />
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
            Ready to find your German address?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Create a free account to save favorites, track inquiries and message landlords.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register" className="btn bg-white text-brand-700 hover:bg-brand-50">
              Create free account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/properties" className="btn bg-brand-500/20 text-white ring-1 ring-white/40 hover:bg-brand-500/30">
              Browse properties
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <DisclaimerBanner />
        </div>
      </section>
    </div>
  )
}

function FilterIcon() {
  return <Search className="h-5 w-5" />
}

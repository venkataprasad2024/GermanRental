import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Building2,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  FileText,
  Bell,
  Languages,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { SearchBar } from '../components/SearchBar'
import { PropertyCard } from '../components/PropertyCard'
import {
  SectionHeader,
  DisclaimerBanner,
} from '../components/ui'
import { GERMAN_CITIES } from '../data/cities'
import { useListings } from '../context/ListingsContext'
import { useFavorites } from '../context/FavoritesContext'
import { formatEUR } from '../utils/format'

export default function Home() {
  const { listings } = useListings()
  const { recent } = useFavorites()

  const recentScrollRef = useRef(null)
  const [recentSlide, setRecentSlide] = useState(0)

  const featured = listings
    .filter((p) => p.status === 'approved')
    .slice(0, 6)

  /*
   * Only the latest 3 properties viewed
   * by the current user.
   */
  const recentHomes = useMemo(
    () =>
      recent
        .slice(0, 3)
        .map((id) =>
          listings.find(
            (p) => p.id === id,
          ),
        )
        .filter(Boolean),
    [recent, listings],
  )

  /*
   * Keep mobile carousel position in sync
   * with the number of recent properties.
   */
  useEffect(() => {
    if (
      recentSlide >= recentHomes.length
    ) {
      setRecentSlide(
        Math.max(
          recentHomes.length - 1,
          0,
        ),
      )
    }
  }, [
    recentSlide,
    recentHomes.length,
  ])

  const scrollRecent = (direction) => {
    const container =
      recentScrollRef.current

    if (!container) {
      return
    }

    const nextIndex =
      Math.min(
        Math.max(
          recentSlide + direction,
          0,
        ),
        recentHomes.length - 1,
      )

    const children =
      container.children

    const target =
      children[nextIndex]

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      })
    }

    setRecentSlide(nextIndex)
  }

  const handleRecentScroll = () => {
    const container =
      recentScrollRef.current

    if (!container) {
      return
    }

    const firstItem =
      container.children[0]

    if (!firstItem) {
      return
    }

    const itemWidth =
      firstItem.getBoundingClientRect()
        .width

    const gap = 16

    const index = Math.round(
      container.scrollLeft /
        (itemWidth + gap),
    )

    setRecentSlide(
      Math.min(
        Math.max(index, 0),
        recentHomes.length - 1,
      ),
    )
  }

  return (
    <div>
      <style>{`
        .home-hero {
          position: relative;
        }

        .home-hero-image {
          display: block;
          width: 100%;
          height: auto;
        }

        .home-hero-content {
          position: absolute;
          inset: 0;
        }

        @media (max-width: 1023px) {
          .home-hero {
            min-height: 0;
          }

          .home-hero-image {
            height: 600px;
            object-fit: cover;
            object-position: center;
          }

          .home-hero-content {
            position: absolute;
            inset: 0;
          }
        }

        @media (max-width: 639px) {
          .home-hero-image {
            height: 540px;
            object-fit: cover;
            object-position: center;
          }
        }

        @media (min-width: 1024px) {
          .home-hero-image {
            height: auto;
            min-height: 0;
            object-fit: contain;
            object-position: center top;
          }
        }
      `}</style>

      {/* Hero */}
      <section className="home-hero relative left-1/2 -mt-20 w-screen -translate-x-1/2 overflow-hidden">
        {/* Original image: natural full composition on large screens */}
        <img
          src="/hero-background2.jpeg"
          alt=""
          aria-hidden="true"
          className="home-hero-image"
        />

        {/* Soft decorative overlays */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl animate-float" />

          <div
            className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-accent-200/30 blur-3xl animate-float"
            style={{
              animationDelay: '1.5s',
            }}
          />
        </div>

        <div className="home-hero-content pointer-events-none">
          <div className="container-page pointer-events-auto pt-24 sm:pt-24 md:pt-24 lg:pt-28 pb-10 sm:pb-12 lg:pb-16">
            <div className="mx-auto max-w-3xl text-center">
              <span className="section-eyebrow inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/60 px-4 py-1.5 shadow-soft backdrop-blur-md transition-all duration-300 hover:shadow-glass animate-fade-up">
                <MapPin className="h-3.5 w-3.5" /> FIND YOUR HOME IN GERMANY
              </span>

              <h1
                className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-700 sm:text-5xl lg:text-6xl text-balance animate-fade-up"
                style={{
                  animationDelay: '80ms',
                }}
              >
                Find your German{' '}
                <span className="bg-gradient-to-r from-accent-600 to-accent-500 bg-clip-text text-transparent">
                  home
                </span>
                , the easy way.
              </h1>

              <p
                className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-600 animate-fade-up"
                style={{
                  animationDelay: '160ms',
                }}
              >
                Browse verified rentals across Berlin, Munich, Frankfurt and more.
                Understand the deposit, utilities and rental conditions before you
                ever contact a landlord.
              </p>
            </div>

            <div
              className="relative z-40 mx-auto mt-8 max-w-4xl animate-fade-up"
              style={{
                animationDelay: '240ms',
              }}
            >
              <div className="rounded-3xl border border-white/70 bg-white/30 p-2 shadow-glass backdrop-blur-md transition-all duration-300 hover:shadow-glassHover">
                <SearchBar variant="hero" />
              </div>
            </div>

            <div
              className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-500 animate-fade-in"
              style={{
                animationDelay: '320ms',
              }}
            >
              <span className="font-semibold uppercase tracking-wide text-ink-400">
                Popular:
              </span>

              {[
                'Berlin',
                'Munich',
                'Frankfurt',
                'Hamburg',
                'Cologne',
              ].map((c) => (
                <Link
                  key={c}
                  to={`/properties?city=${c}`}
                  className="rounded-full border border-white/80 bg-white/90 px-3 py-1 font-medium text-ink-700 shadow-soft transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:border-accent-300/70 hover:bg-white hover:text-accent-600 hover:shadow-glass"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip — glass card floating over the seam */}
      <section className="relative z-0 border-y border-ink-100 bg-white">
        <div className="container-page grid grid-cols-2 divide-x divide-ink-100 sm:grid-cols-4">
          {[
            {
              value: '18+',
              label: 'Curated listings',
            },
            {
              value: '10',
              label: 'German cities',
            },
            {
              value: '5,200+',
              label: 'Happy movers',
            },
            {
              value: '4.7★',
              label: 'Average rating',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="px-4 py-6 text-center transition-colors duration-300 hover:bg-brand-50/50"
            >
              <p className="text-2xl font-extrabold text-brand-700 sm:text-3xl">
                {s.value}
              </p>

              <p className="mt-1 text-xs font-medium text-ink-500 sm:text-sm">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recently viewed */}
      {recentHomes.length > 0 && (
        <section className="container-page py-16">
          <SectionHeader
            eyebrow="Recently viewed"
            title="Pick up where you left off"
            description="Homes you recently opened are kept here so you can find them again quickly."
            action={
              <Link
                to="/properties"
                className="btn-secondary transition-all duration-300 ease-spring hover:scale-105 active:scale-95"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />

          {/* DESKTOP */}
          <div className="mt-8 hidden gap-6 sm:grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
            {recentHomes.map(
              (p, i) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  index={i}
                />
              ),
            )}
          </div>

          {/* MOBILE */}
          <div className="mt-8 sm:hidden">
            <div className="relative">
              <div
                ref={recentScrollRef}
                onScroll={
                  handleRecentScroll
                }
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 pr-1"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {recentHomes.map(
                  (p, i) => (
                    <Link
                      key={p.id}
                      to={`/properties/${p.id}`}
                      className="min-w-[82%] snap-start overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-ink-100">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="px-4 py-3">
                        <p className="text-lg font-extrabold text-ink-900">
                          {formatEUR(
                            p.rent,
                          )}
                          <span className="ml-1 text-xs font-medium text-ink-500">
                            /month
                          </span>
                        </p>
                      </div>
                    </Link>
                  ),
                )}
              </div>

              {recentHomes.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      scrollRecent(-1)
                    }
                    disabled={
                      recentSlide === 0
                    }
                    className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/95 text-brand-700 shadow-soft backdrop-blur transition hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Previous recently viewed property"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      scrollRecent(1)
                    }
                    disabled={
                      recentSlide ===
                      recentHomes.length - 1
                    }
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/95 text-brand-700 shadow-soft backdrop-blur transition hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Next recently viewed property"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {recentHomes.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-1.5">
                {recentHomes.map(
                  (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        const container =
                          recentScrollRef.current

                        const target =
                          container?.children[i]

                        if (target) {
                          target.scrollIntoView({
                            behavior:
                              'smooth',
                            block:
                              'nearest',
                            inline:
                              'start',
                          })
                        }

                        setRecentSlide(i)
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === recentSlide
                          ? 'w-6 bg-brand-700'
                          : 'w-1.5 bg-ink-300'
                      }`}
                      aria-label={`Go to recently viewed property ${i + 1}`}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured properties */}
      <section className="container-page py-16">
        <SectionHeader
          eyebrow="Featured"
          title="Homes our community loves"
          description="A hand-picked selection of furnished apartments, studios and WG rooms across Germany."
          action={
            <Link
              to="/properties"
              className="btn-secondary transition-all duration-300 ease-spring hover:scale-105 active:scale-95"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
          {featured.map(
            (p, i) => (
              <PropertyCard
                key={p.id}
                property={p}
                index={i}
              />
            ),
          )}
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

          <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
            {GERMAN_CITIES.slice(
              0,
              8,
            ).map((c, i) => (
              <Link
                key={c.name}
                to={`/properties?city=${c.name}`}
                className="group relative overflow-hidden rounded-2xl shadow-card ring-1 ring-ink-100 transition-all duration-500 ease-smooth hover:-translate-y-1.5 hover:shadow-cardHover animate-fade-up"
                style={{
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <div className="aspect-[4/5] w-full bg-ink-200">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-110"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-white/10 p-4 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white/15">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">
                      {c.name}
                    </h3>

                    <span className="rounded-full border border-white/20 bg-white/20 px-2 py-0.5 text-xs font-medium backdrop-blur">
                      {formatEUR(
                        c.avgRent,
                      )}{' '}
                      avg
                    </span>
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs text-white/80">
                    {c.blurb}
                  </p>

                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent-300">
                    {c.listings.toLocaleString(
                      'de-DE',
                    )}{' '}
                    listings
                    <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="container-page py-16"
      >
        <SectionHeader
          eyebrow="How it works"
          title="From search to signed contract"
          description="A simple path designed for newcomers to Germany."
          align="center"
        />

        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
          {[
            {
              icon: (
                <Search className="h-5 w-5" />
              ),
              title: 'Discover',
              text: 'Search by city, rent and type across 10 German cities.',
            },
            {
              icon: <FilterIcon />,
              title: 'Filter',
              text: 'Narrow by bedrooms, furnishing and the amenities you need.',
            },
            {
              icon: (
                <FileText className="h-5 w-5" />
              ),
              title: 'Understand',
              text: 'See deposit, utilities, rental conditions and house rules upfront.',
            },
            {
              icon: (
                <HeartHandshake className="h-5 w-5" />
              ),
              title: 'Save & contact',
              text: 'Shortlist favorites and message the landlord directly.',
            },
            {
              icon: (
                <ShieldCheck className="h-5 w-5" />
              ),
              title: 'Move in',
              text: 'Verify documents independently, then sign with confidence.',
            },
          ].map((s, i) => (
            <div
              key={s.title}
              className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/60 p-5 shadow-soft backdrop-blur-md transition-all duration-500 ease-smooth hover:-translate-y-1 hover:bg-white/90 hover:shadow-glassHover animate-fade-up"
              style={{
                animationDelay: `${i * 70}ms`,
              }}
            >
              <span className="absolute right-4 top-4 text-3xl font-extrabold text-ink-100">
                {i + 1}
              </span>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600">
                {s.icon}
              </div>

              <h3 className="mt-4 text-base font-bold text-brand-700">
                {s.title}
              </h3>

              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section
        id="about"
        className="bg-ink-50 py-16"
      >
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="section-eyebrow inline-flex items-center rounded-full border border-white/60 bg-white/60 px-4 py-1.5 shadow-soft backdrop-blur-md">
              Why German Mitra
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-700 sm:text-4xl text-balance">
              Built for the way Indians move to Germany.
            </h2>

            <p className="mt-4 text-base leading-relaxed text-ink-600">
              Moving countries is hard enough. Finding a home shouldn't be a
              guessing game. German Mitra explains German rental terms in plain
              English and shows you exactly what you'll pay and what's expected.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                {
                  icon: (
                    <Wallet className="h-5 w-5" />
                  ),
                  title: 'Transparent costs',
                  text: 'Rent, deposit (Kaution) and utilities (Nebenkosten) shown clearly.',
                },
                {
                  icon: (
                    <Languages className="h-5 w-5" />
                  ),
                  title: 'Plain-English terms',
                  text: 'Rental conditions and house rules translated and explained.',
                },
                {
                  icon: (
                    <GraduationCap className="h-5 w-5" />
                  ),
                  title: 'Student-friendly',
                  text: 'WG rooms and studios with Bürgschaft and semester contracts.',
                },
                {
                  icon: (
                    <Briefcase className="h-5 w-5" />
                  ),
                  title: 'For professionals',
                  text: 'Furnished apartments ready for your first week in Germany.',
                },
                {
                  icon: (
                    <Bell className="h-5 w-5" />
                  ),
                  title: 'Save & track',
                  text: 'Keep favorites and recently viewed homes in your dashboard.',
                },
                {
                  icon: (
                    <ShieldCheck className="h-5 w-5" />
                  ),
                  title: 'Verified landlords',
                  text: 'Look for the verified badge and still do your own checks.',
                },
              ].map((b) => (
                <div
                  key={b.title}
                  className="group flex gap-3 rounded-2xl p-2 transition-all duration-300 hover:bg-white/60 hover:backdrop-blur-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/60 bg-white/80 text-brand-600 shadow-soft transition-transform duration-300 ease-spring group-hover:scale-110">
                    {b.icon}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-brand-700">
                      {b.title}
                    </h3>

                    <p className="mt-1 text-sm leading-relaxed text-ink-600">
                      {b.text}
                    </p>
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
                className="aspect-[3/4] w-full rounded-2xl object-cover shadow-card transition-transform duration-500 ease-smooth hover:scale-[1.02]"
                loading="lazy"
              />

              <img
                src="https://images.pexels.com/photos/30475302/pexels-photo-30475302.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Frankfurt skyline"
                className="mt-8 aspect-[3/4] w-full rounded-2xl object-cover shadow-card transition-transform duration-500 ease-smooth hover:scale-[1.02]"
                loading="lazy"
              />
            </div>

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-2xl border border-white/60 bg-white/80 px-5 py-3 shadow-glassHover backdrop-blur-xl">
              <p className="text-xs text-ink-500">
                Trusted across
              </p>

              <p className="text-sm font-bold text-brand-700">
                10 German cities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="contact"
        className="container-page py-16"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-6 py-12 text-center text-white sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-glassDark backdrop-blur-md">
              <Building2 className="h-8 w-8 text-accent-300" />
            </div>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
              Ready to find your German address?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-brand-100">
              Create a free account to save favorites, track inquiries and message landlords.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/register"
                className="btn rounded-full bg-gradient-to-r from-accent-400 to-accent-600 text-white shadow-accent transition-all duration-300 ease-spring hover:scale-105 hover:shadow-accentHover active:scale-95"
              >
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/properties"
                className="btn rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all duration-300 ease-spring hover:scale-105 hover:bg-white/20 active:scale-95"
              >
                Browse properties
              </Link>
            </div>
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
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ArrowUpDown, Grid2x2, LayoutGrid, Search, X } from 'lucide-react'
import { PropertyCard } from '../components/PropertyCard'
import { FilterPanel } from '../components/FilterPanel'
import { EmptyState, SkeletonCard, DisclaimerBanner } from '../components/ui'
import { useListings } from '../context/ListingsContext'
import { classNames } from '../utils/format'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'area-desc', label: 'Largest area' },
]

const emptyFilters = {
  city: '',
  type: '',
  maxRent: '',
  bedrooms: '',
  furnished: '',
  amenities: [],
  q: '',
}

export default function Properties() {
  const { listings } = useListings()
  const [params, setParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('newest')
  const [density, setDensity] = useState('comfortable')
  const [mobileFilters, setMobileFilters] = useState(false)

  const [filters, setFilters] = useState(() => ({
    ...emptyFilters,
    city: params.get('city') || '',
    type: params.get('type') || '',
    maxRent: params.get('maxRent') || '',
    q: params.get('q') || '',
  }))

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const next = new URLSearchParams()
    if (filters.city) next.set('city', filters.city)
    if (filters.type) next.set('type', filters.type)
    if (filters.maxRent) next.set('maxRent', filters.maxRent)
    if (filters.q) next.set('q', filters.q)
    setParams(next, { replace: true })
  }, [filters, setParams])

  const filtered = useMemo(() => {
    let list = listings.filter((p) => p.status === 'approved')
    if (filters.city) list = list.filter((p) => p.city === filters.city)
    if (filters.type) list = list.filter((p) => p.type === filters.type)
    if (filters.maxRent) list = list.filter((p) => p.rent <= Number(filters.maxRent))
    if (filters.bedrooms) list = list.filter((p) => p.bedrooms >= Number(filters.bedrooms))
    if (filters.furnished === 'yes') list = list.filter((p) => p.furnished)
    if (filters.furnished === 'no') list = list.filter((p) => !p.furnished)
    if (filters.amenities.length) {
      list = list.filter((p) => filters.amenities.every((a) => p.amenities.includes(a)))
    }
    if (filters.q) {
      const q = filters.q.toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q),
      )
    }
    switch (sort) {
      case 'price-asc': return [...list].sort((a, b) => a.rent - b.rent)
      case 'price-desc': return [...list].sort((a, b) => b.rent - a.rent)
      case 'area-desc': return [...list].sort((a, b) => b.area - a.area)
      default: return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }, [listings, filters, sort])

  const activeCount = [
    filters.city, filters.type, filters.bedrooms, filters.furnished, filters.q,
    filters.maxRent ? 'rent' : '',
    filters.amenities.length ? 'amenities' : '',
  ].filter(Boolean).length

  return (
    <div className="container-page py-8 lg:py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Browse properties
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            {filtered.length} {filtered.length === 1 ? 'home' : 'homes'} across Germany
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              placeholder="Search title, city, district…"
              className="input pl-9"
            />
          </div>
          <button
            onClick={() => setMobileFilters(true)}
            className="btn-secondary lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {activeCount > 0 && (
              <span className="ml-1 rounded-full bg-brand-600 px-1.5 text-xs font-bold text-white">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="relative mt-4 sm:hidden">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          placeholder="Search title, city, district\u2026"
          className="input pl-9"
        />
      </div>

      <div className="mt-6 flex gap-8">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(emptyFilters)}
          resultCount={filtered.length}
          mobileOpen={mobileFilters}
          onMobileClose={() => setMobileFilters(false)}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {activeCount > 0 && (
                <button
                  onClick={() => setFilters(emptyFilters)}
                  className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600 transition hover:bg-ink-200"
                >
                  Clear all <X className="h-3 w-3" />
                </button>
              )}
              {filters.city && <Pill label={filters.city} onClear={() => setFilters((f) => ({ ...f, city: '' }))} />}
              {filters.type && <Pill label={filters.type} onClear={() => setFilters((f) => ({ ...f, type: '' }))} />}
              {filters.furnished === 'yes' && <Pill label="Furnished" onClear={() => setFilters((f) => ({ ...f, furnished: '' }))} />}
              {filters.furnished === 'no' && <Pill label="Unfurnished" onClear={() => setFilters((f) => ({ ...f, furnished: '' }))} />}
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-1 rounded-xl ring-1 ring-ink-200 sm:flex">
                <button
                  onClick={() => setDensity('comfortable')}
                  className={classNames('rounded-lg p-2 transition', density === 'comfortable' ? 'bg-ink-100 text-ink-900' : 'text-ink-400 hover:text-ink-700')}
                  aria-label="Comfortable grid"
                >
                  <Grid2x2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDensity('compact')}
                  className={classNames('rounded-lg p-2 transition', density === 'compact' ? 'bg-ink-100 text-ink-900' : 'text-ink-400 hover:text-ink-700')}
                  aria-label="Compact grid"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
              <label className="relative">
                <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="input appearance-none pl-9 pr-8"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {loading ? (
            <div className={classNames('grid gap-6', density === 'compact' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3')}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Search className="h-7 w-7" />}
              title="No properties match your filters"
              description="Try widening your search — remove a filter or increase the maximum rent."
              action={
                <button onClick={() => setFilters(emptyFilters)} className="btn-primary">
                  Reset filters
                </button>
              }
            />
          ) : (
            <div className={classNames('grid gap-6', density === 'compact' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3')}>
              {filtered.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          )}

          <div className="mt-8">
            <DisclaimerBanner />
          </div>
        </div>
      </div>
    </div>
  )
}

function Pill({ label, onClear }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
      {label}
      <button onClick={onClear} className="rounded-full hover:text-brand-900" aria-label={`Remove ${label}`}>
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

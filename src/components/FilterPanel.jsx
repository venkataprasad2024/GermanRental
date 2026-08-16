import { SlidersHorizontal, X } from 'lucide-react'
import { GERMAN_CITIES, PROPERTY_TYPES, AMENITY_LIST } from '../data/cities'
import { classNames } from '../utils/format'

export function FilterPanel({ filters, onChange, onReset, resultCount, mobileOpen, onMobileClose }) {
  const update = (key, value) => onChange({ ...filters, [key]: value })

  const panel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-ink-900">
          <SlidersHorizontal className="h-4 w-4 text-brand-600" /> Filters
        </h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-brand-700 hover:text-brand-800"
        >
          Reset all
        </button>
      </div>

      <Group label="City">
        <select
          value={filters.city || ''}
          onChange={(e) => update('city', e.target.value)}
          className="input"
        >
          <option value="">Any city</option>
          {GERMAN_CITIES.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </Group>

      <Group label="Property type">
        <div className="grid grid-cols-2 gap-2">
          <Chip active={!filters.type} onClick={() => update('type', '')}>All</Chip>
          {PROPERTY_TYPES.map((t) => (
            <Chip key={t} active={filters.type === t} onClick={() => update('type', t)}>
              {t}
            </Chip>
          ))}
        </div>
      </Group>

      <Group label={`Max rent — €${filters.maxRent || '2000'}`}>
        <input
          type="range"
          min="300"
          max="2500"
          step="50"
          value={filters.maxRent || 2500}
          onChange={(e) => update('maxRent', e.target.value)}
          className="w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-[11px] text-ink-400">
          <span>€300</span>
          <span>€2500+</span>
        </div>
      </Group>

      <Group label="Bedrooms">
        <div className="flex gap-2">
          {['', '1', '2', '3', '4'].map((n) => (
            <Chip key={n || 'any'} active={filters.bedrooms === n} onClick={() => update('bedrooms', n)}>
              {n || 'Any'}
            </Chip>
          ))}
        </div>
      </Group>

      <Group label="Furnishing">
        <div className="flex gap-2">
          <Chip active={!filters.furnished} onClick={() => update('furnished', '')}>Any</Chip>
          <Chip active={filters.furnished === 'yes'} onClick={() => update('furnished', 'yes')}>Furnished</Chip>
          <Chip active={filters.furnished === 'no'} onClick={() => update('furnished', 'no')}>Unfurnished</Chip>
        </div>
      </Group>

      <Group label="Amenities">
        <div className="flex flex-wrap gap-2">
          {AMENITY_LIST.map((a) => {
            const active = (filters.amenities || []).includes(a)
            return (
              <Chip
                key={a}
                active={active}
                onClick={() => {
                  const set = new Set(filters.amenities || [])
                  if (active) set.delete(a)
                  else set.add(a)
                  update('amenities', [...set])
                }}
              >
                {a}
              </Chip>
            )
          })}
        </div>
      </Group>

      <p className="rounded-xl bg-ink-50 px-3 py-2 text-xs text-ink-600">
        {resultCount} {resultCount === 1 ? 'property' : 'properties'} match your filters
      </p>
    </div>
  )

  return (
    <>
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-20 card p-5">{panel}</div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[85] lg:hidden">
          <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm animate-fade-in" onClick={onMobileClose} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-5 shadow-cardHover animate-toast-in">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-ink-900">Filters</span>
              <button onClick={onMobileClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100" aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>
            {panel}
            <button onClick={onMobileClose} className="btn-primary mt-6 w-full">
              Show {resultCount} results
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function Group({ label, children }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</p>
      {children}
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'rounded-lg border px-3 py-1.5 text-xs font-medium transition',
        active
          ? 'border-brand-600 bg-brand-50 text-brand-700'
          : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50',
      )}
    >
      {children}
    </button>
  )
}

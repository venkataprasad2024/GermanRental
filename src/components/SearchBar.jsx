import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Home, Euro } from 'lucide-react'
import { GERMAN_CITIES, PROPERTY_TYPES } from '../data/cities'
import { classNames } from '../utils/format'

export function SearchBar({ variant = 'hero', className = '', defaultValues = {} }) {
  const [city, setCity] = useState(defaultValues.city || '')
  const [type, setType] = useState(defaultValues.type || '')
  const [maxRent, setMaxRent] = useState(defaultValues.maxRent || '')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (type) params.set('type', type)
    if (maxRent) params.set('maxRent', maxRent)
    navigate(`/properties?${params.toString()}`)
  }

  const isHero = variant === 'hero'

  return (
    <form
      onSubmit={submit}
      className={classNames(
        'w-full rounded-2xl bg-white p-2 shadow-cardHover ring-1 ring-ink-100',
        isHero && 'sm:rounded-full',
        className,
      )}
    >
      <div className="grid gap-2 sm:grid-cols-[1.3fr_1fr_0.9fr_auto] sm:items-center">
        <Field icon={<MapPin className="h-4 w-4 text-brand-600" />} label="City">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-ink-900 focus:outline-none"
          >
            <option value="">Any city</option>
            {GERMAN_CITIES.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </Field>

        <Field icon={<Home className="h-4 w-4 text-brand-600" />} label="Type">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-ink-900 focus:outline-none"
          >
            <option value="">Any type</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field icon={<Euro className="h-4 w-4 text-brand-600" />} label="Max rent">
          <input
            type="number"
            min="0"
            step="50"
            value={maxRent}
            onChange={(e) => setMaxRent(e.target.value)}
            placeholder="Any"
            className="w-full bg-transparent text-sm font-medium text-ink-900 placeholder:text-ink-400 focus:outline-none"
          />
        </Field>

        <button
          type="submit"
          className={classNames(
            'btn-primary h-full rounded-xl px-5 py-3',
            isHero && 'sm:rounded-full',
          )}
        >
          <Search className="h-4 w-4" /> Search
        </button>
      </div>
    </form>
  )
}

function Field({ icon, label, children }) {
  return (
    <label className="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-ink-50 sm:rounded-full">
      <span className="hidden sm:flex">{icon}</span>
      <span className="flex flex-1 flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
          {label}
        </span>
        {children}
      </span>
    </label>
  )
}

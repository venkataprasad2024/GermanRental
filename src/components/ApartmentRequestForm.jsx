import { useState } from 'react'
import {
  Calendar,
  Euro,
  Home,
  MapPin,
  Check,
} from 'lucide-react'

import {
  GERMAN_CITIES,
  PROPERTY_TYPES,
  AMENITY_LIST,
} from '../data/cities'

import { useAuth } from '../context/AuthContext'
import {
  useListings,
} from '../context/ListingsContext'

export function ApartmentRequestForm() {
  const { user } = useAuth()
  const {
    addApartmentRequest,
  } = useListings()

  const [form, setForm] = useState({
    city: user?.city || '',
    district: '',
    type:
      PROPERTY_TYPES[0] ||
      'Apartment',
    maxRent: '',
    bedrooms: '1',
    furnished: '',
    moveDate: '',
    amenities: [],
    requirements: '',
  })

  const [submitted, setSubmitted] =
    useState(false)

  const [error, setError] =
    useState('')

  const update = (
    field,
    value,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const toggleAmenity = (
    amenity,
  ) => {
    setForm((current) => {
      const exists =
        current.amenities.includes(
          amenity,
        )

      return {
        ...current,

        amenities: exists
          ? current.amenities.filter(
              (item) =>
                item !== amenity,
            )
          : [
              ...current.amenities,
              amenity,
            ],
      }
    })
  }

  const submit = (event) => {
    event.preventDefault()
    setError('')

    if (
      !form.city ||
      !form.maxRent ||
      !form.moveDate
    ) {
      setError(
        'Please select a city, maximum rent and move-in date.',
      )
      return
    }

    addApartmentRequest({
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,

      city: form.city,
      district:
        form.district.trim(),

      type: form.type,

      maxRent:
        Number(form.maxRent),

      bedrooms:
        Number(form.bedrooms) || 1,

      furnished:
        form.furnished,

      moveDate:
        form.moveDate,

      amenities:
        form.amenities,

      requirements:
        form.requirements.trim(),
    })

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-white">
          <Check className="h-7 w-7" />
        </div>

        <h2 className="mt-4 text-xl font-bold text-ink-900">
          Request submitted
        </h2>

        <p className="mx-auto mt-2 max-w-lg text-sm text-ink-600">
          Your apartment request has been saved. We can use these requirements to match you with suitable properties.
        </p>

      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      className="card p-5 sm:p-7"
    >
      <div className="grid gap-6">

        {/* LOCATION */}

        <section>
          <div className="mb-5 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-brand-700" />

            <div>
              <h2 className="font-bold text-ink-900">
                Preferred location
              </h2>

              <p className="text-xs text-ink-500">
                Where would you like to live?
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="label">
                City *
              </label>

              <select
                value={form.city}
                onChange={(event) =>
                  update(
                    'city',
                    event.target.value,
                  )
                }
                className="input"
              >
                <option value="">
                  Select city
                </option>

                {GERMAN_CITIES.map(
                  (city) => (
                    <option
                      key={city.name}
                      value={city.name}
                    >
                      {city.name}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label className="label">
                Preferred district
              </label>

              <input
                value={form.district}
                onChange={(event) =>
                  update(
                    'district',
                    event.target.value,
                  )
                }
                className="input"
                placeholder="e.g. Mitte, Altona"
              />
            </div>

          </div>
        </section>

        {/* PROPERTY REQUIREMENTS */}

        <section className="border-t border-ink-100 pt-6">

          <div className="mb-5 flex items-center gap-3">
            <Home className="h-5 w-5 text-brand-700" />

            <div>
              <h2 className="font-bold text-ink-900">
                Apartment requirements
              </h2>

              <p className="text-xs text-ink-500">
                Tell us about the home you need
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="label">
                Property type
              </label>

              <select
                value={form.type}
                onChange={(event) =>
                  update(
                    'type',
                    event.target.value,
                  )
                }
                className="input"
              >
                {PROPERTY_TYPES.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label className="label">
                Bedrooms
              </label>

              <select
                value={form.bedrooms}
                onChange={(event) =>
                  update(
                    'bedrooms',
                    event.target.value,
                  )
                }
                className="input"
              >
                {[
                  '1',
                  '2',
                  '3',
                  '4',
                  '5',
                ].map((value) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {value}+
                  </option>
                ))}
              </select>
            </div>

          </div>
        </section>

        {/* BUDGET + DATE */}

        <section className="border-t border-ink-100 pt-6">

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="label">
                Maximum monthly rent *
              </label>

              <div className="relative">
                <Euro className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

                <input
                  type="number"
                  min="0"
                  value={form.maxRent}
                  onChange={(event) =>
                    update(
                      'maxRent',
                      event.target.value,
                    )
                  }
                  className="input pl-9"
                  placeholder="1500"
                />
              </div>
            </div>

            <div>
              <label className="label">
                Move-in date *
              </label>

              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

                <input
                  type="date"
                  value={form.moveDate}
                  onChange={(event) =>
                    update(
                      'moveDate',
                      event.target.value,
                    )
                  }
                  className="input pl-9"
                />
              </div>
            </div>

          </div>
        </section>

        {/* FURNISHED */}

        <section className="border-t border-ink-100 pt-6">

          <label className="label">
            Furnishing
          </label>

          <div className="flex flex-wrap gap-2">

            {[
              {
                value: '',
                label: 'Any',
              },
              {
                value: 'yes',
                label: 'Furnished',
              },
              {
                value: 'no',
                label: 'Unfurnished',
              },
            ].map((option) => (
              <button
                key={option.value || 'any'}
                type="button"
                onClick={() =>
                  update(
                    'furnished',
                    option.value,
                  )
                }
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  form.furnished ===
                  option.value
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-ink-200 bg-white text-ink-600 hover:border-brand-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {/* AMENITIES */}

        <section className="border-t border-ink-100 pt-6">

          <h2 className="font-bold text-ink-900">
            Preferred amenities
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">

            {AMENITY_LIST.map(
              (amenity) => {
                const active =
                  form.amenities.includes(
                    amenity,
                  )

                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() =>
                      toggleAmenity(
                        amenity,
                      )
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-ink-200 bg-white text-ink-600 hover:border-brand-300'
                    }`}
                  >
                    {amenity}
                  </button>
                )
              },
            )}
          </div>
        </section>

        {/* EXTRA REQUIREMENTS */}

        <section className="border-t border-ink-100 pt-6">

          <label className="label">
            Additional requirements
          </label>

          <textarea
            rows="6"
            value={form.requirements}
            onChange={(event) =>
              update(
                'requirements',
                event.target.value,
              )
            }
            className="input resize-none"
            placeholder="Tell us anything else that would help us find the right apartment."
          />
        </section>

        {/* ERROR */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* SUBMIT */}

        <div className="border-t border-ink-100 pt-6">
          <button
            type="submit"
            className="btn-primary w-full sm:w-auto"
          >
            Submit apartment request
          </button>

          <p className="mt-3 text-xs text-ink-500">
            Your request is stored with your account details so it can be matched with suitable listings.
          </p>
        </div>

      </div>
    </form>
  )
}
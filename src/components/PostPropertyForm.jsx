import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  MapPin,
  Euro,
  BedDouble,
  Ruler,
  Check,
  Camera,
  ImagePlus,
  X,
} from 'lucide-react'

import {
  GERMAN_CITIES,
  PROPERTY_TYPES,
  AMENITY_LIST,
} from '../data/cities'

import { useAuth } from '../context/AuthContext'
import { useListings } from '../context/ListingsContext'

export function PostPropertyForm() {
  const { user } = useAuth()
  const { addListing } = useListings()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    type: PROPERTY_TYPES[0] || 'Apartment',
    city: user?.city || '',
    district: '',
    rent: '',
    utilities: '',
    bedrooms: '1',
    bathrooms: '1',
    area: '',
    furnished: false,
    description: '',
    amenities: [],
    images: [],
  })

  const [error, setError] = useState('')
  const [submitted, setSubmitted] =
    useState(false)

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

  const handleImageFiles = (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    const remaining = Math.max(0, 10 - form.images.length)
    const selectedFiles = files.slice(0, remaining)

    const readers = selectedFiles.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(file)
        }),
    )

    Promise.all(readers)
      .then((images) => {
        setForm((current) => ({
          ...current,
          images: [...current.images, ...images],
        }))
      })
      .catch(() => {
        setError('Unable to load one or more images. Please try again.')
      })

    event.target.value = ''
  }

  const removeImage = (index) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }))
  }

  const submit = (event) => {
    event.preventDefault()
    setError('')

    if (
      !form.title.trim() ||
      !form.city ||
      !form.district.trim() ||
      !form.rent ||
      !form.area
    ) {
      setError(
        'Please fill in all required fields.',
      )
      return
    }

    const listing = addListing({
      title: form.title.trim(),
      type: form.type,
      city: form.city,
      district: form.district.trim(),

      rent: Number(form.rent),
      utilities:
        Number(form.utilities) || 0,

      bedrooms:
        Number(form.bedrooms) || 1,

      bathrooms:
        Number(form.bathrooms) || 1,

      area: Number(form.area),

      furnished:
        Boolean(form.furnished),

      amenities: form.amenities,

      description:
        form.description.trim(),

      images:
        form.images.length > 0
          ? form.images
          : [
              'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
            ],

      landlordId: user?.id,
      landlordName: user?.name,
      landlordEmail: user?.email,
    })

    setSubmitted(true)

    /*
     * New listings are pending by design
     * in ListingsContext.
     */
    setTimeout(() => {
      navigate(
        `/properties/${listing.id}`,
      )
    }, 700)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-white">
          <Check className="h-7 w-7" />
        </div>

        <h2 className="mt-4 text-xl font-bold text-ink-900">
          Property submitted
        </h2>

        <p className="mt-2 text-sm text-ink-600">
          Your property has been submitted for review.
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

        {/* BASIC INFORMATION */}

        <section>
          <div className="mb-5 flex items-center gap-3">
            <Building2 className="h-5 w-5 text-brand-700" />

            <div>
              <h2 className="font-bold text-ink-900">
                Property details
              </h2>

              <p className="text-xs text-ink-500">
                Basic information about the apartment
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="sm:col-span-2">
              <label className="label">
                Property title *
              </label>

              <input
                value={form.title}
                onChange={(event) =>
                  update(
                    'title',
                    event.target.value,
                  )
                }
                className="input"
                placeholder="e.g. Bright 2-Room Apartment near Alexanderplatz"
              />
            </div>

            <div>
              <label className="label">
                Property type *
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
                City *
              </label>

              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

                <select
                  value={form.city}
                  onChange={(event) =>
                    update(
                      'city',
                      event.target.value,
                    )
                  }
                  className="input pl-9"
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
            </div>

            <div>
              <label className="label">
                District *
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
                placeholder="e.g. Mitte"
              />
            </div>
          </div>
        </section>

        {/* APARTMENT PHOTOS */}

        <section className="border-t border-ink-100 pt-6">
          <div className="mb-5 flex items-center gap-3">
            <ImagePlus className="h-5 w-5 text-brand-700" />

            <div>
              <h2 className="font-bold text-ink-900">
                Apartment photos
              </h2>

              <p className="text-xs text-ink-500">
                Add up to 10 clear photos of the property
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <label className="cursor-pointer rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-5 transition-colors hover:border-brand-400 hover:bg-brand-50">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageFiles}
                className="sr-only"
              />

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-soft">
                  <ImagePlus className="h-6 w-6" />
                </div>

                <div>
                  <p className="font-semibold text-ink-900">
                    Choose photos
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500">
                    Select images from your device
                  </p>
                </div>
              </div>
            </label>

            <label className="cursor-pointer rounded-2xl border-2 border-dashed border-accent-200 bg-accent-50/40 p-5 transition-colors hover:border-accent-400 hover:bg-accent-50 sm:hidden">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageFiles}
                className="sr-only"
              />

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-accent-600 shadow-soft">
                  <Camera className="h-6 w-6" />
                </div>

                <div>
                  <p className="font-semibold text-ink-900">
                    Take a photo
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500">
                    Use your phone camera
                  </p>
                </div>
              </div>
            </label>
          </div>

          {form.images.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {form.images.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="group relative overflow-hidden rounded-xl border border-ink-200 bg-ink-50"
                >
                  <img
                    src={image}
                    alt={`Apartment ${index + 1}`}
                    className="aspect-[4/3] w-full object-cover"
                  />

                  {index === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-brand-700 px-2 py-1 text-[10px] font-semibold text-white">
                      Cover photo
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-soft transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="mt-3 text-xs text-ink-500">
            JPG, PNG or WEBP. The first photo will be used as the cover image.
          </p>
        </section>

        {/* RENT */}

        <section className="border-t border-ink-100 pt-6">

          <div className="mb-5 flex items-center gap-3">
            <Euro className="h-5 w-5 text-brand-700" />

            <div>
              <h2 className="font-bold text-ink-900">
                Rental details
              </h2>

              <p className="text-xs text-ink-500">
                Pricing and apartment size
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">

            <div>
              <label className="label">
                Monthly rent *
              </label>

              <input
                type="number"
                min="0"
                value={form.rent}
                onChange={(event) =>
                  update(
                    'rent',
                    event.target.value,
                  )
                }
                className="input"
                placeholder="1200"
              />
            </div>

            <div>
              <label className="label">
                Utilities
              </label>

              <input
                type="number"
                min="0"
                value={form.utilities}
                onChange={(event) =>
                  update(
                    'utilities',
                    event.target.value,
                  )
                }
                className="input"
                placeholder="250"
              />
            </div>

            <div>
              <label className="label">
                Area (m²) *
              </label>

              <div className="relative">
                <Ruler className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

                <input
                  type="number"
                  min="1"
                  value={form.area}
                  onChange={(event) =>
                    update(
                      'area',
                      event.target.value,
                    )
                  }
                  className="input pl-9"
                  placeholder="65"
                />
              </div>
            </div>

          </div>
        </section>

        {/* ROOMS */}

        <section className="border-t border-ink-100 pt-6">

          <div className="mb-5 flex items-center gap-3">
            <BedDouble className="h-5 w-5 text-brand-700" />

            <div>
              <h2 className="font-bold text-ink-900">
                Rooms
              </h2>

              <p className="text-xs text-ink-500">
                Choose the apartment configuration
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">

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
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                Bathrooms
              </label>

              <select
                value={form.bathrooms}
                onChange={(event) =>
                  update(
                    'bathrooms',
                    event.target.value,
                  )
                }
                className="input"
              >
                {[
                  '1',
                  '2',
                  '3',
                ].map((value) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-end gap-3 rounded-xl border border-ink-200 p-3">
              <input
                type="checkbox"
                checked={
                  form.furnished
                }
                onChange={(event) =>
                  update(
                    'furnished',
                    event.target.checked,
                  )
                }
                className="h-4 w-4 accent-brand-600"
              />

              <span className="text-sm font-medium text-ink-700">
                Furnished
              </span>
            </label>

          </div>
        </section>

        {/* AMENITIES */}

        <section className="border-t border-ink-100 pt-6">

          <h2 className="font-bold text-ink-900">
            Amenities
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

        {/* DESCRIPTION */}

        <section className="border-t border-ink-100 pt-6">

          <label className="label">
            Description
          </label>

          <textarea
            rows="6"
            value={form.description}
            onChange={(event) =>
              update(
                'description',
                event.target.value,
              )
            }
            className="input resize-none"
            placeholder="Describe the apartment, nearby transport, neighborhood and anything important for tenants."
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
            Submit property
          </button>

          <p className="mt-3 text-xs text-ink-500">
            Your listing will be submitted for review before becoming visible to renters.
          </p>
        </div>

      </div>
    </form>
  )
}
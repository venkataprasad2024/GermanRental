import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowUpDown,
  Map as MapIcon,
  List as ListIcon,
  MapPin,
  Search,
  X,
} from 'lucide-react'

import { PropertyCard } from '../components/PropertyCard'
import { FilterBar } from '../components/FilterBar'
import { PropertyMap } from '../components/PropertyMap'

import {
  EmptyState,
  SkeletonCard,
  DisclaimerBanner,
} from '../components/ui'

import { useListings } from '../context/ListingsContext'
import { classNames } from '../utils/format'

const SORT_OPTIONS = [
  {
    value: 'newest',
    label: 'Newest first',
  },
  {
    value: 'price-asc',
    label: 'Price: low to high',
  },
  {
    value: 'price-desc',
    label: 'Price: high to low',
  },
  {
    value: 'area-desc',
    label: 'Largest area',
  },
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

const MAP_RADIUS_KM = 2

export default function Properties() {
  const { listings } = useListings()
  const [params, setParams] = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('newest')

  /*
   * Desktop:
   * Map is always visible on the right.
   *
   * Mobile:
   * mapOpen switches between property list and map.
   */
  const [mapOpen, setMapOpen] = useState(false)
  const [mapLocation, setMapLocation] = useState(null)
  const [selectedPropertyId, setSelectedPropertyId] = useState(null)
  const ignoreInitialMapViewport = useRef(true)

  /*
   * =========================================================
   * CITY FROM URL
   * =========================================================
   *
   * /properties?city=Berlin
   * /properties?city=Frankfurt
   * /properties?city=Munich
   */
  const selectedCity = params.get('city') || ''

  /*
   * =========================================================
   * FILTER STATE
   * =========================================================
   */
  const [filters, setFilters] = useState(() => ({
    ...emptyFilters,
    type: params.get('type') || '',
    maxRent: params.get('maxRent') || '',
    bedrooms: params.get('bedrooms') || '',
    furnished: params.get('furnished') || '',
    q: params.get('q') || '',
    amenities: params.get('amenities')
      ? params.get('amenities').split(',')
      : [],
  }))

  /*
   * =========================================================
   * INITIAL LOADING
   * =========================================================
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 350)

    return () => clearTimeout(timer)
  }, [])

  /*
   * =========================================================
   * KEEP FILTERS IN URL
   * =========================================================
   */
  useEffect(() => {
    const next = new URLSearchParams(params)

    if (filters.type) {
      next.set('type', filters.type)
    } else {
      next.delete('type')
    }

    if (filters.maxRent) {
      next.set('maxRent', filters.maxRent)
    } else {
      next.delete('maxRent')
    }

    if (filters.bedrooms) {
      next.set('bedrooms', filters.bedrooms)
    } else {
      next.delete('bedrooms')
    }

    if (filters.furnished) {
      next.set('furnished', filters.furnished)
    } else {
      next.delete('furnished')
    }

    if (filters.q) {
      next.set('q', filters.q)
    } else {
      next.delete('q')
    }

    if (
      filters.amenities &&
      filters.amenities.length > 0
    ) {
      next.set(
        'amenities',
        filters.amenities.join(','),
      )
    } else {
      next.delete('amenities')
    }

    const currentString = params.toString()
    const nextString = next.toString()

    if (currentString !== nextString) {
      setParams(next, {
        replace: true,
      })
    }
  }, [
    filters.type,
    filters.maxRent,
    filters.bedrooms,
    filters.furnished,
    filters.q,
    filters.amenities,
    params,
    setParams,
  ])

  /*
   * =========================================================
   * FILTER BAR CHANGE
   * =========================================================
   */
  const handleFilterChange = (nextFilters) => {
    /*
     * City is stored in the URL.
     */
    if (nextFilters.city !== selectedCity) {
      const nextParams = new URLSearchParams(params)

      if (nextFilters.city) {
        nextParams.set(
          'city',
          nextFilters.city,
        )
      } else {
        nextParams.delete('city')
      }

      setParams(nextParams, {
        replace: true,
      })
    }

    /*
     * Store all filters locally.
     */
    setFilters({
      ...nextFilters,
      city: selectedCity,
    })

    /*
     * Changing normal filters clears
     * a selected map location.
     */
    setMapLocation(null)
  }

  /*
   * =========================================================
   * BASE FILTERING
   * =========================================================
   *
   * These are the normal filters.
   * Map filtering is applied afterwards.
   */
  const baseFiltered = useMemo(() => {
    let list = listings.filter(
      (p) => p.status === 'approved',
    )

    /*
     * CITY
     */
    if (selectedCity) {
      const city = selectedCity
        .trim()
        .toLowerCase()

      list = list.filter((p) => {
        if (!p.city) return false

        return (
          p.city.trim().toLowerCase() === city
        )
      })
    }

    /*
     * PROPERTY TYPE
     */
    if (filters.type) {
      list = list.filter(
        (p) => p.type === filters.type,
      )
    }

    /*
     * MAX RENT
     */
    if (filters.maxRent) {
      list = list.filter(
        (p) =>
          p.rent <= Number(filters.maxRent),
      )
    }

    /*
     * BEDROOMS
     */
    if (filters.bedrooms) {
      list = list.filter(
        (p) =>
          p.bedrooms >=
          Number(filters.bedrooms),
      )
    }

    /*
     * FURNISHED
     */
    if (filters.furnished === 'yes') {
      list = list.filter(
        (p) => p.furnished,
      )
    }

    if (filters.furnished === 'no') {
      list = list.filter(
        (p) => !p.furnished,
      )
    }

    /*
     * AMENITIES
     */
    if (
      filters.amenities &&
      filters.amenities.length > 0
    ) {
      list = list.filter((p) => {
        if (!p.amenities) return false

        return filters.amenities.every(
          (amenity) =>
            p.amenities.includes(amenity),
        )
      })
    }

    /*
     * TEXT SEARCH
     *
     * Kept so your existing search/URL
     * behavior still works.
     */
    if (filters.q) {
      const q = filters.q
        .trim()
        .toLowerCase()

      list = list.filter((p) => {
        const title =
          p.title?.toLowerCase() || ''

        const city =
          p.city?.toLowerCase() || ''

        const district =
          p.district?.toLowerCase() || ''

        const type =
          p.type?.toLowerCase() || ''

        return (
          title.includes(q) ||
          city.includes(q) ||
          district.includes(q) ||
          type.includes(q)
        )
      })
    }

    return list
  }, [
    listings,
    selectedCity,
    filters,
  ])

  /*
   * =========================================================
   * FINAL FILTERING
   * =========================================================
   *
   * Normal filters
   *       ↓
   * Map radius
   *       ↓
   * Sort
   */
  const filtered = useMemo(() => {
    let list = [...baseFiltered]

    /*
     * MAP RADIUS
     */
    if (mapLocation) {
      list = list.filter((property) => {
        if (!property.coordinates) {
          return false
        }

        const lat = Number(
          property.coordinates.lat,
        )

        const lng = Number(
          property.coordinates.lng,
        )

        if (
          !Number.isFinite(lat) ||
          !Number.isFinite(lng)
        ) {
          return false
        }

        const distance = distanceInKm(
          mapLocation.lat,
          mapLocation.lng,
          lat,
          lng,
        )

        return distance <= MAP_RADIUS_KM
      })
    }

    /*
     * SORT
     */
    switch (sort) {
      case 'price-asc':
        return list.sort(
          (a, b) => a.rent - b.rent,
        )

      case 'price-desc':
        return list.sort(
          (a, b) => b.rent - a.rent,
        )

      case 'area-desc':
        return list.sort(
          (a, b) => b.area - a.area,
        )

      case 'newest':
      default:
        list.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt),
        )
        break
    }

    if (selectedPropertyId) {
      const selectedIndex = list.findIndex(
        (property) => property.id === selectedPropertyId,
      )

      if (selectedIndex > 0) {
        const [selectedProperty] = list.splice(
          selectedIndex,
          1,
        )
        list.unshift(selectedProperty)
      }
    }

    return list
  }, [
    baseFiltered,
    mapLocation,
    selectedPropertyId,
    sort,
  ])

  /*
   * =========================================================
   * RESET FILTERS
   * =========================================================
   */
  const resetFilters = () => {
    setFilters({
      ...emptyFilters,
    })

    setMapLocation(null)

    setParams(
      {},
      {
        replace: true,
      },
    )
  }

  /*
   * =========================================================
   * MAP LOCATION
   * =========================================================
   */
  const handleMapLocation = (location) => {
    setMapLocation({
      lat: location.lat,
      lng: location.lng,
    })
    setSelectedPropertyId(location.propertyId || null)
  }
  const handleMapViewport = (location) => {
  if (ignoreInitialMapViewport.current) {
    ignoreInitialMapViewport.current = false
    return
  }

  setMapLocation({
    lat: location.lat,
    lng: location.lng,
  })

  setSelectedPropertyId(null)
}
  const clearMapLocation = () => {
    setMapLocation(null)
    setSelectedPropertyId(null)
  }

  return (
    <div className="container-page py-4 sm:py-6 lg:py-8">

      {/* =====================================================
          TOP FILTER BAR
      ====================================================== */}

      <div className="mb-4 lg:mb-5">
        <FilterBar
          filters={{
            ...filters,
            city: selectedCity,
          }}
          onChange={handleFilterChange}
          resultCount={filtered.length}
        />
      </div>

      {/* =====================================================
          HEADER + SORT + MAP
      ====================================================== */}

      <div className="mt-2 flex items-center justify-between gap-3">

        {/* TITLE */}

        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Browse properties
          </h1>

          <p className="mt-1 text-sm text-ink-600">
            {filtered.length}{' '}
            {filtered.length === 1
              ? 'home'
              : 'homes'}{' '}
            across Germany

            {selectedCity && (
              <>
                {' '}in{' '}
                <strong className="font-semibold text-ink-900">
                  {selectedCity}
                </strong>
              </>
            )}
          </p>
        </div>

        {/* ===================================================
            DESKTOP SORT + MAP
        ==================================================== */}

        <div className="hidden shrink-0 items-center gap-2 sm:flex">

          {/* NEWEST FIRST */}

          <label className="relative">
            <ArrowUpDown
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-4 w-4
                -translate-y-1/2
                text-ink-400
              "
            />

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="
                input
                h-11
                w-[165px]
                appearance-none
                pl-9
                pr-8
                text-sm
              "
            >
              {SORT_OPTIONS.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>
          </label>

          {/* MAP */}

          <div
            className="
              inline-flex
              h-11
              items-center
              gap-2
              rounded-full
              border
              border-ink-200
              bg-white
              px-4
              text-sm
              font-bold
              text-ink-700
            "
          >
            <MapIcon className="h-4 w-4 text-brand-700" />
            Map
          </div>
        </div>
      </div>

      {/* =====================================================
          ACTIVE FILTER PILLS
      ====================================================== */}

      <div className="mt-3 flex flex-wrap items-center gap-2">

        {selectedCity && (
          <Pill
            label={selectedCity}
            onClear={() => {
              const nextParams =
                new URLSearchParams(params)

              nextParams.delete('city')

              setParams(
                nextParams,
                {
                  replace: true,
                },
              )

              setMapLocation(null)
            }}
          />
        )}

        {filters.type && (
          <Pill
            label={filters.type}
            onClear={() =>
              setFilters(
                (current) => ({
                  ...current,
                  type: '',
                }),
              )
            }
          />
        )}

        {filters.maxRent && (
          <Pill
            label={`Max €${filters.maxRent}`}
            onClear={() =>
              setFilters(
                (current) => ({
                  ...current,
                  maxRent: '',
                }),
              )
            }
          />
        )}

        {filters.bedrooms && (
          <Pill
            label={`${filters.bedrooms}+ bedrooms`}
            onClear={() =>
              setFilters(
                (current) => ({
                  ...current,
                  bedrooms: '',
                }),
              )
            }
          />
        )}

        {filters.furnished === 'yes' && (
          <Pill
            label="Furnished"
            onClear={() =>
              setFilters(
                (current) => ({
                  ...current,
                  furnished: '',
                }),
              )
            }
          />
        )}

        {filters.furnished === 'no' && (
          <Pill
            label="Unfurnished"
            onClear={() =>
              setFilters(
                (current) => ({
                  ...current,
                  furnished: '',
                }),
              )
            }
          />
        )}

        {filters.amenities?.map(
          (amenity) => (
            <Pill
              key={amenity}
              label={amenity}
              onClear={() =>
                setFilters(
                  (current) => ({
                    ...current,
                    amenities:
                      current.amenities.filter(
                        (a) =>
                          a !== amenity,
                      ),
                  }),
                )
              }
            />
          ),
        )}

        {filters.q && (
          <Pill
            label={`Search: ${filters.q}`}
            onClear={() =>
              setFilters(
                (current) => ({
                  ...current,
                  q: '',
                }),
              )
            }
          />
        )}

        {mapLocation && (
          <button
            type="button"
            onClick={clearMapLocation}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              bg-brand-50
              px-3
              py-1
              text-xs
              font-semibold
              text-brand-700
            "
          >
            <MapPin className="h-3 w-3" />
            Nearby location
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* =====================================================
          MOBILE SORT
      ====================================================== */}

      <div className="mt-3 flex justify-end sm:hidden">
        <label className="relative">
          <ArrowUpDown
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              h-4 w-4
              -translate-y-1/2
              text-ink-400
            "
          />

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            className="
              input
              h-10
              w-[155px]
              appearance-none
              pl-9
              pr-8
              text-sm
            "
          >
            {SORT_OPTIONS.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ),
            )}
          </select>
        </label>
      </div>

      {/* =====================================================
          MOBILE MAP
      ====================================================== */}

      {mapOpen && (
        <div className="mt-4 mb-5 lg:hidden">

          <div className="h-[65vh] min-h-[420px]">
            <PropertyMap
  properties={baseFiltered}
  selectedLocation={
    mapLocation
  }
  onLocationSelect={
    handleMapLocation
  }
  onViewportChange={
    handleMapViewport
  }
  radiusKm={
    MAP_RADIUS_KM
  }
/>
          </div>

          {mapLocation && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">

              <div>
                <p className="text-sm font-semibold text-brand-700">
                  {filtered.length}{' '}
                  {filtered.length === 1
                    ? 'property'
                    : 'properties'}{' '}
                  nearby
                </p>

                <p className="text-xs text-brand-600">
                  Within {MAP_RADIUS_KM} km
                </p>
              </div>

              <button
                type="button"
                onClick={
                  clearMapLocation
                }
                className="text-xs font-semibold text-brand-700"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="mt-5 lg:grid lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-6">

        {/* ===================================================
            PROPERTY LIST
        ==================================================== */}

        <div className="min-w-0">

          {loading ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">

              {Array.from({
                length: 4,
              }).map((_, index) => (
                <SkeletonCard
                  key={index}
                />
              ))}

            </div>
          ) : filtered.length === 0 ? (

            <EmptyState
              icon={
                mapLocation ? (
                  <MapIcon className="h-7 w-7" />
                ) : (
                  <Search className="h-7 w-7" />
                )
              }
              title={
                mapLocation
                  ? 'No available apartments here'
                  : selectedCity
                    ? `No available apartments in ${selectedCity}`
                    : 'No properties match your filters'
              }
              description={
                mapLocation
                  ? `No apartments within ${MAP_RADIUS_KM} km of this location match your current filters.`
                  : selectedCity
                    ? 'Try changing the filters or selecting another location.'
                    : 'Try widening your search or changing one of the filters.'
              }
              action={
                mapLocation ? (
                  <button
                    type="button"
                    onClick={
                      clearMapLocation
                    }
                    className="btn-primary"
                  >
                    Show all properties
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={
                      resetFilters
                    }
                    className="btn-primary"
                  >
                    Reset filters
                  </button>
                )
              }
            />

          ) : (

            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">

              {filtered.map(
                (
                  property,
                  index,
                ) => (
                  <PropertyCard
                    key={
                      property.id
                    }
                    property={
                      property
                    }
                    index={index}
                  />
                ),
              )}

            </div>
          )}

          <div className="mt-8">
            <DisclaimerBanner />
          </div>
        </div>

        {/* ===================================================
            DESKTOP MAP — ALWAYS VISIBLE
        ==================================================== */}

        <aside className="hidden lg:block">

          <div className="sticky top-24 h-[calc(100vh-120px)]">

            <PropertyMap
  properties={baseFiltered}
  selectedLocation={
    mapLocation
  }
  onLocationSelect={
    handleMapLocation
  }
  onViewportChange={
    handleMapViewport
  }
  radiusKm={
    MAP_RADIUS_KM
  }
/>

            {mapLocation && (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">

                <div>
                  <p className="text-sm font-semibold text-brand-700">
                    {filtered.length}{' '}
                    {filtered.length === 1
                      ? 'property'
                      : 'properties'}{' '}
                    nearby
                  </p>

                  <p className="text-xs text-brand-600">
                    Within {MAP_RADIUS_KM} km
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    clearMapLocation
                  }
                  className="text-xs font-semibold text-brand-700 hover:text-brand-900"
                >
                  Show all properties
                </button>

              </div>
            )}

          </div>
        </aside>
      </div>

      {/* =====================================================
          MOBILE FIXED MAP BUTTON
      ====================================================== */}

      <div className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 lg:hidden">

        <button
          type="button"
          onClick={() =>
            setMapOpen(
              (open) => !open,
            )
          }
          className="
            inline-flex
            min-w-[110px]
            items-center
            justify-center
            gap-2
            rounded-full
            bg-brand-700
            px-6
            py-3
            text-sm
            font-bold
            text-white
            shadow-cardHover
            transition
            hover:bg-brand-800
            active:scale-95
          "
        >
          {mapOpen ? (
            <ListIcon className="h-4 w-4" />
          ) : (
            <MapIcon className="h-4 w-4" />
          )}

          {mapOpen
            ? 'Show apartments'
            : 'Map'}
        </button>
      </div>
    </div>
  )
}

/* ============================================================
   HAVERSINE DISTANCE
============================================================ */

function distanceInKm(
  lat1,
  lng1,
  lat2,
  lng2,
) {
  const R = 6371

  const dLat =
    ((lat2 - lat1) * Math.PI) /
    180

  const dLng =
    ((lng2 - lng1) * Math.PI) /
    180

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(
      (lat1 * Math.PI) / 180,
    ) *
      Math.cos(
        (lat2 * Math.PI) / 180,
      ) *
      Math.sin(dLng / 2) ** 2

  return (
    2 *
    R *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    )
  )
}

/* ============================================================
   FILTER PILL
============================================================ */

function Pill({
  label,
  onClear,
}) {
  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        bg-brand-50
        px-3
        py-1
        text-xs
        font-medium
        text-brand-700
      "
    >
      {label}

      <button
        type="button"
        onClick={onClear}
        className="rounded-full hover:text-brand-900"
        aria-label={`Remove ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}
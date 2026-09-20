import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  MapPin,
  Home,
  Euro,
  SlidersHorizontal,
  Check,
  Users,
  CalendarDays,
} from 'lucide-react'

import {
  GERMAN_CITIES,
  PROPERTY_TYPES,
  AMENITY_LIST,
} from '../data/cities'

import { classNames } from '../utils/format'

export function FilterBar({
  filters,
  onChange,
  resultCount,
}) {
  const [open, setOpen] = useState(null)

  const update = (key, value) => {
    onChange({
      ...filters,
      [key]: value,
    })
  }

  const toggleAmenity = (amenity) => {
    const current = filters.amenities || []
    const exists = current.includes(amenity)

    const next = exists
      ? current.filter((a) => a !== amenity)
      : [...current, amenity]

    update('amenities', next)
  }

  const moreActive =
    Boolean(filters.bedrooms) ||
    Boolean(filters.furnished) ||
    Boolean(filters.roomsMin) ||
    Boolean(filters.roomsMax) ||
    Boolean(filters.personsMin) ||
    Boolean(filters.personsMax) ||
    Boolean(filters.anmeldung) ||
    Boolean(filters.squareMetersMin) ||
    Boolean(filters.squareMetersMax) ||
    Boolean(filters.internet) ||
    Boolean(filters.rentMin) ||
    Boolean(filters.rentMax) ||
    Boolean(filters.includingUtilities) ||
    Boolean(filters.rentalType) ||
    Boolean(filters.amenities?.length)

  return (
    <div className="relative z-40">
      <div
        className="no-scrollbar flex gap-2 overflow-x-auto pb-2"
        onScroll={() => {
          if (open) setOpen(null)
        }}
      >
        {/* CITY */}

        <FilterDropdown
          id="city"
          open={open === 'city'}
          setOpen={setOpen}
          label={filters.city || 'Any city'}
          icon={<MapPin className="h-4 w-4" />}
          active={Boolean(filters.city)}
        >
          <div className="max-h-72 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                update('city', '')
                setOpen(null)
              }}
              className={classNames(
                'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm',
                !filters.city
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-700 hover:bg-ink-50',
              )}
            >
              Any city
              {!filters.city && <Check className="h-4 w-4" />}
            </button>

            {GERMAN_CITIES.map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => {
                  update('city', city.name)
                  setOpen(null)
                }}
                className={classNames(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm',
                  filters.city === city.name
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-700 hover:bg-ink-50',
                )}
              >
                <span>{city.name}</span>
                {filters.city === city.name && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </FilterDropdown>

        {/* PROPERTY TYPE */}

        <FilterDropdown
          id="type"
          open={open === 'type'}
          setOpen={setOpen}
          label={filters.type || 'Property type'}
          icon={<Home className="h-4 w-4" />}
          active={Boolean(filters.type)}
        >
          <div className="grid grid-cols-2 gap-2">
            <OptionButton
              active={!filters.type}
              onClick={() => {
                update('type', '')
                setOpen(null)
              }}
            >
              All
            </OptionButton>

            {PROPERTY_TYPES.map((type) => (
              <OptionButton
                key={type}
                active={filters.type === type}
                onClick={() => {
                  update('type', type)
                  setOpen(null)
                }}
              >
                {type}
              </OptionButton>
            ))}
          </div>
        </FilterDropdown>

        {/* MAX RENT */}

        <FilterDropdown
          id="maxRent"
          open={open === 'maxRent'}
          setOpen={setOpen}
          label={
            filters.maxRent
              ? `€${filters.maxRent}`
              : 'Max rent'
          }
          icon={<Euro className="h-4 w-4" />}
          active={Boolean(filters.maxRent)}
        >
          <div className="w-64">
            <p className="mb-3 text-sm font-semibold text-ink-900">
              Maximum monthly rent
            </p>

            <input
              type="range"
              min="300"
              max="2500"
              step="50"
              value={filters.maxRent || 2500}
              onChange={(e) =>
                update('maxRent', e.target.value)
              }
              className="w-full accent-brand-600"
            />

            <div className="mt-2 flex justify-between text-xs text-ink-500">
              <span>€300</span>
              <span className="font-semibold text-brand-700">
                €{filters.maxRent || 2500}
              </span>
              <span>€2500+</span>
            </div>

            <button
              type="button"
              onClick={() => setOpen(null)}
              className="btn-primary mt-4 w-full"
            >
              Apply
            </button>
          </div>
        </FilterDropdown>

        {/* SHARING WITH */}

        <FilterDropdown
          id="sharingWith"
          open={open === 'sharingWith'}
          setOpen={setOpen}
          label={filters.sharingWith || 'Sharing with'}
          icon={<Users className="h-4 w-4" />}
          active={Boolean(filters.sharingWith)}
        >
          <div className="min-w-[220px]">
            {[
              ['', 'Any'],
              ['girls', 'Girls'],
              ['boys', 'Boys'],
            ].map(([value, label]) => (
              <button
                key={value || 'any'}
                type="button"
                onClick={() => {
                  update('sharingWith', value)
                  setOpen(null)
                }}
                className={classNames(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm',
                  filters.sharingWith === value
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-700 hover:bg-ink-50',
                )}
              >
                <span>{label}</span>
                {filters.sharingWith === value && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </FilterDropdown>

        {/* RENTAL TYPE */}

        <FilterDropdown
          id="rentalType"
          open={open === 'rentalType'}
          setOpen={setOpen}
          label={
            filters.rentalType
              ? filters.rentalType === 'rent'
                ? 'Rent'
                : 'Sublet'
              : 'Rental type'
          }
          icon={<Home className="h-4 w-4" />}
          active={Boolean(filters.rentalType)}
        >
          <div className="min-w-[220px]">
            {[
              ['', 'Any'],
              ['rent', 'Rent'],
              ['sublet', 'Sublet'],
            ].map(([value, label]) => (
              <button
                key={value || 'any'}
                type="button"
                onClick={() => {
                  update('rentalType', value)
                  setOpen(null)
                }}
                className={classNames(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm',
                  filters.rentalType === value
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-700 hover:bg-ink-50',
                )}
              >
                <span>{label}</span>

                {filters.rentalType === value && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </FilterDropdown>

        {/* MORE */}

        <FilterDropdown
          id="more"
          open={open === 'more'}
          setOpen={setOpen}
          label="More"
          icon={<SlidersHorizontal className="h-4 w-4" />}
          active={moreActive}
        >
          <div className="w-[340px] max-w-[calc(100vw-2rem)]">
            <div className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
              {/* BEDROOMS */}

              <MoreSection title="Bedrooms">
                <div className="flex flex-wrap gap-1.5">
                  {['', '1', '2', '3', '4'].map((value) => (
                    <OptionButton
                      key={value || 'any'}
                      active={filters.bedrooms === value}
                      onClick={() => update('bedrooms', value)}
                    >
                      {value ? `${value}+` : 'Any'}
                    </OptionButton>
                  ))}
                </div>
              </MoreSection>

              {/* FURNISHED */}

              <MoreSection title="Furnished">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    ['', 'Any'],
                    ['yes', 'Furnished'],
                    ['no', 'Unfurnished'],
                  ].map(([value, label]) => (
                    <OptionButton
                      key={value || 'any'}
                      active={filters.furnished === value}
                      onClick={() => update('furnished', value)}
                    >
                      {label}
                    </OptionButton>
                  ))}
                </div>
              </MoreSection>

              {/* NO. ROOMS */}

              <RangeFields
                title="No. rooms"
                minValue={filters.roomsMin}
                maxValue={filters.roomsMax}
                onMin={(value) => update('roomsMin', value)}
                onMax={(value) => update('roomsMax', value)}
              />

              {/* NO. PERSONS */}

              <RangeFields
                title="No. persons"
                minValue={filters.personsMin}
                maxValue={filters.personsMax}
                onMin={(value) => update('personsMin', value)}
                onMax={(value) => update('personsMax', value)}
              />

              {/* ANMELDUNG */}

              <ToggleOptions
                title="Anmeldung"
                value={filters.anmeldung}
                options={[
                  ['', 'Any'],
                  ['yes', 'Yes'],
                  ['no', 'No'],
                ]}
                onChange={(value) =>
                  update('anmeldung', value)
                }
              />

              {/* SQUARE METERS */}

              <RangeFields
                title="Square meters"
                minValue={filters.squareMetersMin}
                maxValue={filters.squareMetersMax}
                onMin={(value) =>
                  update('squareMetersMin', value)
                }
                onMax={(value) =>
                  update('squareMetersMax', value)
                }
              />

              {/* INTERNET */}

              <ToggleOptions
                title="Internet"
                value={filters.internet}
                options={[
                  ['', 'Any'],
                  ['yes', 'Yes'],
                  ['no', 'No'],
                ]}
                onChange={(value) =>
                  update('internet', value)
                }
              />

              {/* RENT */}

              <RangeFields
                title="Rent (€ / month)"
                minValue={filters.rentMin}
                maxValue={filters.rentMax}
                onMin={(value) => update('rentMin', value)}
                onMax={(value) => update('rentMax', value)}
                prefix="€"
              />

              {/* INCLUDING UTILITIES */}

              <ToggleOptions
                title="Including utilities"
                value={filters.includingUtilities}
                options={[
                  ['', 'Any'],
                  ['yes', 'Yes'],
                  ['no', 'No'],
                ]}
                onChange={(value) =>
                  update('includingUtilities', value)
                }
              />

              {/* RENTAL TIME */}

              <MoreSection title="Rental time">
                <div className="min-w-[220px]">
                  {[
                    ['', 'Any'],
                    ['1-3', '1–3 months'],
                    ['3-6', '3–6 months'],
                    ['6-12', '6–12 months'],
                    ['12+', '12+ months'],
                  ].map(([value, label]) => (
                    <button
                      key={value || 'any'}
                      type="button"
                      onClick={() => update('rentalTime', value)}
                      className={classNames(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm',
                        filters.rentalTime === value
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-ink-700 hover:bg-ink-50',
                      )}
                    >
                      <span>{label}</span>

                      {filters.rentalTime === value && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              </MoreSection>

              {/* AMENITIES */}

              <MoreSection title="Amenities">
                <div className="space-y-1">
                  {AMENITY_LIST.map((amenity) => {
                    const active = (
                      filters.amenities || []
                    ).includes(amenity)

                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() =>
                          toggleAmenity(amenity)
                        }
                        className={classNames(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs',
                          active
                            ? 'bg-brand-50 text-brand-700'
                            : 'text-ink-700 hover:bg-ink-50',
                        )}
                      >
                        <span
                          className={classNames(
                            'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                            active
                              ? 'border-brand-600 bg-brand-600 text-white'
                              : 'border-ink-300 bg-white',
                          )}
                        >
                          {active && (
                            <Check className="h-3 w-3" />
                          )}
                        </span>
                        {amenity}
                      </button>
                    )
                  })}
                </div>
              </MoreSection>
            </div>

            <button
              type="button"
              onClick={() => setOpen(null)}
              className="btn-primary mt-3 w-full"
            >
              Show {resultCount} results
            </button>
          </div>
        </FilterDropdown>
      </div>
    </div>
  )
}

function MoreSection({ title, children }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-ink-900">
        {title}
      </p>
      {children}
    </div>
  )
}

function RangeFields({
  title,
  minValue,
  maxValue,
  onMin,
  onMax,
  prefix = '',
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-ink-900">
        {title}
      </p>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          min="0"
          value={minValue || ''}
          onChange={(e) => onMin(e.target.value)}
          placeholder={`${prefix} Min`}
          className="input"
        />

        <input
          type="number"
          min="0"
          value={maxValue || ''}
          onChange={(e) => onMax(e.target.value)}
          placeholder={`${prefix} Max`}
          className="input"
        />
      </div>
    </div>
  )
}

function ToggleOptions({
  title,
  value,
  options,
  onChange,
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-ink-900">
        {title}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {options.map(([optionValue, label]) => (
          <button
            key={optionValue || 'any'}
            type="button"
            onClick={() => onChange(optionValue)}
            className={classNames(
              'rounded-lg border px-3 py-2 text-xs font-medium transition',
              value === optionValue
                ? 'border-brand-600 bg-brand-50 text-brand-700'
                : 'border-ink-200 bg-white text-ink-700 hover:bg-ink-50',
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ============================================================
   DROPDOWN
============================================================ */

function FilterDropdown({
  id,
  open,
  setOpen,
  label,
  icon,
  active,
  children,
}) {
  const wrapperRef = useRef(null)
  const buttonRef = useRef(null)

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  })

  const updatePosition = () => {
    if (!buttonRef.current) return

    const rect =
      buttonRef.current.getBoundingClientRect()

    const estimatedWidth = 340

    const left = Math.max(
      16,
      Math.min(
        rect.left,
        window.innerWidth -
          estimatedWidth -
          16,
      ),
    )

    setPosition({
      top: rect.bottom + 8,
      left,
    })
  }

  useEffect(() => {
    if (!open) return

    updatePosition()

    const onResize = () => updatePosition()
    const onScroll = () => updatePosition()

    const onMouseDown = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(null)
      }
    }

    window.addEventListener(
      'resize',
      onResize,
    )

    window.addEventListener(
      'scroll',
      onScroll,
      true,
    )

    document.addEventListener(
      'mousedown',
      onMouseDown,
    )

    return () => {
      window.removeEventListener(
        'resize',
        onResize,
      )

      window.removeEventListener(
        'scroll',
        onScroll,
        true,
      )

      document.removeEventListener(
        'mousedown',
        onMouseDown,
      )
    }
  }, [open, setOpen])

  return (
    <div
      ref={wrapperRef}
      className="shrink-0"
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setOpen(
            open ? null : id,
          )

          requestAnimationFrame(
            updatePosition,
          )
        }}
        className={classNames(
          'inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition',
          active
            ? 'border-brand-600 bg-brand-50 text-brand-700'
            : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50',
        )}
      >
        {icon}
        {label}

        <ChevronDown
          className={classNames(
            'h-4 w-4 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          className="
            fixed
            z-40
            rounded-2xl
            border
            border-ink-200
            bg-white
            p-3
            shadow-cardHover
          "
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

/* ============================================================
   OPTION BUTTON
============================================================ */

function OptionButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'rounded-lg px-3 py-2.5 text-left text-sm transition',
        active
          ? 'bg-brand-50 font-semibold text-brand-700'
          : 'text-ink-700 hover:bg-ink-50',
      )}
    >
      {children}
    </button>
  )
}

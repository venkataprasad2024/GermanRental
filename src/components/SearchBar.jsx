import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  MapPin,
  Home,
  Euro,
  ChevronDown,
  Check,
} from 'lucide-react'

import {
  GERMAN_CITIES,
  PROPERTY_TYPES,
} from '../data/cities'

import { classNames } from '../utils/format'

const MAX_RENT_OPTIONS = [
  'Up to €500',
  '€500 – €750',
  '€750 – €1,000',
  '€1,000 – €1,500',
  '€1,500 – €2,000',
  '€2,000+',
]

export function SearchBar({
  variant = 'hero',
  className = '',
  defaultValues = {},
}) {
  const [city, setCity] = useState(
    defaultValues.city || '',
  )

  const [type, setType] = useState(
    defaultValues.type || '',
  )

  const [maxRent, setMaxRent] = useState(
    defaultValues.maxRent || '',
  )

  const [openMenu, setOpenMenu] =
    useState(null)

  const navigate = useNavigate()

  const barRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        barRef.current &&
        !barRef.current.contains(event.target)
      ) {
        setOpenMenu(null)
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      )
    }
  }, [])

  const submit = (e) => {
    e.preventDefault()

    const params = new URLSearchParams()

    if (city) {
      params.set('city', city)
    }

    if (type) {
      params.set('type', type)
    }

    if (maxRent) {
      const rentValues = {
        'Up to €500': '500',
        '€500 – €750': '750',
        '€750 – €1,000': '1000',
        '€1,000 – €1,500': '1500',
        '€1,500 – €2,000': '2000',
        '€2,000+': '2000+',
      }

      params.set('maxRent', rentValues[maxRent])
    }

    const query = params.toString()

    navigate(
      query
        ? `/properties?${query}`
        : '/properties',
    )

    setOpenMenu(null)
  }

  const isHero = variant === 'hero'

  return (
    <form
      ref={barRef}
      onSubmit={submit}
      className={classNames(
        `
          relative
          z-[1000]
          w-full
          max-w-full
          min-w-0
          overflow-visible
          rounded-[20px]
          border
          border-white/55
          bg-white/25
          p-1.5
          shadow-[0_8px_28px_rgba(6,75,122,0.12)]
          backdrop-blur-xl
          transition-all
          duration-300
        `,
        `
          hover:bg-white/30
          hover:shadow-[0_10px_32px_rgba(6,75,122,0.15)]
        `,
        isHero && 'sm:rounded-full',
        className,
      )}
    >
      <div
        className="
          relative
          z-[1000]
          grid
          h-[52px]
          w-full
          min-w-0
          grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_42px]
          items-stretch
          overflow-visible
          rounded-[15px]
          bg-white/15
          backdrop-blur-md
          sm:flex
          sm:h-14
          sm:rounded-full
        "
      >
        {/* =====================================================
            CITY
        ====================================================== */}

        <DropdownField
          icon={
            <MapPin
              className="
                h-4
                w-4
                shrink-0
                text-[#064B7A]
                sm:h-[18px]
                sm:w-[18px]
              "
            />
          }
          label="City"
          value={city || 'Any city'}
          open={openMenu === 'city'}
          onToggle={() =>
            setOpenMenu(
              openMenu === 'city'
                ? null
                : 'city',
            )
          }
          options={GERMAN_CITIES.map(
            (c) => c.name,
          )}
          selected={city}
          onSelect={(value) => {
            setCity(value)
            setOpenMenu(null)
          }}
        />

        {/* =====================================================
            PROPERTY TYPE
        ====================================================== */}

        <DropdownField
          icon={
            <Home
              className="
                h-4
                w-4
                shrink-0
                text-[#064B7A]
                sm:h-[18px]
                sm:w-[18px]
              "
            />
          }
          label="Type"
          value={type || 'Any type'}
          open={openMenu === 'type'}
          onToggle={() =>
            setOpenMenu(
              openMenu === 'type'
                ? null
                : 'type',
            )
          }
          options={PROPERTY_TYPES}
          selected={type}
          onSelect={(value) => {
            setType(value)
            setOpenMenu(null)
          }}
        />

        {/* =====================================================
            MAX RENT
        ====================================================== */}

        <DropdownField
          icon={
            <Euro
              className="
                h-4
                w-4
                shrink-0
                text-[#064B7A]
                sm:h-[18px]
                sm:w-[18px]
              "
            />
          }
          label="Max rent"
          value={maxRent || 'Any'}
          open={openMenu === 'maxRent'}
          onToggle={() =>
            setOpenMenu(
              openMenu === 'maxRent'
                ? null
                : 'maxRent',
            )
          }
          options={MAX_RENT_OPTIONS}
          selected={maxRent}
          defaultOption="Any"
          onSelect={(value) => {
            setMaxRent(value)
            setOpenMenu(null)
          }}
        />

        {/* =====================================================
            SEARCH BUTTON
        ====================================================== */}

        <button
          type="submit"
          aria-label="Search"
          className="
            my-1
            mr-1
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-[13px]
            bg-gradient-to-br
            from-[#064B7A]
            to-[#003B63]
            text-white
            shadow-[0_5px_15px_rgba(6,75,122,0.24)]
            transition-all
            duration-200
            hover:brightness-110
            active:scale-95
            sm:my-1.5
            sm:mr-1.5
            sm:h-11
            sm:w-auto
            sm:min-w-[118px]
            sm:rounded-full
            sm:px-5
          "
        >
          <Search className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />

          <span
            className="
              ml-1.5
              hidden
              text-sm
              font-semibold
              sm:inline
            "
          >
            Search
          </span>
        </button>
      </div>
    </form>
  )
}

function DropdownField({
  icon,
  label,
  value,
  open,
  onToggle,
  options,
  selected,
  defaultOption = '',
  onSelect,
}) {
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!open || !dropdownRef.current) return

    const frame = requestAnimationFrame(() => {
      const dropdown = dropdownRef.current
      if (!dropdown) return

      const rect = dropdown.getBoundingClientRect()
      const topPadding = 20
      const bottomPadding = 24

      if (rect.bottom > window.innerHeight - bottomPadding) {
        window.scrollBy({
          top: rect.bottom - window.innerHeight + bottomPadding,
          behavior: 'smooth',
        })
      } else if (rect.top < topPadding) {
        window.scrollBy({
          top: rect.top - topPadding,
          behavior: 'smooth',
        })
      }
    })

    return () => cancelAnimationFrame(frame)
  }, [open])

  return (
    <div
      className="
        relative
        z-[1000]
        flex
        min-w-0
        flex-1
        border-r
        border-white/35
      "
    >
      {/* =====================================================
          DROPDOWN TRIGGER
      ====================================================== */}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={onToggle}
        className="
          relative
          z-[1000]
          flex
          h-full
          min-w-0
          w-full
          items-center
          gap-1
          px-1.5
          text-left
          transition-colors
          duration-200
          hover:bg-white/40
          sm:gap-2
          sm:px-3
        "
      >
        {icon}

        <span
          className="
            flex
            min-w-0
            flex-1
            flex-col
            justify-center
          "
        >
          <span
            className="
              truncate
              text-[7px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[#064B7A]/55
              sm:text-[10px]
            "
          >
            {label}
          </span>

          <span
            className="
              mt-0.5
              flex
              min-w-0
              items-center
              gap-1
            "
          >
            <span
              className="
                min-w-0
                truncate
                text-[10px]
                font-semibold
                text-[#102A43]
                sm:text-sm
              "
            >
              {value}
            </span>

            <ChevronDown
              className={classNames(
                `
                  h-3
                  w-3
                  shrink-0
                  text-[#064B7A]/45
                  transition-transform
                  duration-200
                  sm:h-3.5
                  sm:w-3.5
                `,
                open && 'rotate-180',
              )}
            />
          </span>
        </span>
      </button>

      {/* =====================================================
          DROPDOWN MENU
          
          Very high z-index + opaque background.
      ====================================================== */}

      {open && (
        <div
          ref={dropdownRef}
          role="listbox"
          className="
            absolute
            left-1/2
            top-[calc(100%+8px)]
            z-40
            isolate
            w-[160px]
            max-w-[calc(100vw-24px)]
            -translate-x-1/2
            sm:left-0
            sm:w-[240px]
            sm:translate-x-0
            overflow-hidden
            overflow-hidden
            rounded-2xl
            border
            border-white/70
            bg-white/100
            p-1.5
            backdrop-blur-sm
            shadow-[0_20px_50px_rgba(0,59,99,0.20)]
          "
        >
          {/* =================================================
              DEFAULT OPTION
          ================================================== */}

          <button
            type="button"
            role="option"
            aria-selected={!selected}
            onClick={() => onSelect('')}
            className={classNames(
              `
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                px-3
                py-2.5
                text-left
                text-sm
                font-medium
                transition-colors
              `,
              !selected
                ? 'bg-[#064B7A]/10 text-[#064B7A]'
                : 'text-[#102A43] hover:bg-[#F1F6FA]',
            )}
          >
            <span>
              {defaultOption || (label === 'City'
                ? 'Any city'
                : 'Any type')}
            </span>

            {!selected && (
              <Check className="h-4 w-4 text-[#064B7A]" />
            )}
          </button>

          <div className="my-1 h-px bg-[#064B7A]/10" />

          {/* =================================================
              OPTIONS
          ================================================== */}

          <div
            className="
              max-h-48
              overflow-y-auto
              overscroll-contain
              sm:max-h-56
            "
          >
            {options.map((option) => {
              const isSelected =
                option === selected

              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() =>
                    onSelect(option)
                  }
                  className={classNames(
                    `
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      transition-colors
                    `,
                    isSelected
                      ? 'bg-[#064B7A]/10 font-semibold text-[#064B7A]'
                      : 'font-medium text-[#102A43] hover:bg-[#F1F6FA]',
                  )}
                >
                  <span className="truncate">
                    {option}
                  </span>

                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-[#064B7A]" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
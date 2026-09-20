import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Plus,
  LogOut,
  Shield,
  Home,
  User,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import germanMitraLogo from '../assets/german-mitra-logo.png'
import { classNames } from '../utils/format'
import { GERMAN_CITIES } from '../data/cities'
import GermanMitraIcon from '../assets/Standaloneicon.png'

export function Navbar() {
  const {
    user,
    isAuthenticated,
    logout,
    isAdmin,
    isLandlord,
  } = useAuth()

  const { favorites } = useFavorites()

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const [location, setLocation] = useState('')
  const [showSuggestions, setShowSuggestions] =
    useState(false)

  const menuRef = useRef(null)
  const searchRef = useRef(null)

  const navigate = useNavigate()

  /*
   * =========================================================
   * NAVBAR SCROLL
   * =========================================================
   */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
    }

    onScroll()

    window.addEventListener(
      'scroll',
      onScroll,
      { passive: true },
    )

    return () =>
      window.removeEventListener(
        'scroll',
        onScroll,
      )
  }, [])

  /*
   * =========================================================
   * CLOSE PROFILE / APARTMENT MENUS
   * =========================================================
   */
  useEffect(() => {
    const onClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target,
        )
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      onClick,
    )

    return () =>
      document.removeEventListener(
        'mousedown',
        onClick,
      )
  }, [])

  /*
   * =========================================================
   * SEARCH OUTSIDE CLICK
   * =========================================================
   */
  useEffect(() => {
    const onClick = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target,
        )
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener(
      'mousedown',
      onClick,
    )

    return () =>
      document.removeEventListener(
        'mousedown',
        onClick,
      )
  }, [])

  /*
   * =========================================================
   * MOBILE SCROLL LOCK
   * =========================================================
   */
  useEffect(() => {
    document.body.style.overflow =
      mobileOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  /*
   * =========================================================
   * LOCATION SEARCH
   * =========================================================
   */
  const filteredCities = location.trim()
    ? GERMAN_CITIES.filter((city) => {
        const searchText =
          location.trim().toLowerCase()

        return (
          city.name
            .toLowerCase()
            .includes(searchText) ||
          city.state
            .toLowerCase()
            .includes(searchText)
        )
      }).slice(0, 6)
    : []

  const handleSearch = (event) => {
    event.preventDefault()

    const searchValue =
      location.trim()

    setShowSuggestions(false)

    navigate(
      searchValue
        ? `/properties?q=${encodeURIComponent(
            searchValue,
          )}`
        : '/properties',
    )
  }

  const handleSuggestionClick = (
    city,
  ) => {
    if (!city || !city.name) return

    setLocation(city.name)
    setShowSuggestions(false)

    navigate(
      `/properties?city=${encodeURIComponent(
        city.name,
      )}`,
    )
  }

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */
  const handleLogout = () => {
    logout()

    setMenuOpen(false)
    setApartmentsOpen(false)
    setMobileApartmentsOpen(false)
    setMobileOpen(false)

    // Refresh the application after logout
    window.location.reload()
  }

  const dashboardLink = isAdmin
    ? '/dashboard/admin'
    : isLandlord
      ? '/dashboard/landlord'
      : '/dashboard/tenant'

  return (
    <header
      className={classNames(
        'fixed left-0 right-0 top-0 z-50 w-full border-b transition-all duration-500 ease-smooth',
        scrolled
          ? 'border-brand-100/40 bg-gradient-to-b from-white/50 to-brand-50/50 shadow-glass backdrop-blur-xl'
          : 'border-brand-100/40 bg-gradient-to-b from-white/60 to-brand-50/60 backdrop-blur-xl',
      )}
    >
      {/* ==================================================
          TOP NAVBAR
      ================================================== */}

     <nav className="flex min-h-[72px] w-full items-center gap-4 px-4 sm:px-6 lg:px-8 2xl:px-10">

        {/* LOGO */}

        <Link
          to="/"
          aria-label="German Mitra home"
          className="shrink-0 transition-transform duration-300 ease-spring hover:scale-105"
        >
          <img
            src={germanMitraLogo}
            alt="German Mitra"
            className="hidden h-14 w-auto object-contain md:block"
          />

          <img
            src={GermanMitraIcon}
            alt="German Mitra"
            className="h-10 w-10 object-contain md:hidden"
          />
        </Link>

        {/* ===================================================
            DESKTOP SEARCH
        ==================================================== */}

        <div
          ref={searchRef}
          className="relative hidden min-w-0 flex-1 md:block md:max-w-[380px] lg:max-w-[400px]"
        >
          <form onSubmit={handleSearch}>
            <div className="flex h-12 w-full items-center overflow-hidden rounded-full border border-white/60 bg-white/60 shadow-soft backdrop-blur-md transition-all duration-300 ease-smooth focus-within:border-brand-300/70 focus-within:bg-white/90 focus-within:shadow-glass">

              <Search className="ml-4 h-4 w-4 shrink-0 text-ink-400" />

              <input
                id="navbar-location"
                type="text"
                value={location}
                onChange={(event) => {
                  const value =
                    event.target.value

                  setLocation(value)

                  setShowSuggestions(
                    value.trim().length >
                      0,
                  )
                }}
                onFocus={() => {
                  if (location.trim()) {
                    setShowSuggestions(true)
                  }
                }}
                placeholder="Search city or location"
                aria-label="Search city or location"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-ink-900 outline-none placeholder:text-ink-400"
              />

              <button
                type="submit"
                aria-label="Search"
                className="mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-brand transition-all duration-300 ease-spring hover:scale-105 hover:shadow-brandHover active:scale-95"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {showSuggestions &&
            location.trim() && (
              <SearchSuggestions
                cities={filteredCities}
                onSelect={
                  handleSuggestionClick
                }
              />
            )}
        </div>

        {/* ===================================================
            DESKTOP NAV
        ==================================================== */}

        <div className="ml-auto hidden items-center gap-1 md:flex">

          {/* HOME */}

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              classNames(
                'rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 ease-smooth',
                isActive
                  ? 'bg-brand-50 text-brand-700 shadow-sm'
                  : 'text-ink-900 hover:bg-brand-50/80 hover:text-brand-700',
              )
            }
          >
            Home
          </NavLink>

          {/* APARTMENTS */}

          <NavLink
            to="/properties"
            end
            className={({ isActive }) =>
              classNames(
                'rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 ease-smooth',
                isActive
                  ? 'bg-brand-50 text-brand-700 shadow-sm'
                  : 'text-ink-900 hover:bg-brand-50/80 hover:text-brand-700',
              )
            }
          >
            Apartments
          </NavLink>

          {/* LANDLORD */}

          <NavLink
            to="/dashboard/landlord"
            className={({ isActive }) =>
              classNames(
                'rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 ease-smooth',
                isActive
                  ? 'bg-brand-50 text-brand-700 shadow-sm'
                  : 'text-ink-900 hover:bg-brand-50/80 hover:text-brand-700',
              )
            }
          >
            For landlords
          </NavLink>

          {/* WISHLIST */}

          <Link
            to="/dashboard/tenant"
            aria-label="Wishlist"
            title="Wishlist"
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink-900 transition-all duration-300 ease-spring hover:scale-110 hover:bg-brand-50/80 hover:text-brand-700"
          >
            <Heart className="h-5 w-5" />

            {favorites.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1.5 text-[10px] font-bold text-white shadow-accent animate-glow-pulse">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* PROFILE */}

          {isAuthenticated ? (
            <div
              className="relative ml-2"
              ref={menuRef}
            >
              <button
                type="button"
                onClick={() =>
                  setMenuOpen(
                    (open) => !open,
                  )
                }
                className="flex items-center gap-2 rounded-full border border-white/60 bg-white/50 py-1 pl-1 pr-3 backdrop-blur-md transition-all duration-300 ease-smooth hover:border-brand-200 hover:bg-brand-50/80 hover:shadow-soft"
              >
                <img
                  src={user?.avatar || 'https://i.pravatar.cc/150?img=12'}
                  alt={user?.name || 'User'}
                  className="h-9 w-9 rounded-full object-cover"
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = 'https://i.pravatar.cc/150?img=12'
                  }}
                />

                <span className="max-w-24 truncate text-sm font-semibold text-ink-800">
                  {user.name.split(' ')[0]}
                </span>

                <ChevronDown
                  className={classNames(
                    'h-4 w-4 text-ink-500 transition-transform duration-300',
                    menuOpen &&
                      'rotate-180',
                  )}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-white/60 bg-white/80 py-2 shadow-glassHover backdrop-blur-xl animate-scale-in">

                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-ink-900">
                      {user.name}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-ink-500">
                      {user.email}
                    </p>
                  </div>

                  <div className="mx-3 h-px bg-ink-100/70" />

                  <MenuItem
                    to={dashboardLink}
                    icon={
                      <LayoutDashboard className="h-4 w-4" />
                    }
                    label="Dashboard"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                  />

                  <MenuItem
                    to="/dashboard/tenant"
                    icon={
                      <Heart className="h-4 w-4" />
                    }
                    label="Wishlist"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                  />

                  {isLandlord && (
                    <MenuItem
                      to="/dashboard/landlord/new"
                      icon={
                        <Plus className="h-4 w-4" />
                      }
                      label="Add property"
                      onClick={() =>
                        setMenuOpen(false)
                      }
                    />
                  )}

                  <div className="mx-3 my-1 h-px bg-ink-100/70" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-ink-700 transition-colors duration-200 hover:bg-brand-50/80 hover:text-brand-700"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 rounded-full border border-white/30 bg-gradient-to-r from-accent-400 to-accent-600 px-6 py-3 text-sm font-semibold text-white shadow-accent backdrop-blur-sm transition-all duration-300 ease-spring hover:scale-105 hover:shadow-accentHover active:scale-95"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* ===================================================
            MOBILE SEARCH
        ==================================================== */}

        <div
          ref={searchRef}
          className="relative min-w-0 flex-1 md:hidden"
        >
          <form onSubmit={handleSearch}>
            <div className="flex h-11 w-full items-center overflow-hidden rounded-full border border-white/60 bg-white/70 shadow-soft backdrop-blur-sm transition-all duration-300 focus-within:border-brand-300/70">

              <Search className="ml-3 h-4 w-4 shrink-0 text-ink-400" />

              <input
                type="text"
                value={location}
                onChange={(event) => {
                  const value =
                    event.target.value

                  setLocation(value)

                  setShowSuggestions(
                    value.trim().length >
                      0,
                  )
                }}
                onFocus={() => {
                  if (location.trim()) {
                    setShowSuggestions(true)
                  }
                }}
                placeholder="Search city"
                aria-label="Search city or location"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-ink-400"
              />

              <button
                type="submit"
                aria-label="Search"
                className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-brand transition-all duration-300 ease-spring active:scale-90"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          {showSuggestions &&
            location.trim() && (
              <SearchSuggestions
                cities={filteredCities}
                onSelect={
                  handleSuggestionClick
                }
                mobile
              />
            )}
        </div>

        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              (open) => !open,
            )
          }
          className="ml-1 inline-flex shrink-0 items-center justify-center rounded-full p-2.5 text-ink-800 transition-all duration-300 ease-spring hover:scale-110 hover:bg-brand-50/80 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      {mobileOpen && (
        <div className="border-t border-white/40 bg-white/80 backdrop-blur-xl md:hidden animate-fade-in">
          <div className="w-full space-y-1 px-4 py-4 sm:px-6 lg:px-8">

            {/* MOBILE HOME */}

            <MobileLink
              to="/"
              label="Home"
              end
              onClick={() =>
                setMobileOpen(false)
              }
            />

            {/* MOBILE APARTMENTS */}

            <MobileLink
              to="/properties"
              label="Apartments"
              end
              onClick={() =>
                setMobileOpen(false)
              }
            />

            <MobileLink
              to="/dashboard/landlord"
              label="For landlords"
              onClick={() =>
                setMobileOpen(false)
              }
            />

            {/* WISHLIST */}

            <Link
              to="/dashboard/tenant"
              onClick={() =>
                setMobileOpen(false)
              }
              aria-label="Wishlist"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-ink-800 transition-all duration-300 hover:bg-brand-50/80 hover:text-brand-700"
            >
              <Heart className="h-5 w-5" />

              <span>Wishlist</span>

              {favorites.length > 0 && (
                <span className="ml-auto rounded-full bg-accent-500 px-2 py-0.5 text-xs font-bold text-white shadow-accent">
                  {favorites.length}
                </span>
              )}
            </Link>

            <div className="my-3 h-px bg-ink-100/70" />

            {/* AUTH */}

            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardLink}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-ink-800 transition-all duration-300 hover:bg-brand-50/80 hover:text-brand-700"
                >
                  {isAdmin ? (
                    <Shield className="h-5 w-5" />
                  ) : isLandlord ? (
                    <Home className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}

                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-base font-semibold text-ink-800 transition-all duration-300 hover:bg-brand-50/80 hover:text-brand-700"
                >
                  <LogOut className="h-5 w-5" />
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="mt-2 block rounded-full bg-gradient-to-r from-accent-400 to-accent-600 px-6 py-3 text-center text-base font-semibold text-white shadow-accent transition-all duration-300 ease-spring active:scale-95"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

/* ============================================================
   APARTMENT MENU LINK
============================================================ */

function ApartmentMenuLink({
  to,
  label,
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="
        block
        rounded-xl
        px-4
        py-3
        text-sm
        font-semibold
        text-ink-700
        transition-all
        duration-200
        hover:bg-brand-50
        hover:text-brand-700
      "
    >
      {label}
    </Link>
  )
}

/* ============================================================
   SEARCH SUGGESTIONS
============================================================ */

function SearchSuggestions({
  cities,
  onSelect,
  mobile = false,
}) {
  return (
    <div
      className={classNames(
        'absolute left-0 right-0 top-full z-[60] mt-2 overflow-hidden rounded-2xl border border-white/60 bg-white/85 shadow-glassHover backdrop-blur-xl animate-scale-in',
        mobile && 'mx-5',
      )}
    >
      {cities.length > 0 ? (
        <div className="py-2">
          <p className="px-4 pb-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
            Locations
          </p>

          {cities.map((city) => (
            <button
              key={city.name}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault()
                onSelect(city)
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-brand-50/80"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <Search className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">
                  {city.name}
                </p>

                <p className="truncate text-xs text-ink-500">
                  {city.state}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-4 py-5 text-center">
          <p className="text-sm font-medium text-ink-700">
            No locations found
          </p>

          <p className="mt-1 text-xs text-ink-400">
            Try another city or location
          </p>
        </div>
      )}
    </div>
  )
}

/* ============================================================
   MENU ITEM
============================================================ */

function MenuItem({
  to,
  icon,
  label,
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 transition-colors duration-200 hover:bg-brand-50/80 hover:text-brand-700"
    >
      {icon}
      {label}
    </Link>
  )
}

/* ============================================================
   MOBILE LINK
============================================================ */

function MobileLink({
  to,
  label,
  onClick,
  end = false,
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        classNames(
          'block rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200',
          isActive
            ? 'bg-brand-50 text-brand-700 shadow-sm'
            : 'text-ink-800 hover:bg-brand-50/80 hover:text-brand-700',
        )
      }
    >
      {label}
    </NavLink>
  )
}
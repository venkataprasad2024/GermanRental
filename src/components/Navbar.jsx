import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { Logo } from './Logo'
import { classNames } from '../utils/format'

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

  const menuRef = useRef(null)
  const navigate = useNavigate()

  // --------------------------------------------------
  // Navbar scroll effect
  // --------------------------------------------------
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
    }

    onScroll()

    window.addEventListener('scroll', onScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // --------------------------------------------------
  // Close profile dropdown when clicking outside
  // --------------------------------------------------
  useEffect(() => {
    const onClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', onClick)

    return () => {
      document.removeEventListener('mousedown', onClick)
    }
  }, [])

  // --------------------------------------------------
  // Disable body scroll when mobile menu is open
  // --------------------------------------------------
  useEffect(() => {
    document.body.style.overflow = mobileOpen
      ? 'hidden'
      : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------
  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    setMobileOpen(false)
    navigate('/')
  }

  // --------------------------------------------------
  // Search
  // --------------------------------------------------
  const handleSearch = (e) => {
    e.preventDefault()

    const searchValue = location.trim()

    if (searchValue) {
      navigate(
        `/properties?location=${encodeURIComponent(
          searchValue
        )}`
      )
    } else {
      navigate('/properties')
    }
  }

  // --------------------------------------------------
  // Dashboard based on role
  // --------------------------------------------------
  const dashboardLink = isAdmin
    ? '/dashboard/admin'
    : isLandlord
      ? '/dashboard/landlord'
      : '/dashboard/tenant'

  return (
    <header
      className={classNames(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        scrolled
          ? 'border-ink-100 bg-white/95 shadow-soft backdrop-blur-md'
          : 'border-ink-100 bg-white'
      )}
    >
      {/* ==================================================
          TOP NAVBAR
      ================================================== */}
      <nav
        className="
          mx-auto flex
          min-h-[72px]
          w-full max-w-[1500px]
          items-center
          gap-4
          px-5
          lg:px-8
        "
      >
        {/* ==================================================
            LOGO
        ================================================== */}
        <Link
          to="/"
          aria-label="GermanMitra home"
          className="shrink-0"
        >
          <Logo />
        </Link>

        {/* ==================================================
            DESKTOP SEARCH
        ================================================== */}
        <form
          onSubmit={handleSearch}
          className="
            hidden
            min-w-0
            flex-1
            md:block
            md:max-w-[380px]
            lg:max-w-[400px]
          "
        >
          <div
            className="
              flex h-12
              w-full
              items-center
              overflow-hidden
              rounded-full
              border border-ink-200
              bg-white
              shadow-soft
              transition-all duration-200
              focus-within:border-brand-300
              focus-within:shadow-card
            "
          >
            <Search
              className="
                ml-4
                h-4 w-4
                shrink-0
                text-ink-400
              "
            />

            <input
              id="navbar-location"
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder="Search city or location"
              aria-label="Search city or location"
              className="
                min-w-0
                flex-1
                bg-transparent
                px-3
                text-sm
                font-medium
                text-ink-900
                outline-none
                placeholder:text-ink-400
              "
            />

            <button
              type="submit"
              aria-label="Search"
              className="
                mr-1
                flex h-10 w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-brand-600
                text-white
                transition
                hover:bg-brand-700
              "
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* ==================================================
            DESKTOP NAVIGATION
        ================================================== */}
        <div
          className="
            ml-auto
            hidden
            items-center
            gap-1
            md:flex
          "
        >
          {/* Apartments */}
          <Link
            to="/properties"
            className="
              rounded-full
              px-4 py-3
              text-sm
              font-semibold
              text-ink-900
              transition
              hover:bg-brand-50
              hover:text-brand-700
            "
          >
            Apartments
          </Link>

          {/* For landlords */}
          <Link
            to="/dashboard/landlord"
            className="
              rounded-full
              px-4 py-3
              text-sm
              font-semibold
              text-ink-900
              transition
              hover:bg-brand-50
              hover:text-brand-700
            "
          >
            For landlords
          </Link>

          {/* Wishlist - ICON ONLY */}
          <Link
            to="/dashboard/tenant"
            aria-label="Wishlist"
            title="Wishlist"
            className="
              relative
              flex
              h-11 w-11
              items-center
              justify-center
              rounded-full
              text-ink-900
              transition
              hover:bg-brand-50
              hover:text-brand-700
            "
          >
            <Heart className="h-5 w-5" />

            {favorites.length > 0 && (
              <span
                className="
                  absolute
                  -right-0.5
                  -top-0.5
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-brand-600
                  px-1.5
                  text-[10px]
                  font-bold
                  text-white
                "
              >
                {favorites.length}
              </span>
            )}
          </Link>

          {/* ==================================================
              AUTHENTICATED USER
          ================================================== */}
          {isAuthenticated ? (
            <div
              className="relative ml-2"
              ref={menuRef}
            >
              <button
                onClick={() =>
                  setMenuOpen((open) => !open)
                }
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border border-ink-200
                  bg-ink-50
                  py-1
                  pl-1
                  pr-3
                  transition
                  hover:border-brand-200
                  hover:bg-brand-50
                "
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="
                    h-9 w-9
                    rounded-full
                    object-cover
                  "
                />

                <span
                  className="
                    max-w-24
                    truncate
                    text-sm
                    font-semibold
                    text-ink-800
                  "
                >
                  {user.name.split(' ')[0]}
                </span>

                <ChevronDown
                  className="
                    h-4 w-4
                    text-ink-500
                  "
                />
              </button>

              {/* User Dropdown */}
              {menuOpen && (
                <div
                  className="
                    absolute
                    right-0
                    mt-3
                    w-60
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    py-2
                    shadow-cardHover
                    ring-1
                    ring-ink-100
                    animate-scale-in
                  "
                >
                  <div className="px-4 py-3">
                    <p
                      className="
                        text-sm
                        font-semibold
                        text-ink-900
                      "
                    >
                      {user.name}
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-xs
                        text-ink-500
                      "
                    >
                      {user.email}
                    </p>
                  </div>

                  <div className="mx-3 h-px bg-ink-100" />

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

                  <div className="mx-3 my-1 h-px bg-ink-100" />

                  <button
                    onClick={handleLogout}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4 py-2.5
                      text-sm
                      text-ink-700
                      transition
                      hover:bg-brand-50
                      hover:text-brand-700
                    "
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ==================================================
               SIGN IN
            ================================================== */
            <Link
              to="/login"
              className="
                ml-2
                rounded-full
                bg-ink-100
                px-6 py-3
                text-sm
                font-semibold
                text-ink-900
                transition
                hover:bg-brand-100
                hover:text-brand-800
              "
            >
              Sign in
            </Link>
          )}
        </div>

        {/* ==================================================
            MOBILE MENU BUTTON
        ================================================== */}
        <button
          onClick={() =>
            setMobileOpen((open) => !open)
          }
          className="
            ml-auto
            inline-flex
            items-center
            justify-center
            rounded-full
            p-2.5
            text-ink-800
            transition
            hover:bg-brand-50
            md:hidden
          "
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

      {/* ==================================================
          MOBILE / TABLET SEARCH
          Search remains visible on small screens
      ================================================== */}
      <div
        className="
          border-t
          border-ink-100
          bg-white
          px-5
          pb-3
          pt-2
          md:hidden
        "
      >
        <form onSubmit={handleSearch}>
          <div
            className="
              flex h-11
              w-full
              items-center
              overflow-hidden
              rounded-full
              border border-ink-200
              bg-white
              shadow-soft
              focus-within:border-brand-300
            "
          >
            <Search
              className="
                ml-4
                h-4 w-4
                shrink-0
                text-ink-400
              "
            />

            <input
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder="Search city or location"
              aria-label="Search city or location"
              className="
                min-w-0
                flex-1
                bg-transparent
                px-3
                text-sm
                outline-none
                placeholder:text-ink-400
              "
            />

            <button
              type="submit"
              aria-label="Search"
              className="
                mr-1
                flex h-9 w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-brand-600
                text-white
                transition
                hover:bg-brand-700
              "
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      {/* ==================================================
          MOBILE MENU
      ================================================== */}
      {mobileOpen && (
        <div
          className="
            border-t
            border-ink-100
            bg-white
            md:hidden
            animate-fade-in
          "
        >
          <div
            className="
              mx-auto
              max-w-[1500px]
              space-y-1
              px-5
              py-4
            "
          >
            {/* Apartments */}
            <MobileLink
              to="/properties"
              label="Apartments"
              onClick={() =>
                setMobileOpen(false)
              }
            />

            {/* For landlords */}
            <MobileLink
              to="/dashboard/landlord"
              label="For landlords"
              onClick={() =>
                setMobileOpen(false)
              }
            />

            {/* Wishlist ICON ONLY */}
            <Link
              to="/dashboard/tenant"
              onClick={() =>
                setMobileOpen(false)
              }
              aria-label="Wishlist"
              className="
                flex
                items-center
                gap-3
                rounded-xl
                px-4 py-3
                text-base
                font-semibold
                text-ink-800
                transition
                hover:bg-brand-50
                hover:text-brand-700
              "
            >
              <Heart className="h-5 w-5" />

              <span>Wishlist</span>

              {favorites.length > 0 && (
                <span
                  className="
                    ml-auto
                    rounded-full
                    bg-brand-600
                    px-2
                    py-0.5
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  {favorites.length}
                </span>
              )}
            </Link>

            <div className="my-3 h-px bg-ink-100" />

            {/* Authenticated mobile options */}
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardLink}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4 py-3
                    text-base
                    font-semibold
                    text-ink-800
                    transition
                    hover:bg-brand-50
                    hover:text-brand-700
                  "
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
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-4 py-3
                    text-left
                    text-base
                    font-semibold
                    text-ink-800
                    transition
                    hover:bg-brand-50
                    hover:text-brand-700
                  "
                >
                  <LogOut className="h-5 w-5" />

                  Sign out
                </button>
              </>
            ) : (
              /* Mobile Sign In */
              <Link
                to="/login"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="
                  mt-2
                  block
                  rounded-full
                  bg-ink-100
                  px-6 py-3
                  text-center
                  text-base
                  font-semibold
                  text-ink-900
                  transition
                  hover:bg-brand-100
                  hover:text-brand-800
                "
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


/* ==========================================================
   DESKTOP DROPDOWN ITEM
========================================================== */

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
      className="
        flex
        items-center
        gap-3
        px-4 py-2.5
        text-sm
        text-ink-700
        transition
        hover:bg-brand-50
        hover:text-brand-700
      "
    >
      {icon}
      {label}
    </Link>
  )
}


/* ==========================================================
   MOBILE NAVIGATION ITEM
========================================================== */

function MobileLink({
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
        px-4 py-3
        text-base
        font-semibold
        text-ink-800
        transition
        hover:bg-brand-50
        hover:text-brand-700
      "
    >
      {label}
    </Link>
  )
}
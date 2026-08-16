import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Home, LogOut, Menu, Shield, User, X, ChevronDown, LayoutDashboard, Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { Logo } from './Logo'
import { classNames } from '../utils/format'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/properties', label: 'Properties' },
  { to: '/#how-it-works', label: 'How it works' },
]

export function Navbar() {
  const { user, isAuthenticated, logout, isAdmin, isLandlord, isTenant } = useAuth()
  const { favorites } = useFavorites()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    setMobileOpen(false)
    navigate('/')
  }

  const dashboardLink = isAdmin
    ? '/dashboard/admin'
    : isLandlord
      ? '/dashboard/landlord'
      : '/dashboard/tenant'

  return (
    <header
      className={classNames(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/90 shadow-soft backdrop-blur-md ring-1 ring-ink-100'
          : 'bg-white/0',
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label="DeutschHome home" className="shrink-0">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                classNames(
                  'rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'text-brand-700'
                    : 'text-ink-700 hover:bg-ink-100 hover:text-ink-900',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/tenant"
            className="relative hidden rounded-lg p-2 text-ink-700 transition hover:bg-ink-100 hover:text-brand-700 sm:inline-flex"
            aria-label="Saved favorites"
          >
            <Heart className="h-5 w-5" />
            {favorites.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 ring-1 ring-ink-200 transition hover:bg-ink-50"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="max-w-24 truncate text-sm font-medium text-ink-800">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="h-4 w-4 text-ink-500" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl bg-white py-1 shadow-cardHover ring-1 ring-ink-100 animate-scale-in">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-ink-900">{user.name}</p>
                    <p className="truncate text-xs text-ink-500">{user.email}</p>
                  </div>
                  <div className="my-1 h-px bg-ink-100" />
                  <MenuItem to={dashboardLink} icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" onClick={() => setMenuOpen(false)} />
                  <MenuItem to="/dashboard/tenant" icon={<Heart className="h-4 w-4" />} label="Favorites" onClick={() => setMenuOpen(false)} />
                  {isLandlord && (
                    <MenuItem to="/dashboard/landlord/new" icon={<Plus className="h-4 w-4" />} label="Add property" onClick={() => setMenuOpen(false)} />
                  )}
                  <div className="my-1 h-px bg-ink-100" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink-700 transition hover:bg-ink-50"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="btn-ghost">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary">
                Get started
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-ink-700 hover:bg-ink-100 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden">
          <div className="container-page space-y-1 border-t border-ink-100 bg-white py-4 animate-fade-in">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-ink-800 hover:bg-ink-100"
              >
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-ink-100" />
            <Link
              to="/dashboard/tenant"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-ink-800 hover:bg-ink-100"
            >
              <Heart className="h-5 w-5" /> Favorites
              {favorites.length > 0 && (
                <span className="ml-auto rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardLink}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-ink-800 hover:bg-ink-100"
                >
                  {isAdmin ? <Shield className="h-5 w-5" /> : isLandlord ? <Home className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-base font-medium text-ink-800 hover:bg-ink-100"
                >
                  <LogOut className="h-5 w-5" /> Sign out
                </button>
              </>
            ) : (
              <div className="grid gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full">
                  Sign in
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function MenuItem({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-sm text-ink-700 transition hover:bg-ink-50"
    >
      {icon} {label}
    </Link>
  )
}

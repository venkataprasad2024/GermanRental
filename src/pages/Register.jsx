import { useState } from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  Mail,
  Lock,
  User,
  Home,
  Eye,
  EyeOff,
  UserPlus,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { GERMAN_CITIES } from '../data/cities'
import { AuthLayout } from './Login'
import { classNames } from '../utils/format'
import GoogleSignInButton from '../components/GoogleSignInButton'

const ROLES = [
  {
    value: 'tenant',
    label: 'Tenant',
    desc: 'Find and save homes',
  },
  {
    value: 'landlord',
    label: 'Landlord',
    desc: 'List your properties',
  },
]

export default function Register() {
  const { register } = useAuth()

  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] =
    useState({
      name: '',
      email: '',
      password: '',
      role: 'tenant',
      city: '',
    })

  const [showPw, setShowPw] =
    useState(false)

  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const set = (key) => (event) => {
    setForm((current) => ({
      ...current,
      [key]:
        event.target.value,
    }))
  }

  const submit = (event) => {
    event.preventDefault()

    setError('')

    if (form.password.length < 6) {
      setError(
        'Password must be at least 6 characters.',
      )
      return
    }

    setLoading(true)

    setTimeout(() => {
      const result = register(form)

      setLoading(false)

      if (!result.ok) {
        setError(result.error)
        toast.error(result.error)
        return
      }

      toast.success(
        `Welcome to DeutschHome, ${result.user.name.split(' ')[0]}!`,
      )

      navigate(
        result.user.role ===
          'landlord'
          ? '/dashboard/landlord'
          : '/dashboard/tenant',
      )
    }, 350)
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join DeutschHome to find, save and manage German rentals."
    >
      <div className="space-y-5">

        {/* GOOGLE SIGN-UP */}

        <GoogleSignInButton
          text="signup_with"
          role={form.role}
          city={form.city}
        />

        {/* DIVIDER */}

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-ink-100" />

          <span className="text-xs font-medium text-ink-400">
            Or create with email
          </span>

          <div className="h-px flex-1 bg-ink-100" />
        </div>

        <form
          onSubmit={submit}
          className="space-y-4"
        >
          {/* ERROR */}

          {error && (
            <div className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
              {error}
            </div>
          )}

          {/* ROLE */}

          <div>
            <label className="label">
              I am a
            </label>

            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() =>
                    setForm(
                      (current) => ({
                        ...current,
                        role: role.value,
                      }),
                    )
                  }
                  className={classNames(
                    'rounded-xl border p-3 text-left transition',
                    form.role ===
                      role.value
                      ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
                      : 'border-ink-200 bg-white hover:border-ink-300',
                  )}
                >
                  <p className="text-sm font-bold text-ink-900">
                    {role.label}
                  </p>

                  <p className="text-xs text-ink-500">
                    {role.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* NAME */}

          <div>
            <label className="label">
              Full name
            </label>

            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

              <input
                className="input pl-9"
                value={form.name}
                onChange={set('name')}
                placeholder="Your full name"
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* EMAIL */}

          <div>
            <label className="label">
              Email address
            </label>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

              <input
                type="email"
                className="input pl-9"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* PASSWORD + CITY */}

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="label">
                Password
              </label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

                <input
                  type={
                    showPw
                      ? 'text'
                      : 'password'
                  }
                  className="input px-9"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPw(
                      (value) => !value,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-700"
                  aria-label={
                    showPw
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="label">
                Preferred city
              </label>

              <div className="relative">
                <Home className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

                <select
                  className="input pl-9"
                  value={form.city}
                  onChange={set('city')}
                >
                  <option value="">
                    Any city
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

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              'Creating account…'
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Create account
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-ink-600">
          Already have an account?{' '}

          <Link
            to="/login"
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            Sign in
          </Link>
        </p>

      </div>
    </AuthLayout>
  )
}
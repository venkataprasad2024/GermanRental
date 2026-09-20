import { useState } from 'react'
import {
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  LogIn,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Logo } from '../components/Logo'
import appIcon from '../assets/german-mitra-app-icon.png'
import GoogleSignInButton from '../components/GoogleSignInButton'

export default function Login() {
  const { login } = useAuth()

  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] =
    useState('')

  const [showPw, setShowPw] =
    useState(false)

  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const redirectParam =
    new URLSearchParams(
      location.search,
    ).get('redirect')

  const getDestination = (user) => {
    if (redirectParam) {
      return redirectParam
    }

    if (location.state?.from) {
      return location.state.from
    }

    if (user.role === 'admin') {
      return '/dashboard/admin'
    }

    if (user.role === 'landlord') {
      return '/dashboard/landlord'
    }

    return '/dashboard/tenant'
  }

  const submit = (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    setTimeout(() => {
      const result = login({
        email,
        password,
      })

      setLoading(false)

      if (!result.ok) {
        setError(result.error)
        toast.error(result.error)
        return
      }

      toast.success(
        `Welcome back, ${result.user.name.split(' ')[0]}!`,
      )

      navigate(
        getDestination(result.user),
        {
          replace: true,
        },
      )
    }, 350)
  }

  const demoAccounts = [
    {
      label: 'Sandhya',
      email:
        'sandhya@germanmitra.com',
      password: 'sandhya@5566',
    },
    {
      label: 'Prasad',
      email:
        'prasad@germanmitra.com',
      password: 'prasad@5566',
    },
    {
      label: 'Raghava',
      email:
        'raghava@germanmitra.com',
      password: 'raghava@5566',
    },
    {
      label: 'Admin',
      email:
        'admin@GermanMitra.de',
      password: 'admin123',
    },
    {
      label: 'Landlord',
      email:
        'landlord@GermanMitra.de',
      password: 'landlord123',
    },
    {
      label: 'Tenant',
      email:
        'tenant@GermanMitra.de',
      password: 'tenant123',
    },
  ]

  const quickFill = (account) => {
    setEmail(account.email)
    setPassword(account.password)
    setError('')
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your saved homes and inquiries."
    >
      <div className="space-y-5">

        {/* GOOGLE */}

        <GoogleSignInButton
          text="continue_with"
          role="tenant"
        />

        {/* DIVIDER */}

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-ink-100" />

          <span className="text-xs font-medium text-ink-400">
            Or continue with email
          </span>

          <div className="h-px flex-1 bg-ink-100" />
        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <form
          onSubmit={submit}
          className="space-y-4"
        >
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
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div>
            <div className="flex items-center justify-between">
              <label className="label">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-brand-700 hover:text-brand-800"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

              <input
                type={
                  showPw
                    ? 'text'
                    : 'password'
                }
                className="input px-9"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
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

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              'Signing in…'
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign in
              </>
            )}
          </button>
        </form>

        {/* DEMO ACCOUNTS */}

        <div className="rounded-xl bg-ink-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Demo accounts
            </p>

            <span className="text-[11px] text-ink-400">
              Click to fill
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {demoAccounts.map(
              (account) => (
                <DemoButton
                  key={account.email}
                  label={account.label}
                  onClick={() =>
                    quickFill(account)
                  }
                />
              ),
            )}
          </div>
        </div>

        <p className="text-center text-sm text-ink-600">
          New to German Mitra?{' '}

          <Link
            to="/register"
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            Create an account{' '}
            <ArrowRight className="inline h-3.5 w-3.5" />
          </Link>
        </p>

      </div>
    </AuthLayout>
  )
}

function DemoButton({
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-ink-700 ring-1 ring-ink-200 transition hover:bg-brand-50 hover:text-brand-700 hover:ring-brand-300"
    >
      {label}
    </button>
  )
}

export function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="container-page py-10 lg:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl shadow-card ring-1 ring-ink-100 lg:grid-cols-2">

        <div className="hidden bg-gradient-to-br from-brand-600 to-brand-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <span className="inline-flex items-center gap-2">
            <img
              src={appIcon}
              alt="German Mitra"
              className="h-9 w-9 object-contain"
            />
            <span className="text-lg font-extrabold tracking-tight text-white">
              GermanMitra
            </span>
          </span>

          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-balance">
              Your German home is one search away.
            </h2>

            <ul className="mt-6 space-y-3 text-sm text-brand-100">
              {[
                'Save favorite homes',
                'Track inquiries to landlords',
                'List your property as a landlord',
                'Manage everything in one dashboard',
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
                    ✓
                  </span>

                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-brand-200">
            Demo prototype · All data is fictional
          </p>
        </div>

        <div className="bg-white p-6 sm:p-10">
          <div className="lg:hidden">
            <span className="inline-flex items-center gap-2">
              <img
                src={appIcon}
                alt="German Mitra"
                className="h-9 w-9 object-contain"
              />
              <span className="text-lg font-extrabold tracking-tight text-ink-900">
                German<span className="text-brand-600">Mitra</span>
              </span>
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-900 lg:mt-0">
            {title}
          </h1>

          <p className="mt-1.5 text-sm text-ink-600">
            {subtitle}
          </p>

          <div className="mt-6">
            {children}
          </div>
        </div>

      </div>
    </div>
  )
}
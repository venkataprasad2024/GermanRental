import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Logo } from '../components/Logo'

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const res = login({ email, password })
      setLoading(false)
      if (!res.ok) {
        setError(res.error)
        toast.error(res.error)
        return
      }
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`)
      const dest = location.state?.from || (
        res.user.role === 'admin' ? '/dashboard/admin'
          : res.user.role === 'landlord' ? '/dashboard/landlord'
            : '/dashboard/tenant'
      )
      navigate(dest)
    }, 500)
  }

  const quickFill = (role) => {
    const creds = {
      admin: { email: 'admin@deutschhome.de', password: 'admin123' },
      landlord: { email: 'landlord@deutschhome.de', password: 'landlord123' },
      tenant: { email: 'tenant@deutschhome.de', password: 'tenant123' },
    }
    setEmail(creds[role].email)
    setPassword(creds[role].password)
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your saved homes and inquiries.">
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200">{error}</div>
        )}
        <div>
          <label className="label">Email address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input type="email" className="input pl-9" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label">Password</label>
            <Link to="/forgot-password" className="text-xs font-semibold text-brand-700 hover:text-brand-800">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input type={showPw ? 'text' : 'password'} className="input px-9" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
            <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-700" aria-label={showPw ? 'Hide password' : 'Show password'}>
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Signing in…' : (<><LogIn className="h-4 w-4" /> Sign in</>)}
        </button>
      </form>

      <div className="mt-6 rounded-xl bg-ink-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Demo accounts</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <DemoButton label="Tenant" onClick={() => quickFill('tenant')} />
          <DemoButton label="Landlord" onClick={() => quickFill('landlord')} />
          <DemoButton label="Admin" onClick={() => quickFill('admin')} />
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-ink-600">
        New to DeutschHome?{' '}
        <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-800">
          Create an account <ArrowRight className="inline h-3.5 w-3.5" />
        </Link>
      </p>
    </AuthLayout>
  )
}

function DemoButton({ label, onClick }) {
  return (
    <button type="button" onClick={onClick} className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-ink-700 ring-1 ring-ink-200 transition hover:bg-brand-50 hover:text-brand-700 hover:ring-brand-300">
      {label}
    </button>
  )
}

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="container-page py-10 lg:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl shadow-card ring-1 ring-ink-100 lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-brand-600 to-brand-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <Logo className="[&_span:last-child]:text-white [&_.text-brand-600]:text-white" />
          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-balance">Your German home is one search away.</h2>
            <ul className="mt-6 space-y-3 text-sm text-brand-100">
              {['Save favorite homes', 'Track inquiries to landlords', 'List your property as a landlord', 'Manage everything in one dashboard'].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-brand-200">Demo prototype · All data is fictional</p>
        </div>
        <div className="bg-white p-6 sm:p-10">
          <div className="lg:hidden"><Logo /></div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-900 lg:mt-0">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-600">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

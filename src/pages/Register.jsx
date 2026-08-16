import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Home, Eye, EyeOff, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { GERMAN_CITIES } from '../data/cities'
import { AuthLayout } from './Login'
import { classNames } from '../utils/format'

const ROLES = [
  { value: 'tenant', label: 'Tenant', desc: 'Find and save homes' },
  { value: 'landlord', label: 'Landlord', desc: 'List your properties' },
]

export default function Register() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'tenant', city: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const res = register(form)
      setLoading(false)
      if (!res.ok) {
        setError(res.error)
        toast.error(res.error)
        return
      }
      toast.success(`Welcome to DeutschHome, ${res.user.name.split(' ')[0]}!`)
      navigate(res.user.role === 'landlord' ? '/dashboard/landlord' : '/dashboard/tenant')
    }, 500)
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join DeutschHome to find, save and manage German rentals.">
      <form onSubmit={submit} className="space-y-4">
        {error && <div className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
        <div>
          <label className="label">I am a</label>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <button key={r.value} type="button" onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                className={classNames('rounded-xl border p-3 text-left transition', form.role === r.value ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600' : 'border-ink-200 bg-white hover:border-ink-300')}>
                <p className="text-sm font-bold text-ink-900">{r.label}</p>
                <p className="text-xs text-ink-500">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Full name</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input pl-9" value={form.name} onChange={set('name')} placeholder="Your full name" required />
          </div>
        </div>
        <div>
          <label className="label">Email address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input type="email" className="input pl-9" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input type={showPw ? 'text' : 'password'} className="input px-9" value={form.password} onChange={set('password')} placeholder="Min. 6 characters" required />
              <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-700" aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="label">Preferred city</label>
            <div className="relative">
              <Home className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <select className="input pl-9" value={form.city} onChange={set('city')}>
                <option value="">Any city</option>
                {GERMAN_CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account…' : (<><UserPlus className="h-4 w-4" /> Create account</>)}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">Sign in</Link>
      </p>
    </AuthLayout>
  )
}

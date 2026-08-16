import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, MailCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { AuthLayout } from './Login'

export default function ForgotPassword() {
  const { requestReset } = useAuth()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const res = requestReset({ email })
      setLoading(false)
      if (!res.ok) {
        setError(res.error)
        toast.error(res.error)
        return
      }
      setSent(true)
      toast.success('Reset link sent. Check your inbox (demo).')
    }, 500)
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and we'll send you a reset link.">
      {sent ? (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <MailCheck className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-ink-900">Check your email</h2>
          <p className="mt-2 text-sm text-ink-600">
            If an account exists for <strong className="text-ink-900">{email}</strong>, a reset link is on its way. (This is a demo — no actual email is sent.)
          </p>
          <Link to="/login" className="btn-primary mt-6 w-full"><ArrowLeft className="h-4 w-4" /> Back to sign in</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
          <div>
            <label className="label">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input type="email" className="input pl-9" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending…' : 'Send reset link'}</button>
          <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </form>
      )}
    </AuthLayout>
  )
}

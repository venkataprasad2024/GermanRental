import { Link, useLocation, Navigate } from 'react-router-dom'
import { classNames } from '../utils/format'

export function DashboardLayout({ nav, title, subtitle, actions, children, requiredRole, user, isRole }) {
  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && !isRole) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Access denied</h1>
        <p className="mt-2 text-ink-600">This dashboard is for {requiredRole} accounts only.</p>
        <Link to="/" className="btn-primary mt-6">Back home</Link>
      </div>
    )
  }

  return (
    <div className="container-page py-8 lg:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-ink-600">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="sticky top-20 space-y-1">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={classNames(
                  'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  item.active
                    ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-100'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
                )}
              >
                {item.icon} {item.label}
              </a>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 space-y-10">{children}</div>
      </div>
    </div>
  )
}

export function StatCard({ icon, label, value, tone = 'brand' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    ink: 'bg-ink-100 text-ink-600',
    red: 'bg-red-50 text-red-600',
  }
  return (
    <div className="card p-5">
      <div className={classNames('flex h-10 w-10 items-center justify-center rounded-xl', tones[tone])}>
        {icon}
      </div>
      <p className="mt-3 text-2xl font-extrabold text-ink-900">{value}</p>
      <p className="text-xs text-ink-500">{label}</p>
    </div>
  )
}

export function Panel({ id, title, icon, action, children, empty }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
          {icon} {title}
        </h2>
        {action}
      </div>
      {empty ? empty : children}
    </section>
  )
}

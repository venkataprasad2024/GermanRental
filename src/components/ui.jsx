import { classNames } from '../utils/format'

export function EmptyState({ icon, title, description, action, className = '' }) {
  return (
    <div className={classNames('flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-14 text-center', className)}>
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-ink-400 ring-1 ring-ink-100">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-ink-900">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="flex gap-3 pt-2">
          <div className="skeleton h-3 w-12 rounded" />
          <div className="skeleton h-3 w-12 rounded" />
          <div className="skeleton h-3 w-12 rounded" />
        </div>
        <div className="skeleton h-6 w-24 rounded pt-2" />
      </div>
    </div>
  )
}

export function SectionHeader({ eyebrow, title, description, align = 'left', action }) {
  return (
    <div className={classNames('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', align === 'center' && 'sm:flex-col sm:items-center text-center')}>
      <div className={classNames('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl text-balance">
          {title}
        </h2>
        {description && <p className="mt-3 text-base leading-relaxed text-ink-600">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function DisclaimerBanner({ className = '' }) {
  return (
    <div className={classNames('rounded-2xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900 ring-1 ring-amber-200', className)}>
      <strong className="font-semibold">Demo notice:</strong> All listings, landlords and
      documents are fictional. Always independently verify landlords, rental documents and
      conditions before paying any deposit or signing a contract.
    </div>
  )
}

export function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="text-lg font-extrabold tracking-tight text-ink-900">
        Deutsch<span className="text-brand-600">Home</span>
      </span>
    </span>
  )
}

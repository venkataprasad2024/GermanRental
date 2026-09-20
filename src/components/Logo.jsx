import standaloneIcon from '../assets/Standaloneicon.png'

export function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white shadow-soft">
        <img
          src={standaloneIcon}
          alt="German Mitra"
          className="h-9 w-9 object-contain"
        />
      </span>

      <span className="text-lg font-extrabold tracking-tight text-ink-900">
        German<span className="text-brand-600">Mitra</span>
      </span>
    </span>
  )
}
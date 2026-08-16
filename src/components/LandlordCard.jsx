import { Phone, Mail, BadgeCheck, Clock, Star, Building2 } from 'lucide-react'

export function LandlordCard({ landlord }) {
  return (
    <div className="card p-5">
      <div className="flex items-start gap-4">
        <img
          src={landlord.avatar}
          alt={landlord.name}
          className="h-16 w-16 rounded-2xl object-cover ring-1 ring-ink-100"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-ink-900">{landlord.name}</h3>
            {landlord.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            )}
          </div>
          <p className="text-sm text-ink-600">{landlord.role}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-ink-500">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {landlord.rating}
            </span>
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" /> {landlord.listings} listings
            </span>
            <span>Since {landlord.since}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-ink-50 p-3 text-sm">
        <p className="flex items-center gap-2 text-ink-700">
          <Clock className="h-4 w-4 text-ink-400" /> {landlord.responseTime}
        </p>
        <p className="flex items-center gap-2 text-ink-700">
          <Phone className="h-4 w-4 text-ink-400" /> {landlord.phone}
        </p>
        <p className="flex items-center gap-2 text-ink-700">
          <Mail className="h-4 w-4 text-ink-400" /> {landlord.email}
        </p>
      </div>
    </div>
  )
}

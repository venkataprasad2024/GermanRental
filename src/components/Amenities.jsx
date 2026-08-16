import {
  Wifi, WashingMachine, UtensilsCrossed, Flame, DoorOpen, ArrowUpFromLine,
  Car, Sofa, CookingPot, Bike, Boxes, Trees, Check,
} from 'lucide-react'

const ICONS = {
  WiFi: Wifi,
  'Washing Machine': WashingMachine,
  Dishwasher: UtensilsCrossed,
  Heating: Flame,
  Balcony: DoorOpen,
  Elevator: ArrowUpFromLine,
  Parking: Car,
  Furnished: Sofa,
  Kitchen: CookingPot,
  'Bicycle Storage': Bike,
  Cellar: Boxes,
  'Garden Access': Trees,
}

export function Amenities({ amenities, className = '' }) {
  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${className}`}>
      {amenities.map((a) => {
        const Icon = ICONS[a] || Check
        return (
          <div
            key={a}
            className="flex items-center gap-2.5 rounded-xl bg-ink-50 px-3 py-2.5 text-sm font-medium text-ink-700"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-600 ring-1 ring-ink-100">
              <Icon className="h-4 w-4" />
            </span>
            {a}
          </div>
        )
      })}
    </div>
  )
}

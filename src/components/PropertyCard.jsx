import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bath, BedDouble, Heart, MapPin, Maximize, Eye } from 'lucide-react'
import { formatEUR } from '../utils/format'
import { useFavorites } from '../context/FavoritesContext'
import { classNames } from '../utils/format'

export function PropertyCard({ property, index = 0 }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const [imgLoaded, setImgLoaded] = useState(false)
  const fav = isFavorite(property.id)

  return (
    <article
      className="group card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <Link to={`/properties/${property.id}`} className="relative block overflow-hidden">
        <div className="aspect-[4/3] w-full bg-ink-100">
          {!imgLoaded && <div className="skeleton h-full w-full" />}
          <img
            src={property.images[0]}
            alt={property.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={classNames(
              'h-full w-full object-cover transition-all duration-500 group-hover:scale-105',
              imgLoaded ? 'opacity-100' : 'opacity-0',
            )}
          />
        </div>

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="chip bg-white/95 text-brand-700 shadow-soft backdrop-blur">
            {property.type}
          </span>
          {property.furnished && (
            <span className="chip bg-brand-600/95 text-white shadow-soft backdrop-blur">
              Furnished
            </span>
          )}
          {property.status === 'pending' && (
            <span className="chip bg-amber-500/95 text-white shadow-soft backdrop-blur">
              Pending review
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-ink-950/60 px-2 py-1 text-xs font-medium text-white backdrop-blur">
          <Eye className="h-3.5 w-3.5" /> {property.views || 0}
        </div>
      </Link>

      <button
        onClick={() => toggleFavorite(property.id)}
        className={classNames(
          'absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-soft backdrop-blur transition hover:scale-110',
          fav ? 'text-brand-600' : 'text-ink-400 hover:text-brand-600',
        )}
        aria-label={fav ? 'Remove from favorites' : 'Save to favorites'}
        style={{ marginTop: '0px' }}
      >
        <Heart className={classNames('h-5 w-5', fav && 'fill-current')} />
      </button>

      <Link to={`/properties/${property.id}`} className="block p-4">
        <div className="flex items-center gap-1 text-xs font-medium text-ink-500">
          <MapPin className="h-3.5 w-3.5" />
          {property.district}, {property.city}
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-base font-bold leading-snug text-ink-900 transition group-hover:text-brand-700">
          {property.title}
        </h3>

        <div className="mt-3 flex items-center gap-4 text-sm text-ink-600">
          <span className="inline-flex items-center gap-1">
            <BedDouble className="h-4 w-4 text-ink-400" /> {property.bedrooms}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath className="h-4 w-4 text-ink-400" /> {property.bathrooms}
          </span>
          <span className="inline-flex items-center gap-1">
            <Maximize className="h-4 w-4 text-ink-400" /> {property.area} m²
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-ink-100 pt-3">
          <div>
            <p className="text-lg font-extrabold text-ink-900">
              {formatEUR(property.rent)}
              <span className="text-xs font-medium text-ink-500"> /month</span>
            </p>
            <p className="text-xs text-ink-500">+ {formatEUR(property.utilities)} utilities</p>
          </div>
          <span className="text-xs font-semibold text-brand-700 transition group-hover:translate-x-0.5">
            Details →
          </span>
        </div>
      </Link>
    </article>
  )
}

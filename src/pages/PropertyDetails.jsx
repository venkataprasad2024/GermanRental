import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Bath, BedDouble, Maximize, MapPin, CalendarDays, Heart, Share2,
  Check, FileText, Download, ShieldCheck, Home, Clock, Euro, AlertCircle,
  Send, ChevronRight,
} from 'lucide-react'
import { PropertyGallery } from '../components/PropertyGallery'
import { Amenities } from '../components/Amenities'
import { LandlordCard } from '../components/LandlordCard'
import { Modal } from '../components/Modal'
import { EmptyState, DisclaimerBanner } from '../components/ui'
import { useListings } from '../context/ListingsContext'
import { useFavorites } from '../context/FavoritesContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { formatEUR, formatDate, classNames } from '../utils/format'

export default function PropertyDetails() {
  const { id } = useParams()
  const { getProperty, incrementViews, addInquiry, listings } = useListings()
  const { isFavorite, toggleFavorite, trackRecent } = useFavorites()
  const { isAuthenticated, user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const property = getProperty(id)
  const [loaded, setLoaded] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '', moveDate: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoaded(false)
    const t = setTimeout(() => setLoaded(true), 200)
    return () => clearTimeout(t)
  }, [id])

  useEffect(() => {
    if (property) {
      trackRecent(property.id)
      incrementViews(property.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!loaded) {
    return (
      <div className="container-page py-10">
        <div className="skeleton aspect-[16/10] w-full rounded-3xl" />
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="skeleton h-8 w-2/3 rounded" />
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="skeleton h-40 w-full rounded-2xl" />
          </div>
          <div className="skeleton h-64 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container-page py-20">
        <EmptyState
          icon={<AlertCircle className="h-7 w-7" />}
          title="Property not found"
          description="This listing may have been removed or is no longer available."
          action={<Link to="/properties" className="btn-primary">Back to all properties</Link>}
        />
      </div>
    )
  }

  const fav = isFavorite(property.id)
  const related = listings
    .filter((p) => p.status === 'approved' && p.city === property.city && p.id !== property.id)
    .slice(0, 3)

  const handleInquiry = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      addInquiry({
        propertyId: property.id,
        propertyTitle: property.title,
        tenantName: form.name || (user?.name ?? 'Guest'),
        tenantEmail: form.email || (user?.email ?? ''),
        message: form.message,
        moveDate: form.moveDate,
      })
      setSubmitting(false)
      setInquiryOpen(false)
      setForm({ name: '', email: '', message: '', moveDate: '' })
      toast.success('Inquiry sent to the landlord. They will be in touch.')
    }, 600)
  }

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: property.title, url: window.location.href }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  return (
    <div className="container-page py-6 lg:py-8">
      <nav className="flex items-center gap-1.5 text-xs text-ink-500">
        <Link to="/" className="hover:text-brand-700">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/properties" className="hover:text-brand-700">Properties</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/properties?city=${property.city}`} className="hover:text-brand-700">{property.city}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-ink-700">{property.district}</span>
      </nav>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-brand-50 text-brand-700">{property.type}</span>
            {property.furnished && <span className="chip bg-emerald-50 text-emerald-700">Furnished</span>}
            <span className="chip bg-ink-100 text-ink-700">
              <Clock className="h-3.5 w-3.5" /> Available {formatDate(property.available)}
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl text-balance">
            {property.title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-600">
            <MapPin className="h-4 w-4 text-brand-600" /> {property.address}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={share} className="btn-secondary">
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button
            onClick={() => {
              toggleFavorite(property.id)
              toast[fav ? 'info' : 'success'](fav ? 'Removed from favorites' : 'Saved to favorites')
            }}
            className={classNames('btn-secondary', fav && 'border-brand-300 bg-brand-50 text-brand-700 hover:bg-brand-100')}
          >
            <Heart className={classNames('h-4 w-4', fav && 'fill-current')} /> {fav ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PropertyGallery images={property.images} alt={property.title} />

          {/* Quick stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={<BedDouble className="h-5 w-5" />} value={property.bedrooms} label="Bedrooms" />
            <Stat icon={<Bath className="h-5 w-5" />} value={property.bathrooms} label="Bathrooms" />
            <Stat icon={<Maximize className="h-5 w-5" />} value={`${property.area} m²`} label="Area" />
            <Stat icon={<CalendarDays className="h-5 w-5" />} value={`${property.minimumStay} mo`} label="Min. stay" />
          </div>

          {/* Description */}
          <Section title="About this home">
            <p className="text-sm leading-relaxed text-ink-700">{property.description}</p>
          </Section>

          {/* Amenities */}
          <Section title="Amenities">
            <Amenities amenities={property.amenities} />
          </Section>

          {/* Rental conditions */}
          <Section title="Rental conditions">
            <ul className="space-y-2.5">
              {property.rentalConditions.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm text-ink-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {c}
                </li>
              ))}
            </ul>
          </Section>

          {/* House rules */}
          <Section title="House rules">
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {property.houseRules.map((r) => (
                <li key={r} className="flex items-start gap-2.5 rounded-xl bg-ink-50 px-3 py-2.5 text-sm text-ink-700">
                  <Home className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" /> {r}
                </li>
              ))}
            </ul>
          </Section>

          {/* Documents */}
          {property.documents.length > 0 && (
            <Section title="Rental documents">
              <div className="grid gap-3 sm:grid-cols-2">
                {property.documents.map((d) => (
                  <div key={d.name} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3 transition hover:border-ink-200 hover:bg-ink-50">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">{d.name}</p>
                      <p className="text-xs text-ink-500">{d.type} · {d.size}</p>
                    </div>
                    <button
                      onClick={() => toast.info('Document download is disabled in this demo.')}
                      className="rounded-lg p-2 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
                      aria-label={`Download ${d.name}`}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Location */}
          <Section title="Location">
            <div className="overflow-hidden rounded-2xl ring-1 ring-ink-100">
              <div className="relative aspect-[16/8] bg-brand-50">
                <iframe
                  title={`Map of ${property.address}`}
                  className="h-full w-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.coordinates.lng - 0.02},${property.coordinates.lat - 0.01},${property.coordinates.lng + 0.02},${property.coordinates.lat + 0.01}&layer=mapnik&marker=${property.coordinates.lat},${property.coordinates.lng}`}
                />
              </div>
              <div className="flex items-center justify-between gap-2 bg-white p-3 text-sm">
                <span className="flex items-center gap-2 text-ink-700">
                  <MapPin className="h-4 w-4 text-brand-600" /> {property.address}
                </span>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${property.coordinates.lat}&mlon=${property.coordinates.lng}#map=15/${property.coordinates.lat}/${property.coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-brand-700 hover:text-brand-800"
                >
                  Open in maps →
                </a>
              </div>
            </div>
          </Section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            {/* Price card */}
            <div className="card p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-extrabold text-ink-900">{formatEUR(property.rent)}</p>
                  <p className="text-xs text-ink-500">per month (cold rent)</p>
                </div>
                <span className="chip bg-emerald-50 text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified listing
                </span>
              </div>

              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Deposit (Kaution)" value={formatEUR(property.deposit)} />
                <Row label="Utilities (Nebenkosten)" value={formatEUR(property.utilities)} />
                <Row label="Total warm rent" value={formatEUR(property.rent + property.utilities)} strong />
                <Row label="Minimum stay" value={`${property.minimumStay} months`} />
                <Row label="Available from" value={formatDate(property.available)} />
              </dl>

              <button onClick={() => setInquiryOpen(true)} className="btn-primary mt-4 w-full">
                <Send className="h-4 w-4" /> Contact landlord
              </button>
              <button
                onClick={() => toggleFavorite(property.id)}
                className={classNames('btn-secondary mt-2 w-full', fav && 'border-brand-300 bg-brand-50 text-brand-700')}
              >
                <Heart className={classNames('h-4 w-4', fav && 'fill-current')} /> {fav ? 'Saved to favorites' : 'Save to favorites'}
              </button>
            </div>

            <LandlordCard landlord={property.landlord} />

            <DisclaimerBanner />
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-ink-900">More homes in {property.city}</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Link key={p.id} to={`/properties/${p.id}`} className="group card overflow-hidden transition hover:-translate-y-1 hover:shadow-cardHover animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="aspect-[4/3] overflow-hidden bg-ink-100">
                  <img src={p.images[0]} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-ink-500">{p.district}, {p.city}</p>
                  <p className="mt-1 line-clamp-1 text-sm font-bold text-ink-900">{p.title}</p>
                  <p className="mt-2 text-base font-extrabold text-ink-900">{formatEUR(p.rent)}<span className="text-xs font-medium text-ink-500">/mo</span></p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        property={property}
        user={user}
        isAuthenticated={isAuthenticated}
        form={form}
        setForm={setForm}
        submitting={submitting}
        onSubmit={handleInquiry}
        onLoginPrompt={() => {
          setInquiryOpen(false)
          navigate('/login')
        }}
      />
    </div>
  )
}

function Stat({ icon, value, label }) {
  return (
    <div className="card p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">{icon}</div>
      <p className="mt-3 text-lg font-bold text-ink-900">{value}</p>
      <p className="text-xs text-ink-500">{label}</p>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-bold text-ink-900">{title}</h2>
      {children}
    </section>
  )
}

function Row({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-100 pb-2 last:border-0 last:pb-0">
      <dt className="text-ink-600">{label}</dt>
      <dd className={classNames('font-semibold text-ink-900', strong && 'text-brand-700')}>{value}</dd>
    </div>
  )
}

function InquiryModal({ open, onClose, property, user, isAuthenticated, form, setForm, submitting, onSubmit, onLoginPrompt }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Contact landlord"
      description={property.title}
      size="md"
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-xs text-ink-500">
            <Euro className="h-3.5 w-3.5" /> No payment required to inquire
          </p>
          <button type="submit" form="inquiry-form" disabled={submitting} className="btn-primary">
            {submitting ? 'Sending…' : 'Send inquiry'}
          </button>
        </div>
      }
    >
      {!isAuthenticated && (
        <div className="mb-4 flex items-start gap-2 rounded-xl bg-brand-50 p-3 text-xs text-brand-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            You can send an inquiry as a guest, but creating an account lets you
            track all your inquiries in one place.{' '}
            <button type="button" onClick={onLoginPrompt} className="font-semibold underline">
              Sign in
            </button>
          </span>
        </div>
      )}
      <form id="inquiry-form" onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Your name</label>
            <input
              className="input"
              value={form.name || user?.name || ''}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Full name"
              required
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={form.email || user?.email || ''}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              required
            />
          </div>
        </div>
        <div>
          <label className="label">Preferred move-in date</label>
          <input
            type="date"
            className="input"
            value={form.moveDate}
            onChange={(e) => setForm((f) => ({ ...f, moveDate: e.target.value }))}
          />
        </div>
        <div>
          <label className="label">Message</label>
          <textarea
            className="input min-h-28 resize-y"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder={`Hi, I'm interested in this home. Is it still available for ${formatDate(property.available)}?`}
            required
          />
        </div>
      </form>
    </Modal>
  )
}

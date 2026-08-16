import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Clock, Send, Sparkles, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { useListings } from '../context/ListingsContext'
import { PropertyCard } from '../components/PropertyCard'
import { EmptyState } from '../components/ui'
import { DashboardLayout, StatCard, Panel } from '../components/DashboardLayout'
import { formatDate } from '../utils/format'

export default function TenantDashboard() {
  const { user, isTenant } = useAuth()
  const { favorites, recent } = useFavorites()
  const { listings, inquiries } = useListings()

  const savedHomes = useMemo(() => listings.filter((p) => favorites.includes(p.id)), [listings, favorites])
  const recentHomes = useMemo(() => recent.map((id) => listings.find((p) => p.id === id)).filter(Boolean), [recent, listings])
  const myInquiries = useMemo(
    () => inquiries.filter((i) => i.tenantEmail === user?.email || i.tenantName === user?.name),
    [inquiries, user],
  )
  const recommended = useMemo(() => {
    const favCities = savedHomes.map((p) => p.city)
    const pool = listings.filter((p) => p.status === 'approved' && !favorites.includes(p.id))
    const cityMatches = pool.filter((p) => favCities.includes(p.city))
    const rest = pool.filter((p) => !favCities.includes(p.city))
    return [...cityMatches, ...rest].slice(0, 3)
  }, [listings, savedHomes, favorites])

  return (
    <DashboardLayout
      user={user}
      isRole={isTenant}
      title={`Hello, ${user?.name?.split(' ')[0] || 'there'}`}
      subtitle="Track your saved homes, recent views and inquiries."
      nav={[
        { id: 'saved', label: 'Saved properties', icon: <Heart className="h-4 w-4" />, active: true },
        { id: 'recent', label: 'Recently viewed', icon: <Clock className="h-4 w-4" /> },
        { id: 'inquiries', label: 'My inquiries', icon: <Send className="h-4 w-4" /> },
        { id: 'recommended', label: 'Recommended', icon: <Sparkles className="h-4 w-4" /> },
      ]}
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={<Heart className="h-5 w-5" />} label="Saved homes" value={savedHomes.length} />
        <StatCard icon={<Clock className="h-5 w-5" />} label="Recently viewed" value={recentHomes.length} tone="emerald" />
        <StatCard icon={<Send className="h-5 w-5" />} label="Inquiries sent" value={myInquiries.length} tone="amber" />
        <StatCard icon={<Sparkles className="h-5 w-5" />} label="Recommendations" value={recommended.length} tone="ink" />
      </div>

      <Panel id="saved" title="Saved properties" icon={<Heart className="h-5 w-5 text-brand-600" />}
        empty={savedHomes.length === 0 ? (
          <EmptyState icon={<Heart className="h-7 w-7" />} title="No saved properties yet" description="Tap the heart icon on any listing to save it here for later."
            action={<Link to="/properties" className="btn-primary">Browse properties</Link>} />
        ) : null}>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {savedHomes.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
        </div>
      </Panel>

      <Panel id="recent" title="Recently viewed" icon={<Clock className="h-5 w-5 text-emerald-600" />}
        empty={recentHomes.length === 0 ? (
          <EmptyState icon={<Search className="h-7 w-7" />} title="Nothing viewed yet" description="Properties you open will appear here so you can find them again."
            action={<Link to="/properties" className="btn-primary">Start browsing</Link>} />
        ) : null}>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {recentHomes.slice(0, 6).map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
        </div>
      </Panel>

      <Panel id="inquiries" title="My inquiries" icon={<Send className="h-5 w-5 text-amber-600" />}
        empty={myInquiries.length === 0 ? (
          <EmptyState icon={<Send className="h-7 w-7" />} title="No inquiries yet" description="When you contact a landlord, your messages will appear here."
            action={<Link to="/properties" className="btn-primary">Find a home</Link>} />
        ) : null}>
        <div className="space-y-3">
          {myInquiries.map((i) => (
            <div key={i.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link to={`/properties/${i.propertyId}`} className="font-bold text-ink-900 hover:text-brand-700">{i.propertyTitle}</Link>
                  <p className="mt-1 text-sm text-ink-600 line-clamp-2">{i.message}</p>
                  <p className="mt-2 text-xs text-ink-500">Sent on {formatDate(i.createdAt)}{i.moveDate && ` · Preferred move-in ${formatDate(i.moveDate)}`}</p>
                </div>
                <StatusBadge status={i.status} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel id="recommended" title="Recommended for you" icon={<Sparkles className="h-5 w-5 text-brand-600" />}
        action={<Link to="/properties" className="text-sm font-semibold text-brand-700 hover:text-brand-800">See all</Link>}>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {recommended.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
        </div>
      </Panel>
    </DashboardLayout>
  )
}

const STATUS = {
  new: { label: 'New', cls: 'bg-brand-50 text-brand-700' },
  replied: { label: 'Replied', cls: 'bg-emerald-50 text-emerald-700' },
  rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700' },
  accepted: { label: 'Accepted', cls: 'bg-emerald-600 text-white' },
}

export function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.new
  return <span className={`chip ${s.cls}`}>{s.label}</span>
}

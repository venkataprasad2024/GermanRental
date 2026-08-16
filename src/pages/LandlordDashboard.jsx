import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, Eye, Send, Plus, Pencil, Trash2, MapPin, Inbox, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useListings } from '../context/ListingsContext'
import { useToast } from '../context/ToastContext'
import { EmptyState } from '../components/ui'
import { Modal } from '../components/Modal'
import { DashboardLayout, StatCard, Panel } from '../components/DashboardLayout'
import { StatusBadge } from './TenantDashboard'
import { formatEUR, formatDate } from '../utils/format'

export default function LandlordDashboard() {
  const { user, isLandlord } = useAuth()
  const { listings, inquiries, deleteListing, setInquiryStatus } = useListings()
  const toast = useToast()
  const [toDelete, setToDelete] = useState(null)

  const myListings = useMemo(
    () => listings.filter((p) => p.landlord?.name === 'Herr Lars Becker' || p.id.startsWith('p-')),
    [listings],
  )
  const myInquiries = useMemo(
    () => inquiries.filter((i) => myListings.some((p) => p.id === i.propertyId)),
    [inquiries, myListings],
  )
  const totalViews = myListings.reduce((sum, p) => sum + (p.views || 0), 0)

  const confirmDelete = () => {
    if (!toDelete) return
    deleteListing(toDelete.id)
    toast.success(`"${toDelete.title}" was removed.`)
    setToDelete(null)
  }

  return (
    <DashboardLayout
      user={user}
      isRole={isLandlord}
      requiredRole="landlord"
      title="Landlord dashboard"
      subtitle="Manage your listings, track views and reply to inquiries."
      actions={<Link to="/dashboard/landlord/new" className="btn-primary"><Plus className="h-4 w-4" /> Add property</Link>}
      nav={[
        { id: 'listings', label: 'My listings', icon: <Home className="h-4 w-4" />, active: true },
        { id: 'inquiries', label: 'Inquiries', icon: <Inbox className="h-4 w-4" /> },
        { id: 'stats', label: 'Performance', icon: <LayoutDashboard className="h-4 w-4" /> },
      ]}
    >
      <div id="stats" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={<Home className="h-5 w-5" />} label="Active listings" value={myListings.length} />
        <StatCard icon={<Eye className="h-5 w-5" />} label="Total views" value={totalViews.toLocaleString('de-DE')} tone="emerald" />
        <StatCard icon={<Send className="h-5 w-5" />} label="Inquiries" value={myInquiries.length} tone="amber" />
        <StatCard icon={<MapPin className="h-5 w-5" />} label="Avg. rent" value={formatEUR(Math.round(myListings.reduce((s, p) => s + p.rent, 0) / (myListings.length || 1)))} tone="ink" />
      </div>

      <Panel id="listings" title="My listings" icon={<Home className="h-5 w-5 text-brand-600" />}
        empty={myListings.length === 0 ? (
          <EmptyState icon={<Home className="h-7 w-7" />} title="No listings yet" description="Add your first property to start receiving inquiries."
            action={<Link to="/dashboard/landlord/new" className="btn-primary"><Plus className="h-4 w-4" /> Add property</Link>} />
        ) : null}>
        <div className="space-y-3">
          {myListings.map((p) => (
            <div key={p.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <img src={p.images[0]} alt={p.title} className="h-24 w-full rounded-xl object-cover sm:w-32" loading="lazy" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/properties/${p.id}`} className="font-bold text-ink-900 hover:text-brand-700 line-clamp-1">{p.title}</Link>
                  <ListingStatusBadge status={p.status} />
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-ink-500"><MapPin className="h-3.5 w-3.5" /> {p.district}, {p.city}</p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-ink-500">
                  <span className="font-semibold text-ink-900">{formatEUR(p.rent)}/mo</span>
                  <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {p.views || 0} views</span>
                  <span>Added {formatDate(p.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/dashboard/landlord/edit/${p.id}`} className="btn-secondary"><Pencil className="h-4 w-4" /> Edit</Link>
                <button onClick={() => setToDelete(p)} className="btn-ghost text-red-600 hover:bg-red-50" aria-label={`Delete ${p.title}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel id="inquiries" title="Inquiries" icon={<Inbox className="h-5 w-5 text-amber-600" />}
        empty={myInquiries.length === 0 ? (
          <EmptyState icon={<Inbox className="h-7 w-7" />} title="No inquiries yet" description="When tenants contact you about your listings, they'll appear here." />
        ) : null}>
        <div className="space-y-3">
          {myInquiries.map((i) => (
            <div key={i.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-ink-500">{i.tenantName} · {i.tenantEmail}</p>
                  <Link to={`/properties/${i.propertyId}`} className="font-bold text-ink-900 hover:text-brand-700">{i.propertyTitle}</Link>
                  <p className="mt-1 text-sm text-ink-600">{i.message}</p>
                  <p className="mt-2 text-xs text-ink-500">Received {formatDate(i.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={i.status} />
                  <div className="flex gap-1.5">
                    <button onClick={() => { setInquiryStatus(i.id, 'replied'); toast.success('Marked as replied') }} className="rounded-lg bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700 transition hover:bg-emerald-100 hover:text-emerald-700">Reply</button>
                    <button onClick={() => { setInquiryStatus(i.id, 'accepted'); toast.success('Inquiry accepted') }} className="rounded-lg bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700 transition hover:bg-brand-100 hover:text-brand-700">Accept</button>
                    <button onClick={() => { setInquiryStatus(i.id, 'rejected'); toast.info('Inquiry rejected') }} className="rounded-lg bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700 transition hover:bg-red-100 hover:text-red-700">Reject</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Modal open={Boolean(toDelete)} onClose={() => setToDelete(null)} title="Delete listing?" size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setToDelete(null)} className="btn-secondary">Cancel</button>
            <button onClick={confirmDelete} className="btn-danger"><Trash2 className="h-4 w-4" /> Delete</button>
          </div>
        }>
        <p className="text-sm text-ink-700">Are you sure you want to permanently remove <strong className="text-ink-900">{toDelete?.title}</strong>? This cannot be undone.</p>
      </Modal>
    </DashboardLayout>
  )
}

const LISTING_STATUS = {
  approved: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-700' },
  pending: { label: 'Pending review', cls: 'bg-amber-50 text-amber-700' },
  rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700' },
}

function ListingStatusBadge({ status }) {
  const s = LISTING_STATUS[status] || LISTING_STATUS.pending
  return <span className={`chip ${s.cls}`}>{s.label}</span>
}

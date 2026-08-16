import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Home, Users, Inbox, Check, X, Trash2, Eye, MapPin, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useListings } from '../context/ListingsContext'
import { useToast } from '../context/ToastContext'
import { EmptyState } from '../components/ui'
import { Modal } from '../components/Modal'
import { DashboardLayout, StatCard, Panel } from '../components/DashboardLayout'
import { formatDate, formatEUR, classNames } from '../utils/format'

const TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'all', label: 'All' },
]

export default function AdminDashboard() {
  const { user, isAdmin, users } = useAuth()
  const { listings, inquiries, setListingStatus, deleteListing, setInquiryStatus } = useListings()
  const toast = useToast()
  const [tab, setTab] = useState('pending')
  const [q, setQ] = useState('')
  const [toDelete, setToDelete] = useState(null)

  const filtered = useMemo(() => {
    let list = tab === 'all' ? listings : listings.filter((p) => p.status === tab)
    if (q) {
      const s = q.toLowerCase()
      list = list.filter((p) => p.title.toLowerCase().includes(s) || p.city.toLowerCase().includes(s))
    }
    return list
  }, [listings, tab, q])

  const pending = listings.filter((p) => p.status === 'pending')

  const confirmDelete = () => {
    if (!toDelete) return
    deleteListing(toDelete.id)
    toast.success(`"${toDelete.title}" was removed.`)
    setToDelete(null)
  }

  return (
    <DashboardLayout
      user={user}
      isRole={isAdmin}
      requiredRole="admin"
      title="Admin dashboard"
      subtitle="Review listings, monitor users and manage inquiries."
      nav={[
        { id: 'overview', label: 'Overview', icon: <Shield className="h-4 w-4" />, active: true },
        { id: 'listings', label: 'Listings', icon: <Home className="h-4 w-4" /> },
        { id: 'users', label: 'Users', icon: <Users className="h-4 w-4" /> },
        { id: 'inquiries', label: 'Inquiries', icon: <Inbox className="h-4 w-4" /> },
      ]}
    >
      <div id="overview" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={<Home className="h-5 w-5" />} label="Total listings" value={listings.length} />
        <StatCard icon={<Eye className="h-5 w-5" />} label="Pending review" value={pending.length} tone="amber" />
        <StatCard icon={<Users className="h-5 w-5" />} label="Registered users" value={users.length} tone="emerald" />
        <StatCard icon={<Inbox className="h-5 w-5" />} label="Total inquiries" value={inquiries.length} tone="ink" />
      </div>

      <Panel id="listings" title="Manage listings" icon={<Home className="h-5 w-5 text-brand-600" />}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={classNames('rounded-lg px-3 py-1.5 text-xs font-semibold transition', tab === t.id ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200')}>
                {t.label}
                {t.id === 'pending' && pending.length > 0 && <span className="ml-1.5 rounded-full bg-white/20 px-1.5">{pending.length}</span>}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search listings…" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Home className="h-7 w-7" />} title="No listings here" description="There are no listings matching this filter." />
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <div key={p.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <img src={p.images[0]} alt={p.title} className="h-20 w-full rounded-xl object-cover sm:w-28" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/properties/${p.id}`} className="font-bold text-ink-900 hover:text-brand-700 line-clamp-1">{p.title}</Link>
                    <AdminBadge status={p.status} />
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-ink-500"><MapPin className="h-3.5 w-3.5" /> {p.district}, {p.city}</p>
                  <p className="mt-1 text-xs text-ink-500">{formatEUR(p.rent)}/mo · Added {formatDate(p.createdAt)} · {p.views || 0} views</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {p.status !== 'approved' && <button onClick={() => { setListingStatus(p.id, 'approved'); toast.success('Listing approved') }} className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"><Check className="inline h-3.5 w-3.5" /> Approve</button>}
                  {p.status !== 'rejected' && <button onClick={() => { setListingStatus(p.id, 'rejected'); toast.info('Listing rejected') }} className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"><X className="inline h-3.5 w-3.5" /> Reject</button>}
                  <button onClick={() => setToDelete(p)} className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100" aria-label="Remove"><Trash2 className="inline h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel id="users" title="Registered users" icon={<Users className="h-5 w-5 text-emerald-600" />}>
        <div className="overflow-hidden rounded-2xl ring-1 ring-ink-100">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="hidden px-4 py-3 sm:table-cell">Role</th>
                <th className="hidden px-4 py-3 md:table-cell">City</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 bg-white">
              {users.map((u) => (
                <tr key={u.id} className="transition hover:bg-ink-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
                      <div className="min-w-0">
                        <p className="font-semibold text-ink-900">{u.name}</p>
                        <p className="truncate text-xs text-ink-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell"><RoleBadge role={u.role} /></td>
                  <td className="hidden px-4 py-3 text-ink-600 md:table-cell">{u.city || '—'}</td>
                  <td className="px-4 py-3 text-ink-500">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel id="inquiries" title="All inquiries" icon={<Inbox className="h-5 w-5 text-amber-600" />}
        empty={inquiries.length === 0 ? (<EmptyState icon={<Inbox className="h-7 w-7" />} title="No inquiries" description="Inquiries from tenants will show up here." />) : null}>
        <div className="space-y-3">
          {inquiries.map((i) => (
            <div key={i.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-ink-500">{i.tenantName} · {i.tenantEmail}</p>
                  <Link to={`/properties/${i.propertyId}`} className="font-bold text-ink-900 hover:text-brand-700">{i.propertyTitle}</Link>
                  <p className="mt-1 text-sm text-ink-600 line-clamp-2">{i.message}</p>
                  <p className="mt-2 text-xs text-ink-500">Received {formatDate(i.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={classNames('chip', STATUS_CLS[i.status] || STATUS_CLS.new)}>{(i.status || 'new').charAt(0).toUpperCase() + (i.status || 'new').slice(1)}</span>
                  <button onClick={() => { setInquiryStatus(i.id, 'replied'); toast.success('Marked as replied') }} className="rounded-lg bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700 transition hover:bg-emerald-100 hover:text-emerald-700">Mark replied</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Modal open={Boolean(toDelete)} onClose={() => setToDelete(null)} title="Remove listing?" size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setToDelete(null)} className="btn-secondary">Cancel</button>
            <button onClick={confirmDelete} className="btn-danger"><Trash2 className="h-4 w-4" /> Remove</button>
          </div>
        }>
        <p className="text-sm text-ink-700">Permanently remove <strong className="text-ink-900">{toDelete?.title}</strong>? This cannot be undone.</p>
      </Modal>
    </DashboardLayout>
  )
}

const STATUS_CLS = {
  approved: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  rejected: 'bg-red-50 text-red-700',
  new: 'bg-brand-50 text-brand-700',
}

function AdminBadge({ status }) {
  const cls = { approved: 'bg-emerald-50 text-emerald-700', pending: 'bg-amber-50 text-amber-700', rejected: 'bg-red-50 text-red-700' }
  return <span className={`chip ${cls[status] || cls.pending}`}>{status}</span>
}

function RoleBadge({ role }) {
  const cls = { admin: 'bg-brand-600 text-white', landlord: 'bg-brand-50 text-brand-700', tenant: 'bg-ink-100 text-ink-700' }
  return <span className={`chip ${cls[role] || cls.tenant}`}>{role}</span>
}

import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, ImagePlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useListings } from '../context/ListingsContext'
import { useToast } from '../context/ToastContext'
import { GERMAN_CITIES, PROPERTY_TYPES, AMENITY_LIST } from '../data/cities'
import { classNames } from '../utils/format'

const DEFAULT_IMAGES = [
  'https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/7195739/pexels-photo-7195739.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/6444976/pexels-photo-6444976.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/6957081/pexels-photo-6957081.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
]

const empty = {
  title: '', city: 'Berlin', district: '', address: '', rent: 800, deposit: 1600,
  utilities: 120, type: 'Apartment', bedrooms: 1, bathrooms: 1, area: 45,
  furnished: true, available: '2026-09-01', minimumStay: 12, images: DEFAULT_IMAGES,
  amenities: ['WiFi', 'Heating', 'Kitchen'], description: '',
  rentalConditions: ['Kaution (deposit): 2 months cold rent', 'Schufa record required'],
  houseRules: ['No smoking indoors', 'Quiet hours 22:00 – 06:00'],
}

export default function PropertyForm() {
  const { id } = useParams()
  const { user, isLandlord } = useAuth()
  const { getProperty, addListing, updateListing } = useListings()
  const toast = useToast()
  const navigate = useNavigate()

  const editing = Boolean(id)
  const [form, setForm] = useState(() => {
    if (editing) {
      const p = getProperty(id)
      if (p) return { ...p }
    }
    return { ...empty }
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const toggleAmenity = (a) => {
    setForm((f) => {
      const s = new Set(f.amenities)
      if (s.has(a)) s.delete(a)
      else s.add(a)
      return { ...f, amenities: [...s] }
    })
  }

  const submit = (e) => {
    e.preventDefault()
    if (form.images.length === 0) {
      toast.error('Please add at least one image URL.')
      return
    }
    const data = {
      ...form,
      rent: Number(form.rent), deposit: Number(form.deposit), utilities: Number(form.utilities),
      bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms), area: Number(form.area),
      minimumStay: Number(form.minimumStay),
      furnished: form.furnished === true || form.furnished === 'true',
      landlord: {
        name: user?.name || 'Herr Lars Becker',
        role: 'Landlord',
        phone: '+49 30 5555 0000',
        email: user?.email || 'landlord@deutschhome.de',
        avatar: user?.avatar || 'https://i.pravatar.cc/150?img=12',
        rating: 4.5, listings: 1, responseTime: 'Usually replies within 1 day',
        verified: false, since: '2025',
      },
    }
    if (editing) {
      updateListing(id, data)
      toast.success('Listing updated.')
    } else {
      addListing(data)
      toast.success('Listing created. It will appear once approved by an admin.')
    }
    navigate('/dashboard/landlord')
  }

  if (!user) return null

  return (
    <div className="container-page py-8 lg:py-10">
      <Link to="/dashboard/landlord" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{editing ? 'Edit property' : 'Add a new property'}</h1>
      <p className="mt-2 text-sm text-ink-600">Fill in the details below. New listings are reviewed by an admin before going live.</p>

      <form onSubmit={submit} className="mt-8 space-y-8">
        <FormCard title="Basic information">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" full><input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Bright 2-room apartment near the city center" required /></Field>
            <Field label="City"><select className="input" value={form.city} onChange={(e) => set('city', e.target.value)}>{GERMAN_CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}</select></Field>
            <Field label="District"><input className="input" value={form.district} onChange={(e) => set('district', e.target.value)} placeholder="e.g. Mitte" required /></Field>
            <Field label="Address" full><input className="input" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Street and house number, postcode" required /></Field>
          </div>
        </FormCard>

        <FormCard title="Property details">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Property type"><select className="input" value={form.type} onChange={(e) => set('type', e.target.value)}>{PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></Field>
            <Field label="Bedrooms"><input type="number" min="0" className="input" value={form.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} required /></Field>
            <Field label="Bathrooms"><input type="number" min="0" className="input" value={form.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} required /></Field>
            <Field label="Area (m²)"><input type="number" min="1" className="input" value={form.area} onChange={(e) => set('area', e.target.value)} required /></Field>
            <Field label="Furnishing"><select className="input" value={String(form.furnished)} onChange={(e) => set('furnished', e.target.value === 'true')}><option value="true">Furnished</option><option value="false">Unfurnished</option></select></Field>
            <Field label="Available from"><input type="date" className="input" value={form.available} onChange={(e) => set('available', e.target.value)} required /></Field>
            <Field label="Minimum stay (months)"><input type="number" min="1" className="input" value={form.minimumStay} onChange={(e) => set('minimumStay', e.target.value)} required /></Field>
          </div>
        </FormCard>

        <FormCard title="Pricing">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Cold rent (€/month)"><input type="number" min="0" className="input" value={form.rent} onChange={(e) => set('rent', e.target.value)} required /></Field>
            <Field label="Deposit (€)"><input type="number" min="0" className="input" value={form.deposit} onChange={(e) => set('deposit', e.target.value)} required /></Field>
            <Field label="Utilities (€/month)"><input type="number" min="0" className="input" value={form.utilities} onChange={(e) => set('utilities', e.target.value)} required /></Field>
          </div>
        </FormCard>

        <FormCard title="Amenities">
          <div className="flex flex-wrap gap-2">
            {AMENITY_LIST.map((a) => {
              const active = form.amenities.includes(a)
              return (
                <button key={a} type="button" onClick={() => toggleAmenity(a)}
                  className={classNames('rounded-lg border px-3 py-1.5 text-xs font-medium transition', active ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50')}>
                  {a}
                </button>
              )
            })}
          </div>
        </FormCard>

        <FormCard title="Images">
          <div className="space-y-2">
            {form.images.map((src, i) => (
              <div key={i} className="flex items-center gap-3">
                <img src={src} alt="" className="h-12 w-16 rounded-lg object-cover" />
                <input className="input" value={src} onChange={(e) => set('images', form.images.map((im, j) => (j === i ? e.target.value : im)))} placeholder="Image URL" />
                <button type="button" onClick={() => set('images', form.images.filter((_, j) => j !== i))} className="rounded-lg p-2 text-ink-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove image">×</button>
              </div>
            ))}
            <button type="button" onClick={() => set('images', [...form.images, ''])} className="btn-secondary text-xs"><ImagePlus className="h-4 w-4" /> Add image</button>
          </div>
        </FormCard>

        <FormCard title="Description & conditions">
          <Field label="Description" full><textarea className="input min-h-32 resize-y" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the property, neighborhood and who it's ideal for." required /></Field>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Rental conditions (one per line)"><textarea className="input min-h-28 resize-y" value={form.rentalConditions.join('\n')} onChange={(e) => set('rentalConditions', e.target.value.split('\n').filter(Boolean))} /></Field>
            <Field label="House rules (one per line)"><textarea className="input min-h-28 resize-y" value={form.houseRules.join('\n')} onChange={(e) => set('houseRules', e.target.value.split('\n').filter(Boolean))} /></Field>
          </div>
        </FormCard>

        <div className="flex items-center justify-end gap-3">
          <Link to="/dashboard/landlord" className="btn-secondary">Cancel</Link>
          <button type="submit" className="btn-primary"><Save className="h-4 w-4" /> {editing ? 'Save changes' : 'Publish listing'}</button>
        </div>
      </form>
    </div>
  )
}

function FormCard({ title, children }) {
  return (
    <div className="card p-5 sm:p-6">
      <h2 className="mb-4 text-base font-bold text-ink-900">{title}</h2>
      <div className="grid gap-4">{children}</div>
    </div>
  )
}

function Field({ label, children, full }) {
  return (
    <div className={full ? 'sm:col-span-2 lg:col-span-4' : ''}>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}

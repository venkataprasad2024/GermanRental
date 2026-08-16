import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PROPERTIES } from '../data/properties'

const ListingsContext = createContext(null)

const LISTINGS_KEY = 'dh:listings'
const INQUIRIES_KEY = 'dh:inquiries'

const SEED_INQUIRIES = [
  {
    id: 'inq-1',
    propertyId: 'p101',
    propertyTitle: 'Bright 2-Room Apartment near Alexanderplatz',
    tenantName: 'Priya Sharma',
    tenantEmail: 'tenant@deutschhome.de',
    message:
      'Hello, I am moving to Berlin in September for a new job. Is the apartment still available and can we arrange a viewing?',
    moveDate: '2026-09-01',
    status: 'new',
    createdAt: '2026-08-13',
  },
  {
    id: 'inq-2',
    propertyId: 'p102',
    propertyTitle: 'Modern Studio in Maxvorstadt Student District',
    tenantName: 'Arjun Mehta',
    tenantEmail: 'arjun.mehta@example.com',
    message:
      'Hi, I am an incoming Masters student at TUM. I would love to know if a B\u00fcrgschaft from my parents is accepted.',
    moveDate: '2026-09-15',
    status: 'replied',
    createdAt: '2026-08-11',
  },
  {
    id: 'inq-3',
    propertyId: 'p104',
    propertyTitle: 'Spacious 3-Room Flat with Balcony in Altona',
    tenantName: 'Rohan Verma',
    tenantEmail: 'rohan.verma@example.com',
    message:
      'We are a family of three relocating from Bangalore to Hamburg. Could you share more photos of the kitchen and bathroom?',
    moveDate: '2026-10-01',
    status: 'new',
    createdAt: '2026-08-09',
  },
]

function readListings() {
  try {
    const raw = localStorage.getItem(LISTINGS_KEY)
    if (!raw) return PROPERTIES
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return PROPERTIES
    return parsed
  } catch {
    return PROPERTIES
  }
}

function readInquiries() {
  try {
    const raw = localStorage.getItem(INQUIRIES_KEY)
    if (!raw) return SEED_INQUIRIES
    return JSON.parse(raw) || SEED_INQUIRIES
  } catch {
    return SEED_INQUIRIES
  }
}

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState(() => readListings())
  const [inquiries, setInquiries] = useState(() => readInquiries())

  useEffect(() => {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings))
  }, [listings])

  useEffect(() => {
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries))
  }, [inquiries])

  const getProperty = useCallback(
    (id) => listings.find((p) => p.id === id),
    [listings],
  )

  const addListing = useCallback((data) => {
    const id = `p-${Date.now()}`
    const listing = {
      id,
      views: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'pending',
      coordinates: { lat: 52.52, lng: 13.405 },
      documents: [],
      ...data,
    }
    setListings((prev) => [listing, ...prev])
    return listing
  }, [])

  const updateListing = useCallback((id, patch) => {
    setListings((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }, [])

  const deleteListing = useCallback((id) => {
    setListings((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const incrementViews = useCallback((id) => {
    setListings((prev) =>
      prev.map((p) => (p.id === id ? { ...p, views: (p.views || 0) + 1 } : p)),
    )
  }, [])

  const setListingStatus = useCallback((id, status) => {
    setListings((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
  }, [])

  const addInquiry = useCallback((inq) => {
    const newInq = {
      id: `inq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString().slice(0, 10),
      ...inq,
    }
    setInquiries((prev) => [newInq, ...prev])
    return newInq
  }, [])

  const setInquiryStatus = useCallback((id, status) => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i)),
    )
  }, [])

  const resetData = useCallback(() => {
    setListings(PROPERTIES)
    setInquiries(SEED_INQUIRIES)
  }, [])

  const value = useMemo(
    () => ({
      listings,
      inquiries,
      getProperty,
      addListing,
      updateListing,
      deleteListing,
      incrementViews,
      setListingStatus,
      addInquiry,
      setInquiryStatus,
      resetData,
    }),
    [
      listings,
      inquiries,
      getProperty,
      addListing,
      updateListing,
      deleteListing,
      incrementViews,
      setListingStatus,
      addInquiry,
      setInquiryStatus,
      resetData,
    ],
  )

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>
}

export function useListings() {
  const ctx = useContext(ListingsContext)
  if (!ctx) throw new Error('useListings must be used within ListingsProvider')
  return ctx
}

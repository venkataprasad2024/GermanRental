import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { PROPERTIES } from '../data/properties'

const ListingsContext =
  createContext(null)

const LISTINGS_KEY =
  'dh:listings'

const INQUIRIES_KEY =
  'dh:inquiries'

const REQUESTS_KEY =
  'dh:apartment-requests'

const MOCK_CONTACTS = [
  {
    phone: '+917893644742',
    whatsapp: '+917893644742',
    email: 'pandillavenkataprasad@gmail.com',
  },
  {
    phone: '+919505439502',
    whatsapp: '+919505439502',
    email: 'sandhyakorimi5566@gmail.com',
  },
  {
    phone: '+919398854629',
    whatsapp: '+919398854629',
    email: 'sandhyakorimi08@gmail.com',
  },
]

const SEED_INQUIRIES = [
  {
    id: 'inq-1',
    propertyId: 'p101',
    propertyTitle:
      'Bright 2-Room Apartment near Alexanderplatz',
    tenantName:
      'Priya Sharma',
    tenantEmail:
      'tenant@deutschhome.de',
    message:
      'Hello, I am moving to Berlin in September for a new job. Is the apartment still available and can we arrange a viewing?',
    moveDate:
      '2026-09-01',
    status: 'new',
    createdAt:
      '2026-08-13',
  },

  {
    id: 'inq-2',
    propertyId: 'p102',
    propertyTitle:
      'Modern Studio in Maxvorstadt Student District',
    tenantName:
      'Arjun Mehta',
    tenantEmail:
      'arjun.mehta@example.com',
    message:
      'Hi, I am an incoming Masters student at TUM. I would love to know if a Bürgschaft from my parents is accepted.',
    moveDate:
      '2026-09-15',
    status: 'replied',
    createdAt:
      '2026-08-11',
  },

  {
    id: 'inq-3',
    propertyId: 'p104',
    propertyTitle:
      'Spacious 3-Room Flat with Balcony in Altona',
    tenantName:
      'Rohan Verma',
    tenantEmail:
      'rohan.verma@example.com',
    message:
      'We are a family of three relocating from Bangalore to Hamburg. Could you share more photos of the kitchen and bathroom?',
    moveDate:
      '2026-10-01',
    status: 'new',
    createdAt:
      '2026-08-09',
  },
]

/*
 * =========================================================
 * SYNC MOCK PROPERTY CONTACTS
 *
 * Keeps every existing property exactly as it is,
 * but updates only phone / whatsapp / email for
 * the mock properties.
 *
 * Existing landlord information such as:
 * name, role, avatar, rating, listings, responseTime,
 * verified and since are preserved.
 * =========================================================
 */
function syncMockContacts(items) {
  if (!Array.isArray(items)) {
    return PROPERTIES
  }

  const propertyMap = new Map(
    PROPERTIES.map((property) => [
      property.id,
      property,
    ]),
  )

  return items.map((property, index) => {
    const mockProperty =
      propertyMap.get(property.id)

    if (!mockProperty) {
      return property
    }

    const fallbackContact =
      MOCK_CONTACTS[
        index % MOCK_CONTACTS.length
      ]

    const mockLandlord =
      mockProperty.landlord || {}

    const currentLandlord =
      property.landlord || {}

    return {
      ...property,

      landlord: {
        ...currentLandlord,

        phone:
          mockLandlord.phone ||
          fallbackContact.phone,

        whatsapp:
          mockLandlord.whatsapp ||
          fallbackContact.whatsapp,

        email:
          mockLandlord.email ||
          fallbackContact.email,
      },
    }
  })
}

function readListings() {
  try {
    const raw =
      localStorage.getItem(
        LISTINGS_KEY,
      )

    if (!raw) {
      return syncMockContacts(PROPERTIES)
    }

    const parsed =
      JSON.parse(raw)

    if (
      !Array.isArray(parsed) ||
      parsed.length === 0
    ) {
      return syncMockContacts(PROPERTIES)
    }

    return syncMockContacts(parsed)
  } catch {
    return syncMockContacts(PROPERTIES)
  }
}

function readInquiries() {
  try {
    const raw =
      localStorage.getItem(
        INQUIRIES_KEY,
      )

    if (!raw) {
      return SEED_INQUIRIES
    }

    return (
      JSON.parse(raw) ||
      SEED_INQUIRIES
    )
  } catch {
    return SEED_INQUIRIES
  }
}

function readApartmentRequests() {
  try {
    const raw =
      localStorage.getItem(
        REQUESTS_KEY,
      )

    if (!raw) {
      return []
    }

    const parsed =
      JSON.parse(raw)

    return Array.isArray(parsed)
      ? parsed
      : []
  } catch {
    return []
  }
}

export function ListingsProvider({
  children,
}) {
  const [listings, setListings] =
    useState(() => readListings())

  const [inquiries, setInquiries] =
    useState(() => readInquiries())

  const [
    apartmentRequests,
    setApartmentRequests,
  ] = useState(() =>
    readApartmentRequests(),
  )

  /*
   * =========================================================
   * PERSIST LISTINGS
   * =========================================================
   */
  useEffect(() => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify(listings),
    )
  }, [listings])

  /*
   * =========================================================
   * PERSIST INQUIRIES
   * =========================================================
   */
  useEffect(() => {
    localStorage.setItem(
      INQUIRIES_KEY,
      JSON.stringify(inquiries),
    )
  }, [inquiries])

  /*
   * =========================================================
   * PERSIST APARTMENT REQUESTS
   * =========================================================
   */
  useEffect(() => {
    localStorage.setItem(
      REQUESTS_KEY,
      JSON.stringify(
        apartmentRequests,
      ),
    )
  }, [apartmentRequests])

  /*
   * =========================================================
   * PROPERTY
   * =========================================================
   */

  const getProperty =
    useCallback(
      (id) =>
        listings.find(
          (property) =>
            property.id === id,
        ),
      [listings],
    )

  const addListing =
    useCallback((data) => {
      const id = `p-${Date.now()}`

      const listing = {
        id,

        views: 0,

        createdAt:
          new Date()
            .toISOString()
            .slice(0, 10),

        status: 'pending',

        coordinates: {
          lat: 52.52,
          lng: 13.405,
        },

        documents: [],

        ...data,
      }

      setListings((previous) => [
        listing,
        ...previous,
      ])

      return listing
    }, [])

  const updateListing =
    useCallback(
      (id, patch) => {
        setListings((previous) =>
          previous.map((property) =>
            property.id === id
              ? {
                  ...property,
                  ...patch,
                }
              : property,
          ),
        )
      },
      [],
    )

  const deleteListing =
    useCallback((id) => {
      setListings((previous) =>
        previous.filter(
          (property) =>
            property.id !== id,
        ),
      )
    }, [])

  const incrementViews =
    useCallback((id) => {
      setListings((previous) =>
        previous.map((property) =>
          property.id === id
            ? {
                ...property,
                views:
                  (property.views ||
                    0) + 1,
              }
            : property,
        ),
      )
    }, [])

  const setListingStatus =
    useCallback(
      (id, status) => {
        setListings((previous) =>
          previous.map((property) =>
            property.id === id
              ? {
                  ...property,
                  status,
                }
              : property,
          ),
        )
      },
      [],
    )

  /*
   * =========================================================
   * INQUIRIES
   * =========================================================
   */

  const addInquiry =
    useCallback((inq) => {
      const newInquiry = {
        id: `inq-${Date.now()}`,

        status: 'new',

        createdAt:
          new Date()
            .toISOString()
            .slice(0, 10),

        ...inq,
      }

      setInquiries((previous) => [
        newInquiry,
        ...previous,
      ])

      return newInquiry
    }, [])

  const setInquiryStatus =
    useCallback(
      (id, status) => {
        setInquiries((previous) =>
          previous.map((inquiry) =>
            inquiry.id === id
              ? {
                  ...inquiry,
                  status,
                }
              : inquiry,
          ),
        )
      },
      [],
    )

  /*
   * =========================================================
   * APARTMENT REQUESTS
   * =========================================================
   */

  const addApartmentRequest =
    useCallback((data) => {
      const request = {
        id: `req-${Date.now()}`,

        status: 'new',

        createdAt:
          new Date().toISOString(),

        ...data,
      }

      setApartmentRequests(
        (previous) => [
          request,
          ...previous,
        ],
      )

      return request
    }, [])

  const updateApartmentRequest =
    useCallback(
      (id, patch) => {
        setApartmentRequests(
          (previous) =>
            previous.map((request) =>
              request.id === id
                ? {
                    ...request,
                    ...patch,
                  }
                : request,
            ),
        )
      },
      [],
    )

  /*
   * =========================================================
   * RESET
   * =========================================================
   */
  const resetData =
    useCallback(() => {
      setListings(
        syncMockContacts(PROPERTIES),
      )

      setInquiries(
        SEED_INQUIRIES,
      )

      setApartmentRequests([])
    }, [])

  /*
   * =========================================================
   * CONTEXT VALUE
   * =========================================================
   */
  const value = useMemo(
    () => ({
      listings,
      inquiries,
      apartmentRequests,

      getProperty,

      addListing,
      updateListing,
      deleteListing,
      incrementViews,
      setListingStatus,

      addInquiry,
      setInquiryStatus,

      addApartmentRequest,
      updateApartmentRequest,

      resetData,
    }),
    [
      listings,
      inquiries,
      apartmentRequests,

      getProperty,

      addListing,
      updateListing,
      deleteListing,
      incrementViews,
      setListingStatus,

      addInquiry,
      setInquiryStatus,

      addApartmentRequest,
      updateApartmentRequest,

      resetData,
    ],
  )

  return (
    <ListingsContext.Provider
      value={value}
    >
      {children}
    </ListingsContext.Provider>
  )
}

export function useListings() {
  const ctx =
    useContext(ListingsContext)

  if (!ctx) {
    throw new Error(
      'useListings must be used within ListingsProvider',
    )
  }

  return ctx
}
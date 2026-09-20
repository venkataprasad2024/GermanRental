import { useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  ImagePlus,
  X,
  Plus,
  Home as HomeIcon,
  BedDouble,
  Zap,
  Droplet,
  Flame,
  Wifi,
  FileCheck2,
  Info,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useListings } from '../context/ListingsContext'
import { useToast } from '../context/ToastContext'
import {
  GERMAN_CITIES,
  PROPERTY_TYPES,
} from '../data/cities'
import { classNames } from '../utils/format'

const DEFAULT_PHOTO_AREAS = [
  'Room 1',
  'Room 2',
  'Living room',
  'Kitchen',
  'Bathroom',
  'Corridor',
]

const empty = {
  title: '',
  city: 'Berlin',
  district: '',
  address: '',

  // Existing fields retained so the current app/data stays compatible.
  rent: 800,
  deposit: 1600,
  utilities: 120,
  type: 'Apartment',
  bedrooms: 1,
  bathrooms: 1,
  area: 45,
  furnished: true,
  available: '',
  minimumStay: 12,
  images: [],

  // Brother's final requirements.
  rentalType: 'Rent',
  totalRooms: 3,
  totalTenants: 1,

  utilitiesIncluded: {
    Electricity: true,
    Water: true,
    Heating: true,
    Internet: true,
  },

  anmeldung: 'Yes',
  brokerFee: 'No',
  brokerFeeAmount: '',

  perRoomPricing: true,
  rooms: [
    {
      name: 'Room 1',
      available: true,
      rent: '',
      deposit: '',
      persons: '1',
      sharedWith: 'Any gender',
    },
  ],

  photoAreas: DEFAULT_PHOTO_AREAS.map((name) => ({
    name,
    images: [],
  })),

  // Existing contact fields retained.
  whatsapp: '',
  contactEmail: '',
  description: '',
}

function buildDefaultPhotoAreas() {
  return DEFAULT_PHOTO_AREAS.map((name) => ({
    name,
    images: [],
  }))
}

function getPhotoAreas(property) {
  if (
    Array.isArray(property?.photoAreas) &&
    property.photoAreas.length > 0
  ) {
    return property.photoAreas.map((area) => ({
      name: area?.name || 'Area',
      images: Array.isArray(area?.images)
        ? area.images
        : [],
    }))
  }

  const areas = buildDefaultPhotoAreas()

  if (
    Array.isArray(property?.images) &&
    property.images.length > 0
  ) {
    areas[0].images = property.images
  }

  return areas
}

function flattenPhotoAreas(photoAreas) {
  return photoAreas.flatMap((area) =>
    Array.isArray(area.images) ? area.images : [],
  )
}

export default function PropertyForm() {
  const { id } = useParams()
  const { user, isLandlord } = useAuth()
  const {
    getProperty,
    addListing,
    updateListing,
  } = useListings()
  const toast = useToast()
  const navigate = useNavigate()

  const photoInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const areaInputRefs = useRef({})

  const editing = Boolean(id)

  const [form, setForm] = useState(() => {
    if (editing) {
      const property = getProperty(id)

      if (property) {
        return {
          ...empty,
          ...property,
          rentalType:
            property.rentalType || 'Rent',
          totalRooms:
            property.totalRooms ??
            property.bedrooms ??
            1,
          totalTenants:
            property.totalTenants ?? 1,
          utilitiesIncluded: {
            ...empty.utilitiesIncluded,
            ...(property.utilitiesIncluded || {}),
          },
          anmeldung:
            property.anmeldung || 'Yes',
          brokerFee:
            property.brokerFee || 'No',
          brokerFeeAmount:
            property.brokerFeeAmount || '',
          perRoomPricing:
            typeof property.perRoomPricing ===
            'boolean'
              ? property.perRoomPricing
              : true,
          rooms:
            Array.isArray(property.rooms) &&
            property.rooms.length > 0
              ? property.rooms
              : empty.rooms,
          photoAreas: getPhotoAreas(property),
          whatsapp:
            property.landlord?.whatsapp ||
            property.landlord?.phone ||
            '',
          contactEmail:
            property.landlord?.email || '',
        }
      }
    }

    return {
      ...empty,
      photoAreas: buildDefaultPhotoAreas(),
    }
  })

  const set = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const updateRoom = (index, nextRoom) => {
    setForm((current) => ({
      ...current,
      rooms: current.rooms.map((room, roomIndex) =>
        roomIndex === index
          ? nextRoom
          : room,
      ),
    }))
  }

  const addRoom = () => {
    setForm((current) => ({
      ...current,
      rooms: [
        ...current.rooms,
        {
          name: `Room ${current.rooms.length + 1}`,
          available: true,
          rent: '',
          deposit: '',
          persons: '1',
          sharedWith: 'Any gender',
        },
      ],
    }))
  }

  const removeRoom = (index) => {
    setForm((current) => ({
      ...current,
      rooms: current.rooms.filter(
        (_, roomIndex) => roomIndex !== index,
      ),
    }))
  }

  const addImagesToArea = async (
    areaIndex,
    files,
  ) => {
    const selectedFiles = Array.from(
      files || [],
    ).filter((file) =>
      file.type.startsWith('image/'),
    )

    if (selectedFiles.length === 0) return

    const currentCount = flattenPhotoAreas(
      form.photoAreas,
    ).length

    const remainingSlots = Math.max(
      0,
      10 - currentCount,
    )

    if (remainingSlots === 0) {
      toast.error(
        'You can add up to 10 photos.',
      )
      return
    }

    const filesToRead = selectedFiles.slice(
      0,
      remainingSlots,
    )

    const images = await Promise.all(
      filesToRead.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader()

            reader.onload = () =>
              resolve(
                typeof reader.result === 'string'
                  ? reader.result
                  : null,
              )

            reader.onerror = () =>
              resolve(null)

            reader.readAsDataURL(file)
          }),
      ),
    )

    const validImages = images.filter(Boolean)

    if (validImages.length === 0) return

    setForm((current) => {
      const nextPhotoAreas =
        current.photoAreas.map(
          (area, index) =>
            index === areaIndex
              ? {
                  ...area,
                  images: [
                    ...(area.images || []),
                    ...validImages,
                  ].slice(0, 10),
                }
              : area,
        )

      return {
        ...current,
        photoAreas: nextPhotoAreas,
        images: flattenPhotoAreas(
          nextPhotoAreas,
        ),
      }
    })
  }

  const addImages = (files) => {
    if (form.photoAreas.length === 0) {
      return
    }

    addImagesToArea(0, files)
  }

  const removeAreaImage = (
    areaIndex,
    imageIndex,
  ) => {
    setForm((current) => {
      const nextPhotoAreas =
        current.photoAreas.map(
          (area, index) =>
            index === areaIndex
              ? {
                  ...area,
                  images: area.images.filter(
                    (_, currentImageIndex) =>
                      currentImageIndex !==
                      imageIndex,
                  ),
                }
              : area,
        )

      return {
        ...current,
        photoAreas: nextPhotoAreas,
        images: flattenPhotoAreas(
          nextPhotoAreas,
        ),
      }
    })
  }

  const renamePhotoArea = (
    areaIndex,
    name,
  ) => {
    setForm((current) => ({
      ...current,
      photoAreas: current.photoAreas.map(
        (area, index) =>
          index === areaIndex
            ? { ...area, name }
            : area,
      ),
    }))
  }

  const removePhotoArea = (areaIndex) => {
    setForm((current) => {
      const nextPhotoAreas =
        current.photoAreas.filter(
          (_, index) =>
            index !== areaIndex,
        )

      return {
        ...current,
        photoAreas:
          nextPhotoAreas.length > 0
            ? nextPhotoAreas
            : [
                {
                  name: 'Property photos',
                  images: [],
                },
              ],
        images: flattenPhotoAreas(
          nextPhotoAreas,
        ),
      }
    })
  }

  const addPhotoArea = () => {
    setForm((current) => ({
      ...current,
      photoAreas: [
        ...current.photoAreas,
        {
          name: `Area ${current.photoAreas.length + 1}`,
          images: [],
        },
      ],
    }))
  }

  const toggleUtility = (key) => {
    setForm((current) => ({
      ...current,
      utilitiesIncluded: {
        ...current.utilitiesIncluded,
        [key]:
          !current.utilitiesIncluded[key],
      },
    }))
  }

  const submit = (event) => {
    event.preventDefault()

    if (!form.whatsapp?.trim()) {
      toast.error(
        'Please enter your WhatsApp number.',
      )
      return
    }

    if (!form.contactEmail?.trim()) {
      toast.error(
        'Please enter your email address.',
      )
      return
    }

    const allImages = flattenPhotoAreas(
      form.photoAreas,
    )

    if (allImages.length === 0) {
      toast.error(
        'Please add at least one apartment photo.',
      )
      return
    }

    if (
      form.perRoomPricing &&
      form.rooms.length === 0
    ) {
      toast.error(
        'Please add at least one room.',
      )
      return
    }

    const roomRent =
      form.rooms.length > 0
        ? Number(form.rooms[0].rent) || 0
        : 0

    const roomDeposit =
      form.rooms.length > 0
        ? Number(form.rooms[0].deposit) || 0
        : 0

    const data = {
      ...form,

      // Keep existing data fields working.
      rent: form.perRoomPricing
        ? roomRent
        : Number(form.rent) || 0,
      deposit: form.perRoomPricing
        ? roomDeposit
        : Number(form.deposit) || 0,
      utilities: Number(form.utilities) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      area: Number(form.area) || 0,
      minimumStay:
        Number(form.minimumStay) || 1,
      totalRooms:
        Number(form.totalRooms) || 0,
      totalTenants:
        Number(form.totalTenants) || 0,
      furnished:
        form.furnished === true ||
        form.furnished === 'true',
      images: allImages,
      photoAreas: form.photoAreas,
      rooms: form.rooms.map((room) => ({
        ...room,
        rent: Number(room.rent) || 0,
        deposit:
          Number(room.deposit) || 0,
        persons:
          Number(room.persons) || 1,
      })),
      brokerFeeAmount:
        form.brokerFee === 'Yes'
          ? form.brokerFeeAmount
          : '',

      landlord: {
        name:
          user?.name || 'Herr Lars Becker',
        role: 'Landlord',
        phone: '+49 30 5555 0000',
        whatsapp:
          form.whatsapp.trim(),
        email:
          form.contactEmail.trim(),
        avatar:
          user?.avatar ||
          'https://i.pravatar.cc/150?img=12',
        rating: 4.5,
        listings: 1,
        responseTime:
          'Usually replies within 1 day',
        verified: false,
        since: '2025',
      },
    }

    if (editing) {
      updateListing(id, data)
      toast.success('Listing updated.')
    } else {
      addListing(data)
      toast.success(
        'Listing created. It will appear once approved by an admin.',
      )
    }

    navigate('/dashboard/landlord')
  }

  if (!user || !isLandlord) return null

  return (
    <div className="container-page py-8 lg:py-10">
      <Link
        to="/dashboard/landlord"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
        {editing
          ? 'Edit property'
          : 'Add a new property'}
      </h1>

      <p className="mt-2 text-sm text-ink-600">
        Fill in the details below. New listings
        are reviewed by an admin before going
        live.
      </p>

      <form
        onSubmit={submit}
        className="mt-8 space-y-8"
      >
        {/* PROPERTY BASICS */}
        <FormCard
          title="Property basics"
          subtitle="What are you listing?"
          icon={HomeIcon}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Title"
              full
              required
            >
              <input
                className="input"
                value={form.title}
                onChange={(e) =>
                  set(
                    'title',
                    e.target.value,
                  )
                }
                placeholder="e.g. Bright apartment in Berlin"
                required
              />
            </Field>

            <Field
              label="City"
              required
            >
              <select
                className="input"
                value={form.city}
                onChange={(e) =>
                  set(
                    'city',
                    e.target.value,
                  )
                }
              >
                {GERMAN_CITIES.map(
                  (city) => (
                    <option
                      key={city.name}
                      value={city.name}
                    >
                      {city.name}
                    </option>
                  ),
                )}
              </select>
            </Field>

            <Field
              label="District"
              required
            >
              <input
                className="input"
                value={form.district}
                onChange={(e) =>
                  set(
                    'district',
                    e.target.value,
                  )
                }
                placeholder="e.g. Mitte"
                required
              />
            </Field>

            <Field
              label="Address"
              full
              required
            >
              <input
                className="input"
                value={form.address}
                onChange={(e) =>
                  set(
                    'address',
                    e.target.value,
                  )
                }
                placeholder="Street, house number and postcode"
                required
              />
            </Field>

            <Field label="Property type" required>
              <select
                className="input"
                value={form.type}
                onChange={(e) =>
                  set(
                    'type',
                    e.target.value,
                  )
                }
              >
                {PROPERTY_TYPES.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ),
                )}
              </select>
            </Field>

            <Field label="Rental type">
              <Segmented
                options={[
                  'Rent',
                  'Sublet',
                ]}
                value={form.rentalType}
                onChange={(value) =>
                  set(
                    'rentalType',
                    value,
                  )
                }
              />
            </Field>

            <Field
              label="Vacant from"
              required
            >
              <input
                type="date"
                className="input"
                value={form.available}
                onChange={(e) =>
                  set(
                    'available',
                    e.target.value,
                  )
                }
                required
              />
            </Field>

            <Field label="Minimum stay">
              <select
                className="input"
                value={String(
                  form.minimumStay,
                )}
                onChange={(e) =>
                  set(
                    'minimumStay',
                    Number(
                      e.target.value,
                    ),
                  )
                }
              >
                <option value="0">
                  No minimum
                </option>
                <option value="1">
                  1 month
                </option>
                <option value="3">
                  3 months
                </option>
                <option value="6">
                  6 months
                </option>
                <option value="12">
                  12 months
                </option>
              </select>
            </Field>

            <Field
              label="Total no. of rooms"
              required
            >
              <input
                type="number"
                min="1"
                className="input"
                value={form.totalRooms}
                onChange={(e) =>
                  set(
                    'totalRooms',
                    e.target.value,
                  )
                }
                placeholder="e.g. 3"
                required
              />
            </Field>

            <Field
              label="Total tenants"
              required
              hint="Total number of people who will live in the property."
            >
              <input
                type="number"
                min="1"
                className="input"
                value={form.totalTenants}
                onChange={(e) =>
                  set(
                    'totalTenants',
                    e.target.value,
                  )
                }
                placeholder="e.g. 4"
                required
              />
            </Field>

            <Field
              label="Square meters"
              hint="Optional"
            >
              <input
                type="number"
                min="1"
                className="input"
                value={form.area}
                onChange={(e) =>
                  set(
                    'area',
                    e.target.value,
                  )
                }
                placeholder="e.g. 85"
              />
            </Field>

            <Field
              label="Number of bathrooms"
              required
            >
              <input
                type="number"
                min="0"
                className="input"
                value={form.bathrooms}
                onChange={(e) =>
                  set(
                    'bathrooms',
                    e.target.value,
                  )
                }
                placeholder="e.g. 1"
                required
              />
            </Field>

            <Field label="Furnished">
              <Segmented
                options={[
                  'Yes',
                  'Partially',
                  'No',
                ]}
                value={
                  form.furnished === true
                    ? 'Yes'
                    : form.furnished ===
                        false
                      ? 'No'
                      : form.furnished
                }
                onChange={(value) =>
                  set(
                    'furnished',
                    value === 'Yes'
                      ? true
                      : value === 'No'
                        ? false
                        : value,
                  )
                }
              />
            </Field>
          </div>
        </FormCard>

        {/* CONTACT */}
        <FormCard
          title="Contact information"
          subtitle="Used by tenants to contact the landlord"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="WhatsApp number"
              required
            >
              <input
                type="tel"
                className="input"
                value={form.whatsapp}
                onChange={(e) =>
                  set(
                    'whatsapp',
                    e.target.value,
                  )
                }
                placeholder="+49 151 23456789"
                required
              />
            </Field>

            <Field
              label="Email address"
              required
            >
              <input
                type="email"
                className="input"
                value={form.contactEmail}
                onChange={(e) =>
                  set(
                    'contactEmail',
                    e.target.value,
                  )
                }
                placeholder="landlord@example.com"
                required
              />
            </Field>
          </div>
        </FormCard>

        {/* PHOTOS & VIDEOS */}
        <FormCard
          title="Photos & videos"
          subtitle="Label each area — renters browse by room"
          icon={ImagePlus}
        >
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              addImages(
                e.target.files,
              )
              e.target.value = ''
            }}
          />

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              addImages(
                e.target.files,
              )
              e.target.value = ''
            }}
          />

          <div className="rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/40 p-5 sm:p-6">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-soft">
                <ImagePlus className="h-6 w-6" />
              </div>

              <h3 className="mt-3 text-base font-bold text-ink-900">
                Add photos of your apartment
              </h3>

              <p className="mt-1 text-sm text-ink-500">
                Add up to 10 photos. The first
                photo will be used as the cover image.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    photoInputRef.current?.click()
                  }
                  className="btn-primary"
                >
                  <ImagePlus className="h-4 w-4" />
                  Choose photos
                </button>

                <button
                  type="button"
                  onClick={() =>
                    cameraInputRef.current?.click()
                  }
                  className="btn-secondary md:hidden"
                >
                  <ImagePlus className="h-4 w-4" />
                  Take a photo
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {form.photoAreas.map(
              (area, areaIndex) => (
                <div
                  key={`${area.name}-${areaIndex}`}
                  className="rounded-xl border border-ink-100 p-2.5"
                >
                  <div className="mb-2 flex items-center gap-1.5">
                    <input
                      value={area.name}
                      onChange={(e) =>
                        renamePhotoArea(
                          areaIndex,
                          e.target.value,
                        )
                      }
                      className="min-w-0 flex-1 border-b border-transparent bg-transparent text-[11px] font-semibold text-ink-700 outline-none focus:border-ink-300"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removePhotoArea(
                          areaIndex,
                        )
                      }
                      className="shrink-0 text-ink-300 hover:text-red-500"
                      aria-label={`Remove ${area.name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {(area.images || []).map(
                      (
                        src,
                        imageIndex,
                      ) => (
                        <div
                          key={`${src}-${imageIndex}`}
                          className="group relative overflow-hidden rounded-lg border border-ink-100"
                        >
                          <img
                            src={src}
                            alt={`${area.name} ${imageIndex + 1}`}
                            className="aspect-square w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeAreaImage(
                                areaIndex,
                                imageIndex,
                              )
                            }
                            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/65 text-white"
                            aria-label={`Remove ${area.name} photo ${imageIndex + 1}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ),
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        areaInputRefs.current[
                          areaIndex
                        ]?.click()
                      }
                      className="flex aspect-square flex-col items-center justify-center rounded-lg border border-dashed border-ink-200 bg-ink-50/50 text-ink-400 hover:border-brand-300 hover:text-brand-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="mt-1 text-[9px] font-semibold">
                        Add photo
                      </span>
                    </button>
                  </div>

                  <input
                    ref={(node) => {
                      areaInputRefs.current[
                        areaIndex
                      ] = node
                    }}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      addImagesToArea(
                        areaIndex,
                        e.target.files,
                      )
                      e.target.value = ''
                    }}
                  />
                </div>
              ),
            )}

            <button
              type="button"
              onClick={addPhotoArea}
              className="flex min-h-[96px] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-200 text-ink-400 hover:border-brand-300 hover:text-brand-700"
            >
              <Plus className="h-5 w-5" />
              <span className="text-[11px] font-semibold">
                Add area
              </span>
            </button>
          </div>

          <p className="flex items-start gap-1.5 text-[11px] text-ink-400">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Renters will see these labels when
            browsing photos.
          </p>
        </FormCard>

        {/* ROOM-BY-ROOM PRICING */}
        <FormCard
          title="Room-by-room pricing"
          subtitle="List and price each room separately, or set one price for the whole place"
          icon={BedDouble}
        >
          <div className="flex items-center justify-between gap-4 rounded-xl bg-ink-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-ink-700">
                List rooms individually
              </p>
              <p className="mt-0.5 text-xs text-ink-400">
                Turn off a room once it is filled
                with tenants.
              </p>
            </div>

            <Toggle
              checked={form.perRoomPricing}
              onChange={(value) =>
                set(
                  'perRoomPricing',
                  value,
                )
              }
              labelOn="Enabled"
              labelOff="Disabled"
            />
          </div>

          {form.perRoomPricing ? (
            <div className="space-y-3 pt-2">
              {form.rooms.map(
                (room, index) => (
                  <RoomCard
                    key={`${room.name}-${index}`}
                    room={room}
                    onChange={(value) =>
                      updateRoom(
                        index,
                        value,
                      )
                    }
                    onRemove={() =>
                      removeRoom(index)
                    }
                    canRemove={
                      form.rooms.length >
                      1
                    }
                  />
                ),
              )}

              <button
                type="button"
                onClick={addRoom}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800"
              >
                <Plus className="h-3.5 w-3.5" />
                Add room
              </button>
            </div>
          ) : (
            <div className="grid gap-4 pt-2 sm:grid-cols-2">
              <Field
                label="Rent (€/month)"
                required
                hint="Cold rent (Kaltmiete), excluding utilities."
              >
                <input
                  type="number"
                  min="0"
                  className="input"
                  value={form.rent}
                  onChange={(e) =>
                    set(
                      'rent',
                      e.target.value,
                    )
                  }
                  placeholder="e.g. 750"
                  required
                />
              </Field>

              <Field
                label="Deposit (€)"
                required
              >
                <input
                  type="number"
                  min="0"
                  className="input"
                  value={form.deposit}
                  onChange={(e) =>
                    set(
                      'deposit',
                      e.target.value,
                    )
                  }
                  placeholder="e.g. 1500"
                  required
                />
              </Field>

              <Field label="Shared with">
                <Segmented
                  options={[
                    'Any gender',
                    'Male',
                    'Female',
                  ]}
                  value={
                    form.rooms[0]
                      ?.sharedWith ||
                    'Any gender'
                  }
                  onChange={(value) =>
                    set(
                      'rooms',
                      form.rooms.length >
                        0
                        ? [
                            {
                              ...form.rooms[0],
                              sharedWith:
                                value,
                            },
                            ...form.rooms.slice(
                              1,
                            ),
                          ]
                        : [
                            {
                              ...empty.rooms[0],
                              sharedWith:
                                value,
                            },
                          ],
                    )
                  }
                />
              </Field>
            </div>
          )}
        </FormCard>

        {/* UTILITIES & TERMS */}
        <FormCard
          title="Utilities & terms"
          icon={Zap}
        >
          <Field
            label="Utilities included"
            hint="On by default — switch off anything not included."
          >
            <div className="flex flex-wrap gap-2">
              {[
                {
                  key: 'Electricity',
                  icon: Zap,
                },
                {
                  key: 'Water',
                  icon: Droplet,
                },
                {
                  key: 'Heating',
                  icon: Flame,
                },
                {
                  key: 'Internet',
                  icon: Wifi,
                },
              ].map(
                ({
                  key,
                  icon: Icon,
                }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      toggleUtility(key)
                    }
                    className={classNames(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition',
                      form
                        .utilitiesIncluded[
                        key
                        ]
                        ? 'border-brand-200 bg-brand-50 text-brand-700'
                        : 'border-ink-200 bg-ink-50 text-ink-500',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {key}
                    <span>
                      {form
                        .utilitiesIncluded[
                        key
                        ]
                        ? '✓'
                        : '×'}
                    </span>
                  </button>
                ),
              )}
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Anmeldung provided"
              hint="Confirms the tenant can register their address here."
            >
              <Segmented
                options={['Yes', 'No']}
                value={form.anmeldung}
                onChange={(value) =>
                  set(
                    'anmeldung',
                    value,
                  )
                }
              />
            </Field>

            <Field label="Service / brokerage fee">
              <Segmented
                options={['No', 'Yes']}
                value={form.brokerFee}
                onChange={(value) =>
                  set(
                    'brokerFee',
                    value,
                  )
                }
              />
            </Field>

            {form.brokerFee ===
              'Yes' && (
              <Field
                label="Fee amount (€ or % of rent)"
                full
              >
                <input
                  className="input"
                  value={
                    form.brokerFeeAmount
                  }
                  onChange={(e) =>
                    set(
                      'brokerFeeAmount',
                      e.target.value,
                    )
                  }
                  placeholder="e.g. 1 month's rent"
                />
              </Field>
            )}
          </div>
        </FormCard>

        {/* DESCRIPTION */}
        <FormCard
          title="Description"
          icon={FileCheck2}
        >
          <Field
            label="Description"
            full
            required
          >
            <textarea
              rows={6}
              className="input min-h-32 resize-y"
              value={form.description}
              onChange={(e) =>
                set(
                  'description',
                  e.target.value,
                )
              }
              placeholder="Describe the property, the neighborhood, house rules, and what kind of housemate you're looking for..."
              required
            />
          </Field>
        </FormCard>

        <div className="flex items-center justify-end gap-3">
          <Link
            to="/dashboard/landlord"
            className="btn-secondary"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="btn-primary"
          >
            <Save className="h-4 w-4" />
            {editing
              ? 'Save changes'
              : 'Publish listing'}
          </button>
        </div>
      </form>
    </div>
  )
}

function FormCard({
  title,
  subtitle,
  icon: Icon,
  children,
}) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Icon className="h-4 w-4" />
          </div>
        )}

        <div>
          <h2 className="text-base font-bold text-ink-900">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-0.5 text-xs text-ink-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {children}
      </div>
    </section>
  )
}

function Field({
  label,
  children,
  full,
  required,
  hint,
}) {
  return (
    <div
      className={
        full
          ? 'sm:col-span-2 lg:col-span-4'
          : ''
      }
    >
      <label className="label">
        {label}
        {required && (
          <span className="ml-0.5 text-brand-600">
            *
          </span>
        )}
      </label>

      {children}

      {hint && (
        <p className="mt-1.5 text-xs leading-snug text-ink-400">
          {hint}
        </p>
      )}
    </div>
  )
}

function Segmented({
  options,
  value,
  onChange,
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() =>
            onChange(option)
          }
          className={classNames(
            'rounded-full border px-3.5 py-2 text-xs font-semibold transition',
            value === option
              ? 'border-brand-600 bg-brand-600 text-white'
              : 'border-ink-200 bg-white text-ink-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  labelOn = 'On',
  labelOff = 'Off',
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onChange(!checked)
      }
      className={classNames(
        'inline-flex items-center gap-2 rounded-full px-1 py-1 text-xs font-bold transition',
        checked
          ? 'bg-brand-50 text-brand-700'
          : 'bg-ink-50 text-ink-500',
      )}
    >
      <span
        className={classNames(
          'relative h-5 w-9 rounded-full transition-colors',
          checked
            ? 'bg-brand-600'
            : 'bg-ink-300',
        )}
      >
        <span
          className={classNames(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all',
            checked
              ? 'left-[18px]'
              : 'left-0.5',
          )}
        />
      </span>

      {checked
        ? labelOn
        : labelOff}
    </button>
  )
}

function RoomCard({
  room,
  onChange,
  onRemove,
  canRemove,
}) {
  return (
    <div
      className={classNames(
        'rounded-xl border p-4 transition',
        room.available
          ? 'border-ink-200 bg-white'
          : 'border-ink-100 bg-ink-50/60 opacity-70',
      )}
    >
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <input
          value={room.name}
          onChange={(e) =>
            onChange({
              ...room,
              name: e.target.value,
            })
          }
          className="min-w-0 flex-1 bg-transparent text-sm font-bold text-ink-800 outline-none"
        />

        <div className="flex items-center gap-2">
          <Toggle
            checked={room.available}
            onChange={(value) =>
              onChange({
                ...room,
                available: value,
              })
            }
            labelOn="Available"
            labelOff="Taken"
          />

          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="flex h-7 w-7 items-center justify-center rounded-full text-ink-300 hover:bg-red-50 hover:text-red-500"
              aria-label={`Remove ${room.name}`}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Rent (€/mo)">
          <input
            type="number"
            min="0"
            className="input"
            placeholder="450"
            value={room.rent}
            onChange={(e) =>
              onChange({
                ...room,
                rent: e.target.value,
              })
            }
          />
        </Field>

        <Field label="Deposit (€)">
          <input
            type="number"
            min="0"
            className="input"
            placeholder="900"
            value={room.deposit}
            onChange={(e) =>
              onChange({
                ...room,
                deposit:
                  e.target.value,
              })
            }
          />
        </Field>

        <Field label="No. of persons">
          <input
            type="number"
            min="1"
            className="input"
            placeholder="1"
            value={room.persons}
            onChange={(e) =>
              onChange({
                ...room,
                persons:
                  e.target.value,
              })
            }
          />
        </Field>

        <Field label="Shared with">
          <select
            className="input"
            value={room.sharedWith}
            onChange={(e) =>
              onChange({
                ...room,
                sharedWith:
                  e.target.value,
              })
            }
          >
            <option>
              Any gender
            </option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </Field>
      </div>
    </div>
  )
}

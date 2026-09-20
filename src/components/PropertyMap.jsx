import { useEffect, useRef } from 'react'

const GERMANY_CENTER = { lat: 51.1657, lng: 10.4515 }
const DEFAULT_ZOOM = 6
const NEARBY_RADIUS_METERS = 2000

let googleMapsPromise = null

function loadGoogleMaps() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return Promise.reject(
      new Error(
        'VITE_GOOGLE_MAPS_API_KEY is missing from the .env file.',
      ),
    )
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps)
  }

  if (googleMapsPromise) {
    return googleMapsPromise
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[data-german-mitra-google-maps="true"]',
    )

    if (existingScript) {
      existingScript.addEventListener('load', () =>
        resolve(window.google.maps),
      )

      existingScript.addEventListener('error', () =>
        reject(
          new Error('Google Maps failed to load.'),
        ),
      )

      return
    }

    const script = document.createElement('script')

    script.src =
      `https://maps.googleapis.com/maps/api/js` +
      `?key=${encodeURIComponent(apiKey)}` +
      `&v=weekly` +
      `&libraries=places`

    script.async = true
    script.defer = true
    script.dataset.germanMitraGoogleMaps = 'true'

    script.onload = () => {
      if (window.google?.maps) {
        resolve(window.google.maps)
      } else {
        reject(
          new Error('Google Maps loaded without the Maps API.'),
        )
      }
    }

    script.onerror = () => {
      reject(
        new Error(
          'Unable to load Google Maps. Check your API key and enabled APIs.',
        ),
      )
    }

    document.head.appendChild(script)
  })

  return googleMapsPromise
}

function escapeSvgText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function propertyMarkerIcon(selected = false) {
  const background = selected ? '#F59E0B' : '#003B73'
  const houseColor = selected ? '#003B73' : '#F59E0B'
  const size = selected ? 46 : 42

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 ${size} ${size}"
    >
      <g transform="rotate(-45 ${size / 2} ${size / 2})">
        <rect
          x="1.5"
          y="1.5"
          width="${size - 3}"
          height="${size - 3}"
          rx="${size / 2}"
          fill="${background}"
          stroke="${selected ? '#003B73' : '#FFFFFF'}"
          stroke-width="3"
        />

        <g transform="rotate(45 ${size / 2} ${size / 2})">
          <path
            d="M${size * 0.27} ${size * 0.25}
               L${size * 0.5} ${size * 0.08}
               L${size * 0.73} ${size * 0.25}
               V${size * 0.7}
               H${size * 0.58}
               V${size * 0.5}
               H${size * 0.42}
               V${size * 0.7}
               H${size * 0.27}
               Z"
            fill="${houseColor}"
            stroke="#FFFFFF"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </g>
      </g>
    </svg>
  `

  return {
    url:
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(svg),
    scaledSize: new window.google.maps.Size(size, size),
    anchor: new window.google.maps.Point(
      size / 2,
      size,
    ),
  }
}


function getValidProperties(properties) {
  return properties
    .map((property) => {
      if (!property.coordinates) {
        return null
      }

      const lat = Number(property.coordinates.lat)
      const lng = Number(property.coordinates.lng)

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return null
      }

      return {
        ...property,
        lat,
        lng,
      }
    })
    .filter(Boolean)
}

function GooglePropertyMap({
  properties,
  onLocationSelect,
  onPropertyPopupClick,
  onViewportChange,
  selectedLocation,
  radiusKm,
}) {
  const mapElementRef = useRef(null)
  const mapRef = useRef(null)

  const propertyMarkersRef = useRef([])
  const infoWindowRef = useRef(null)
  const selectedCircleRef = useRef(null)

  const userInteractionRef = useRef(false)
  const programmaticMoveRef = useRef(false)
  const initialFitDoneRef = useRef(false)

  const propertiesRef = useRef(properties)
  const selectedLocationRef = useRef(
    selectedLocation,
  )
  const onPropertyPopupClickRef = useRef(
    onPropertyPopupClick,
  )

  useEffect(() => {
    propertiesRef.current = properties
  }, [properties])

  useEffect(() => {
    selectedLocationRef.current = selectedLocation
  }, [selectedLocation])

  useEffect(() => {
    onPropertyPopupClickRef.current =
      onPropertyPopupClick
  }, [onPropertyPopupClick])

  function clearPropertyMarkers() {
    propertyMarkersRef.current.forEach((marker) => {
      marker.setMap(null)
    })

    propertyMarkersRef.current = []
  }


  function clearCircle() {
    if (selectedCircleRef.current) {
      selectedCircleRef.current.setMap(null)
      selectedCircleRef.current = null
    }
  }


  function fitMapToProperties() {
    const map = mapRef.current

    if (!map) {
      return
    }

    const validProperties =
      getValidProperties(propertiesRef.current)

    programmaticMoveRef.current = true

    if (!validProperties.length) {
      map.setCenter(GERMANY_CENTER)
      map.setZoom(DEFAULT_ZOOM)

      window.google.maps.event.addListenerOnce(
        map,
        'idle',
        () => {
          programmaticMoveRef.current = false
        },
      )

      return
    }

    if (validProperties.length === 1) {
      const property = validProperties[0]

      map.setCenter({
        lat: property.lat,
        lng: property.lng,
      })

      map.setZoom(14)

      window.google.maps.event.addListenerOnce(
        map,
        'idle',
        () => {
          programmaticMoveRef.current = false
        },
      )

      return
    }

    const bounds =
      new window.google.maps.LatLngBounds()

    validProperties.forEach((property) => {
      bounds.extend({
        lat: property.lat,
        lng: property.lng,
      })
    })

    map.fitBounds(bounds, 60)

    window.google.maps.event.addListenerOnce(
      map,
      'idle',
      () => {
        programmaticMoveRef.current = false
      },
    )
  }

  function renderPropertyMarkers() {
    const map = mapRef.current

    if (!map) {
      return
    }

    clearPropertyMarkers()

    const validProperties =
      getValidProperties(propertiesRef.current)

    validProperties.forEach((property) => {
      const marker =
        new window.google.maps.Marker({
          map,
          position: {
            lat: property.lat,
            lng: property.lng,
          },
          icon: propertyMarkerIcon(false),
          title: property.title,
          zIndex: 100,
        })

      marker.addListener('click', () => {
        if (!infoWindowRef.current) {
          infoWindowRef.current =
            new window.google.maps.InfoWindow()
        }

        const image =
          property.images?.[0] ||
          property.image ||
          ''

        const details = [
          property.bedrooms != null
            ? `${escapeSvgText(property.bedrooms)} room${Number(property.bedrooms) === 1 ? '' : 's'}`
            : '',
          property.bathrooms != null
            ? `${escapeSvgText(property.bathrooms)} bath${Number(property.bathrooms) === 1 ? '' : 's'}`
            : '',
          property.area != null
            ? `${escapeSvgText(property.area)} m²`
            : '',
        ].filter(Boolean)

        const galleryImages = (
          property.images?.filter(Boolean) || []
        )

        if (
          galleryImages.length === 0 &&
          (property.image || '')
        ) {
          galleryImages.push(property.image)
        }

        const mapWidth =
          mapElementRef.current?.clientWidth || 440

        const viewportWidth =
          window.innerWidth || mapWidth

        // Responsive card width: smaller on phones, capped on desktop,
        // and always kept inside the actual map viewport.
        const smallScreen =
          viewportWidth <= 420 || mapWidth <= 340

        const popupWidth = smallScreen
          ? Math.max(
              170,
              Math.min(
                220,
                mapWidth - 44,
                viewportWidth - 44,
              ),
            )
          : Math.max(
              190,
              Math.min(
                250,
                mapWidth - 24,
                viewportWidth - 28,
              ),
            )

        // Keep the image proportional to the selected card width.
        const imageHeight = smallScreen
          ? Math.max(
              82,
              Math.min(
                102,
                Math.round(popupWidth * 0.46),
              ),
            )
          : Math.max(
              90,
              Math.min(
                115,
                Math.round(popupWidth * 0.46),
              ),
            )

        // Responsive navigation controls so both arrows remain visible.
        const arrowSize = Math.max(
          22,
          Math.min(
            30,
            Math.round(popupWidth * 0.12),
          ),
        )

        const controlInset = Math.max(
          5,
          Math.min(8, Math.round(popupWidth * 0.025)),
        )

        const galleryImage =
          galleryImages[0] || ''

        const hasMultipleImages =
          galleryImages.length > 1

        const popupElement =
          document.createElement('div')

        popupElement.className =
          'german-mitra-property-popup'

        popupElement.style.width =
          `${popupWidth}px`
        popupElement.style.maxWidth =
          `${popupWidth}px`
        popupElement.style.minWidth =
          '0'
        popupElement.style.maxWidth =
          `${popupWidth}px`
        popupElement.style.overflow = 'hidden'
        popupElement.style.boxSizing = 'border-box'
        popupElement.style.margin = '0'
        popupElement.style.borderRadius = '8px'
        popupElement.style.background = '#ffffff'
        popupElement.style.boxShadow =
          '0 10px 30px rgba(15,23,42,0.18)'
        popupElement.style.fontFamily =
          'Arial,sans-serif'

        popupElement.innerHTML = `
          ${
            galleryImage
              ? `
                <div
                  style="
                    position:relative;
                    display:block;
                    width:100%;
                    max-width:100%;
                    height:${imageHeight}px;
                    overflow:hidden;
                    background:#E5E7EB;
                    border-radius:0;
                    box-sizing:border-box;
                    margin:0;
                    padding:0;
                    margin:0;
                    padding:0;
                  "
                >
                  <img
                    data-map-gallery-image="true"
                    src="${escapeSvgText(galleryImage)}"
                    alt="${escapeSvgText(property.title || 'Property')}"
                    style="
                      display:block;
                      width:100%;
                      max-width:100%;
                      height:100%;
                      margin:0;
                      padding:0;
                      object-fit:cover;
                      cursor:pointer;
                    "
                    title="Click to show this property"
                  />

                  <button
                    type="button"
                    data-popup-close="true"
                    aria-label="Close property preview"
                    style="
                      position:absolute;
                      right:${controlInset}px;
                      top:${controlInset}px;
                      z-index:20;
                      width:${arrowSize}px;
                      height:${arrowSize}px;
                      border:0;
                      border-radius:50%;
                      background:rgba(17,24,39,.58);
                      color:#fff;
                      font-size:${Math.max(17, Math.round(arrowSize * 0.70))}px;
                      line-height:${arrowSize}px;
                      padding:0;
                      cursor:pointer;
                      display:flex;
                      align-items:center;
                      justify-content:center;
                    "
                  >×</button>

                  ${
                    hasMultipleImages
                      ? `
                        <button
                          type="button"
                          data-gallery-prev="true"
                          aria-label="Previous photo"
                          style="
                            position:absolute;
                            left:${controlInset}px;
                            top:50%;
                            transform:translateY(-50%);
                            width:${arrowSize}px;
                            height:${arrowSize}px;
                            border:0;
                            border-radius:50%;
                            background:rgba(17,24,39,.58);
                            color:#fff;
                            font-size:${Math.max(18, Math.round(arrowSize * 0.68))}px;
                            line-height:${arrowSize}px;
                            cursor:pointer;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                          "
                        >‹</button>

                        <button
                          type="button"
                          data-gallery-next="true"
                          aria-label="Next photo"
                          style="
                            position:absolute;
                            right:${controlInset}px;
                            top:50%;
                            transform:translateY(-50%);
                            width:${arrowSize}px;
                            height:${arrowSize}px;
                            border:0;
                            border-radius:50%;
                            background:rgba(17,24,39,.58);
                            color:#fff;
                            font-size:${Math.max(18, Math.round(arrowSize * 0.68))}px;
                            line-height:${arrowSize}px;
                            cursor:pointer;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                          "
                        >›</button>
                      `
                      : ''
                  }
                </div>
              `
              : ''
          }

          <div
            style="
              padding:8px 9px 9px;
              box-sizing:border-box;
              overflow-x:hidden;
              overflow-y:auto;
              scrollbar-width:thin;
              max-height:160px;
            "
          >
            <div
              style="
                font-size:16px;
                line-height:1.1;
                font-weight:800;
                color:#111827;
                margin-bottom:6px;
              "
            >
              €${escapeSvgText(property.rent ?? '')}
              <span
                style="
                  font-size:12px;
                  font-weight:500;
                  color:#6B7280;
                "
              >per month</span>
            </div>

            <div
              style="
                font-size:14px;
                line-height:1.18;
                font-weight:700;
                color:#111827;
                margin-bottom:5px;
                width:100%;
                max-width:100%;
                min-width:0;
                display:-webkit-box;
                -webkit-line-clamp:2;
                -webkit-box-orient:vertical;
                overflow:hidden;
                overflow-wrap:anywhere;
                word-break:break-word;
              "
            >
              ${escapeSvgText(property.title || 'Property')}
            </div>

            <div
              style="
                font-size:11px;
                line-height:1.3;
                color:#6B7280;
                margin-bottom:9px;
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
                max-width:100%;
              "
            >
              ${escapeSvgText(
                [property.district, property.city]
                  .filter(Boolean)
                  .join(', '),
              )}
            </div>

            ${
              details.length
                ? `
                  <div
                    style="
                      display:flex;
                      align-items:center;
                      gap:7px;
                      flex-wrap:wrap;
                      font-size:11px;
                      line-height:1.25;
                      width:100%;
                      max-width:100%;
                      color:#4B5563;
                    "
                  >
                    ${details
                      .map(
                        (detail, detailIndex) => `
                          ${
                            detailIndex > 0
                              ? '<span style="color:#9CA3AF;">•</span>'
                              : ''
                          }
                          <span
                            style="white-space:nowrap;"
                          >${detail}</span>
                        `,
                      )
                      .join('')}
                  </div>
                `
                : ''
            }
          </div>
        `

        const imageElement =
          popupElement.querySelector(
            '[data-map-gallery-image="true"]',
          )

        const previousButton =
          popupElement.querySelector(
            '[data-gallery-prev="true"]',
          )

        const nextButton =
          popupElement.querySelector(
            '[data-gallery-next="true"]',
          )

        const closeButton =
          popupElement.querySelector(
            '[data-popup-close="true"]',
          )

        let imageIndex = 0

        const updateGalleryImage = () => {
          if (!imageElement || !galleryImages.length) {
            return
          }

          imageElement.src =
            galleryImages[imageIndex]
        }

        if (imageElement) {
          imageElement.addEventListener(
            'click',
            (event) => {
              event.preventDefault()
              event.stopPropagation()

              if (
                onPropertyPopupClickRef.current
              ) {
                onPropertyPopupClickRef.current(
                  property.id,
                )
              }
            },
          )
        }

        if (closeButton) {
          closeButton.addEventListener(
            'click',
            (event) => {
              event.preventDefault()
              event.stopPropagation()

              infoWindowRef.current?.close()
            },
          )
        }

        if (previousButton) {
          previousButton.addEventListener(
            'click',
            (event) => {
              event.preventDefault()
              event.stopPropagation()

              imageIndex =
                (imageIndex -
                  1 +
                  galleryImages.length) %
                galleryImages.length

              updateGalleryImage()
            },
          )
        }

        if (nextButton) {
          nextButton.addEventListener(
            'click',
            (event) => {
              event.preventDefault()
              event.stopPropagation()

              imageIndex =
                (imageIndex + 1) %
                galleryImages.length

              updateGalleryImage()
            },
          )
        }

        infoWindowRef.current.setContent(popupElement)

        infoWindowRef.current.setOptions({
          maxWidth: popupWidth,
        })

        infoWindowRef.current.open({
          map,
          anchor: marker,
        })

        window.google.maps.event.addListenerOnce(
          infoWindowRef.current,
          'domready',
          () => {
            const infoWindows =
              document.querySelectorAll(
                '.gm-style-iw, .gm-style-iw-c, .gm-style-iw-d',
              )

            infoWindows.forEach((element) => {
              element.style.setProperty(
                'overflow',
                'hidden',
                'important',
              )
              element.style.setProperty(
                'overflow-x',
                'hidden',
                'important',
              )
              element.style.setProperty(
                'overflow-y',
                'hidden',
                'important',
              )
              element.style.setProperty(
                'padding',
                '0',
                'important',
              )
              element.style.setProperty(
                'margin',
                '0',
                'important',
              )
              element.style.setProperty(
                'max-height',
                'none',
                'important',
              )
              element.style.setProperty(
                'max-width',
                `${popupWidth}px`,
                'important',
              )
              element.style.setProperty(
                'width',
                `${popupWidth}px`,
                'important',
              )
              element.style.setProperty(
                'max-width',
                `${popupWidth}px`,
                'important',
              )
              element.style.setProperty(
                'min-width',
                '0',
                'important',
              )
              element.style.setProperty(
                'height',
                'auto',
                'important',
              )
              element.style.setProperty(
                'padding',
                '0',
                'important',
              )
              element.style.setProperty(
                'margin',
                '0',
                'important',
              )
              element.style.setProperty(
                'box-sizing',
                'border-box',
                'important',
              )
              element.style.setProperty(
                'padding',
                '0',
                'important',
              )
              element.style.setProperty(
                'margin',
                '0',
                'important',
              )
              element.style.setProperty(
                'box-sizing',
                'border-box',
                'important',
              )
            })

            document
              .querySelectorAll('.gm-ui-hover-effect')
              .forEach((button) => {
                button.style.display = 'none'
              })

            document
              .querySelectorAll('.gm-style-iw-ch, .gm-style-iw-chr')
              .forEach((element) => {
                element.style.setProperty(
                  'padding',
                  '0',
                  'important',
                )
                element.style.setProperty(
                  'margin',
                  '0',
                  'important',
                )
                element.style.setProperty(
                  'height',
                  '0',
                  'important',
                )
                element.style.setProperty(
                  'min-height',
                  '0',
                  'important',
                )
                element.style.setProperty(
                  'max-height',
                  '0',
                  'important',
                )
                element.style.setProperty(
                  'overflow',
                  'hidden',
                  'important',
                )
              })

            const bubble =
              document.querySelector(
                '.german-mitra-property-popup',
              )

            if (bubble) {
              bubble.style.setProperty(
                'width',
                `${popupWidth}px`,
                'important',
              )
              bubble.style.setProperty(
                'max-width',
                `${popupWidth}px`,
                'important',
              )
              bubble.style.setProperty(
                'overflow',
                'hidden',
                'important',
              )
              bubble.style.margin = '0'
            }
          },
        )
      })

      propertyMarkersRef.current.push(marker)
    })
  }

  function renderSelectedCircle() {
    const map = mapRef.current

    if (!map) {
      return
    }

    clearCircle()

    const selected =
      selectedLocationRef.current

    if (!selected?.propertyId) {
      return
    }

    selectedCircleRef.current =
      new window.google.maps.Circle({
        map,
        center: {
          lat: selected.lat,
          lng: selected.lng,
        },
        radius:
          radiusKm * 1000,
        strokeColor: '#003B73',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#F59E0B',
        fillOpacity: 0.12,
        clickable: false,
      })
  }

  useEffect(() => {
    let cancelled = false

    loadGoogleMaps()
      .then(() => {
        if (
          cancelled ||
          !mapElementRef.current ||
          mapRef.current
        ) {
          return
        }

        const map =
          new window.google.maps.Map(
            mapElementRef.current,
            {
              center: GERMANY_CENTER,
              zoom: DEFAULT_ZOOM,
              mapTypeId: 'terrain',
              mapTypeControl: true,
              streetViewControl: false,
              fullscreenControl: true,
              zoomControl: true,
              gestureHandling: 'greedy',
              clickableIcons: false,
            },
          )

        mapRef.current = map

        infoWindowRef.current =
          new window.google.maps.InfoWindow()

        map.addListener('dragstart', () => {
          userInteractionRef.current = true
        })

        map.addListener('zoom_changed', () => {
          if (!programmaticMoveRef.current) {
            userInteractionRef.current = true
          }
        })

        map.addListener('click', (event) => {
          if (
            !event.latLng ||
            !onLocationSelect
          ) {
            return
          }

          onLocationSelect({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            propertyId: null,
          })
        })

        map.addListener('idle', () => {
          if (
            !programmaticMoveRef.current &&
            userInteractionRef.current
          ) {
            userInteractionRef.current = false

            const center = map.getCenter()

            if (
              center &&
              onViewportChange
            ) {
              onViewportChange({
                lat: center.lat(),
                lng: center.lng(),
              })
            }

          }

          if (!initialFitDoneRef.current) {
            initialFitDoneRef.current = true

            fitMapToProperties()
            renderPropertyMarkers()
            renderSelectedCircle()

            window.setTimeout(() => {
              }, 300)
          }
        })

        window.addEventListener(
          'resize',
          () => {
            window.google.maps.event.trigger(
              map,
              'resize',
            )
          },
        )

        fitMapToProperties()
        renderPropertyMarkers()
        renderSelectedCircle()
      })
      .catch((error) => {
        console.error(
          'Google Maps initialization failed:',
          error,
        )
      })

    return () => {
      cancelled = true

      clearPropertyMarkers()
      clearCircle()

      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) {
      return
    }

    renderPropertyMarkers()
    renderSelectedCircle()
  }, [
    properties,
    selectedLocation,
    radiusKm,
  ])

  return (
    <div
      ref={mapElementRef}
      className="h-full min-h-0 w-full"
    />
  )
}

export function PropertyMap({
  properties = [],
  onLocationSelect,
  onPropertyPopupClick,
  onViewportChange,
  selectedLocation,
  radiusKm = 2,
}) {
  return (
    <div
      className="relative z-0 h-full min-h-0 overflow-hidden rounded-2xl border border-ink-200 bg-ink-100 shadow-card"
      style={{
        overscrollBehavior: 'contain',
      }}
    >
      <GooglePropertyMap
        properties={properties}
        onLocationSelect={onLocationSelect}
        onPropertyPopupClick={onPropertyPopupClick}
        onViewportChange={onViewportChange}
        selectedLocation={selectedLocation}
        radiusKm={radiusKm}
      />
    </div>
  )
}

export default PropertyMap
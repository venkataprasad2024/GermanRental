import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function PropertyGallery({ images = [], alt = 'Property' }) {
  const validImages = Array.isArray(images) ? images.filter(Boolean) : []
  const [activeIndex, setActiveIndex] = useState(0)
  const galleryRef = useRef(null)

  const goTo = (index, behavior = 'smooth') => {
    const gallery = galleryRef.current
    if (!gallery || !validImages.length) return

    const nextIndex = Math.max(
      0,
      Math.min(index, validImages.length - 1),
    )

    const slideWidth = gallery.clientWidth

    gallery.scrollTo({
      left: slideWidth * nextIndex,
      behavior,
    })

    setActiveIndex(nextIndex)
  }

  const handlePrevious = () => {
    goTo(activeIndex - 1)
  }

  const handleNext = () => {
    goTo(activeIndex + 1)
  }

  /*
   * Keep active dot synchronized with manual touch/swipe.
   */
  useEffect(() => {
    const gallery = galleryRef.current
    if (!gallery || validImages.length <= 1) return

    let frameId

    const handleScroll = () => {
      cancelAnimationFrame(frameId)

      frameId = requestAnimationFrame(() => {
        const slideWidth = gallery.clientWidth

        if (!slideWidth) return

        const index = Math.round(
          gallery.scrollLeft / slideWidth,
        )

        const safeIndex = Math.max(
          0,
          Math.min(index, validImages.length - 1),
        )

        setActiveIndex((current) =>
          current === safeIndex ? current : safeIndex,
        )
      })
    }

    gallery.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      gallery.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(frameId)
    }
  }, [validImages.length])

  /*
   * Recalculate position when screen width changes.
   * This prevents the image from becoming partially shifted
   * after mobile browser resize/orientation changes.
   */
  useEffect(() => {
    const handleResize = () => {
      const gallery = galleryRef.current

      if (!gallery) return

      const slideWidth = gallery.clientWidth

      if (!slideWidth) return

      gallery.scrollTo({
        left: slideWidth * activeIndex,
        behavior: 'auto',
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [activeIndex])

  /*
   * Make sure activeIndex is always valid.
   */
  useEffect(() => {
    if (activeIndex >= validImages.length) {
      setActiveIndex(Math.max(0, validImages.length - 1))
    }
  }, [activeIndex, validImages.length])

  if (!validImages.length) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-3xl bg-ink-100 text-sm text-ink-500">
        No property photos available
      </div>
    )
  }

  return (
    <div className="w-full min-w-0">
      <div
        className="
          relative
          w-full
          min-w-0
          overflow-hidden
          rounded-3xl
          bg-ink-100
          shadow-card
        "
      >
        <div
          ref={galleryRef}
          className="
            flex
            w-full
            min-w-0
            snap-x
            snap-mandatory
            overflow-x-auto
            overscroll-x-contain
            scroll-smooth
            touch-pan-x
            scrollbar-none
            [-ms-overflow-style:none]
            [scrollbar-width:none]
          "
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollPadding: 0,
          }}
          aria-label="Property photos"
        >
          {validImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="
                relative
                min-w-0
                w-full
                max-w-full
                flex-[0_0_100%]
                snap-start
                aspect-[16/10]
                overflow-hidden
              "
            >
              <img
                src={image}
                alt={`${alt} photo ${index + 1}`}
                className="
                  block
                  h-full
                  w-full
                  max-w-full
                  select-none
                  object-cover
                  object-center
                "
                draggable="false"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {validImages.length > 1 && (
          <>
            {/* Previous */}
            <button
              type="button"
              onClick={handlePrevious}
              disabled={activeIndex === 0}
              aria-label="Previous photo"
              className="
                absolute
                left-3
                top-1/2
                z-10
                flex
                h-9
                w-9
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/90
                text-ink-800
                shadow-lg
                transition
                hover:bg-white
                active:scale-95
                disabled:pointer-events-none
                disabled:opacity-35
                sm:left-4
                sm:h-11
                sm:w-11
              "
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={handleNext}
              disabled={activeIndex === validImages.length - 1}
              aria-label="Next photo"
              className="
                absolute
                right-3
                top-1/2
                z-10
                flex
                h-9
                w-9
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/90
                text-ink-800
                shadow-lg
                transition
                hover:bg-white
                active:scale-95
                disabled:pointer-events-none
                disabled:opacity-35
                sm:right-4
                sm:h-11
                sm:w-11
              "
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {validImages.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {validImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-current={
                activeIndex === index ? 'true' : 'false'
              }
              className={`
                rounded-full
                transition-all
                duration-200
                ${
                  activeIndex === index
                    ? 'h-1.5 w-6 bg-brand-600'
                    : 'h-1.5 w-1.5 bg-ink-300 hover:bg-ink-400'
                }
              `}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PropertyGallery
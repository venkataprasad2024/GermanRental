import { useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { classNames } from '../utils/format'

export function PropertyGallery({ images, alt }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const go = (dir) => {
    setActive((prev) => (prev + dir + images.length) % images.length)
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl bg-ink-100">
        <div className="aspect-[16/10] w-full">
          <img
            src={images[active]}
            alt={`${alt} - photo ${active + 1}`}
            className="h-full w-full object-cover"
          />
        </div>

        <button
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-800 shadow-soft backdrop-blur transition hover:bg-white"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-800 shadow-soft backdrop-blur transition hover:bg-white"
          aria-label="Next photo"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <button
          onClick={() => setLightbox(true)}
          className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-ink-950/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-ink-950/80"
        >
          <Expand className="h-3.5 w-3.5" /> Fullscreen
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink-950/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {active + 1} / {images.length}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={classNames(
              'overflow-hidden rounded-xl ring-2 transition',
              active === i ? 'ring-brand-600' : 'ring-transparent hover:ring-ink-200',
            )}
          >
            <div className="aspect-square w-full bg-ink-100">
              <img src={src} alt={`${alt} thumbnail ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
            </div>
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-ink-950/90 p-4 animate-fade-in"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            onClick={() => setLightbox(false)}
            aria-label="Close fullscreen"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={images[active]}
            alt={`${alt} fullscreen`}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); go(-1) }}
            className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); go(1) }}
            className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  )
}

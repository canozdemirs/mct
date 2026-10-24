"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface BeforeAfterPhoto {
  src: string;
  alt: string;
}

// Responsive grid (2 cols mobile, 3 desktop) + click-to-open lightbox with
// prev/next navigation. Images are pre-composited "Before/After" pairs
// (with a real patient quote baked into the image itself by whoever made
// the original graphic) -- there is no separate caption to add here, and
// none is invented.
export function BeforeAfterGallery({ photos }: { photos: BeforeAfterPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function close() {
    setOpenIndex(null);
  }
  function prev(e?: React.MouseEvent) {
    e?.stopPropagation();
    setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }
  function next(e?: React.MouseEvent) {
    e?.stopPropagation();
    setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            onClick={() => setOpenIndex(i)}
            className="relative rounded-xl overflow-hidden shadow-md cursor-zoom-in block w-full text-left"
            style={{ aspectRatio: "1/1", border: "1px solid rgba(87,136,172,0.15)" }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 33vw"
              priority={i === 0}
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[999] bg-black/85 flex items-center justify-center p-4"
          onClick={close}
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X size={22} />
          </button>
          <button
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            aria-label="Next photo"
            className="absolute right-2 sm:right-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="relative" style={{ width: "min(90vw, 640px)", aspectRatio: "1/1" }}>
            <Image
              src={photos[openIndex].src}
              alt={photos[openIndex].alt}
              fill
              className="object-contain rounded-xl"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </>
  );
}

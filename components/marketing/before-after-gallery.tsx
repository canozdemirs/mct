"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface BeforeAfterPhoto {
  src: string;
  alt: string;
}

// Two layouts sharing one lightbox (full-resolution, prev/next):
// - "grid": 1 column on mobile (large, full width), 2-3 on desktop. Used
//   for the real before/after result photos.
// - "carousel": horizontal scroll-snap row -- a native swipeable carousel
//   on mobile with no extra JS/library, and just a row on desktop since
//   the cards don't wrap. Used for the Google review screenshot cards.
// Images are pre-composited graphics (a real patient quote or review text
// baked into the image itself by whoever made the original) -- there is
// no separate caption to add here, and none is invented.
export function BeforeAfterGallery({
  photos,
  layout = "grid",
}: {
  photos: BeforeAfterPhoto[];
  layout?: "grid" | "carousel";
}) {
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
      {layout === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={i === 0}
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-2 -mx-5 px-5 sm:mx-0 sm:px-0" style={{ scrollbarWidth: "none" }}>
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              onClick={() => setOpenIndex(i)}
              className="relative rounded-xl overflow-hidden shadow-md cursor-zoom-in text-left shrink-0 snap-start"
              style={{ width: "72vw", maxWidth: 260, aspectRatio: "1/1", border: "1px solid rgba(87,136,172,0.15)" }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="280px"
              />
            </button>
          ))}
        </div>
      )}

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
            aria-label="Previous"
            className="absolute left-2 sm:left-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-2 sm:right-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="relative" style={{ width: "min(94vw, 1080px)", aspectRatio: "1/1" }}>
            <Image
              src={photos[openIndex].src}
              alt={photos[openIndex].alt}
              fill
              className="object-contain rounded-xl"
              sizes="(max-width: 1080px) 94vw, 1080px"
              quality={95}
            />
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { HospitalImage } from "./hospital-image";

interface Props {
  images: string[];
  name: string;
}

export function HospitalGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div className="mb-6">
      <HospitalImage
        key={active}
        src={images[active]}
        alt={`${name} — image ${active + 1}`}
        wrapperClassName="aspect-video relative rounded-2xl overflow-hidden"
        sizes="(max-width: 1024px) 100vw, 65vw"
        priority={active === 0}
      />
      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative flex-1 aspect-video rounded-xl overflow-hidden border-2 transition-colors ${
                i === active
                  ? "border-[#1ab3c8]"
                  : "border-transparent hover:border-slate-300"
              }`}
            >
              <HospitalImage
                src={src}
                alt={`${name} thumbnail ${i + 1}`}
                wrapperClassName="absolute inset-0"
                sizes="(max-width: 768px) 25vw, 12vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

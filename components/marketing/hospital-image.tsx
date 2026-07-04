"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  /** Must include `relative` (or another positioned value) for fill to work */
  wrapperClassName: string;
  sizes?: string;
  priority?: boolean;
}

export function HospitalImage({ src, alt, wrapperClassName, sizes, priority }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`${wrapperClassName} flex items-center justify-center bg-gradient-to-br from-[#1b5fa8]/10 to-[#1ab3c8]/10`}
      >
        <svg
          className="w-10 h-10 text-[#1ab3c8]/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        priority={priority}
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

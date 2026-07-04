"use client";

import { useState } from "react";
import Image from "next/image";

export function GroupLogo({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-sm font-semibold text-slate-500">{alt}</span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={140}
      height={40}
      className="h-10 w-auto object-contain"
      onError={() => setFailed(true)}
    />
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export function CertificateLightbox() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="block rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-colors cursor-zoom-in"
      >
        <Image
          src="/license_ushas.jpg"
          alt="International Health Tourism Authorization Certificate — USHAS"
          width={260}
          height={184}
          className="w-full h-auto object-cover"
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <Image
              src="/license_ushas.jpg"
              alt="International Health Tourism Authorization Certificate — USHAS"
              width={900}
              height={637}
              className="max-w-[90vw] max-h-[90vh] w-auto h-auto rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

// Phase: TR mini-site header. Used by app/medical-tourism-turkey/page.tsx
// IN PLACE OF the global <Nav /> (components/marketing/nav.tsx), which is
// left completely untouched and still used by every other page. Having
// both would show two header rows stacked on top of each other on this
// page, which is the exact problem this component replaces.
const navLinks = [
  { href: "#hero", label: "Ana Sayfa" },
  { href: "#hakkimizda", label: "Hakkımızda" },
  { href: "#surec", label: "Süreç" },
  { href: "#sss", label: "SSS" },
  { href: "#iletisim", label: "İletişim" },
];

export function MedicalTourismTurkeyNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main row (2026-10-15 redesign): flag + Partner Login now live
            here, opposite the logo, at EVERY width -- previously
            "hidden lg:flex" and duplicated inside the mobile hamburger
            panel below. The hamburger toggle (page-section links only
            now) stays in this same row, after Partner Login; logo and
            Partner Login shrink on narrow screens so all four pieces fit
            without wrapping.
            2026-10-15 follow-up: flag glyph size reduced ~17-20% (text-2xl
            -> text-xl mobile, text-3xl -> text-2xl desktop) per design
            request; the w-11/h-11 (44x44, WCAG minimum) touch-target
            container is intentionally left unchanged -- only the visual
            glyph inside it shrank. */}
        <div className="flex items-center justify-between h-16 lg:h-20 gap-2">
          <Link href="/" className="shrink-0 min-w-0">
            <Image
              src="/mct_logo.png"
              alt="Medical Center Turkey"
              width={160}
              height={44}
              priority
              className="w-[100px] sm:w-[160px] h-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-semibold text-brand hover:text-teal transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <Link
              href="/"
              aria-label="Switch to English"
              className="flex items-center justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-full text-xl lg:text-2xl leading-none hover:bg-gray-50 transition-colors"
            >
              🇬🇧
            </Link>
            <Link
              href="/agency"
              className="px-2 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-sm rounded-full border border-brand text-brand font-semibold hover:bg-brand hover:text-white transition-colors whitespace-nowrap"
            >
              Partner Login
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              className="lg:hidden flex items-center justify-center w-11 h-11 -mr-1.5 text-brand shrink-0"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {open && (
          // relative z-10 (2026-10-15): no overlap was found in testing --
          // the panel is already in normal document flow inside the
          // sticky, z-50 header, which should place it above everything
          // that follows in the DOM -- but an explicit stacking context
          // here costs nothing and removes any doubt if some future
          // addition to the page introduces a competing one.
          <div className="relative z-10 lg:hidden border-t border-gray-100 py-5 flex flex-col items-center gap-4 bg-white">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-brand hover:text-teal transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

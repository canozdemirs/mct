"use client";

import Link from "next/link";
import Image from "next/image";

// Phase: TR mini-site header. Used by app/medical-tourism-turkey/page.tsx
// IN PLACE OF the global <Nav /> (components/marketing/nav.tsx), which is
// left completely untouched and still used by every other page. Having
// both would show two header rows stacked on top of each other on this
// page, which is the exact problem this component replaces.
const navLinks = [
  { href: "#hero", label: "Ana Sayfa" },
  { href: "/hospitals-in-turkey", label: "Hastaneler" },
  { href: "#surec", label: "Süreç" },
  { href: "#sss", label: "SSS" },
  { href: "#iletisim", label: "İletişim" },
];

export function MedicalTourismTurkeyNav() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main row: flag + Partner Login live here, opposite the logo, at
            EVERY width -- mirrors components/marketing/nav.tsx (English)
            exactly. No hamburger toggle (2026-10-15 correction: the
            hamburger/dropdown approach was a misunderstanding and has been
            removed entirely -- see second row below). */}
        <div className="flex items-center justify-between h-16 lg:h-20 gap-2">
          <Link href="/" className="shrink-0 min-w-0">
            <Image
              src="/mct_logo.png"
              alt="Medical Center Turkey"
              width={160}
              height={44}
              priority
              className="w-[110px] sm:w-[160px] h-auto"
            />
          </Link>

          {/* Nav links — desktop only, center. Unchanged. */}
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
          </div>
        </div>

        {/* Second row (2026-10-15 correction): always-visible horizontal
            links row on mobile, matching components/marketing/nav.tsx's
            mobile row exactly -- no dropdown, no toggle state. All five
            links render simultaneously; flex-wrap + gap keep them from
            overflowing on the narrowest supported width. */}
        <div className="lg:hidden border-t border-gray-100 py-2 flex items-center justify-center gap-x-5 gap-y-2 flex-wrap">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-xs font-semibold text-brand hover:text-teal transition-colors">
              {l.label}
            </a>
          ))}
        </div>

      </div>
    </header>
  );
}

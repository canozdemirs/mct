"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useConsultationModal } from "./consultation-modal";

export function Nav() {
  const { openConsultation } = useConsultationModal();
  const pathname = usePathname();

  // Site-wide lead-attribution fix (2026-10-14): same reasoning as
  // whatsapp-float.tsx -- Nav renders identically on every page, so it
  // derives its own page context from usePathname() rather than needing a
  // prop threaded through every page that renders it.
  function handleGetQuote() {
    openConsultation(`Header Get Quote (${pathname})`);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main row (2026-10-15 redesign): flag + Partner Login now live
            here, opposite the logo, at EVERY width -- not just desktop.
            The flag carries no "Türkçe" text (icon-only, 44x44 min touch
            target per WCAG), so it's compact enough to share this row with
            the logo even at 320px once the logo itself is allowed to
            shrink below its own intrinsic size on narrow screens. */}
        <div className="flex items-center justify-between h-16 lg:h-20 gap-2">

          {/* Logo — intrinsic size unchanged (image quality), displayed
              size scales down on narrow screens via className, grows back
              to its original 160x44 at sm and up. */}
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

          {/* Nav links — desktop only, center */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-brand hover:text-teal transition-colors">Home</Link>
            <Link href="/hospitals-in-turkey" className="text-sm font-semibold text-brand hover:text-teal transition-colors">Hospitals</Link>
            <Link href="/treatment-prices-in-turkey" className="text-sm font-semibold text-brand hover:text-teal transition-colors">Cost Calculator</Link>
            <Link href="/blog" className="text-sm font-semibold text-brand hover:text-teal transition-colors">Blog</Link>
            <button onClick={handleGetQuote} className="text-sm font-semibold text-brand hover:text-teal transition-colors">Get Quote</button>
          </nav>

          {/* Right — flag (icon-only, no "Türkçe" text) + Partner Login.
              Visible at every width now; sizes step up at lg so the flag
              reads clearly larger on desktop, per design request. */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link
              href="/medical-tourism-turkey"
              aria-label="Türkçe sürüme geç"
              className="flex items-center justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-full text-2xl lg:text-3xl leading-none hover:bg-gray-50 transition-colors"
            >
              🇹🇷
            </Link>
            <Link
              href="/agency"
              className="px-2.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm rounded-full border border-brand text-brand font-semibold hover:bg-brand hover:text-white transition-colors whitespace-nowrap"
            >
              Partner Login
            </Link>
          </div>

        </div>

        {/* Mobile nav — page links only; flag and Partner Login live in the
            main row above now, not duplicated here. */}
        <div className="lg:hidden border-t border-gray-100 py-2 flex items-center justify-center gap-x-6 gap-y-2 flex-wrap">
          <Link href="/" className="text-xs font-semibold text-brand hover:text-teal transition-colors">Home</Link>
          <Link href="/hospitals-in-turkey" className="text-xs font-semibold text-brand hover:text-teal transition-colors">Hospitals</Link>
          <Link href="/treatment-prices-in-turkey" className="text-xs font-semibold text-brand hover:text-teal transition-colors">Cost Calculator</Link>
          <Link href="/blog" className="text-xs font-semibold text-brand hover:text-teal transition-colors">Blog</Link>
          <button onClick={handleGetQuote} className="text-xs font-semibold text-brand hover:text-teal transition-colors">Get Quote</button>
        </div>

      </div>
    </header>
  );
}

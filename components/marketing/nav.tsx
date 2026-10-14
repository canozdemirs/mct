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

        {/* Main row */}
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/mct_logo.png"
              alt="Medical Center Turkey"
              width={160}
              height={44}
              priority
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

          {/* Right — CTA */}
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/medical-tourism-turkey"
              className="text-sm font-semibold text-brand hover:text-teal transition-colors"
            >
              🇹🇷 Türkçe
            </Link>
            <Link
              href="/agency"
              className="px-4 py-2 rounded-full border border-brand text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-colors"
            >
              Partner Login
            </Link>
          </div>

        </div>

        {/* Mobile nav */}
        <div className="lg:hidden border-t border-gray-100 py-2 flex items-center justify-center gap-6 flex-wrap">
          <Link href="/" className="text-xs font-semibold text-brand hover:text-teal transition-colors">Home</Link>
          <Link href="/hospitals-in-turkey" className="text-xs font-semibold text-brand hover:text-teal transition-colors">Hospitals</Link>
          <Link href="/treatment-prices-in-turkey" className="text-xs font-semibold text-brand hover:text-teal transition-colors">Cost Calculator</Link>
          <Link href="/blog" className="text-xs font-semibold text-brand hover:text-teal transition-colors">Blog</Link>
          <button onClick={handleGetQuote} className="text-xs font-semibold text-brand hover:text-teal transition-colors">Get Quote</button>
          <Link href="/medical-tourism-turkey" className="text-xs font-semibold text-brand hover:text-teal transition-colors">🇹🇷 Türkçe</Link>
        </div>

      </div>
    </header>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";

export function Nav() {
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

          {/* Cert badges — desktop only, center */}
          <div className="hidden lg:flex items-center gap-2 text-sm font-semibold text-brand whitespace-nowrap">
            <span>Authorized Health Tourism Facilitator · USHAS AK-1494</span>
            <span className="opacity-30">|</span>
            <span>Association of Turkish Travel Agencies · 18274</span>
          </div>

          {/* Right — phone + CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+908508888911"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand hover:opacity-75 transition-opacity"
            >
              <Phone size={14} />
              +90 850 888 89 11
            </a>
            <Link
              href="/agency"
              className="px-4 py-2 rounded-full border border-brand text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-colors"
            >
              Agency Login
            </Link>
          </div>

        </div>

        {/* Cert bar — mobile only, below main row */}
        <div className="lg:hidden border-t border-gray-100 py-1.5 flex flex-col items-center gap-0.5 text-[11px] font-semibold text-brand text-center">
          <span>Authorized Health Tourism Facilitator · USHAS AK-1494</span>
          <span>Association of Turkish Travel Agencies · 18274</span>
        </div>

      </div>
    </header>
  );
}

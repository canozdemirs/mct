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
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="shrink-0">
            <Image src="/mct_logo.png" alt="Medical Center Turkey" width={160} height={44} priority />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-semibold text-brand hover:text-teal transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <Link href="/" aria-label="Switch to English" className="text-sm font-semibold text-brand hover:text-teal transition-colors">
              🇬🇧 English
            </Link>
            <Link
              href="/agency"
              className="px-4 py-2 rounded-full border border-brand text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-colors"
            >
              Partner Login
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            className="lg:hidden p-2 -mr-2 text-brand"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-gray-100 py-5 flex flex-col items-center gap-4">
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
            <div className="flex items-center gap-4 pt-4 mt-1 border-t border-gray-100 w-full justify-center">
              <Link href="/" onClick={() => setOpen(false)} aria-label="Switch to English" className="text-sm font-semibold text-brand hover:text-teal transition-colors">
                🇬🇧 English
              </Link>
              <Link
                href="/agency"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-full border border-brand text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-colors"
              >
                Partner Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

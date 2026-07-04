import Link from "next/link";
import Image from "next/image";

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

          {/* Nav links — desktop only, center */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-brand hover:text-teal transition-colors">Home</Link>
            <Link href="/hospitals-in-turkey" className="text-sm font-semibold text-brand hover:text-teal transition-colors">Hospitals</Link>
            <Link href="/cost-calculator" className="text-sm font-semibold text-brand hover:text-teal transition-colors">Calculator</Link>
            <Link href="/blog" className="text-sm font-semibold text-brand hover:text-teal transition-colors">Blog</Link>
            <Link href="#consultation" className="text-sm font-semibold text-brand hover:text-teal transition-colors">Get Quote</Link>
          </nav>

          {/* Right — CTA */}
          <div className="flex items-center shrink-0">
            <Link
              href="/agency"
              className="px-4 py-2 rounded-full border border-brand text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-colors"
            >
              Partner Login
            </Link>
          </div>

        </div>

        {/* Mobile nav */}
        <div className="lg:hidden border-t border-gray-100 py-2 flex items-center justify-center gap-6">
          <Link href="/" className="text-xs font-semibold text-brand hover:text-teal transition-colors">Home</Link>
          <Link href="/hospitals-in-turkey" className="text-xs font-semibold text-brand hover:text-teal transition-colors">Hospitals</Link>
          <Link href="/cost-calculator" className="text-xs font-semibold text-brand hover:text-teal transition-colors">Calculator</Link>
          <Link href="/blog" className="text-xs font-semibold text-brand hover:text-teal transition-colors">Blog</Link>
          <Link href="#consultation" className="text-xs font-semibold text-brand hover:text-teal transition-colors">Get Quote</Link>
        </div>

      </div>
    </header>
  );
}

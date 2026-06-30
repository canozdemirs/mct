import Link from "next/link";
import Image from "next/image";
import { CertificateLightbox } from "./certificate-lightbox";

export function Footer() {
  return (
    <footer
      className="relative text-white overflow-hidden"
      style={{
        backgroundImage: "url('/mct_head_office.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-brand-dark/40" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="text-xl font-bold text-white mb-1">Medical Center Turkey</div>
            <div className="text-xs font-semibold uppercase tracking-widest text-teal mb-5">
              International Patient Center
            </div>
            <p className="text-sm text-white/55 leading-relaxed max-w-sm mb-6">
              Your International Patient Center — managing your entire treatment journey across
              our network of Ministry of Health certified hospitals, from first consultation to
              your safe return home.
            </p>
            <a
              href="https://www.google.com/maps/search/Varyap+Meridian+Grand+Tower+A+Blok+Atasehir+Istanbul"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-xl border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/8 transition-colors p-4"
            >
              <svg className="shrink-0 mt-0.5 text-teal" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <div>
                <p className="text-sm text-white/80 leading-relaxed group-hover:text-white transition-colors">
                  Barbaros Mah. Al Zambak Sk.<br />
                  Varyap Meridian Grand Tower<br />
                  A Blok No:2 D:226<br />
                  Ataşehir, İstanbul 34746, Turkey
                </p>
                <span className="inline-block mt-2 text-xs font-semibold text-teal group-hover:underline">
                  Open in Google Maps →
                </span>
              </div>
            </a>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-white/55">
              {[
                { label: "Home", href: "/" },
                { label: "Hospitals", href: "/hospitals" },
                { label: "Calculator", href: "/cost-calculator" },
                { label: "Blog", href: "/blog" },
                { label: "Get Quote", href: "#consultation" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="space-y-2.5 text-sm text-white/55 mt-6">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/confidentiality" className="hover:text-white transition-colors">
                  Confidentiality
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-start">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
              Licenses & Accreditations
            </h4>
            <a
              href="/license_ushas.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-colors"
            >
              <Image
                src="/license_ushas.jpg"
                alt="International Health Tourism Authorization Certificate — USHAS"
                width={260}
                height={184}
                className="w-full h-auto object-cover"
              />
            </a>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8">
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-white/30">
            <p>© {new Date().getFullYear()} Medical Center Turkey. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white/60 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white/60 transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

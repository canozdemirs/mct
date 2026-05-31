import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <div className="text-xl font-bold text-white mb-1">Medical Center Turkey</div>
            <div className="text-xs font-semibold uppercase tracking-widest text-teal mb-5">
              International Patient Center
            </div>
            <p className="text-sm text-white/55 leading-relaxed max-w-sm mb-6">
              We connect international patients with Ministry of Health certified hospitals in
              Istanbul and coordinate every step of the treatment journey — from first inquiry to
              safe return home.
            </p>
            <a
              href="https://wa.me/908508888911"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#1fb55a] transition-colors"
            >
              <MessageCircle size={16} />
              Contact on WhatsApp
            </a>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-white/55">
              {[
                { label: "Treatments", href: "#" },
                { label: "Packages", href: "#packages" },
                { label: "How It Works", href: "#" },
                { label: "About MCT", href: "#" },
                { label: "Contact", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-white/55">
              <li>Istanbul, Turkey</li>
              <li>
                <a
                  href="https://wa.me/908508888911"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@medicalcenterturkey.com"
                  className="hover:text-white transition-colors"
                >
                  info@medicalcenterturkey.com
                </a>
              </li>
              <li>
                <a
                  href="https://medicalcenterturkey.com"
                  className="hover:text-white transition-colors"
                >
                  medicalcenterturkey.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8">
          <p className="text-xs text-white/35 leading-relaxed mb-5 max-w-4xl">
            <strong className="text-white/50">Important Notice:</strong> Medical Center Turkey is
            an international health tourism coordinator, not a healthcare provider, clinic, or
            hospital. We do not provide medical advice, diagnoses, or treatment. Final treatment
            suitability is determined by licensed physicians following in-person medical
            evaluation. Individual results may vary. All treatments are performed by independent
            licensed healthcare professionals at Ministry of Health certified facilities.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-white/30">
            <p>© {new Date().getFullYear()} Medical Center Turkey. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white/60 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white/60 transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

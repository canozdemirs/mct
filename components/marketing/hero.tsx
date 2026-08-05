import Image from "next/image";
import { MessageCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[600px] sm:min-h-[680px] flex items-center justify-center text-center">
        <Image
          src="/mct_head_office.jpg"
          alt="Medical Center Turkey — Istanbul"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-brand/88" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center">
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              "Ministry of Health Licensed",
              "TÜRSAB Licensed",
              "JCI Accredited Hospitals",
              "VIP Concierge Service",
            ].map((b) => (
              <span
                key={b}
                className="border border-white/20 text-white/60 text-[10px] font-semibold px-3 py-1.5 rounded-full tracking-wide"
              >
                {b}
              </span>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
            <span className="text-white">Premium Health Care<br />Experience in </span>
            <span className="text-teal">Turkey.</span>
          </h1>

          <p className="text-white/60 text-base sm:text-lg max-w-lg mb-10 leading-relaxed">
            World-Class Treatment. Personalized Care. Your Health, Our Priority.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="#packages"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white hover:text-brand transition-colors"
            >
              Explore Packages
            </a>
            <a
              href="https://wa.me/908508888911"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#1ebe5a] transition-colors"
            >
              <MessageCircle size={16} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

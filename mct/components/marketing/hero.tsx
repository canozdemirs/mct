import Image from "next/image";
import { Building2, ClipboardList } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/mct_company.jpg"
        alt="Medical Center Turkey"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          <p className="text-white/60 font-semibold text-xs uppercase tracking-widest mb-5">
            Istanbul, Turkey — Est. 2018
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            World-Class Treatment
            <br />
            in Istanbul.
            <br />
            <span className="text-teal">Every Detail Managed.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/75 leading-relaxed mb-10 max-w-2xl">
            Medical Center Turkey is your dedicated international patient coordinator. We
            connect you with our Ministry of Health certified partner hospitals and manage
            your entire treatment journey — from first inquiry to safe return home.
            Our coordination services are completely free of charge.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#hospitals"
              className="flex items-center justify-center gap-3 bg-white text-brand px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-50 transition-colors shadow-lg"
            >
              <Building2 size={20} />
              Our Hospitals
            </a>
            <a
              href="#consultation"
              className="flex items-center justify-center gap-3 bg-white text-brand px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-50 transition-colors shadow-lg"
            >
              <ClipboardList size={20} />
              Get Free Consultation
            </a>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

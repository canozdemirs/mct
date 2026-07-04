import Image from "next/image";

// iw/ih: intrinsic px dimensions (aspect-ratio hint for srcset).
// h: rendered height in CSS px. Width resolves to "auto" (natural from ratio).
// Wordmark-only logos (no emblem) get h=40 so their visual weight matches
// logos that include an emblem icon at h=36.
const logos = [
  { name: "Acıbadem Healthcare Group", src: "/images/hospitals/groups/acibadem.png", iw: 552, ih: 77,  h: 40 },
  { name: "Memorial Healthcare Group", src: "/hospitals/memorial.webp",              iw: 179, ih: 58,  h: 36 },
  { name: "Koç University Hospital",   src: "/hospitals/koc.svg",                    iw: 415, ih: 108, h: 36 },
  { name: "American Hospital",         src: "/hospitals/amerikan.png",               iw: 257, ih: 77,  h: 36 },
  { name: "Medipol Health Group",      src: "/hospitals/medipol.jpg",                iw: 586, ih: 163, h: 36 },
  { name: "Estethica",                 src: "/hospitals/estethica.svg",              iw: 170, ih: 34,  h: 40 },
];

export function HospitalNetwork() {
  return (
    <section className="bg-white border-t border-gray-100 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden">
          <style>{`
            @keyframes logo-scroll {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .logo-track { animation: logo-scroll 20s linear infinite; }
          `}</style>
          <div className="logo-track flex w-max items-center gap-16">
            {[...logos, ...logos].map((logo, i) => (
              <div key={i} className="shrink-0 flex items-center">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={logo.iw}
                  height={logo.ih}
                  style={{ height: logo.h, width: "auto" }}
                  className="grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

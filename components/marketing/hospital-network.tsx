import Image from "next/image";

const BASE_H = 36;

// iw/ih: intrinsic pixel dimensions — gives next/image the aspect ratio for srcset.
// heightOverride: wordmark-only logos (no emblem) get 40px so their visual weight
// matches logos that include an icon/emblem at the base 36px.
const logos = [
  { name: "Acıbadem Healthcare Group", src: "/images/hospitals/groups/acibadem.png", iw: 552, ih: 77,  heightOverride: 20 },
  { name: "Memorial Healthcare Group", src: "/hospitals/memorial.webp",              iw: 179, ih: 58,  heightOverride: 42 },
  { name: "Koç University Hospital",   src: "/hospitals/koc.svg",                    iw: 415, ih: 108 },
  { name: "American Hospital",         src: "/hospitals/amerikan.png",               iw: 257, ih: 77  },
  { name: "Medipol Health Group",      src: "/hospitals/medipol.jpg",                iw: 586, ih: 163 },
  { name: "Estethica",                 src: "/hospitals/estethica.svg",              iw: 170, ih: 34,  heightOverride: 22 },
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
            {[...logos, ...logos].map((logo, i) => {
              const h = logo.heightOverride ?? BASE_H;
              return (
                <div key={i} className="inline-flex items-center shrink-0">
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={logo.iw}
                    height={logo.ih}
                    style={{ height: h, width: "auto" }}
                    className="object-contain"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

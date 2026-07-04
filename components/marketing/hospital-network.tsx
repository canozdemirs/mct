import Image from "next/image";

// w: container px — sized so each logo fills ~h-12 (48px) at its natural aspect ratio
const logos = [
  { name: "Acıbadem Healthcare Group", src: "/images/hospitals/groups/acibadem.png", w: 280 },
  { name: "Memorial Healthcare Group", src: "/hospitals/memorial.webp",              w: 160 },
  { name: "Koç University Hospital",   src: "/hospitals/koc.svg",                    w: 192 },
  { name: "American Hospital",         src: "/hospitals/amerikan.png",               w: 160 },
  { name: "Medipol Health Group",      src: "/hospitals/medipol.jpg",                w: 184 },
  { name: "Estethica",                 src: "/hospitals/estethica.svg",              w: 240 },
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
            .logo-track { animation: logo-scroll 24s linear infinite; }
          `}</style>
          <div className="logo-track flex w-max items-center gap-16">
            {[...logos, ...logos].map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-center h-12 shrink-0"
                style={{ width: h.w }}
              >
                <Image
                  src={h.src}
                  alt={h.name}
                  width={h.w}
                  height={48}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

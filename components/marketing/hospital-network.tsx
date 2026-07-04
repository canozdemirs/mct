import Image from "next/image";

const hospitals = [
  { name: "Acıbadem Hospitals", src: "/images/hospitals/groups/acibadem.png", cls: "w-full h-full" },
  { name: "Memorial Hospitals", src: "/hospitals/memorial.webp", cls: "w-full h-full" },
  { name: "Koç University Hospital", src: "/hospitals/koc.svg", cls: "w-3/4 h-3/4" },
  { name: "American Hospital", src: "/hospitals/amerikan.png", cls: "w-full h-full scale-125" },
  { name: "Medipol Hospitals", src: "/hospitals/medipol.jpg", cls: "w-full h-full scale-[2.5]" },
  { name: "Estethica", src: "/hospitals/estethica.svg", cls: "w-4/5 h-4/5" },
];

export function HospitalNetwork() {
  return (
    <section className="bg-white border-t border-gray-100 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="overflow-hidden">
          <style>{`
            @keyframes logo-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .logo-track {
              animation: logo-scroll 18s linear infinite;
            }
          `}</style>
          <div className="logo-track flex w-max items-center gap-16">
            {[...hospitals, ...hospitals].map((h, i) => (
              <div key={i} className="flex items-center justify-center h-12 w-36 shrink-0">
                <Image
                  src={h.src}
                  alt={h.name}
                  width={160}
                  height={48}
                  className={`object-contain ${h.cls}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

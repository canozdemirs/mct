import Image from "next/image";

const hospitals = [
  { name: "Acıbadem Hospitals", src: "/hospitals/acibadem.webp", cls: "w-full h-full" },
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
        <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-10">
          Trusted Hospital Network
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 -translate-x-24">
          {hospitals.map((h) => (
            <div key={h.name} className="flex items-center justify-center h-12 w-36">
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
    </section>
  );
}

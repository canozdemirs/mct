import Image from "next/image";
import { Check, MessageCircle } from "lucide-react";

const treatments = [
  {
    name: "Hair Transplant",
    price: "From £1,490",
    image: "/treatments/hair-transplant-v7.jpg",
    inclusions: [
      "FUE / DHI technique",
      "Hospital coordination",
      "VIP airport transfer",
      "Hotel accommodation",
      "Post-op care kit",
      "Follow-up support",
    ],
  },
  {
    name: "Rhinoplasty",
    price: "From £2,490",
    image: "/treatments/rhinoplasty.jpg",
    inclusions: [
      "Closed / open technique",
      "Hospital coordination",
      "VIP airport transfer",
      "Hotel accommodation",
      "Medication pack",
      "Follow-up support",
    ],
  },
  {
    name: "Breast Augmentation",
    price: "From £2,990",
    image: "/treatments/breast-augmentation-v3.jpg",
    inclusions: [
      "Silicone implants included",
      "Hospital coordination",
      "VIP airport transfer",
      "Hotel accommodation",
      "Compression garment",
      "Follow-up support",
    ],
  },
  {
    name: "Gynecomastia",
    price: "From £1,990",
    image: "/treatments/gynecomastia-v2.jpg",
    inclusions: [
      "Liposuction + gland removal",
      "Hospital coordination",
      "VIP airport transfer",
      "Hotel accommodation",
      "Compression vest",
      "Follow-up support",
    ],
  },
  {
    name: "Dental Implant",
    price: "From £490",
    image: "/treatments/dental-implant.jpg",
    inclusions: [
      "Titanium implant + crown",
      "Hospital coordination",
      "VIP airport transfer",
      "Hotel accommodation",
      "Aftercare kit",
      "Follow-up support",
    ],
  },
  {
    name: "Blepharoplasty",
    price: "From £1,990",
    image: "/treatments/blepharoplasty-v4.jpg",
    inclusions: [
      "Upper / lower eyelid surgery",
      "Hospital coordination",
      "VIP airport transfer",
      "Hotel accommodation",
      "Whitening kit",
      "Follow-up support",
    ],
  },
  {
    name: "Liposuction",
    price: "From £1,990",
    image: "/treatments/liposuction.jpg",
    inclusions: [
      "Vaser / traditional lipo",
      "Hospital coordination",
      "VIP airport transfer",
      "Hotel accommodation",
      "Compression garment",
      "Follow-up support",
    ],
  },
  {
    name: "Check-Up",
    price: "From £290",
    image: "/treatments/checkup.jpg",
    inclusions: [
      "Full blood panel",
      "Cardiac screening",
      "Hospital coordination",
      "VIP airport transfer",
      "Hotel accommodation",
      "Detailed health report",
    ],
  },
];

export function Packages() {
  return (
    <section className="bg-gray-50 pb-16 sm:pb-24 pt-2" id="packages">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand mb-3">
            MCT Hassle-Free Packages
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            MCT&apos;s most preferred Hassle-Free treatment packages — hover a card to see what&apos;s included.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {treatments.map((t) => (
            <div
              key={t.name}
              className="flip-card h-64 cursor-pointer"
              style={{ perspective: "1000px" }}
            >
              <div className="flip-card-inner relative w-full h-full">
                {/* Front */}
                <div className="flip-card-front absolute inset-0 rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-base font-bold text-white leading-tight">{t.name}</h3>
                    <span className="text-white/80 text-xs font-semibold mt-0.5 block">{t.price}</span>
                  </div>
                </div>

                {/* Back */}
                <div className="flip-card-back absolute inset-0 rounded-2xl bg-white border-2 border-teal flex flex-col p-4 shadow-lg">
                  <h3 className="text-sm font-bold text-brand mb-2.5">{t.name}</h3>
                  <ul className="space-y-1.5 flex-1">
                    {t.inclusions.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-xs text-gray-700">
                        <Check size={11} className="text-teal shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://wa.me/908508888911"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-1.5 bg-teal text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#159fb3] transition-colors"
                  >
                    <MessageCircle size={11} />
                    Get a Free Quote
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <a
            href="#packages"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-brand text-brand font-semibold text-sm hover:bg-brand hover:text-white transition-colors"
          >
            View All Treatments
          </a>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Final treatment suitability is determined by licensed physicians following medical
          evaluation. Results may vary.
        </p>
      </div>
    </section>
  );
}

import { Check, MessageCircle } from "lucide-react";

const packages = [
  {
    tier: "Entry",
    name: "Hassle-Free",
    description:
      "Everything you need to receive quality treatment in Istanbul with reliable, full coordination support.",
    features: [
      "Hospital coordination",
      "Airport transfer",
      "Accommodation arranged",
      "Treatment support",
      "Post-treatment follow-up",
    ],
    highlight: false,
  },
  {
    tier: "Most Popular",
    name: "Gold",
    description:
      "Enhanced comfort and priority service. Our most chosen tier for international patients.",
    features: [
      "Everything in Hassle-Free",
      "Private transfers",
      "Priority scheduling",
      "Dedicated coordinator",
      "SIM card & city guide",
    ],
    highlight: true,
  },
  {
    tier: "Premium",
    name: "Premium",
    description:
      "A business-class experience with premium accommodation and personal assistant service.",
    features: [
      "Everything in Gold",
      "4-star hotel upgrade",
      "Personal assistant",
      "Translation services",
      "Comprehensive health report",
    ],
    highlight: false,
  },
  {
    tier: "Luxury",
    name: "Exclusive",
    description:
      "The ultimate MCT experience. Ultra-luxury from the moment you land to the moment you depart.",
    features: [
      "Everything in Premium",
      "5-star luxury hotel",
      "Chauffeur service",
      "VIP lounge access",
      "24/7 personal concierge",
    ],
    highlight: false,
  },
];

export function Packages() {
  return (
    <section className="bg-white py-16 sm:py-24" id="packages">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Choose Your Package
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Every package includes full coordination with Ministry of Health certified partner
            hospitals. The right hospital is matched to your medical needs — not the other way
            around.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative flex flex-col rounded-2xl p-6 border-2 transition-all ${
                pkg.highlight
                  ? "border-teal shadow-xl shadow-teal/10 scale-[1.02]"
                  : "border-gray-100 hover:border-gray-200 hover:shadow-md"
              }`}
            >
              {pkg.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="mb-5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-teal">
                  {pkg.tier}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{pkg.name}</h3>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mb-6">{pkg.description}</p>

              <ul className="space-y-3 flex-1 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check size={15} className="text-teal shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="https://wa.me/908508888911"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-semibold transition-colors ${
                  pkg.highlight
                    ? "bg-teal text-white hover:bg-[#159fb3]"
                    : "bg-gray-50 text-brand border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <MessageCircle size={15} />
                Request This Package
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Final treatment suitability is determined by licensed physicians following medical
          evaluation. Results may vary.
        </p>
      </div>
    </section>
  );
}

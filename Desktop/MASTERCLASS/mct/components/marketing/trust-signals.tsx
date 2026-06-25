import { Clock, Globe, ShieldCheck, Layers } from "lucide-react";

const signals = [
  {
    icon: Clock,
    stat: "Since 2018",
    label: "7+ years coordinating international health tourism",
  },
  {
    icon: Globe,
    stat: "50+ Countries",
    label: "Patients from the USA, UK, Canada, and Europe",
  },
  {
    icon: ShieldCheck,
    stat: "Certified Partners",
    label: "Ministry of Health certified partner hospitals only",
  },
  {
    icon: Layers,
    stat: "4 Package Tiers",
    label: "From Hassle-Free to Exclusive — tailored to your needs",
  },
];

export function TrustSignals() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Trusted by Patients Worldwide
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            We are not a clinic or a hospital. We are your dedicated international patient
            coordinator — managing every step so you don&apos;t have to.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {signals.map(({ icon: Icon, stat, label }) => (
            <div
              key={stat}
              className="flex flex-col items-center text-center p-7 rounded-2xl border border-gray-100 bg-gray-50 hover:border-teal hover:shadow-sm transition-all"
            >
              <div className="w-13 h-13 rounded-full flex items-center justify-center mb-5 bg-brand/8">
                <Icon size={26} className="text-brand" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1.5">{stat}</div>
              <div className="text-sm text-gray-500 leading-snug">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import * as Icons from "lucide-react";
import { treatments, categoryLabels } from "@/lib/treatments";

export default function TreatmentGrid() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#1b5fa8]">
          Treatments We Coordinate in Turkey
        </h2>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          From hair transplant to full aesthetic surgery, dental care, and
          medical check-ups — all through JCI-accredited partner hospitals in
          Istanbul.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {treatments.map((t) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Icon = (Icons as any)[t.icon] ?? Icons.Stethoscope;
          return (
            <Link
              key={t.slug}
              href={`/treatments/${t.slug}`}
              className="group border border-gray-200 rounded-xl p-6 hover:border-[#1ab3c8] hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[#1b5fa8]/10 text-[#1b5fa8] group-hover:bg-[#1ab3c8]/10 group-hover:text-[#1ab3c8]">
                  <Icon size={22} />
                </div>
                <span className="text-xs uppercase tracking-wide text-gray-400">
                  {categoryLabels[t.category]}
                </span>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {t.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {t.shortDescription}
              </p>
              <p className="text-[#1b5fa8] font-medium text-sm">
                From ${t.priceFrom.toLocaleString()}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <Link
          href="/treatment-prices-in-turkey"
          className="inline-block bg-[#1b5fa8] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1ab3c8] transition-colors"
        >
          Compare Treatment Prices in Turkey →
        </Link>
      </div>
    </section>
  );
}

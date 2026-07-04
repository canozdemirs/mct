"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { hospitalGroups } from "@/lib/hospitals";
import type { Hospital } from "@/lib/hospitals";
import { HospitalImage } from "./hospital-image";

type GroupKey = keyof typeof hospitalGroups;

const GROUP_TABS: Array<{ key: GroupKey | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "acibadem", label: "Acıbadem" },
  { key: "memorial", label: "Memorial" },
  { key: "medipol", label: "Medipol" },
  { key: "koc-healthcare", label: "Koç Healthcare" },
  { key: "estethica", label: "Estethica" },
];

export function HospitalGrid({ hospitals }: { hospitals: Hospital[] }) {
  const [active, setActive] = useState<GroupKey | "all">("all");

  const filtered =
    active === "all" ? hospitals : hospitals.filter((h) => h.group === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {GROUP_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              active === tab.key
                ? "bg-[#1b5fa8] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:border-[#1b5fa8] hover:text-[#1b5fa8]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((hospital) => (
          <Link
            key={hospital.slug}
            href={`/${hospital.slug}`}
            className="rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow overflow-hidden group"
          >
            <HospitalImage
              src={hospital.images[0]}
              alt={hospital.name}
              wrapperClassName="aspect-video relative rounded-t-2xl overflow-hidden"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="p-5">
              <h2 className="text-lg font-semibold text-slate-800 group-hover:text-[#1b5fa8] transition-colors mb-0.5 leading-snug">
                {hospital.name}
              </h2>
              <p className="text-sm text-slate-500 mb-3">
                {hospitalGroups[hospital.group].name}
              </p>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                <MapPin size={14} className="text-[#1ab3c8] shrink-0" />
                <span>
                  {hospital.district ? `${hospital.district}, ` : ""}
                  {hospital.city}
                </span>
              </div>
              {hospital.accreditations.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {hospital.accreditations.map((acc) => (
                    <span
                      key={acc}
                      className="bg-teal-50 text-[#1ab3c8] text-xs rounded-full px-2.5 py-1 font-medium"
                    >
                      {acc}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

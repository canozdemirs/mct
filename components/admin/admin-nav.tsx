"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/leads", label: "Patients" },
  { href: "/admin/pipeline", label: "Sales Pipeline" },
  { href: "/admin/partner-applications", label: "Partners" },
];

const VERCEL_ANALYTICS_URL = "https://vercel.com/mct-s-projects/mct-xnse/analytics";

export function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 flex-wrap">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                active ? "bg-brand text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        {isAdmin && (
          <a
            href={VERCEL_ANALYTICS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors bg-gray-50 text-gray-600 hover:bg-gray-100"
          >
            Traffic
          </a>
        )}
      </div>
    </div>
  );
}

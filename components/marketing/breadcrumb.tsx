import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <nav className="flex items-center gap-1 text-xs text-slate-500 flex-wrap" aria-label="Breadcrumb">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1 shrink-0">
              {i > 0 && <ChevronRight size={12} className="shrink-0 text-slate-400" />}
              {item.href ? (
                <Link href={item.href} className="hover:text-slate-800 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-800 font-semibold">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}

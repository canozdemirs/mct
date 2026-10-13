import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Real <Link> elements to real routes (/blog, /blog/page/2, ...) — fully
// crawlable without JavaScript, satisfying the "pagination must not be
// JS-only" requirement. This only renders on the static base listing
// (never shown while a client-side search/category filter is active).
export function BlogPagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => (page <= 1 ? "/blog" : `/blog/page/${page}`);

  const pageNumbers = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  const sorted = [...pageNumbers].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const items: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) items.push("ellipsis");
    items.push(p);
    prev = p;
  }

  return (
    <nav aria-label="Blog pagination" className="flex items-center justify-center gap-1.5 mt-12">
      {currentPage > 1 && (
        <Link
          href={hrefFor(currentPage - 1)}
          aria-label="Previous page"
          className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:border-brand hover:text-brand transition-colors"
        >
          <ChevronLeft size={16} />
        </Link>
      )}

      {items.map((item, i) =>
        item === "ellipsis" ? (
          <span key={`e-${i}`} className="px-1.5 text-gray-400 text-sm">
            &hellip;
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
              item === currentPage
                ? "bg-brand text-white"
                : "text-gray-500 border border-gray-200 hover:border-brand hover:text-brand"
            }`}
          >
            {item}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={hrefFor(currentPage + 1)}
          aria-label="Next page"
          className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:border-brand hover:text-brand transition-colors"
        >
          <ChevronRight size={16} />
        </Link>
      )}
    </nav>
  );
}

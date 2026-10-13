"use client";

import { useEffect, useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { BlogCard, type BlogCardData } from "./blog-card";

const RESULTS_PER_PAGE = 12;

export function BlogSearchFilter({
  categories,
  children,
}: {
  categories: { name: string; count: number }[];
  children: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [results, setResults] = useState<BlogCardData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const active = query.trim() !== "" || category !== null;

  useEffect(() => {
    if (!active) {
      setResults(null);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);

    const timeout = setTimeout(() => {
      fetch(`/api/blog-search?${params.toString()}`)
        .then((res) => res.json())
        .then((data: { results: BlogCardData[] }) => {
          setResults(data.results);
          setPage(1);
        })
        .finally(() => setLoading(false));
    }, 250); // debounce typing

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category]);

  const totalPages = results ? Math.max(1, Math.ceil(results.length / RESULTS_PER_PAGE)) : 1;
  const pageResults = results ? results.slice((page - 1) * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE) : [];

  return (
    <div>
      {/* Compact filter bar: search (left) + category "Type" dropdown
          (right) on desktop, stacked on mobile. Replaces the old separate
          search row + wrapping category-pill row. */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <div className="flex-1">
          <label htmlFor="blog-search-input" className="hidden sm:block text-[11px] font-semibold uppercase tracking-wide text-transparent mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="blog-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              aria-label="Search blog articles"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-10 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal focus:bg-white transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="sm:w-56 shrink-0">
          <label htmlFor="blog-category-filter" className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Type
          </label>
          <div className="relative">
            <select
              id="blog-category-filter"
              value={category ?? ""}
              onChange={(e) => setCategory(e.target.value || null)}
              className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-xl pl-4 pr-10 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal focus:bg-white transition-all cursor-pointer"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.count})
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
        </div>
      </div>

      {!active && children}

      {active && (
        <div>
          {loading && <p className="text-sm text-gray-400 text-center py-12">Searching...</p>}

          {!loading && results && results.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 font-semibold mb-1">No articles found</p>
              <p className="text-sm text-gray-400">Try a different search term or category.</p>
            </div>
          )}

          {!loading && results && results.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageResults.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav aria-label="Search results pagination" className="flex items-center justify-center gap-2 mt-12">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand hover:text-brand transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand hover:text-brand transition-colors"
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

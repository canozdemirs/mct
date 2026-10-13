import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BlogCard } from "./blog-card";
import { BlogPagination } from "./blog-pagination";
import { BlogSearchFilter } from "./blog-search-filter";
import { getRealCategories } from "@/lib/blog-listing";
import type { BlogPostMeta } from "@/lib/blog-index.generated";

export function BlogIndexContent({
  posts,
  currentPage,
  totalPages,
}: {
  posts: BlogPostMeta[];
  currentPage: number;
  totalPages: number;
}) {
  const categories = getRealCategories();

  return (
    <main className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={13} />
            <span className="text-gray-600 font-medium">Blog</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal mb-3">
          Medical Center Turkey
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-brand mb-4">Medical Center Turkey Blog</h1>
        <p className="text-gray-500 text-base max-w-2xl mx-auto">
          Explore expert insights, treatment guides, patient information, and the latest articles about healthcare
          and medical tourism in Turkey.
        </p>
      </div>

      {/* Search, filters, grid, pagination */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <BlogSearchFilter categories={categories}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} priority={currentPage === 1 && i < 3} />
            ))}
          </div>
          <BlogPagination currentPage={currentPage} totalPages={totalPages} />
        </BlogSearchFilter>
      </div>
    </main>
  );
}

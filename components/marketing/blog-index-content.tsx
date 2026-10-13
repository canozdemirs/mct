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
      {/* Visible breadcrumb and intro heading/description were removed per
          request -- this sr-only h1 is the page's only heading now, kept
          for accessible document structure. The SEO <title> (set in
          app/blog/page.tsx's metadata) is separate and untouched. */}
      <h1 className="sr-only">Medical Center Turkey Blog</h1>

      {/* Search, filters, grid, pagination */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20">
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

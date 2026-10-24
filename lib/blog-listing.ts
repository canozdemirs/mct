// Shared, pure helpers for the /blog index — used by both the static
// paginated pages (app/blog/page.tsx, app/blog/page/[page]/page.tsx), the
// server-side search API (app/api/blog-search/route.ts), and the article
// detail page (app/(blog-engine)/posts/[slug]/page.tsx, via getPostBySlug
// below). No content bodies are touched here, only the lightweight
// metadata already in lib/blog-index.generated.ts
// (title/slug/date/excerpt/category/image).

import { BLOG_POSTS, type BlogPostMeta } from "./blog-index.generated";
import { CATEGORY_OVERRIDES } from "./blog-category-overrides";
import { LISTING_EXCERPTS } from "./blog-listing-excerpts";
import { BLOG_SLUGS_REPLACED_BY_PAGE } from "./blog-replaced-by-page";

export const POSTS_PER_PAGE = 12;

// `listingExcerpt` is deliberately separate from `seoDescription`: the SEO
// <meta name="description">/JSON-LD text is untouched by this field. It's
// optional — only slugs present in LISTING_EXCERPTS get one; every other
// post keeps falling back to seoDescription on the card (see blog-card.tsx).
export type BlogPostMetaWithExcerpt = BlogPostMeta & { listingExcerpt?: string };

function toTimestamp(date: string): number {
  // post_date_gmt format: "YYYY-MM-DD HH:MM:SS" (UTC, no explicit offset).
  return new Date(date.replace(" ", "T") + "Z").getTime();
}

// CATEGORY_OVERRIDES and LISTING_EXCERPTS are applied once, here, so every
// consumer of SORTED_BLOG_POSTS (listing, search, sitemap, the article page
// via getPostBySlug) sees the corrected categories / card excerpts
// consistently — the auto-generated BLOG_POSTS array itself is never
// mutated.
const POSTS_WITH_OVERRIDES: BlogPostMetaWithExcerpt[] = BLOG_POSTS
  .filter((post) => !BLOG_SLUGS_REPLACED_BY_PAGE.has(post.slug))
  .map((post) => ({
    ...post,
    ...(CATEGORY_OVERRIDES[post.slug] ? { categories: CATEGORY_OVERRIDES[post.slug] } : null),
    ...(LISTING_EXCERPTS[post.slug] ? { listingExcerpt: LISTING_EXCERPTS[post.slug] } : null),
  }));

export const SORTED_BLOG_POSTS: BlogPostMetaWithExcerpt[] = [...POSTS_WITH_OVERRIDES].sort(
  (a, b) => toTimestamp(b.date) - toTimestamp(a.date)
);

export const TOTAL_BLOG_PAGES = Math.ceil(SORTED_BLOG_POSTS.length / POSTS_PER_PAGE);

export function getBlogPage(page: number): BlogPostMetaWithExcerpt[] {
  const start = (page - 1) * POSTS_PER_PAGE;
  return SORTED_BLOG_POSTS.slice(start, start + POSTS_PER_PAGE);
}

export function getPostBySlug(slug: string): BlogPostMetaWithExcerpt | undefined {
  return SORTED_BLOG_POSTS.find((p) => p.slug === slug);
}

/** Real WordPress categories, as actually assigned on the posts — never
 * inferred from title text. Returned sorted by how many posts use them
 * (most common first), each with its post count. */
export function getRealCategories(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of SORTED_BLOG_POSTS) {
    for (const cat of post.categories) {
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function searchBlogPosts(query: string, category: string | null): BlogPostMetaWithExcerpt[] {
  const q = query.trim().toLowerCase();
  return SORTED_BLOG_POSTS.filter((post) => {
    const matchesQuery =
      q === "" ||
      post.title.toLowerCase().includes(q) ||
      post.seoDescription.toLowerCase().includes(q);
    const matchesCategory = !category || post.categories.includes(category);
    return matchesQuery && matchesCategory;
  });
}

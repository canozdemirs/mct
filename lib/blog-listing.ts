// Shared, pure helpers for the /blog index — used by both the static
// paginated pages (app/blog/page.tsx, app/blog/page/[page]/page.tsx) and
// the server-side search API (app/api/blog-search/route.ts). No content
// bodies are touched here, only the lightweight metadata already in
// lib/blog-index.generated.ts (title/slug/date/excerpt/category/image).

import { BLOG_POSTS, type BlogPostMeta } from "./blog-index.generated";

export const POSTS_PER_PAGE = 12;

function toTimestamp(date: string): number {
  // post_date_gmt format: "YYYY-MM-DD HH:MM:SS" (UTC, no explicit offset).
  return new Date(date.replace(" ", "T") + "Z").getTime();
}

export const SORTED_BLOG_POSTS: BlogPostMeta[] = [...BLOG_POSTS].sort(
  (a, b) => toTimestamp(b.date) - toTimestamp(a.date)
);

export const TOTAL_BLOG_PAGES = Math.ceil(SORTED_BLOG_POSTS.length / POSTS_PER_PAGE);

export function getBlogPage(page: number): BlogPostMeta[] {
  const start = (page - 1) * POSTS_PER_PAGE;
  return SORTED_BLOG_POSTS.slice(start, start + POSTS_PER_PAGE);
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

export function searchBlogPosts(query: string, category: string | null): BlogPostMeta[] {
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

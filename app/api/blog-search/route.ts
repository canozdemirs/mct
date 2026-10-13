import { NextRequest, NextResponse } from "next/server";
import { searchBlogPosts } from "@/lib/blog-listing";

// Server-side blog search/filter. Keeps the client bundle lean — the
// client never receives the full 611-post metadata array, only whatever
// this endpoint returns for the current query. Filters in-memory over the
// already-loaded BLOG_POSTS metadata (titles + categories only, no article
// content), which is fast enough that no caching/DB layer is needed.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || null;

  const results = searchBlogPosts(q, category).map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    seoDescription: p.seoDescription,
    featuredImage: p.featuredImage,
    categories: p.categories,
  }));

  return NextResponse.json({ results, total: results.length });
}

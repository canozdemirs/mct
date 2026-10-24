// Blog slugs that have been replaced by a dedicated, non-blog-engine page
// at the same URL -- excluded everywhere the blog engine would otherwise
// treat them as blog content, so exactly one page exists at the URL
// instead of two competing for it:
//   - lib/blog-listing.ts's SORTED_BLOG_POSTS (so the /blog index, the
//     blog search API, app/sitemap.ts's blog-post loop, and
//     getPostBySlug() all stop seeing it)
//   - app/(blog-engine)/posts/[slug]/page.tsx's generateStaticParams
//     (via SORTED_BLOG_POSTS, so that route is never built for this slug)
//   - proxy.ts's BLOG_SLUGS rewrite-to-/posts/ and the /posts/<slug>
//     redirect-back-to-root (so the root URL falls through to normal
//     filesystem routing and reaches the dedicated page instead)
//
// 2026-10-24: hair-transplant-surgery-before-and-after-turkey rebuilt as
// a dedicated conversion-focused landing page
// (app/hair-transplant-surgery-before-and-after-turkey/page.tsx) --
// Google Ads' "Before & After Results" sitelink points here and visitors
// expect photos immediately, not ~1,300 words of migrated WordPress text
// first. The old blog content file (content/blog/hair-transplant-
// surgery-before-and-after-turkey.html) still exists on disk -- its
// article text and all 15 before/after images are reused by the new
// page directly -- but it's no longer reachable as a blog post.
export const BLOG_SLUGS_REPLACED_BY_PAGE: ReadonlySet<string> = new Set([
  "hair-transplant-surgery-before-and-after-turkey",
]);

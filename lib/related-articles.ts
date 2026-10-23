// 2026-10-23 internal-link project, item 3: up to 4 blog posts per
// landing page, drawn from the same title-tier match file the blog post's
// own "Related Package" box uses (lib/blog-landing-matches.generated.ts)
// -- one source of truth for "which posts belong to which package".
import { BLOG_LANDING_MATCHES } from "@/lib/blog-landing-matches.generated";
import { BLOG_POSTS } from "@/lib/blog-index.generated";

export interface RelatedArticle {
  slug: string;
  title: string;
}

const POSTS_BY_SLUG = new Map(BLOG_POSTS.map((p) => [p.slug, p]));

/** Newest-first, so each landing page surfaces its freshest matching
 * content rather than whatever happens to sort first alphabetically. */
export function getRelatedArticles(landingSlug: string, limit = 4): RelatedArticle[] {
  const matchingSlugs = Object.entries(BLOG_LANDING_MATCHES)
    .filter(([, landing]) => landing === landingSlug)
    .map(([slug]) => slug);

  return matchingSlugs
    .map((slug) => POSTS_BY_SLUG.get(slug))
    .filter((p): p is (typeof BLOG_POSTS)[number] => p !== undefined)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map((p) => ({ slug: p.slug, title: p.title }));
}

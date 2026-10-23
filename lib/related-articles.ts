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

const MAX_EXPERIENCE_POSTS = 2;

// Patient-testimonial slugs, not just the correctly-spelled "experience":
// several in the archive are typo'd ("...-experince...", missing the
// middle "e") or use "journey" instead -- both checked here so they're
// still counted as testimonials and capped the same way.
const TESTIMONIAL_SLUG_PATTERN = /experien|experin|journey/i;

/** Newest-first within each bucket, so each landing page surfaces its
 * freshest matching content rather than whatever happens to sort first
 * alphabetically. At most MAX_EXPERIENCE_POSTS of the result are patient-
 * experience testimonials (slug contains "experience") -- the rest are
 * informational/guide posts, so the section doesn't read as all
 * testimonials and no substance. */
export function getRelatedArticles(landingSlug: string, limit = 4): RelatedArticle[] {
  const matchingPosts = Object.entries(BLOG_LANDING_MATCHES)
    .filter(([, landing]) => landing === landingSlug)
    .map(([slug]) => POSTS_BY_SLUG.get(slug))
    .filter((p): p is (typeof BLOG_POSTS)[number] => p !== undefined)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const experience = matchingPosts.filter((p) => TESTIMONIAL_SLUG_PATTERN.test(p.slug));
  const guide = matchingPosts.filter((p) => !TESTIMONIAL_SLUG_PATTERN.test(p.slug));

  const experienceSlice = experience.slice(0, Math.min(MAX_EXPERIENCE_POSTS, limit));
  const guideSlice = guide.slice(0, limit - experienceSlice.length);
  const selected = [...guideSlice, ...experienceSlice];

  // Top up from whichever bucket has leftovers if the other bucket alone
  // couldn't fill the remaining slots (e.g. fewer than `limit - 2` guide
  // posts exist for this landing).
  if (selected.length < limit) {
    const have = new Set(selected.map((p) => p.slug));
    for (const p of matchingPosts) {
      if (selected.length >= limit) break;
      if (!have.has(p.slug)) selected.push(p);
    }
  }

  selected.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return selected.slice(0, limit).map((p) => ({ slug: p.slug, title: p.title }));
}

import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import { BlogIndexContent } from "@/components/marketing/blog-index-content";
import { generateBreadcrumbSchema, generateCollectionPageSchema } from "@/lib/schema";
import { getBlogPage, SORTED_BLOG_POSTS, TOTAL_BLOG_PAGES } from "@/lib/blog-listing";

// Page 1 of the blog index. Pages 2+ live at /blog/page/[page] (see that
// route) — this file intentionally does not read a page param, it always
// renders the first POSTS_PER_PAGE articles (newest first).
//
// No explicit `robots` here. The root layout sets none either (Phase
// 5K-D) — pre-launch protection comes solely from proxy.ts, which sets
// X-Robots-Tag: noindex, nofollow on any non-production host. Same as
// every other page on the site (corrected 2026-10-14; this comment
// previously described a layout-level noindex that no longer exists).

const PAGE_URL = "https://www.medicalcenterturkey.com/blog";

export const metadata: Metadata = {
  title: "Medical Center Turkey Blog | Healthcare & Medical Tourism Insights",
  description:
    "Explore healthcare insights, treatment guides, and medical tourism articles from Medical Center Turkey.",
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function BlogIndexPage() {
  const posts = getBlogPage(1);

  const collectionSchema = generateCollectionPageSchema({
    name: "Medical Center Turkey Blog",
    description: "Explore expert insights, treatment guides, patient information, and the latest articles about healthcare and medical tourism in Turkey.",
    url: PAGE_URL,
    numberOfItems: SORTED_BLOG_POSTS.length,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.medicalcenterturkey.com" },
    { name: "Blog", url: PAGE_URL },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <BlogIndexContent posts={posts} currentPage={1} totalPages={TOTAL_BLOG_PAGES} />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

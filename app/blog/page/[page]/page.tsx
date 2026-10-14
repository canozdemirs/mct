import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import { BlogIndexContent } from "@/components/marketing/blog-index-content";
import { generateBreadcrumbSchema, generateCollectionPageSchema } from "@/lib/schema";
import { getBlogPage, SORTED_BLOG_POSTS, TOTAL_BLOG_PAGES } from "@/lib/blog-listing";

// Pages 2..TOTAL_BLOG_PAGES of the blog index. Page 1 lives at /blog itself
// (app/blog/page.tsx) — /blog/page/1 is deliberately never generated and
// `dynamicParams = false` makes it 404 rather than silently rendering a
// duplicate of /blog under a second URL.
//
// No explicit `robots` here. The root layout sets none either (Phase
// 5K-D) — pre-launch protection comes solely from proxy.ts, which sets
// X-Robots-Tag: noindex, nofollow on any non-production host. Same as
// every other page on the site (corrected 2026-10-14; this comment
// previously described a layout-level noindex that no longer exists).

type PageProps = { params: Promise<{ page: string }> };

export async function generateStaticParams() {
  const pages = [];
  for (let p = 2; p <= TOTAL_BLOG_PAGES; p++) {
    pages.push({ page: String(p) });
  }
  return pages;
}

export const dynamicParams = false;

function parsePage(pageParam: string): number | null {
  const n = Number(pageParam);
  if (!Number.isInteger(n) || n < 2 || n > TOTAL_BLOG_PAGES) return null;
  return n;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page: pageParam } = await params;
  const page = parsePage(pageParam);
  if (!page) return {};

  const pageUrl = `https://www.medicalcenterturkey.com/blog/page/${page}`;
  return {
    title: `Medical Center Turkey Blog — Page ${page} | Healthcare & Medical Tourism Insights`,
    description:
      "Explore healthcare insights, treatment guides, and medical tourism articles from Medical Center Turkey.",
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function BlogIndexPagedPage({ params }: PageProps) {
  const { page: pageParam } = await params;
  const page = parsePage(pageParam);
  if (!page) notFound();

  const posts = getBlogPage(page);
  const pageUrl = `https://www.medicalcenterturkey.com/blog/page/${page}`;

  const collectionSchema = generateCollectionPageSchema({
    name: `Medical Center Turkey Blog — Page ${page}`,
    description: "Explore expert insights, treatment guides, patient information, and the latest articles about healthcare and medical tourism in Turkey.",
    url: pageUrl,
    numberOfItems: SORTED_BLOG_POSTS.length,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.medicalcenterturkey.com" },
    { name: "Blog", url: "https://www.medicalcenterturkey.com/blog" },
    { name: `Page ${page}`, url: pageUrl },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <BlogIndexContent posts={posts} currentPage={page} totalPages={TOTAL_BLOG_PAGES} />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import { BlogArticleContent } from "@/components/marketing/blog-article-content";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { BLOG_POSTS } from "@/lib/blog-index.generated";
import { getPostBySlug } from "@/lib/blog-listing";

// This route is reached only via a proxy.ts rewrite from the public
// root-level URL (/<slug>). Its own canonical always points back to that
// root URL so this internal path never competes with it for indexing.
// A direct request to /posts/<slug> never reaches this component at all —
// proxy.ts redirects it to the public root URL before Next.js resolves a
// route, so this page can stay fully static (generateStaticParams-only,
// no request-time APIs).
// It intentionally declares no `robots` metadata of its own — it inherits
// noindex/nofollow from the root layout, same as every other page on the
// site during this pre-launch phase.

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: {
      canonical: `https://www.medicalcenterturkey.com/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const canonicalUrl = `https://www.medicalcenterturkey.com/${post.slug}`;
  // The imported WordPress HTML links its "Treatment Cost Calculator" /
  // "click here to calculate" CTAs (652 occurrences across the archive) to
  // the absolute live production URL. That domain still serves the old
  // WordPress site until the real cutover, so following this link today
  // (on any host -- preview, localhost, or even a Next.js production
  // deploy before DNS cutover) lands on WordPress's own calculator, not
  // this app's. Rewritten here, once, at build time, to the app's own
  // relative route -- resolves correctly on every host this app is served
  // from, with no per-article content-file edits. Scoped to this one exact
  // literal URL only; nothing else in the article HTML is touched.
  //
  // The "Request a FREE Consultation" banner (a separate CTA from the
  // calculator one above) is removed entirely per request -- same
  // build-time, no-per-file-edit approach. The imported HTML has several
  // structural variants of this banner across the archive: most are
  // <a href="..."><img alt="Request a FREE Consultation" .../></a> (href
  // itself varies -- "#", the calculator URL, even one unrelated Wikipedia
  // link -- all still removed since the match is on the img's alt, not the
  // href), some wrap the <img> in an extra <span> inside the <a>, a few
  // have no <a> at all (a bare <img>, sometimes inside a stray <p>), and
  // one has a trailing space inside the alt attribute itself. The two
  // passes below handle the anchor-wrapped variants first, then whatever
  // bare/paragraph-wrapped <img> is left -- verified against all 608
  // articles (scripts not kept) to leave zero remaining occurrences while
  // never touching the separate calculator banner. Replacement is a blank
  // line, not an empty string, matching the surrounding paragraph-break
  // convention so no doubled or zero gap is left behind.
  const html = readFileSync(path.join(process.cwd(), "content", "blog", `${slug}.html`), "utf-8")
    .replaceAll("https://www.medicalcenterturkey.com/treatment-prices-in-turkey/", "/treatment-prices-in-turkey")
    .replace(
      /\s*<a\s+href="[^"]*"[^>]*>\s*(?:<span>)?\s*<img[^>]*alt="Request a FREE Consultation\s*"[^>]*\/?>\s*(?:<\/span>)?\s*<\/a>\s*/g,
      "\n\n"
    )
    .replace(
      /\s*(?:<p>)?\s*<img[^>]*alt="Request a FREE Consultation\s*"[^>]*\/?>\s*(?:<\/p>)?\s*/g,
      "\n\n"
    );
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.seoDescription,
    url: canonicalUrl,
    datePublished: post.date,
    image: post.featuredImage || undefined,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.medicalcenterturkey.com" },
    { name: "Blog", url: "https://www.medicalcenterturkey.com/blog" },
    { name: post.title, url: canonicalUrl },
  ]);

  const publishedDate = new Date(post.date.replace(" ", "T") + "Z");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-12 sm:pb-24">
        <article>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand mb-3">{post.title}</h1>
          <p className="text-sm text-gray-400 mb-8">
            {publishedDate.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
            {post.categories.length > 0 && <> &middot; {post.categories.join(", ")}</>}
          </p>
          <BlogArticleContent
            html={html}
            className="blog-article-body space-y-5 text-gray-600 leading-relaxed text-[15px] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-brand [&_h3]:mt-8 [&_h3]:mb-2 [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-brand [&_h4]:mt-6 [&_h4]:mb-2 [&_img]:rounded-xl [&_img]:w-full [&_img]:h-auto [&_figure]:my-6 [&_figcaption]:text-xs [&_figcaption]:text-gray-400 [&_figcaption]:mt-2 [&_ul]:list-disc [&_ul]:list-outside [&_ul]:ml-5 [&_ul]:space-y-1.5 [&_a]:text-teal [&_a]:underline [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-100 [&_td]:p-2 [&_th]:border [&_th]:border-gray-100 [&_th]:p-2 [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl"
          />
        </article>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

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

// Two known promotional CTA banner families, identified by their stable
// SRC filename rather than `alt` text: an archive-wide scan found ~169 of
// the "Request a FREE Consultation" banners have an empty or missing alt
// attribute (an earlier alt-text-based removal pass necessarily missed
// these -- e.g. /tattoo-removal-in-turkey-cost), and a second, previously
// unknown "Get a Free Quote" banner family (free-quote-medical-center-
// turkey.png, 23 occurrences) was found carrying the same consultation/
// quote-request intent and the same /treatment-prices-in-turkey link
// target. 620 occurrences combined. The Treatment Cost Calculator banner
// (Yeni-CC-Logo...) never matches either pattern and is unaffected --
// verified against the full archive (577 occurrences, unchanged before
// vs. after).
//
// The enclosing wrapper varies in both identity and nesting depth across
// the archive -- a single <a>, a bare <img> with no wrapper at all, and
// (the case that broke the previous alt-text-only removal) a 3-deep
// <h4><a><img/></a></h4>. Rather than hand-enumerate wrapper shapes, the
// <img> is first swapped for a unique, non-whitespace marker, then any
// tag directly enclosing ONLY that marker is stripped, repeated until
// stable -- this naturally unwinds any nesting depth. Scoping the
// wrapper-strip to the marker (not a blind "remove any empty tag" sweep)
// matters: an earlier version of this that stripped any empty wrapper
// tag anywhere in the document also deleted unrelated, pre-existing
// whitespace-only <span> tags elsewhere in the article (e.g.
// prp-for-hair-loss.html) that have nothing to do with these banners.
function removeBannerImages(html: string): string {
  const BANNER_SRC = "(?:Request-a-FREE-Consultation|free-quote-medical-center-turkey)";
  const WRAPPER_TAGS = "a|p|span|figure|h2|h3|h4|h5|h6|div";
  const MARKER = "\u0000BANNER\u0000";

  const imgPattern = new RegExp(`<img[^>]*src="[^"]*${BANNER_SRC}[^"]*"[^>]*/?>`, "g");
  if (!imgPattern.test(html)) return html;

  let result = html.replace(imgPattern, MARKER);

  const wrapperPattern = new RegExp(`<(${WRAPPER_TAGS})(?:\\s+[^>]*)?>\\s*${MARKER}\\s*</\\1>`, "g");
  let prev = "";
  while (prev !== result) {
    prev = result;
    result = result.replace(wrapperPattern, MARKER);
  }

  return result.split(MARKER).join("\n\n");
}

// The imported WordPress HTML opens (and in some articles, repeats
// mid-body before a CTA) with a fully generic sentence carrying zero
// article-specific information -- e.g. "<Title> is an article that aims
// to give you all the information you do not know about <topic> and
// more. We kindly shared the main headings with you;" -- confirmed present
// in 567 of 608 articles, 593 occurrences total (some articles repeat it
// 2-5 times before recurring CTA links). It's reliably isolated in its own
// <span> (occasionally split across 2-3 adjacent <span> tags, e.g.
// "...about X</span><span> and more. We kindly shared...</span>", and
// occasionally with a nested <strong>/<em>, or wrapped in one more outer
// <span> that then contains nothing else -- e.g.
// "<span><span>X is an article that aims...Turkey. </span></span>" in
// dental-testimonials-turkey and what-are-the-most-popular-aesthetic-
// procedures-in-turkey), so it's removed structurally rather than
// rewritten -- no replacement text is needed, since the sentence conveys
// no real information and whatever follows (a heading list, an <h2>, or
// the article's own first real sentence) becomes the new opening on its
// own.
//
// Ranges to delete are computed first in a single left-to-right scan, then
// applied to the original string in one pass at the end -- NOT built by
// appending to an output buffer as the scan goes. An earlier version did
// the latter and had a real bug on the double-wrapped-<span> case above:
// by the time the scan reached the inner trigger span and decided the now-
// empty OUTER <span> should also be deleted, that outer tag's text had
// already been irreversibly written to the output buffer one iteration
// earlier (when it was first seen and didn't match on its own), so the
// "delete the outer wrapper too" step silently became a no-op and an
// orphaned, unclosed <span> leaked into the rendered article. Computing
// (start, end) ranges first and slicing the original string against them
// afterward has no such ordering dependency. Verified against the full
// archive: 0 occurrences of the trigger phrase remain after this runs, the
// count of removed <span> opens equals the count of removed </span>
// closes in every one of the 608 articles (no orphaned tag), and real
// neighboring content (an unrelated <span> starting a genuine sentence, or
// a patient testimonial span in dentist-in-turkey-reviews) is never
// consumed -- consumption of a following span only continues while that
// span's own text starts with a matching generic continuation phrase
// ("and more", "and its process", "we kindly shared").
const TEMPLATE_INTRO_SPAN = /<span>((?:[^<]|<\/?strong>|<\/?em>)*)<\/span>/gi;
const TEMPLATE_INTRO_TRIGGER = "aims to give you all the information";
const TEMPLATE_INTRO_CONTINUATION = /^\s*(and (more|its process)\b|we kindly shared\b)/i;

function stripInlineTags(s: string): string {
  return s.replace(/<\/?strong>|<\/?em>/gi, "");
}

function matchSpanAt(html: string, pos: number): RegExpExecArray | null {
  TEMPLATE_INTRO_SPAN.lastIndex = pos;
  const m = TEMPLATE_INTRO_SPAN.exec(html);
  return m && m.index === pos ? m : null;
}

function findTemplateIntroRanges(html: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  let i = 0;
  for (;;) {
    const idx = html.indexOf("<span>", i);
    if (idx === -1) break;
    const m = matchSpanAt(html, idx);
    if (!m || !stripInlineTags(m[1]).toLowerCase().includes(TEMPLATE_INTRO_TRIGGER)) {
      i = idx + 6;
      continue;
    }
    let end = idx + m[0].length;
    for (;;) {
      let j = end;
      while (j < html.length && " \t\r\n".includes(html[j])) j++;
      const m2 = matchSpanAt(html, j);
      if (m2 && TEMPLATE_INTRO_CONTINUATION.test(stripInlineTags(m2[1]))) {
        end = j + m2[0].length;
        continue;
      }
      break;
    }
    let start = idx;
    let k = start;
    while (k > 0 && " \t\r\n".includes(html[k - 1])) k--;
    if (html.slice(Math.max(0, k - 6), k) === "<span>") {
      let j2 = end;
      while (j2 < html.length && " \t\r\n".includes(html[j2])) j2++;
      if (html.slice(j2, j2 + 7).toLowerCase() === "</span>") {
        start = k - 6;
        end = j2 + 7;
      }
    }
    ranges.push([start, end]);
    i = end;
  }
  return ranges;
}

function removeTemplateIntro(html: string): string {
  const ranges = findTemplateIntroRanges(html);
  let out = "";
  let pos = 0;
  for (const [start, end] of ranges) {
    out += html.slice(pos, start);
    pos = end;
  }
  out += html.slice(pos);
  return out;
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
  const html = removeTemplateIntro(
    removeBannerImages(
      readFileSync(path.join(process.cwd(), "content", "blog", `${slug}.html`), "utf-8")
        .replaceAll("https://www.medicalcenterturkey.com/treatment-prices-in-turkey/", "/treatment-prices-in-turkey")
    )
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
            className="blog-article-body space-y-5 text-gray-600 leading-relaxed text-[15px] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-brand [&_h3]:mt-8 [&_h3]:mb-2 [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-brand [&_h4]:mt-6 [&_h4]:mb-2 [&_img]:rounded-xl [&_figcaption]:text-xs [&_figcaption]:text-gray-400 [&_figcaption]:mt-2 [&_ul]:list-disc [&_ul]:list-outside [&_ul]:ml-5 [&_ul]:space-y-1.5 [&_a]:text-teal [&_a]:underline [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-100 [&_td]:p-2 [&_th]:border [&_th]:border-gray-100 [&_th]:p-2 [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl"
          />
        </article>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

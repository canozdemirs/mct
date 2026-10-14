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

// A small family of generic destination/beauty marketing sentences,
// unrelated to any article's actual topic, appears glued (no leading
// space) to the end of a real sentence throughout the archive -- e.g.
// "...this product will not work.Invest in your health, invest in a
// brighter future. Our comprehensive medical programs deliver real
// results, while you indulge in the beauty and serenity of our
// destination." 8 distinct exact-text variants were catalogued (comma vs.
// "and" in the lead clause, 3 tail-clause endings, one fully-merged single-
// sentence form, plus the fixed "We offer advanced expertise... Choose
// us..." pair) across 201 articles, 465 occurrences total -- confirmed via
// a full-corpus scan that these 8 strings fully account for every
// occurrence of the four trigger phrases, with two exceptions.
//
// Two one-off articles (how-much-does-cervical-cancer-treatment-cost,
// targeted-drug-therapy-in-turkey) use their own uniquely-worded variant
// that explicitly doubles down on efficacy language ("deliver real,
// effective results", "healing journey both effective and restorative")
// in an oncology/cancer-drug context -- deliberately left out of
// GENERIC_MARKETING_FILLER so they're never touched by this function; they
// read as an outcome-adjacent claim rather than pure generic filler, so
// they're reported for manual review instead of silently edited.
const GENERIC_MARKETING_FILLER = [
  "Invest in your health, invest in a brighter future.",
  "Invest in your health and invest in a brighter future.",
  "Invest in your health, invest in a brighter future, and indulge in the beauty and serenity of our destination.",
  "Our comprehensive medical programs deliver real results, while you indulge in the beauty and serenity of our destination.",
  "Our comprehensive medical programs deliver real results, while you indulge in the beauty and serenity of our destination in Turkey.",
  "Our comprehensive medical programs deliver real results, while you enjoy the beauty, comfort, and serenity of Turkey throughout your treatment and recovery journey.",
  "We offer advanced expertise, tailored treatment plans, and compassionate care, every step of the way.",
  "Choose us, and choose a future where health isn't just a destination, but a vibrant, empowered journey you take with trusted companions by your side.",
];

const ENCLOSING_TAG = /<([a-zA-Z0-9]+)(?:\s[^>]*)?>/;
const VOID_TAGS = new Set(["br", "img", "hr"]);

// If [start, end) is the ENTIRE content of its one directly-enclosing tag
// (only whitespace between that tag's own open/close and the phrase),
// returns the extended range including that tag too, so removing a phrase
// that was a whole paragraph/span on its own doesn't leave an orphaned
// empty wrapper -- same technique used for the double-wrapped-<span> case
// in removeTemplateIntro above.
function enclosingTagIfNowEmpty(html: string, start: number, end: number): [number, number] | null {
  let k = start;
  while (k > 0 && " \t\r\n".includes(html[k - 1])) k--;
  const openStart = html.lastIndexOf("<", k - 1);
  if (openStart === -1) return null;
  ENCLOSING_TAG.lastIndex = 0;
  const m = ENCLOSING_TAG.exec(html.slice(openStart, k + 1));
  if (!m || openStart + m[0].length !== k) return null;
  const tag = m[1].toLowerCase();
  if (VOID_TAGS.has(tag)) return null;
  let j = end;
  while (j < html.length && " \t\r\n".includes(html[j])) j++;
  const closeTag = `</${tag}>`;
  if (html.slice(j, j + closeTag.length).toLowerCase() !== closeTag) return null;
  return [openStart, j + closeTag.length];
}

function removeGenericMarketingFiller(html: string): string {
  const ranges: Array<[number, number]> = [];
  let i = 0;
  while (i < html.length) {
    let best: [number, string] | null = null;
    for (const phrase of GENERIC_MARKETING_FILLER) {
      const idx = html.indexOf(phrase, i);
      if (idx !== -1 && (best === null || idx < best[0])) best = [idx, phrase];
    }
    if (best === null) break;
    const [idx, phrase] = best;
    const end = idx + phrase.length;
    const extended = enclosingTagIfNowEmpty(html, idx, end);
    const [start, end2] = extended ?? [idx, end];
    ranges.push([start, end2]);
    i = end2;
  }
  let out = "";
  let pos = 0;
  for (const [start, end] of ranges) {
    out += html.slice(pos, start);
    pos = end;
  }
  out += html.slice(pos);
  return out;
}

// ~440 <p>/top-level <span> text blocks across the archive run past 800
// characters (longest: 4246), a holdover from how the WordPress content was
// authored -- long enough to hurt readability and AI-Search "direct answer"
// extraction. Each one is split in place at a genuine sentence boundary
// closest to its midpoint (by plain-text length), not a fixed character
// count, so the two halves land close to even rather than one huge piece
// and one sliver; a boundary is only used if inline-tag depth (a/strong/
// em/b/i/sup/sub) is back to 0 there, so a split can never land inside a
// link or formatting tag. Candidates nested inside <li>/<td>/<table>/<a>
// are skipped entirely (splitting there would break list/table/link
// structure), as is the one block in the whole archive that contains no
// sentence-ending punctuation at all (a long dash-separated list of
// country names in how-to-get-medical-visa-for-turkey) -- both cases are
// left completely unchanged rather than guessed at. No heading is ever
// inserted, no id attribute is touched (none of these candidates carry
// one), and the exact original sentence text and order are preserved on
// both sides of the split -- verified by re-concatenating the two output
// halves and diffing against the original block's plain text across the
// full archive before this was wired in here.
const LONG_PARAGRAPH_THRESHOLD = 800;
const MIN_FRAGMENT_LENGTH = 150;
const INLINE_DEPTH_TAG_RE = /<(\/?)(a|strong|em|b|i|sup|sub)(?:\s[^>]*)?>/gi;
const ANY_TAG_RE = /<[^>]*>/g;
const ABBREVIATION_BEFORE_PERIOD = /\b(Dr|Mr|Mrs|Ms|vs|etc|e\.g|i\.e|No|Jr|St)\.?$/i;

function textOf(htmlFragment: string): string {
  return htmlFragment.replace(ANY_TAG_RE, "").replace(/\s+/g, " ").trim();
}

function isInsideExcludedContext(html: string, pos: number): boolean {
  const prefix = html.slice(0, pos);
  const balance = (openRe: RegExp, closeRe: RegExp) =>
    (prefix.match(openRe)?.length ?? 0) - (prefix.match(closeRe)?.length ?? 0);
  return (
    balance(/<li(?:\s[^>]*)?>/gi, /<\/li>/gi) > 0 ||
    balance(/<td(?:\s[^>]*)?>/gi, /<\/td>/gi) > 0 ||
    balance(/<table(?:\s[^>]*)?>/gi, /<\/table>/gi) > 0 ||
    balance(/<a(?:\s[^>]*)?>/gi, /<\/a>/gi) > 0
  );
}

function findSentenceSplitPoints(inner: string): number[] {
  let depth = 0;
  const points: number[] = [];
  let i = 0;
  while (i < inner.length) {
    if (inner[i] === "<") {
      INLINE_DEPTH_TAG_RE.lastIndex = i;
      const m = INLINE_DEPTH_TAG_RE.exec(inner);
      if (m && m.index === i) {
        depth = m[1] === "/" ? Math.max(0, depth - 1) : depth + 1;
        i = m.index + m[0].length;
        continue;
      }
      const generic = /^<[^>]*>/.exec(inner.slice(i));
      if (generic) {
        i += generic[0].length;
        continue;
      }
      i++;
      continue;
    }
    if (".!?".includes(inner[i]) && depth === 0) {
      let j = i + 1;
      while (j < inner.length && " \t\r\n".includes(inner[j])) j++;
      const rest = inner.slice(j, j + 1);
      if (j > i + 1 && (rest === "" || rest === "<" || /[A-Z]/.test(rest))) {
        const lookbehind = inner.slice(Math.max(0, i - 4), i);
        if (!ABBREVIATION_BEFORE_PERIOD.test(lookbehind)) points.push(j);
      }
    }
    i++;
  }
  return points;
}

function bestSplitPoint(inner: string, points: number[]): number | null {
  if (points.length === 0) return null;
  const totalLen = textOf(inner).length;
  const target = totalLen / 2;
  let best: number | null = null;
  let bestDist = Infinity;
  for (const p of points) {
    const prefixLen = textOf(inner.slice(0, p)).length;
    const suffixLen = totalLen - prefixLen;
    if (prefixLen < MIN_FRAGMENT_LENGTH || suffixLen < MIN_FRAGMENT_LENGTH) continue;
    const dist = Math.abs(prefixLen - target);
    if (dist < bestDist) {
      best = p;
      bestDist = dist;
    }
  }
  return best;
}

function splitLongParagraphs(html: string): string {
  type Candidate = { start: number; end: number; openTag: string; closeTag: string; inner: string };
  const candidates: Candidate[] = [];
  const pRanges: Array<[number, number]> = [];

  const pRe = /<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g;
  for (let m = pRe.exec(html); m; m = pRe.exec(html)) {
    pRanges.push([m.index, m.index + m[0].length]);
    if (textOf(m[1]).length > LONG_PARAGRAPH_THRESHOLD) {
      const openTag = /^<p(?:\s[^>]*)?>/.exec(m[0])![0];
      candidates.push({ start: m.index, end: m.index + m[0].length, openTag, closeTag: "</p>", inner: m[1] });
    }
  }

  const spanRe = /<span>((?:[^<]|<(?!\/?span)[^>]*>)*)<\/span>/g;
  for (let m = spanRe.exec(html); m; m = spanRe.exec(html)) {
    const insideP = pRanges.some(([s, e]) => s <= m!.index && m!.index + m![0].length <= e);
    if (insideP) continue;
    if (textOf(m[1]).length > LONG_PARAGRAPH_THRESHOLD) {
      // Output as <p>, not <span> -- see the long comment above this
      // function for why: a bare top-level <span> is `display: inline` by
      // default (nothing in globals.css makes it block), so two adjacent
      // <span> halves render with NO visible gap between them at all, just
      // a line-wrap in the middle of what still reads as one unbroken
      // paragraph. <p> is block-level and already picks up this
      // container's existing `space-y-5` spacing (the same spacing every
      // <h2>/image/other block already uses), so splitting into <p> is
      // both the fix for that and literally what "valid paragraph-level
      // HTML structure" means. Verified with a real browser (Playwright)
      // against this exact case before switching from <span>.
      candidates.push({ start: m.index, end: m.index + m[0].length, openTag: "<p>", closeTag: "</p>", inner: m[1] });
    }
  }

  candidates.sort((a, b) => a.start - b.start);

  const replacements: Array<[number, number, string]> = [];
  for (const c of candidates) {
    if (isInsideExcludedContext(html, c.start)) continue;
    const points = findSentenceSplitPoints(c.inner);
    const sp = bestSplitPoint(c.inner, points);
    if (sp === null) continue;
    const part1 = c.inner.slice(0, sp).replace(/\s+$/, "");
    const part2 = c.inner.slice(sp).replace(/^\s+/, "");
    const newBlock = `${c.openTag}${part1}${c.closeTag}\n\n${c.openTag}${part2}${c.closeTag}`;
    replacements.push([c.start, c.end, newBlock]);
  }

  let out = "";
  let pos = 0;
  for (const [start, end, block] of replacements) {
    out += html.slice(pos, start) + block;
    pos = end;
  }
  out += html.slice(pos);
  return out;
}

// A manual-review pass (separate from the mechanical GENERIC_MARKETING_FILLER
// removal above) flagged 28 articles with unsupported satisfaction/service
// claims, misleading "miracle"/"perfect results" language, or medically
// inaccurate "risk-free" claims. Each entry below is a one-off, hand-reviewed
// fix for one specific sentence in one specific article -- never a bulk
// pattern applied across many files, since each of these needed individual
// medical/content judgment rather than mechanical matching. Exactly 7 of the
// 28 flagged articles are deliberately absent from this table: their
// flagged sentence already reads as an appropriate caution against
// overclaiming (e.g. "if a clinic guarantees perfect results... this can be
// a warning sign"), or the claim is a narrow, factually-consistent technical
// statement (e.g. "no risk of implant rupture" for fat-transfer augmentation,
// which has no implant to rupture) -- both left untouched on purpose.
// `why-breast-augmentations-deliver-perfect-results-in-turkey`'s "Perfect
// Result" wording only appears in the already-render-time-removed template
// intro and in image alt text; no safe body-text edit exists there without
// touching the title/URL/SEO metadata, which is out of scope here -- it
// remains an open, unresolved item (see the phase report).
const MANUAL_CONTENT_FIXES: Record<string, Array<{ find: string; replace: string }>> = {
  "bladder-cancer-in-turkey": [
    { find: " Patients are grateful for the favorable results of these cutting-edge therapies.", replace: "" },
    { find: "\n \t<li><span><strong>Service quality.</strong> Patients value the excellent quality of service, which includes complimentary services like transportation from the airport to the hospital and translation services.</span></li>", replace: "" },
  ],
  "brain-cancer-treatment-in-turkey": [
    { find: " Patients are grateful for the favorable results of these cutting-edge therapies.", replace: "" },
    { find: "\n \t<li><span><strong>Service quality.</strong> Patients value the excellent quality of service, which includes complimentary services like transportation from the airport to the hospital and translation services.</span></li>", replace: "" },
  ],
  "breast-cancer-in-turkey": [
    { find: " Patients are grateful for the favorable results of these cutting-edge therapies.", replace: "" },
    { find: "\n \t<li><span><strong>Service quality.</strong> Patients value the excellent quality of service, which includes complimentary services like transportation from the airport to the hospital and translation services.</span></li>", replace: "" },
  ],
  "eye-cancer": [
    { find: " Patients are grateful for the favorable results of these cutting-edge therapies.", replace: "" },
    { find: "\n \t<li><span><strong>Service quality.</strong> Patients value the excellent quality of service, which includes complimentary services like transportation from the airport to the hospital and translation services.</span></li>", replace: "" },
  ],
  "fallopian-tube-cancer": [
    { find: " Patients are grateful for the favorable results of these cutting-edge therapies.", replace: "" },
    { find: "\n \t<li><span><strong>Service quality.</strong> Patients value the excellent quality of service, which includes complimentary services like transportation from the airport to the hospital and translation services.</span></li>", replace: "" },
  ],
  "how-is-spinal-osteoarthritis-treated-in-turkey": [
    { find: " Patients are grateful for the favorable results of these cutting-edge therapies.", replace: "" },
    { find: "\n \t<li><span><strong>Service quality.</strong> Patients value the excellent quality of service, which includes complimentary services like transportation from the airport to the hospital and translation services.</span></li>", replace: "" },
  ],
  "kidney-renal-cell-cancer": [
    { find: " Patients are grateful for the favorable results of these cutting-edge therapies.", replace: "" },
    { find: "\n \t<li><span><strong>Service quality.</strong> Patients value the excellent quality of service, which includes complimentary services like transportation from the airport to the hospital and translation services.</span></li>", replace: "" },
  ],
  "liver-cancer-in-turkey": [
    { find: " Patients are grateful for the favorable results of these cutting-edge therapies.", replace: "" },
    { find: "\n \t<li><span><strong>Service quality.</strong> Patients value the excellent quality of service, which includes complimentary services like transportation from the airport to the hospital and translation services.</span></li>", replace: "" },
  ],
  "liver-disease": [
    { find: " Patients are grateful for the favorable results of these cutting-edge therapies.", replace: "" },
    { find: "\n \t<li><span><strong>Service quality.</strong> Patients value the excellent quality of service, which includes complimentary services like transportation from the airport to the hospital and translation services.</span></li>", replace: "" },
  ],
  "metastatic-cancer": [
    { find: " Patients are grateful for the favorable results of these cutting-edge therapies.", replace: "" },
    { find: "\n \t<li><span><strong>Service quality.</strong> Patients value the excellent quality of service, which includes complimentary services like transportation from the airport to the hospital and translation services.</span></li>", replace: "" },
  ],
  "metastatic-prostate-cancer-all-you-need-to-know": [
    { find: " Patients are grateful for the favorable results of these cutting-edge therapies.", replace: "" },
    { find: "\n \t<li><span><strong>Service quality.</strong> Patients value the excellent quality of service, which includes complimentary services like transportation from the airport to the hospital and translation services.</span></li>", replace: "" },
  ],
  "antonio-contes-hair-transplantation": [
    { find: "In 2012, it's still a miracle five years later.", replace: "In 2012, his look had changed noticeably in the five years since." },
  ],
  "gastric-sleeve-surgery-price": [
    { find: "But if we evaluate it for a long time, you will get perfect results within 1 year.", replace: "But over a longer timeframe, results typically continue to improve within the first year." },
  ],
  "does-kim-kardashian-end-the-bbl-era": [
    { find: "Miracle operation BBL stands for Brazilian Butt Lift.", replace: "BBL stands for Brazilian Butt Lift." },
  ],
  "does-dutasteride-help-in-treating-hair-loss": [
    { find: "There are virtually no risks associated with a hair transplant procedure, so you will have nothing to worry about.", replace: "Hair transplant procedures are generally considered low-risk when performed by a qualified surgeon." },
  ],
  "frequently-asked-questins-in-botox": [
    { find: "There is no risk of Botox applications, but it is not suitable for pregnant women.", replace: "Botox is generally considered safe when administered correctly, but it is not suitable for pregnant women." },
  ],
  "cleft-lift-surgery-whats-the-procedure-like-in-2025": [
    { find: "Fully recover within 4-6 weeks, with little to no risk of recurrence.", replace: "Fully recover within 4-6 weeks, with a low risk of recurrence." },
  ],
  "different-lip-plumping-techniques-announced-in-2026": [
    { find: "No risk of overfilling, no downtime, only healthier and smoother lips over time.", replace: "Minimal risk of overfilling, little downtime, and healthier, smoother lips over time." },
  ],
  "how-much-does-cervical-cancer-treatment-cost": [
    {
      find: "<p><span>Invest in your health and invest in a brighter future in Turkey. Our comprehensive cancer treatment programs in Turkey combine advanced medical technology, experienced specialists, and personalized care to deliver real, effective results. While receiving world-class healthcare, you can also enjoy the beauty, comfort, and serenity that Turkey offers making your healing journey both effective and restorative.</span></p>",
      replace: "",
    },
  ],
  "targeted-drug-therapy-in-turkey": [
    {
      find: " Invest in your health, invest in a brighter future with comprehensive medical programs in Turkey that deliver real results, while you also enjoy the beauty and serenity of your destination.",
      replace: "",
    },
  ],
};

function applyManualContentFixes(slug: string, html: string): string {
  const fixes = MANUAL_CONTENT_FIXES[slug];
  if (!fixes) return html;
  let result = html;
  for (const { find, replace } of fixes) {
    result = result.split(find).join(replace);
  }
  return result;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const canonicalUrl = `https://www.medicalcenterturkey.com/${post.slug}`;
  // The imported WordPress HTML links its pricing/package CTAs ("Treatment
  // Cost Calculator" banners, "click here to calculate", "Click here for
  // all inclusive", "EUR 1550 and see more packages", etc.) to absolute
  // live-production URLs. That domain still serves the old WordPress site
  // until the real cutover, so following any of these links today (on any
  // host -- preview, localhost, or even a Next.js production deploy before
  // DNS cutover) lands on WordPress's own pricing pages, not this app's.
  // Rewritten here, once, at build time, to this app's own relative
  // /treatment-prices-in-turkey route -- resolves correctly on every host
  // this app is served from, with no per-article content-file edits.
  //
  // Three distinct legacy URLs were confirmed (via a full-archive scan) to
  // all be the same kind of "view pricing / request a package" CTA, just
  // authored at different times with different WordPress page slugs:
  // /treatment-prices-in-turkey/ (598 articles), /hair-transplant-packages/
  // (34 articles, e.g. the "Click here for all inclusive" link in
  // daniels-hair-transplant-experience-in-turkey), and
  // /rhinoplasty-packages/ (4 articles). All three get the exact same
  // target. Scoped to these exact literal URLs only -- every other absolute
  // medicalcenterturkey.com link in the archive points to a DIFFERENT real
  // article's own page (e.g. /veneers-cost-in-turkey/ is that article's own
  // slug, not a pricing-calculator reference) and is deliberately left
  // untouched here; rewriting those is a separate, not-yet-approved task.
  const LEGACY_PRICING_LINKS = [
    "https://www.medicalcenterturkey.com/treatment-prices-in-turkey/",
    "https://www.medicalcenterturkey.com/hair-transplant-packages/",
    "https://www.medicalcenterturkey.com/rhinoplasty-packages/",
  ];
  let rawHtml = readFileSync(path.join(process.cwd(), "content", "blog", `${slug}.html`), "utf-8");
  for (const legacyUrl of LEGACY_PRICING_LINKS) {
    rawHtml = rawHtml.replaceAll(legacyUrl, "/treatment-prices-in-turkey");
  }
  const html = splitLongParagraphs(
    applyManualContentFixes(
      slug,
      removeGenericMarketingFiller(
        removeTemplateIntro(
          removeBannerImages(rawHtml)
        )
      )
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

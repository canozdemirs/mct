#!/usr/bin/env node
/**
 * import-blog-posts.mjs
 *
 * Imports posts from a WordPress WXR export into content/blog/<slug>.html +
 * lib/blog-index.generated.ts + lib/blog-slugs.generated.ts.
 *
 * Modes:
 *   node scripts/import-blog-posts.mjs            -> prototype mode, only TEST_SLUGS (5 articles)
 *   IMPORT_ALL=1 node scripts/import-blog-posts.mjs -> full mode, all published posts minus EXCLUDED_SLUGS
 *
 * Idempotent: re-running regenerates content/blog/*.html, the two lib/*.generated.ts
 * index files, and the report from scratch every time (no incremental merge, so no
 * duplication or stale entries survive a rerun). Image downloads are skipped (not
 * re-fetched) when a same-named file already exists locally with non-zero size and
 * valid image magic bytes — safe to rerun repeatedly without re-downloading ~3000+
 * images every time.
 *
 * Does NOT touch the live WordPress site — this only reads a local export file and
 * writes into this project's content/blog, public/blog, lib/, and scripts/ directories.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import sanitizeHtml from "sanitize-html";
import {
  fixH1,
  fixH2Toc,
  fixIframeWrappedH2,
  fixLiposuctionParagraph,
  fixGoogleImageLinks,
} from "./lib/structural-fixes.mjs";
import {
  removeOrganTransplantPromotion,
  ORGAN_TRANSPLANT_REMOVALS,
  applyTextQualityFixes,
  TEXT_QUALITY_REPLACEMENTS,
} from "./lib/organ-transplant-cleanup.mjs";
import { applyMedicalClaimsFixes, MEDICAL_CLAIMS_REPLACEMENTS } from "./lib/medical-claims-cleanup.mjs";

const WXR_PATH =
  process.env.WXR_PATH ||
  "/Users/canozdemir/Desktop/treatmentabroadmedicaltreatmentinturkeymedicalcenterturkey.WordPress.2026-10-09.xml";

const IMPORT_ALL = process.env.IMPORT_ALL === "1";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "blog");
const PUBLIC_DIR = path.join(ROOT, "public", "blog");
const LIB_DIR = path.join(ROOT, "lib");

// Legacy post excluded per site-owner decision (2026-10-09): this slug now
// 301s at the route level to /hair-transplant-packages — it is not migrated
// as a standalone blog post.
//
// Phase 5E (2026-10-10): these 3 excluded per site-owner directive — MCT
// previously received an official warning over organ/kidney transplant
// content on the legacy site, and that content must not reappear on the new
// platform. Excluded here (not just deleted from content/) so a future
// re-import can never regenerate them. See lib/gone-paths.ts for the
// matching 410 rule and the Phase 5E report for full rationale.
//
// Phase 4 follow-up (2026-10-14): kidney-transplant-in-turkey and
// how-much-is-a-kidney-transplant-surgery added — same compliance
// rationale as the 3 above. Unlike those 3, neither exists as an actual
// <item> in the current WXR export (verified directly: no matching <link>
// or wp:post_name), so they were never part of the 612 published posts
// counted below — adding them here is purely defensive, in case a future
// WordPress export ever restores them. This is why EXPECTED_IMPORT_TOTAL
// below is a literal 608, not EXPECTED_PUBLISHED_TOTAL - EXCLUDED_SLUGS.size.
const EXCLUDED_SLUGS = new Set([
  "hair-transplant-turkey",
  "transplant-surgery-in-turkey-2025",
  "bone-marrow-transplantation-in-turkey",
  "how-long-is-bone-marrow-transplant",
  "kidney-transplant-in-turkey",
  "how-much-is-a-kidney-transplant-surgery",
]);

// Prototype-phase set, kept so a non-IMPORT_ALL run reproduces exactly the
// 5 already-reviewed articles deterministically.
const TEST_SLUGS = [
  "the-best-hospitals-in-turkey",
  "how-much-is-ivf-treatment",
  "dental-implants-in-turkey-types-prices-procedures",
  "bbl-surgery-in-turkey",
  "best-medical-tourism-providers-in-turkey-2026-how-to-choose-safely",
];

const EXPECTED_PUBLISHED_TOTAL = 612;
// Literal 608, not a formula off EXCLUDED_SLUGS.size (Phase 4 follow-up,
// 2026-10-14): 2 of the 6 exclusions above (the kidney slugs) don't exist
// in the current WXR's 612 published posts, so they never get subtracted
// in practice — only the original 4 do. 612 - 4 = 608, matching the real
// lib/blog-slugs.generated.ts count.
const EXPECTED_IMPORT_TOTAL = 608;

// ---------------------------------------------------------------------------
// Link fixes (Phase 3, approved 2026-10-10) — applied to every article's
// cleaned HTML after sanitization. All counts here were verified against
// scripts/.import-report.json before implementation; EXPECTED_* constants
// make a silent miscount impossible to miss on a rerun.
// ---------------------------------------------------------------------------

const CONSULTATION_HREF = "https://www.medicalcenterturkey.com/request-a-free-consultation/";
// Phase 5E: 2 of the 3 newly-excluded organ-transplant posts each had 1
// consultation CTA (589 - 2 = 587); verified against the pre-exclusion
// content/blog/*.html before this change.
const EXPECTED_CONSULTATION_LINKS = 587;

const DOCTOR_PROFILE_HREFS = new Set([
  "https://www.medicalcenterturkey.com/profiles/dr-kerim-kaban/",
  "https://www.medicalcenterturkey.com/profiles/dr-semra-kahraman/",
  "https://www.medicalcenterturkey.com/profiles/prof-dr-abdullah-ozkaya",
  "https://www.medicalcenterturkey.com/profiles/prof-dr-koray-acarli",
  "https://www.medicalcenterturkey.com/profiles/prof-dr-murat-binbay",
  "https://www.medicalcenterturkey.com/profiles/prof-naci-karaagac",
]);
const EXPECTED_DOCTOR_PROFILE_LINKS = 7;

// Verified mappings to existing, working destinations (5 of the 10 unmapped
// targets from the Phase 3 audit).
const LINK_REMAP = {
  "https://www.medicalcenterturkey.com/americanhospital/": "/american-hospital",
  "https://www.medicalcenterturkey.com/acibadem-taksim/": "/acibadem-taksim-hospital",
  "https://www.medicalcenterturkey.com/kocunivesityhospital/": "/koc-university-hospital",
  "https://www.medicalcenterturkey.com/dental-implants-in-turkey/": "/dental-implants-in-turkey-types-prices-procedures",
  "https://www.medicalcenterturkey.com/dental-treatment-guide-in-turkey/": "/dental-treatment-guide-in-turkey-2",
};
const EXPECTED_LINK_REMAP_COUNT = 5;

// No valid replacement exists for these (dead competitor hospital pages or a
// page with no equivalent anywhere) — unwrap the anchor, keep the text.
const LINK_DELINK_HREFS = new Set([
  "https://www.medicalcenterturkey.com/vmmedicalparkflorya/",
  "https://www.medicalcenterturkey.com/medicalparkbahcelievler/",
  "https://www.medicalcenterturkey.com/istinyeuniversityhospital/",
  "https://www.medicalcenterturkey.com/medical-park-bahcelievler-hospital/",
  "https://www.medicalcenterturkey.com/hair-transplant-before-after/",
]);
const EXPECTED_LINK_DELINK_COUNT = 6; // istinyeuniversityhospital appears twice in one article

// Confirmed-broken images (third-party 404 / dead WordPress media) — removed
// outright, nothing to replace them with.
const BROKEN_IMAGE_URLS = new Set([
  "https://www.wafadental.com/wp-content/uploads/2020/08/Veneers_GIF.gif",
  "https://www.medicalcenterturkey.com/wp-content/uploads/2023/10/Smile-Makeover-Cost-4-300x167.png",
]);
const EXPECTED_BROKEN_IMAGE_REMOVALS = 2;

/** Replaces the consultation-page href with a same-page anchor the client
 * can intercept, while leaving every other attribute (target/rel if
 * present) and the visible link text completely untouched. */
function convertConsultationLinks(html) {
  let count = 0;
  const result = html.replace(
    new RegExp(`<a([^>]*)href="${CONSULTATION_HREF.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"([^>]*)>`, "g"),
    (_m, before, after) => {
      count++;
      return `<a${before}href="#" data-cta="consultation"${after}>`;
    }
  );
  return { html: result, count };
}

/** Removes the `<a>` wrapper for every href in hrefSet, keeping the inner
 * text/markup exactly as it was (no page ever existed to send readers to,
 * so the link itself — not the words — is what has to go). */
function unwrapAnchorsByHref(html, hrefSet) {
  let count = 0;
  const result = html.replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (full, href, inner) => {
    if (hrefSet.has(href)) {
      count++;
      return inner;
    }
    return full;
  });
  return { html: result, count };
}

/** Rewrites href values that have a verified, existing replacement target —
 * only the href attribute changes, the anchor's visible text is untouched. */
function remapAnchorHrefs(html, remapObj) {
  let count = 0;
  const result = html.replace(/href="([^"]+)"/g, (full, href) => {
    if (remapObj[href]) {
      count++;
      return `href="${remapObj[href]}"`;
    }
    return full;
  });
  return { html: result, count };
}

/** Removes whole <img> tags matching a known-broken original URL. Runs
 * after localizeImages, so a failed image still carries its original
 * (now-confirmed-dead) remote src — exactly what we match on here. */
function removeBrokenImages(html, urlSet) {
  let count = 0;
  const result = html.replace(/<img\b[^>]*>/g, (tag) => {
    for (const url of urlSet) {
      if (tag.includes(`src="${url}"`)) {
        count++;
        return "";
      }
    }
    return tag;
  });
  return { html: result, count };
}

function applyLinkAndImageFixes(html, slug, globalCounters, warnings) {
  let out = html;

  const consultation = convertConsultationLinks(out);
  out = consultation.html;
  globalCounters.consultation += consultation.count;

  const doctors = unwrapAnchorsByHref(out, DOCTOR_PROFILE_HREFS);
  out = doctors.html;
  globalCounters.doctorDelink += doctors.count;

  const remapped = remapAnchorHrefs(out, LINK_REMAP);
  out = remapped.html;
  globalCounters.remapped += remapped.count;

  const delinked = unwrapAnchorsByHref(out, LINK_DELINK_HREFS);
  out = delinked.html;
  globalCounters.delinked += delinked.count;

  const images = removeBrokenImages(out, BROKEN_IMAGE_URLS);
  out = images.html;
  globalCounters.brokenImagesRemoved += images.count;

  return out;
}

// Phase 5F, task 6: structural HTML cleanup (duplicate body H1s, flattened
// WordPress TOC remnants in adjacent <h2> runs, the stray liposuction
// closing paragraph, and <a> wrappers pointing at Google Image Search
// results). Implemented in scripts/lib/structural-fixes.mjs using
// htmlparser2 element-boundary detection rather than broad regex deletion,
// and run here so a future re-import can never regenerate the removed
// patterns. Anything the detectors can't confirm with certainty is left
// untouched and recorded in `suspicious` for manual review.
//
// Phase 5F.1 (2026-10-12): the 108 files Phase 5F flagged as "suspicious"
// were individually read and manually classified. 106 were confirmed safe
// and added to slug-scoped allow-lists in structural-fixes.mjs (565+30=595
// H1 fixes incl. 6 H1->H2 demotions; 40 Google-link files already counted
// in Phase 5F's total gain 2 more removed links each from their confirmed-
// empty anchor, 60->62 links with the file count unchanged at 40).
//
// H2/TOC landed at 495/3, not the dry-run-predicted 496/2: demoting 6 H1s
// to H2 in innovations-in-orthopedic-cosmetic-surgery-in-turkey creates 5
// new character-adjacent H2 pairs (each demoted section heading sits
// directly against its first real H2 subheading) that didn't exist when
// that file was tested in isolation. fixH2Toc correctly refuses to touch a
// file with more than one run ("multiple-runs") rather than guess which
// pairs are safe, so this file lands as a 3rd, newly-discovered suspicious
// entry -- nothing was incorrectly deleted, it's a legitimate new manual-
// review case surfaced only by running the real end-to-end pipeline. These
// EXPECTED_* values are the actually-measured results, not a forced target.
//
// Phase 5F.2 (2026-10-12): the 3 remaining exceptions were manually read
// and resolved: (a) jude-laws-hair-transplantation and david-silvas-hair-
// transplantation had a video <iframe> pointlessly wrapped in <h2></h2> --
// unwrapped (fixIframeWrappedH2), keeping the iframe/src/attributes
// byte-for-byte; this also removes their only H2 run, so both files are
// now fully clean (no longer suspicious at all). (b) fixH2Toc now evaluates
// every run in a document independently instead of bailing out on the
// whole file when it has more than one run, so innovations-in-orthopedic-
// cosmetic-surgery-in-turkey's genuine pre-existing TOC remnant (its first
// run, 5 fake entries) gets safely removed while its other 4 runs (real
// section/subsection heading pairs, not duplicates) stay untouched -- that
// file is still reported suspicious (correctly: 4 runs remain blocked) but
// now also counts as "fixed" since 5 headings were removed from it.
const EXPECTED_H1_DUPLICATES_FIXED = 595;
const EXPECTED_H1_DEMOTED = 6;
const EXPECTED_H1_SUSPICIOUS = 0;
const EXPECTED_H2_IFRAME_UNWRAPPED = 2;
const EXPECTED_H2_TOC_FIXED = 496;
const EXPECTED_H2_TOC_SUSPICIOUS = 1;
const EXPECTED_LIPOSUCTION_PARAGRAPHS_REMOVED = 5;
const EXPECTED_GOOGLE_IMAGE_LINK_FILES_FIXED = 40;
const EXPECTED_GOOGLE_IMAGE_LINKS_REMOVED = 62;
const EXPECTED_GOOGLE_IMAGE_LINK_SUSPICIOUS = 0;

// Phase 5G.1 (2026-10-12): permanent fix for the organ/bone-marrow
// transplant service-marketing regression Phase 5G's audit found across 11
// articles (see scripts/lib/organ-transplant-cleanup.mjs). Phase 5G.1C
// (same day) added 6 more confirmed removals across 6 files (3 new slugs,
// 3 additional rules on already-listed slugs) plus 3 text-quality
// replacements across 2 files -- both counted dynamically below so they
// never drift from the data they're checking.
// Phase 5G.2A: ORGAN_TRANSPLANT_REMOVALS/TEXT_QUALITY_REPLACEMENTS are flat
// arrays of { slug, find, expectedCount } now (see organ-transplant-
// cleanup.mjs), so "files changed" is the count of distinct slugs, not
// Object.keys().
const EXPECTED_ORGAN_TRANSPLANT_FILES_CHANGED = new Set(ORGAN_TRANSPLANT_REMOVALS.map((r) => r.slug)).size;
const EXPECTED_ORGAN_TRANSPLANT_REMOVALS_APPLIED = ORGAN_TRANSPLANT_REMOVALS.reduce((sum, rule) => sum + rule.expectedCount, 0);
const EXPECTED_TEXT_QUALITY_FILES_CHANGED = new Set(TEXT_QUALITY_REPLACEMENTS.map((r) => r.slug)).size;
const EXPECTED_TEXT_QUALITY_FIXES_APPLIED = TEXT_QUALITY_REPLACEMENTS.reduce((sum, rule) => sum + rule.expectedCount, 0);

// Phase 5G.2A: permanent fix for the 9 P0 unverified-claim / "we perform"
// corporate-identity findings from the Phase 5G.2 read-only audit (see
// scripts/lib/medical-claims-cleanup.mjs).
const EXPECTED_MEDICAL_CLAIMS_FILES_CHANGED = new Set(MEDICAL_CLAIMS_REPLACEMENTS.map((r) => r.slug)).size;
const EXPECTED_MEDICAL_CLAIMS_FIXES_APPLIED = MEDICAL_CLAIMS_REPLACEMENTS.reduce((sum, rule) => sum + rule.expectedCount, 0);

function applyStructuralFixes(html, slug, title, counters, suspicious) {
  let out = html;

  const h1 = fixH1(out, title, slug);
  out = h1.html;
  if (h1.changed) counters.h1Fixed++;
  if (h1.demotedCount > 0) counters.h1Demoted += h1.demotedCount;
  if (h1.suspicious) suspicious.push({ slug, category: "h1", reason: h1.reason, detail: h1.h1Texts });

  const iframeUnwrap = fixIframeWrappedH2(out, slug);
  out = iframeUnwrap.html;
  if (iframeUnwrap.changed) counters.h2IframeUnwrapped += iframeUnwrap.removedCount;

  const h2 = fixH2Toc(out, slug);
  out = h2.html;
  if (h2.changed) counters.h2TocFixed++;
  if (h2.suspicious) suspicious.push({ slug, category: "h2-toc", reason: h2.reason, detail: h2.unexplainedTexts ?? h2.texts ?? h2.blockedRunCount });

  const lipo = fixLiposuctionParagraph(out, slug);
  out = lipo.html;
  if (lipo.changed) counters.liposuctionParagraphsRemoved++;

  const gimg = fixGoogleImageLinks(out, slug);
  out = gimg.html;
  if (gimg.changed) {
    counters.googleImageLinkFilesFixed++;
    counters.googleImageLinksRemoved += gimg.removedCount;
  }
  if (gimg.suspiciousCount > 0) {
    counters.googleImageLinkSuspiciousFiles++;
    suspicious.push({ slug, category: "google-image-link", reason: "anchor-not-pure-image-wrapper", detail: gimg.suspiciousCount });
  }

  return out;
}

// Known reserved routes this import must never collide with (checked below
// against every slug that will actually be imported).
const RESERVED_SLUGS = new Set([
  "agency", "hospitals-in-turkey", "treatment-prices-in-turkey", "privacy-policy", "terms", "blog",
  "hair-transplant-packages", "all-on-4-dental-implants-turkey", "blepharoplasty-turkey",
  "breast-augmentation-turkey", "cataract-surgery-turkey", "dental-implants-turkey",
  "gynecomastia-turkey", "ivf-treatment-turkey", "lasik-eye-surgery-turkey",
  "liposuction-turkey", "medical-check-up-turkey", "rhinoplasty-turkey",
]);
for (const slug of readHospitalSlugs()) RESERVED_SLUGS.add(slug);

function readHospitalSlugs() {
  try {
    const src = readFileSync(path.join(ROOT, "lib", "hospitals.ts"), "utf-8");
    return [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  } catch {
    return [];
  }
}

// ChatGPT-web-UI contamination signatures (see Phase 1 audit) — used only
// for FLAGGING a manual-review list; removal itself happens generically via
// the sanitize() structural-tag stripping below.
const CONTAMINATION_MARKERS = [
  "data-message-author-role",
  "conversation-turn",
  "markdown prose dark:prose-invert",
  "data-writing-block",
  'data-testid="conversation',
];

// ---------------------------------------------------------------------------
// Content cleaning pipeline
// ---------------------------------------------------------------------------

function convertHeadingShortcode(html) {
  return html.replace(
    /\[cmsmasters_heading[^\]]*\btype="(h[1-6])"[^\]]*\]([\s\S]*?)\[\/cmsmasters_heading\]/g,
    (_m, tag, inner) => `<${tag}>${inner.trim()}</${tag}>`
  );
}

function stripCmsmastersShortcodes(html) {
  return html.replace(/\[\/?cmsmasters_[a-zA-Z_]+(?:\s[^\]]*)?\]/g, "");
}

function convertCaptionShortcode(html) {
  return html.replace(/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/g, (_m, inner) => {
    const imgMatch = inner.match(/<img[^>]*>/);
    const img = imgMatch ? imgMatch[0] : "";
    const captionText = inner.replace(img, "").trim();
    return `<figure>${img}${captionText ? `<figcaption>${captionText}</figcaption>` : ""}</figure>`;
  });
}

function convertEmbedShortcode(html) {
  return html.replace(/\[embed(?:\s[^\]]*)?\]([\s\S]*?)\[\/embed\]/g, (_m, rawUrl) => {
    const url = rawUrl.trim();
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (yt) {
      return `<iframe class="video-embed" src="https://www.youtube.com/embed/${yt[1]}" title="Embedded video" loading="lazy" allowfullscreen></iframe>`;
    }
    return `<p><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></p>`;
  });
}

/**
 * DETECTION ONLY — does not remove anything. An earlier version of this
 * function deleted any "[word]" pattern it didn't recognize, on the theory
 * that leftover brackets were always unconverted shortcodes. That was
 * wrong: it deleted a genuine editorial aside inside a direct quote
 * ("my thighs [are] bigger") in big-transformation-of-kylie-jenner, because
 * "[are]" matched the same generic bracket pattern as a shortcode tag. A
 * real WordPress shortcode and a bracketed word inside a quote are
 * textually indistinguishable by regex alone, so guessing is not safe here.
 * This now only logs what it sees, for human review, and never touches the
 * content. Any genuinely leftover shortcode will show up as visible bracket
 * text on the page — ugly, but never silently destructive, unlike deleting
 * real prose.
 */
function logUnknownBracketPatterns(html, warnings) {
  const found = new Set();
  for (const m of html.matchAll(/\[\/?([a-zA-Z][a-zA-Z0-9_-]{2,})(?:\s[^\]]*)?\]/g)) {
    found.add(m[1]);
  }
  if (found.size) {
    warnings.push(
      `Unconverted bracket-like text remains (NOT removed — verify manually whether this is a real leftover shortcode or genuine article text, e.g. an editorial aside in a quote): ${[...found].join(", ")}`
    );
  }
  return html;
}

function sanitize(html) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "strong", "b", "em", "i", "u", "br", "hr",
      "a", "img", "figure", "figcaption", "blockquote",
      "table", "thead", "tbody", "tr", "td", "th",
      "span", "iframe",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "data-cta"],
      img: ["src", "alt", "width", "height", "loading"],
      iframe: ["src", "title", "loading", "allowfullscreen", "class"],
      "*": ["id"],
    },
    allowedIframeHostnames: ["www.youtube.com"],
    allowedSchemes: ["http", "https", "mailto", "tel"],
    nonTextTags: ["script", "style", "textarea", "option"],
  });
}

function hasContamination(html) {
  return CONTAMINATION_MARKERS.some((m) => html.includes(m));
}

function countTags(html, tagRe) {
  return (html.match(tagRe) || []).length;
}

function extractHrefs(html) {
  return [...html.matchAll(/<a[^>]*href="([^"]+)"/g)].map((m) => m[1]);
}

/** Strips HTML tags AND WordPress [bracket-shortcode ...] syntax before
 * counting words, so a "before" count on raw shortcode-heavy source is
 * comparable to an "after" count on cleaned HTML — otherwise shortcode
 * attribute strings (shortcode_id="aq9s0s69d8" font_size="18" ...) get
 * counted as "words" that were never real prose, making every heavily
 * shortcoded post look like it lost content when it didn't. */
function plainTextWordCount(html) {
  const text = html
    .replace(/\[\/?[a-zA-Z][a-zA-Z0-9_-]*(?:\s[^\]]*)?\]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length ? text.split(" ").length : 0;
}

function cleanContent(rawHtml, warnings) {
  const before = rawHtml;
  let html = rawHtml;
  html = convertHeadingShortcode(html);
  html = stripCmsmastersShortcodes(html);
  html = convertCaptionShortcode(html);
  html = convertEmbedShortcode(html);
  html = logUnknownBracketPatterns(html, warnings);
  const afterShortcodes = html;
  const contaminated = hasContamination(html);
  html = sanitize(html);
  const after = html;

  return {
    before, afterShortcodes, after, contaminated,
    beforeLength: before.length,
    afterLength: after.length,
    removedChars: before.length - after.length,
    integrity: {
      headingsBefore: countTags(before, /\[cmsmasters_heading[^\]]*\]/g) + countTags(before, /<h[1-6][ >]/g),
      headingsAfter: countTags(after, /<h[1-6][ >]/g),
      imagesBefore: new Set([...before.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => m[1])).size,
      imagesAfter: countTags(after, /<img[ >]/g),
      linksBefore: countTags(before, /<a[ >]/g),
      linksAfter: countTags(after, /<a[ >]/g),
      tablesBefore: countTags(before, /<table[ >]/g),
      tablesAfter: countTags(after, /<table[ >]/g),
      embedsBefore: countTags(before, /\[embed[^\]]*\]/g),
      embedsAfter: countTags(after, /<iframe[ >]/g),
      wordsBefore: plainTextWordCount(before),
      wordsAfter: plainTextWordCount(after),
    },
  };
}

// ---------------------------------------------------------------------------
// Image handling
// ---------------------------------------------------------------------------

const MAGIC_BYTES = [
  { sig: [0xff, 0xd8, 0xff], ext: "jpg" },
  { sig: [0x89, 0x50, 0x4e, 0x47], ext: "png" },
  { sig: [0x47, 0x49, 0x46, 0x38], ext: "gif" },
  { sig: [0x52, 0x49, 0x46, 0x46], ext: "webp" }, // RIFF....WEBP
];

function looksLikeValidImage(buf) {
  if (!buf || buf.length < 12) return false;
  return MAGIC_BYTES.some(({ sig }) => sig.every((b, i) => buf[i] === b));
}

async function downloadImage(url, destDir, slug) {
  try {
    const filename = decodeURIComponent(path.basename(new URL(url).pathname));
    const destPath = path.join(destDir, filename);
    const localPath = `/blog/${slug}/${filename}`;

    if (existsSync(destPath)) {
      const stat = statSync(destPath);
      if (stat.size > 0) {
        return { ok: true, originalUrl: url, localPath, filename, bytes: stat.size, cached: true };
      }
    }

    mkdirSync(destDir, { recursive: true });
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (!looksLikeValidImage(buf)) throw new Error("downloaded file does not look like a valid image (bad magic bytes)");
    writeFileSync(destPath, buf);
    return { ok: true, originalUrl: url, localPath, filename, bytes: buf.length, cached: false };
  } catch (err) {
    return { ok: false, originalUrl: url, error: String(err.message || err) };
  }
}

async function localizeImages(html, slug, imageReport) {
  const destDir = path.join(PUBLIC_DIR, slug);
  const imgTagRe = /<img([^>]*)src="([^"]+)"([^>]*)>/g;
  const matches = [...html.matchAll(imgTagRe)];
  let result = html;
  for (const match of matches) {
    const [full, before, src, after] = match;
    const dl = await downloadImage(src, destDir, slug);
    imageReport.push(dl);
    if (dl.ok) {
      const replacement = `<img${before}src="${dl.localPath}"${after}>`;
      result = result.replace(full, replacement);
    }
    // on failure: leave the original remote WordPress URL in place (never drop the image)
  }
  return result;
}

// ---------------------------------------------------------------------------
// Yoast metadata resolution
// ---------------------------------------------------------------------------

function resolvePlaceholders(raw, fallbackTitle, warnings, field) {
  let out = raw
    .replace(/%%title%%/gi, fallbackTitle)
    .replace(/%%page%%/gi, "")
    .replace(/%%sitename%%/gi, "Medical Center Turkey")
    .replace(/%%sitedesc%%/gi, "")
    .replace(/%%excerpt%%/gi, "")
    .replace(/%%primary_category%%/gi, "")
    .replace(/%%category%%/gi, "")
    .replace(/%%sep%%/gi, "|")
    .replace(/\s+/g, " ")
    .replace(/\s*\|\s*$/, "")
    .trim();
  const leftover = out.match(/%%[a-z_]+%%/gi);
  if (leftover) warnings.push(`Unresolved Yoast placeholder(s) in ${field}: ${leftover.join(", ")}`);
  return out;
}

function resolveSeoTitle(meta, fallbackTitle, warnings) {
  const raw = meta["_yoast_wpseo_title"];
  if (raw && String(raw).trim()) return resolvePlaceholders(String(raw), fallbackTitle, warnings, "title");
  return `${fallbackTitle} | Medical Center Turkey`;
}

function stripTagsForExcerpt(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function resolveSeoDescription(meta, cleanedHtml, fallbackTitle, warnings) {
  const raw = meta["_yoast_wpseo_metadesc"];
  if (raw && String(raw).trim()) return resolvePlaceholders(String(raw), fallbackTitle, warnings, "description");
  const plain = stripTagsForExcerpt(cleanedHtml);
  return plain.length > 160 ? plain.slice(0, 157).trimEnd() + "..." : plain;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Mode: ${IMPORT_ALL ? "FULL (all published posts)" : "PROTOTYPE (5 test slugs)"}`);
  console.log(`Reading WXR export: ${WXR_PATH}`);
  if (!existsSync(WXR_PATH)) {
    console.error(`FATAL: WXR export not found at ${WXR_PATH}. Stopping — nothing written.`);
    process.exit(1);
  }
  const xml = readFileSync(WXR_PATH, "utf-8");
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const doc = parser.parse(xml);
  const items = doc.rss.channel.item || [];

  const publishedPosts = items.filter(
    (it) => it["wp:post_type"] === "post" && it["wp:status"] === "publish"
  );

  console.log(`Published posts found in export: ${publishedPosts.length}`);
  if (publishedPosts.length !== EXPECTED_PUBLISHED_TOTAL) {
    console.error(
      `FATAL: expected ${EXPECTED_PUBLISHED_TOTAL} published posts, found ${publishedPosts.length}. ` +
      `The WordPress content has changed since this was last verified — stopping without writing anything.`
    );
    process.exit(1);
  }

  const attachments = {};
  for (const it of items) {
    if (it["wp:post_type"] === "attachment") {
      const id = it["wp:post_id"];
      const url = it["wp:attachment_url"];
      if (id && url) attachments[String(id)] = url;
    }
  }

  const candidatePosts = publishedPosts.filter((it) => !EXCLUDED_SLUGS.has(it["wp:post_name"]));

  let toImport;
  if (IMPORT_ALL) {
    toImport = candidatePosts;
    if (toImport.length !== EXPECTED_IMPORT_TOTAL) {
      console.error(`FATAL: expected ${EXPECTED_IMPORT_TOTAL} importable posts after exclusions, got ${toImport.length}.`);
      process.exit(1);
    }
  } else {
    const targetSlugs = new Set(TEST_SLUGS);
    toImport = candidatePosts.filter((it) => targetSlugs.has(it["wp:post_name"]));
    if (toImport.length !== TEST_SLUGS.length) {
      const found = new Set(toImport.map((it) => it["wp:post_name"]));
      const missing = TEST_SLUGS.filter((s) => !found.has(s));
      console.error(`FATAL: could not find all 5 target slugs in the export. Missing: ${missing.join(", ")}`);
      process.exit(1);
    }
  }

  // Duplicate / reserved-route collision check across the actual import set.
  const seenSlugs = new Set();
  const dupeSlugs = [];
  const collisions = [];
  for (const it of toImport) {
    const slug = it["wp:post_name"];
    if (seenSlugs.has(slug)) dupeSlugs.push(slug);
    seenSlugs.add(slug);
    if (RESERVED_SLUGS.has(slug)) collisions.push(slug);
  }
  if (dupeSlugs.length) {
    console.error(`FATAL: duplicate slugs in import set: ${dupeSlugs.join(", ")}`);
    process.exit(1);
  }
  if (collisions.length) {
    console.error(`FATAL: slug(s) collide with an existing reserved route: ${collisions.join(", ")}`);
    process.exit(1);
  }
  console.log(`Route collision check: 0 collisions against ${RESERVED_SLUGS.size} reserved routes, 0 duplicate slugs.`);

  mkdirSync(CONTENT_DIR, { recursive: true });
  mkdirSync(PUBLIC_DIR, { recursive: true });
  mkdirSync(LIB_DIR, { recursive: true });

  const indexEntries = [];
  const fullReport = [];
  const contaminatedReport = [];
  let processed = 0;
  const linkFixCounters = { consultation: 0, doctorDelink: 0, remapped: 0, delinked: 0, brokenImagesRemoved: 0 };
  const structuralFixCounters = {
    h1Fixed: 0,
    h1Demoted: 0,
    h2IframeUnwrapped: 0,
    h2TocFixed: 0,
    liposuctionParagraphsRemoved: 0,
    googleImageLinkFilesFixed: 0,
    googleImageLinksRemoved: 0,
    googleImageLinkSuspiciousFiles: 0,
  };
  const structuralSuspicious = [];
  const organTransplantCounters = { filesChanged: 0, removalsApplied: 0 };
  const textQualityCounters = { filesChanged: 0, fixesApplied: 0 };
  const medicalClaimsCounters = { filesChanged: 0, fixesApplied: 0 };

  for (const item of toImport) {
    const slug = item["wp:post_name"];
    const title = typeof item.title === "object" ? item.title["#text"] ?? "" : item.title ?? "";
    const rawContent = item["content:encoded"] || "";
    const dateGmt = item["wp:post_date_gmt"];
    const metaList = Array.isArray(item["wp:postmeta"]) ? item["wp:postmeta"] : [item["wp:postmeta"]].filter(Boolean);
    const thumbMeta = metaList.find((m) => m && m["wp:meta_key"] === "_thumbnail_id");
    const thumbId = thumbMeta ? String(thumbMeta["wp:meta_value"]) : null;
    const thumbUrl = thumbId ? attachments[thumbId] : null;

    const meta = {};
    for (const m of metaList) {
      if (m && typeof m["wp:meta_key"] === "string" && m["wp:meta_key"].startsWith("_yoast_wpseo_")) {
        meta[m["wp:meta_key"]] = m["wp:meta_value"];
      }
    }

    const categories = (Array.isArray(item.category) ? item.category : [item.category].filter(Boolean)).map((c) =>
      typeof c === "object" ? { name: c["#text"], domain: c["@_domain"] } : { name: c, domain: null }
    );

    const warnings = [];
    const cleaned = cleanContent(rawContent, warnings);

    const imageReport = [];
    let localizedHtml = await localizeImages(cleaned.after, slug, imageReport);

    let featuredImage = null;
    if (thumbUrl) {
      const dl = await downloadImage(thumbUrl, path.join(PUBLIC_DIR, slug), slug);
      imageReport.push({ ...dl, role: "featured" });
      featuredImage = dl.ok ? dl.localPath : thumbUrl;
    }

    localizedHtml = applyLinkAndImageFixes(localizedHtml, slug, linkFixCounters, warnings);

    const organTransplantFix = removeOrganTransplantPromotion(localizedHtml, slug);
    if (!organTransplantFix.ok) {
      console.error(`\nFATAL: Phase 5G.1 organ-transplant cleanup mismatch in "${slug}". Stopping -- nothing further written. Review before re-running.`);
      for (const e of organTransplantFix.errors) {
        console.error(`  [${e.label ?? "canary"}] expected ${e.expectedCount} occurrence(s) of "${e.find}..." but found ${e.actualCount}`);
      }
      process.exit(1);
    }
    localizedHtml = organTransplantFix.html;
    organTransplantCounters.filesChanged += organTransplantFix.changed ? 1 : 0;
    organTransplantCounters.removalsApplied += organTransplantFix.removedCount;

    const textQualityFix = applyTextQualityFixes(localizedHtml, slug);
    if (!textQualityFix.ok) {
      console.error(`\nFATAL: Phase 5G.1C text-quality fix mismatch in "${slug}". Stopping -- nothing further written. Review before re-running.`);
      for (const e of textQualityFix.errors) {
        console.error(`  [${e.label ?? ""}] expected ${e.expectedCount} occurrence(s) of "${e.find}..." but found ${e.actualCount}`);
      }
      process.exit(1);
    }
    localizedHtml = textQualityFix.html;
    textQualityCounters.filesChanged += textQualityFix.changed ? 1 : 0;
    textQualityCounters.fixesApplied += textQualityFix.appliedCount;

    const medicalClaimsFix = applyMedicalClaimsFixes(localizedHtml, slug);
    if (!medicalClaimsFix.ok) {
      console.error(`\nFATAL: Phase 5G.2A medical-claims fix mismatch in "${slug}". Stopping -- nothing further written. Review before re-running.`);
      for (const e of medicalClaimsFix.errors) {
        console.error(`  [${e.label ?? ""}] expected ${e.expectedCount} occurrence(s) of "${e.find}..." but found ${e.actualCount}`);
      }
      process.exit(1);
    }
    localizedHtml = medicalClaimsFix.html;
    medicalClaimsCounters.filesChanged += medicalClaimsFix.changed ? 1 : 0;
    medicalClaimsCounters.fixesApplied += medicalClaimsFix.appliedCount;

    localizedHtml = applyStructuralFixes(localizedHtml, slug, title, structuralFixCounters, structuralSuspicious);

    const seoTitle = resolveSeoTitle(meta, title, warnings);
    const seoDescription = resolveSeoDescription(meta, cleaned.after, title, warnings);

    const internalHrefs = extractHrefs(localizedHtml).filter((h) => h.includes("medicalcenterturkey.com") || h.startsWith("/"));

    writeFileSync(path.join(CONTENT_DIR, `${slug}.html`), localizedHtml, "utf-8");

    indexEntries.push({
      slug, title, date: dateGmt, seoTitle, seoDescription, featuredImage,
      categories: categories.filter((c) => c.domain === "category").map((c) => c.name),
      tags: categories.filter((c) => c.domain === "post_tag").map((c) => c.name),
      usedFallbackTitle: !meta["_yoast_wpseo_title"],
      usedFallbackDescription: !meta["_yoast_wpseo_metadesc"],
    });

    const imagesFailed = imageReport.filter((i) => !i.ok);
    const wordDropPct = cleaned.integrity.wordsBefore > 0
      ? Math.round(100 * (1 - cleaned.integrity.wordsAfter / cleaned.integrity.wordsBefore))
      : 0;
    const suspicious =
      imagesFailed.length > 0 ||
      cleaned.integrity.headingsAfter < cleaned.integrity.headingsBefore ||
      cleaned.integrity.tablesAfter < cleaned.integrity.tablesBefore ||
      wordDropPct > 15; // shortcode/chrome removal alone should not meaningfully shrink real word count

    const reportEntry = {
      slug, title,
      beforeLength: cleaned.beforeLength,
      afterSanitizeLength: cleaned.afterLength,
      totalCharsRemoved: cleaned.removedChars,
      integrity: { ...cleaned.integrity, wordDropPct },
      images: imageReport,
      imagesFailedCount: imagesFailed.length,
      internalLinks: internalHrefs,
      contaminated: cleaned.contaminated,
      suspicious,
      warnings,
      meta: { seoTitle, seoDescription, usedFallbackTitle: !meta["_yoast_wpseo_title"], usedFallbackDescription: !meta["_yoast_wpseo_metadesc"] },
      manualReviewStatus: cleaned.contaminated || suspicious ? "PENDING" : "not_required",
    };
    fullReport.push(reportEntry);

    if (cleaned.contaminated) {
      contaminatedReport.push({
        slug,
        beforeLength: cleaned.beforeLength,
        afterLength: cleaned.afterLength,
        removedChars: cleaned.removedChars,
        removedElements: "ChatGPT web-UI chrome (structural div/article wrappers carrying data-message-author-role / conversation-turn / markdown prose dark:prose-invert markers) — stripped by the generic structural-tag sanitizer, not hand-picked per post.",
        potentiallyLostContent: suspicious
          ? "FLAGGED: word count dropped more than 15% and/or an image or heading/table failed to carry over — verify manually before approving."
          : "None detected by automated heuristics (heading/image/table counts and word count held within tolerance) — still requires human read-through before approval.",
        manualReviewStatus: "PENDING",
      });
    }

    processed++;
    if (processed % 25 === 0 || processed === toImport.length) {
      console.log(`  ...${processed}/${toImport.length} processed`);
    }
  }

  const indexTs =
    `// AUTO-GENERATED by scripts/import-blog-posts.mjs — do not hand-edit.\n` +
    `export interface BlogPostMeta {\n` +
    `  slug: string;\n  title: string;\n  date: string;\n  seoTitle: string;\n  seoDescription: string;\n` +
    `  featuredImage: string | null;\n  categories: string[];\n  tags: string[];\n` +
    `  usedFallbackTitle: boolean;\n  usedFallbackDescription: boolean;\n}\n\n` +
    `export const BLOG_POSTS: BlogPostMeta[] = ${JSON.stringify(indexEntries, null, 2)};\n`;
  writeFileSync(path.join(LIB_DIR, "blog-index.generated.ts"), indexTs, "utf-8");

  const slugsTs =
    `// AUTO-GENERATED by scripts/import-blog-posts.mjs — do not hand-edit.\n` +
    `export const BLOG_SLUGS: ReadonlySet<string> = new Set(${JSON.stringify(indexEntries.map((e) => e.slug))});\n`;
  writeFileSync(path.join(LIB_DIR, "blog-slugs.generated.ts"), slugsTs, "utf-8");

  writeFileSync(path.join(ROOT, "scripts", ".import-report.json"), JSON.stringify(fullReport, null, 2), "utf-8");
  writeFileSync(path.join(ROOT, "scripts", ".contaminated-report.json"), JSON.stringify(contaminatedReport, null, 2), "utf-8");

  const totalImages = fullReport.reduce((s, r) => s + r.images.length, 0);
  const failedImages = fullReport.reduce((s, r) => s + r.imagesFailedCount, 0);
  const suspiciousCount = fullReport.filter((r) => r.suspicious).length;

  console.log(`\nDone. Imported ${indexEntries.length}/${toImport.length} posts.`);
  console.log(`Images: ${totalImages - failedImages}/${totalImages} OK, ${failedImages} failed.`);
  console.log(`Contaminated articles flagged: ${contaminatedReport.length}`);
  console.log(`Suspicious (flagged for manual review) articles: ${suspiciousCount}`);
  console.log(`Full report: scripts/.import-report.json`);
  console.log(`Contaminated-articles report: scripts/.contaminated-report.json`);

  console.log(`\nLink/image fixes applied:`);
  console.log(`  Consultation CTA links converted: ${linkFixCounters.consultation} (expected ${EXPECTED_CONSULTATION_LINKS})`);
  console.log(`  Doctor-profile links de-linked: ${linkFixCounters.doctorDelink} (expected ${EXPECTED_DOCTOR_PROFILE_LINKS})`);
  console.log(`  Unmapped links remapped to a working page: ${linkFixCounters.remapped} (expected ${EXPECTED_LINK_REMAP_COUNT})`);
  console.log(`  Unmapped links de-linked (no valid target): ${linkFixCounters.delinked} (expected ${EXPECTED_LINK_DELINK_COUNT})`);
  console.log(`  Broken <img> elements removed: ${linkFixCounters.brokenImagesRemoved} (expected ${EXPECTED_BROKEN_IMAGE_REMOVALS})`);

  const h1Suspicious = structuralSuspicious.filter((s) => s.category === "h1").length;
  const h2Suspicious = structuralSuspicious.filter((s) => s.category === "h2-toc").length;
  console.log(`\nPhase 5F structural fixes applied:`);
  console.log(`  Duplicate body <h1> removed: ${structuralFixCounters.h1Fixed} files (expected ${EXPECTED_H1_DUPLICATES_FIXED}); H1→H2 demotions: ${structuralFixCounters.h1Demoted} (expected ${EXPECTED_H1_DEMOTED}); flagged for manual review: ${h1Suspicious} (expected ${EXPECTED_H1_SUSPICIOUS})`);
  console.log(`  Video <h2><iframe> wrappers unwrapped: ${structuralFixCounters.h2IframeUnwrapped} (expected ${EXPECTED_H2_IFRAME_UNWRAPPED})`);
  console.log(`  Broken H2/TOC runs cleaned: ${structuralFixCounters.h2TocFixed} files (expected ${EXPECTED_H2_TOC_FIXED}); flagged for manual review: ${h2Suspicious} (expected ${EXPECTED_H2_TOC_SUSPICIOUS})`);
  console.log(`  Liposuction closing paragraphs removed: ${structuralFixCounters.liposuctionParagraphsRemoved} (expected ${EXPECTED_LIPOSUCTION_PARAGRAPHS_REMOVED})`);
  console.log(`  Google Image Search links unwrapped: ${structuralFixCounters.googleImageLinkFilesFixed} files / ${structuralFixCounters.googleImageLinksRemoved} links (expected ${EXPECTED_GOOGLE_IMAGE_LINK_FILES_FIXED} files / ${EXPECTED_GOOGLE_IMAGE_LINKS_REMOVED} links); flagged for manual review: ${structuralFixCounters.googleImageLinkSuspiciousFiles} files (expected ${EXPECTED_GOOGLE_IMAGE_LINK_SUSPICIOUS})`);

  writeFileSync(path.join(ROOT, "scripts", ".structural-fixes-report.json"), JSON.stringify({ counters: structuralFixCounters, suspicious: structuralSuspicious }, null, 2), "utf-8");
  console.log(`  Full structural-fixes report: scripts/.structural-fixes-report.json`);

  console.log(`\nPhase 5G.1 organ-transplant promotion cleanup:`);
  console.log(`  Files changed: ${organTransplantCounters.filesChanged} (expected ${EXPECTED_ORGAN_TRANSPLANT_FILES_CHANGED})`);
  console.log(`  Exact-text removals applied: ${organTransplantCounters.removalsApplied} (expected ${EXPECTED_ORGAN_TRANSPLANT_REMOVALS_APPLIED})`);

  console.log(`\nPhase 5G.1C text-quality fixes:`);
  console.log(`  Files changed: ${textQualityCounters.filesChanged} (expected ${EXPECTED_TEXT_QUALITY_FILES_CHANGED})`);
  console.log(`  Replacements applied: ${textQualityCounters.fixesApplied} (expected ${EXPECTED_TEXT_QUALITY_FIXES_APPLIED})`);

  console.log(`\nPhase 5G.2A medical-claims fixes:`);
  console.log(`  Files changed: ${medicalClaimsCounters.filesChanged} (expected ${EXPECTED_MEDICAL_CLAIMS_FILES_CHANGED})`);
  console.log(`  Replacements applied: ${medicalClaimsCounters.fixesApplied} (expected ${EXPECTED_MEDICAL_CLAIMS_FIXES_APPLIED})`);

  if (IMPORT_ALL) {
    const mismatches = [];
    if (linkFixCounters.consultation !== EXPECTED_CONSULTATION_LINKS) mismatches.push("consultation");
    if (linkFixCounters.doctorDelink !== EXPECTED_DOCTOR_PROFILE_LINKS) mismatches.push("doctorDelink");
    if (linkFixCounters.remapped !== EXPECTED_LINK_REMAP_COUNT) mismatches.push("remapped");
    if (linkFixCounters.delinked !== EXPECTED_LINK_DELINK_COUNT) mismatches.push("delinked");
    if (linkFixCounters.brokenImagesRemoved !== EXPECTED_BROKEN_IMAGE_REMOVALS) mismatches.push("brokenImagesRemoved");
    if (structuralFixCounters.h1Fixed !== EXPECTED_H1_DUPLICATES_FIXED) mismatches.push("h1Fixed");
    if (structuralFixCounters.h1Demoted !== EXPECTED_H1_DEMOTED) mismatches.push("h1Demoted");
    if (h1Suspicious !== EXPECTED_H1_SUSPICIOUS) mismatches.push("h1Suspicious");
    if (structuralFixCounters.h2IframeUnwrapped !== EXPECTED_H2_IFRAME_UNWRAPPED) mismatches.push("h2IframeUnwrapped");
    if (structuralFixCounters.h2TocFixed !== EXPECTED_H2_TOC_FIXED) mismatches.push("h2TocFixed");
    if (h2Suspicious !== EXPECTED_H2_TOC_SUSPICIOUS) mismatches.push("h2Suspicious");
    if (structuralFixCounters.liposuctionParagraphsRemoved !== EXPECTED_LIPOSUCTION_PARAGRAPHS_REMOVED) mismatches.push("liposuctionParagraphsRemoved");
    if (structuralFixCounters.googleImageLinkFilesFixed !== EXPECTED_GOOGLE_IMAGE_LINK_FILES_FIXED) mismatches.push("googleImageLinkFilesFixed");
    if (structuralFixCounters.googleImageLinksRemoved !== EXPECTED_GOOGLE_IMAGE_LINKS_REMOVED) mismatches.push("googleImageLinksRemoved");
    if (structuralFixCounters.googleImageLinkSuspiciousFiles !== EXPECTED_GOOGLE_IMAGE_LINK_SUSPICIOUS) mismatches.push("googleImageLinkSuspiciousFiles");
    if (organTransplantCounters.filesChanged !== EXPECTED_ORGAN_TRANSPLANT_FILES_CHANGED) mismatches.push("organTransplantFilesChanged");
    if (organTransplantCounters.removalsApplied !== EXPECTED_ORGAN_TRANSPLANT_REMOVALS_APPLIED) mismatches.push("organTransplantRemovalsApplied");
    if (textQualityCounters.filesChanged !== EXPECTED_TEXT_QUALITY_FILES_CHANGED) mismatches.push("textQualityFilesChanged");
    if (textQualityCounters.fixesApplied !== EXPECTED_TEXT_QUALITY_FIXES_APPLIED) mismatches.push("textQualityFixesApplied");
    if (medicalClaimsCounters.filesChanged !== EXPECTED_MEDICAL_CLAIMS_FILES_CHANGED) mismatches.push("medicalClaimsFilesChanged");
    if (medicalClaimsCounters.fixesApplied !== EXPECTED_MEDICAL_CLAIMS_FIXES_APPLIED) mismatches.push("medicalClaimsFixesApplied");
    if (mismatches.length) {
      console.error(`\nWARNING: link/image/structural fix counts did not match expectations for: ${mismatches.join(", ")}. Review before approving.`);
    } else {
      console.log(`\nAll link/image/structural fix counts match expectations exactly.`);
    }
  }
}

main();

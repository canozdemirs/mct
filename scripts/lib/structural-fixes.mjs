import { parseTree, fullText, childTags, findAll, normalizeHeading, removeRanges } from "./html-tree.mjs";

const LIPOSUCTION_PARAGRAPH =
  "<span>If you’re looking for the most dramatic, long-lasting transformation, full-body liposuction is the best choice. For those seeking non-invasive alternatives, options like CoolSculpting and laser lipolysis may be better. If you want to get more detailed information about this surgery, just click on the link below. We are always ready to help you.</span>";

function collapseWs(s) {
  return s.replace(/\s+/g, " ").trim();
}

// Phase 5F.1 (manual review, 2026-10-12): every entry below was individually
// read and confirmed by a human-approved review pass over the 108 records
// the generic Phase 5F detectors flagged as "suspicious" (not auto-fixed).
// These allow-lists are deliberately slug-scoped, not generic similarity
// thresholds — per the site owner's explicit instruction, a fuzzy-match
// score is never used as the deletion criterion on its own. A slug/text
// pair appears here only because a human confirmed, by reading the actual
// article, that it is the same case already proven safe for the 565/422
// generically-handled files. Anything NOT listed here keeps falling through
// to the original strict Phase 5F validation (exact text match only), so a
// future re-import of changed/new content never gets auto-fixed by
// resemblance alone.

// slug -> exact (whitespace-collapsed) text of a body <h1> confirmed to be
// the same heading as the post title (typo/wording variant), safe to drop.
export const H1_CONFIRMED_DUPLICATE_TEXT = new Map([
  ["10-things-to-do-in-istanbul", "What are 10 things to do in Istanbul?"],
  ["the-best-hair-transplant-clinic-in-turkey", "Best Hair Transplant Clinic in Turkey"],
  ["ear-correction-surgery-in-turkey", "Ear Correction in Turkey"],
  ["how-to-get-medical-visa-for-turkey", "Have To Get Medical Visa for Turkey?"],
  ["prp-in-turkey-platelet-rich-plasma", "PRP in Turkey"],
  ["how-much-does-liposuction-and-a-tummy-tuck-cost", "How Much Does Liposuction and A Tummy Tuck Cost"],
  ["rhinoplast-nose-job-before-and-after-turkey", "Rhinoplast (Nose Job) Before and After"],
  ["should-i-get-a-nose-job", "Shoul I Get A Nose Job?"],
  ["facelift-cost-in-turkey", "Facelift Costs in Turkey"],
  ["neck-lift-surgery-cost-in-turkey", "Neck Lift Cost in Turkey"],
  ["the-lip-fillers-cost-in-turkey-2025", "The Lip Filler Cost in Turkey"],
  ["female-hair-transplants-all-you-need-to-know", "Female Hair Transplant All You Need To Know"],
  ["innovations-in-orthopedic-cosmetic-surgery-in-turkey", "Innovation in Orthopedic Cosmetic Surgery in Turkey"],
  ["a-2025-solution-for-a-youthful-neckline", "A Solution for a Youthful Neckline"],
  ["the-benefits-of-non-invasive-rhinoplasty-in-2025", "The Benefits of Non-Invasive Rhinoplasty"],
  ["what-are-the-expected-results-of-an-arm-lift-in-turkey", "What Are the Expected Result of an Arm Lift in Turkey"],
  ["what-you-need-to-know-before-getting-a-nose-surgery", "What You Need to Know Before Getting Nose Surgery"],
  ["do-lip-fillers-still-look-natural-in-2026", "Do Lip Filler Still Look Natural in 2026?"],
  ["jonathan-wickens-hair-transplant-experience-in-turkey", "Jonathan Wickens Hair Transplant Experiences in Turkey"],
  ["the-most-preferred-aesthetics-by-tourists-in-turkey", "The Most Aesthetics by Tourists in Turkey"],
  ["why-breast-augmentations-deliver-perfect-results-in-turkey", "Why Breast Augmentations Deliver Perfect Result in Turkey?"],
  ["tummy-tuck-journey-step-by-step-experience", "Tummy Tuck Journey Step by Step Experince"],
  ["maintaining-liposuction-result-tips-and-lifestyle-advice", "Maintaining Liposuction Results Tips and Lifestyle Advice"],
  ["what-long-term-result-should-you-expected-before-and-after-neck-lift", "What Long Term Result Should You Expect Neck Lift Surgery?"],
  ["everything-you-need-to-know-about-plastic-surgery", "Everthing You Need to Know About Plastic Surgery"],
  ["everything-you-should-know-about-temple-fillers", "Eveything You Should Know About Temple Fillers"],
  ["why-early-cancer-screening-plays-a-critcal-role-in-treatment-success", "Why Early Cancer Screening Plays a Critical Role in Treatment Success"],
  ["josephs-hair-transplant-experiences-in-turkey", "Joseph's Hair Transplant in Turkey"],
  ["seans-rhinoplasty-experiences-in-turkey", "Sean's Rhionoplasty Experiences in Turkey"],
  ["daniels-hair-transplant-experience-in-turkey", "Daniel's Hair Transplant Experiences in Turkey"],
]);

// slug -> exact body <h1> texts confirmed (by reading the article) to be
// genuine, distinct section headings mistagged as H1 — demoted to H2 rather
// than deleted, preserving the heading hierarchy and all content below them.
export const H1_DEMOTE_TO_H2 = new Map([
  [
    "innovations-in-orthopedic-cosmetic-surgery-in-turkey",
    [
      "Cosmetic Foot and Ankle Surgery in Turkey",
      "Cosmetic Hand and Wrist Surgery in Turkey",
      "Aesthetic Muscle Procedures in Turkey",
      "Reasons for Choosing Orthopedic Cosmetic Surgery in Turkey:",
      "Risks and Considerations of Orthopedic Cosmetic Surgery in Turkey:",
      "Technologies Shaping Patient Care",
    ],
  ],
]);

// 74 slugs (of the 76 Phase 5F flagged) confirmed by manual review: the
// single H2 run in each is a WordPress TOC remnant exactly like the 422
// generically-handled files — just with enough wording drift between the
// TOC copy and the real heading that the strict exact-text validation
// couldn't confirm it on its own. The remaining 2 (jude-laws-hair-
// transplantation, david-silvas-hair-transplantation) are deliberately
// excluded: their run wraps a video <iframe>, not plain text, so deleting
// it would destroy the video — out of scope for this TOC cleanup.
export const H2_TOC_CONFIRMED_SLUGS = new Set([
  "frequently-asked-questions-about-implants", "lip-fillers-vs-lip-lift", "botox-and-filler-cost-2022-in-turkey",
  "prostate-cancer-treatment-in-turkey", "botox-for-sweat", "radiotherapy-cost-in-turkey", "chemotherapy-cost-in-turkey",
  "gastric-band-vs-gastric-sleeve", "heart-valve-replacement-in-turkey", "hysterectomy-in-turkey",
  "radiofrequency-ablation-in-turkey", "immunotherapy-in-turkey", "open-heart-surgery-in-turkey",
  "prp-in-turkey-platelet-rich-plasma", "botox-prices-in-turkey", "arm-lift-in-turkey",
  "10-best-hair-growth-serums-for-thickening-hair", "does-finasteride-regrow-hair", "how-minoxidil-works",
  "skin-cancer-treatment-in-turkey", "how-much-is-lung-cancer-treatment", "hyperpigmentation-treatment-in-turkey",
  "how-much-is-body-contouring", "cheapest-country-for-dental-work", "turkey-health-tourism-in-2023",
  "smile-makeover-cost", "hair-transplant-cost-us-vs-turkey", "how-much-does-herniated-disc-surgery-cost",
  "vaser-liposuction-turkey-before-and-after", "cheapest-countries-for-hair-transplant",
  "the-5-best-countries-for-rhinoplasty-surgery", "liver-disease", "fallopian-tube-cancer",
  "bilateral-inguinal-hernia-surgery", "what-is-restorative-dentistry-2", "top-10-treatments-that-people-travel-abroad-for",
  "5-things-you-need-to-know-facing-infertility", "a-guide-to-stem-cell-hair-transplants",
  "the-best-and-cheapest-weight-loss-surgery-by-country", "metastatic-cancer", "testicular-cancer-in-turkey",
  "chemotherapy-for-liver-cancer", "best-countries-for-plastic-surgery", "hair-transplant-in-turkey-best-doctors",
  "best-countries-for-liposuction", "how-much-is-butt-lift-in-turkey-2024", "rhinoplasty-techniques-open-vs-closed-surgery",
  "facelift-at-home-how-to-do-facelift-without-surgery", "frequently-asked-questions-about-gastric-bypass-surgery",
  "dental-treatment-guide-in-turkey-2", "the-rise-of-male-cosmetic-procedures-whats-popular-in-turkey",
  "jaw-correction-procedures-in-turkey", "brazilian-butt-lift-in-turkey-2025", "breast-cancer-surgery-in-turkey",
  "microblading-in-turkey-types-prices-procedures", "the-latest-advances-in-anti-wrinkle-injections-in-turkey-2025",
  "what-is-the-price-of-a-gastric-bypass-in-turkey-2025", "medical-check-up-costs-in-turkey-2025",
  "the-benefits-of-non-invasive-rhinoplasty-in-2025", "mini-arm-lift-2025-a-quick-fix-for-sagging-skin",
  "why-do-people-go-to-turkey-for-hair-transplant", "is-breast-augmentation-still-a-popular-choice-for-2025",
  "the-ultimate-guide-to-recovery-after-breast-augmentation-in-2025", "breast-augmentation-in-2025",
  "comprehensive-medical-check-up-in-turkey-2025", "fat-injection-in-2025", "why-jowl-liposuction-is-gaining-popularity-in-2025",
  "liposuction-in-2025", "is-dhi-hair-transplant-the-best-option-for-you-in-2025", "is-dental-treatment-reliable",
  "what-are-the-most-popular-skin-treatments-in-turkey", "a-comprehensive-guide-to-fat-injection-procedures-in-2025",
  "what-long-term-result-should-you-expected-before-and-after-neck-lift", "how-long-do-lip-filler-last",
]);

// Phase 5F.2 (manual review, 2026-10-12): 2 slugs confirmed by reading the
// actual article -- a video <iframe> is wrapped in meaningless <h2></h2>
// tags (not a TOC duplicate; the site's other 105 video embeds are all
// bare, unwrapped <iframe> elements). Unwrapping just removes the heading
// tags around it, keeping the iframe -- src, attributes, and position --
// byte-for-byte identical.
export const H2_IFRAME_UNWRAP_SLUGS = new Set([
  "jude-laws-hair-transplantation",
  "david-silvas-hair-transplantation",
]);

export function fixIframeWrappedH2(html, slug) {
  if (!H2_IFRAME_UNWRAP_SLUGS.has(slug)) return { html, changed: false, removedCount: 0 };
  const root = parseTree(html);
  const h2s = findAll(root, (n) => n.tag === "h2");
  const targets = h2s.filter((h) => {
    const tags = childTags(h);
    const textOutsideTags = h.items
      .filter((i) => i.type === "text")
      .map((i) => i.data)
      .join("")
      .trim();
    return tags.length === 1 && tags[0] === "iframe" && textOutsideTags === "";
  });
  if (targets.length === 0) return { html, changed: false, removedCount: 0 };

  const ranges = [];
  for (const h of targets) {
    const openTagEnd = html.indexOf(">", h.start) + 1;
    const closeTagStart = h.end - "</h2>".length;
    ranges.push({ start: h.start, end: openTagEnd });
    ranges.push({ start: closeTagStart, end: h.end });
  }
  const out = removeRanges(html, ranges);
  return { html: out, changed: true, removedCount: targets.length };
}

// 2 slugs confirmed by manual review: the Google Image Search anchor wraps
// nothing at all (no <img>, no text) and is immediately followed by the
// real caption text as a sibling, outside the anchor -- a fully dead,
// non-functional link. Not a generic rule: an empty anchor elsewhere could
// mean something different, so this only fires for these two confirmed
// slugs. The ordinary "anchor wraps exactly one <img>" unwrap logic is
// unaffected and still applies to every slug.
export const GOOGLE_EMPTY_ANCHOR_CONFIRMED_SLUGS = new Set([
  "david-beckhams-hair-transplantation",
  "jude-laws-hair-transplantation",
]);

/**
 * H1 duplicate detection. The page template already renders the post title
 * as the page's single H1, so any <h1> in the article body whose text
 * matches the title is a redundant duplicate and safe to delete outright.
 */
export function analyzeH1(html, title) {
  const root = parseTree(html);
  const h1s = findAll(root, (n) => n.tag === "h1");
  const normTitle = normalizeHeading(title);
  const matches = h1s.filter((h) => normalizeHeading(collapseWs(fullText(h))) === normTitle);
  const nonMatches = h1s.filter((h) => normalizeHeading(collapseWs(fullText(h))) !== normTitle);
  return { h1s, matches, nonMatches };
}

function retagH1ToH2(html, node) {
  const openTagEnd = html.indexOf(">", node.start) + 1;
  const closeTagStart = node.end - "</h1>".length;
  return [
    { start: node.start, end: openTagEnd, text: html.slice(node.start, openTagEnd).replace(/^<h1/i, "<h2") },
    { start: closeTagStart, end: node.end, text: html.slice(closeTagStart, node.end).replace(/<\/h1>$/i, "</h2>") },
  ];
}

function applyH1Edits(html, toRemove, toDemote) {
  const ops = [];
  for (const h of toRemove) ops.push({ start: h.start, end: h.end, text: "" });
  for (const h of toDemote) ops.push(...retagH1ToH2(html, h));
  ops.sort((a, b) => a.start - b.start);
  let out = "";
  let cursor = 0;
  for (const op of ops) {
    out += html.slice(cursor, op.start);
    out += op.text;
    cursor = op.end;
  }
  out += html.slice(cursor);
  return out;
}

export function fixH1(html, title, slug) {
  const root = parseTree(html);
  const h1s = findAll(root, (n) => n.tag === "h1");
  if (h1s.length === 0) return { html, changed: false, removedCount: 0, demotedCount: 0, suspicious: false };

  const normTitle = normalizeHeading(title);
  const confirmedDupText = H1_CONFIRMED_DUPLICATE_TEXT.get(slug);
  const demoteTexts = new Set(H1_DEMOTE_TO_H2.get(slug) || []);

  const toRemove = [];
  const toDemote = [];
  const unresolved = [];

  for (const h of h1s) {
    const text = collapseWs(fullText(h));
    if (h.items.length === 0) {
      // Completely empty <h1></h1> -- zero information, always safe to drop.
      toRemove.push(h);
    } else if (normalizeHeading(text) === normTitle) {
      // Generic Phase 5F rule: exact (normalized) duplicate of the title.
      toRemove.push(h);
    } else if (confirmedDupText !== undefined && text === confirmedDupText) {
      // Phase 5F.1 manually-confirmed duplicate (typo/wording variant).
      toRemove.push(h);
    } else if (demoteTexts.has(text)) {
      // Phase 5F.1 manually-confirmed genuine section heading, mistagged.
      toDemote.push(h);
    } else {
      unresolved.push(h);
    }
  }

  if (unresolved.length > 0) {
    // Anything not accounted for by the generic rule or an explicit,
    // human-reviewed allow-list entry leaves the whole file untouched.
    return {
      html,
      changed: false,
      removedCount: 0,
      demotedCount: 0,
      suspicious: true,
      reason: "unresolved-h1",
      h1Texts: h1s.map((h) => collapseWs(fullText(h))),
    };
  }

  if (toRemove.length === 0 && toDemote.length === 0) {
    return { html, changed: false, removedCount: 0, demotedCount: 0, suspicious: false };
  }

  const out = applyH1Edits(html, toRemove, toDemote);
  return { html: out, changed: true, removedCount: toRemove.length, demotedCount: toDemote.length, suspicious: false };
}

/**
 * Broken H2/TOC detection: a "run" of <h2> elements that are character-
 * adjacent in the source (no non-whitespace between consecutive elements).
 * Within a run, any entry whose normalized text matches a standalone H2
 * appearing elsewhere in the document (outside the run) is a redundant TOC
 * remnant and gets deleted. An entry with no match elsewhere is the genuine
 * heading for the section that follows and must be kept untouched.
 */
export function analyzeH2Runs(html) {
  const root = parseTree(html);
  const h2s = findAll(root, (n) => n.tag === "h2");
  if (h2s.length < 2) return { h2s, runs: [] };

  // group into runs of character-adjacent h2 elements (gap is whitespace-only)
  const runs = [];
  let current = [h2s[0]];
  for (let i = 1; i < h2s.length; i++) {
    const prev = h2s[i - 1];
    const cur = h2s[i];
    const gap = html.slice(prev.end, cur.start);
    if (gap.trim() === "") {
      current.push(cur);
    } else {
      if (current.length >= 2) runs.push(current);
      current = [cur];
    }
  }
  if (current.length >= 2) runs.push(current);

  return { h2s, runs };
}

// Phase 5F.2: evaluate every run in the document independently rather than
// bailing out on the whole file the moment it has more than one run. Each
// run still has to pass the exact same safety checks on its own -- this is
// not a loosened check, just a narrower one (per-block instead of
// per-file), so a file can have one run safely fixed while a different,
// unrelated run in the same file is correctly left untouched.
function evaluateRun(run, h2s, slug) {
  const toRemove = run.slice(0, -1);
  const kept = run[run.length - 1];

  // Unconditional safety net: never remove an entry whose only child is
  // non-text content (e.g. an <h2><iframe>...</iframe></h2> video embed) --
  // deleting that would destroy the embed itself, not just a heading.
  const nonTextChild = toRemove.some((h) => h.items.length > 0 && childTags(h).length > 0);
  if (nonTextChild) {
    return { ok: false, reason: "non-text-child-blocked", run, toRemove, kept };
  }

  // Generic Phase 5F validation (unchanged): every entry about to be
  // removed is textually explainable as a duplicate found elsewhere in the
  // document (or is a completely empty <h2></h2>, zero information either
  // way).
  const allNormTexts = h2s.map((h) => normalizeHeading(fullText(h)));
  const countOf = new Map();
  for (const t of allNormTexts) countOf.set(t, (countOf.get(t) || 0) + 1);
  const unexplained = toRemove.filter((h) => h.items.length > 0 && countOf.get(normalizeHeading(fullText(h))) < 2);
  const genericallySafe = unexplained.length === 0;

  // Phase 5F.1: for the 74 slugs a human reviewer individually confirmed
  // (reading the actual article) are the same TOC-remnant pattern as the
  // generically-handled files, apply the removal even where the exact-text
  // validation above couldn't confirm it on its own (wording drift between
  // the TOC copy and the real heading). Every other, unlisted slug keeps
  // falling through to the strict generic check only.
  const allowlisted = H2_TOC_CONFIRMED_SLUGS.has(slug);

  if (!genericallySafe && !allowlisted) {
    return { ok: false, reason: "unexplained-removal-candidate", run, toRemove, kept, unexplained };
  }

  return { ok: true, run, toRemove, kept, viaAllowlist: !genericallySafe && allowlisted };
}

export function fixH2Toc(html, slug) {
  const { h2s, runs } = analyzeH2Runs(html);
  if (runs.length === 0) return { html, changed: false, removedCount: 0, suspicious: false };

  const evaluations = runs.map((run) => evaluateRun(run, h2s, slug));
  const fixed = evaluations.filter((e) => e.ok);
  const blocked = evaluations.filter((e) => !e.ok);

  if (fixed.length === 0) {
    // Nothing in this file can be safely fixed -- preserve the single-run
    // return shape callers already expect for the common case.
    const first = blocked[0];
    return {
      html,
      changed: false,
      removedCount: 0,
      suspicious: true,
      reason: blocked.length > 1 ? "multiple-runs-blocked" : first.reason,
      blockedRunCount: blocked.length,
      runLength: first.run.length,
      unexplainedTexts: first.unexplained ? first.unexplained.map((h) => collapseWs(fullText(h))) : undefined,
      texts: first.run.map((h) => collapseWs(fullText(h))),
    };
  }

  const ranges = fixed.flatMap((e) => e.toRemove.map((h) => ({ start: h.start, end: h.end })));
  const removedCount = ranges.length;
  const out = removeRanges(html, ranges);

  return {
    html: out,
    changed: true,
    removedCount,
    suspicious: blocked.length > 0,
    fixedRunCount: fixed.length,
    blockedRunCount: blocked.length,
    keptText: collapseWs(fullText(fixed[0].kept)),
    viaAllowlist: fixed.some((e) => e.viaAllowlist),
    reason: blocked.length > 0 ? (blocked.length > 1 ? "multiple-runs-blocked" : blocked[0].reason) : undefined,
    unexplainedTexts: blocked.length > 0 && blocked[0].unexplained ? blocked[0].unexplained.map((h) => collapseWs(fullText(h))) : undefined,
    texts: blocked.length > 0 ? blocked[0].run.map((h) => collapseWs(fullText(h))) : undefined,
  };
}

// Phase 5F, task 4: exactly these 5 articles (the 6th named article,
// transplant-surgery-in-turkey-2025, was already removed entirely in Phase
// 5E). This is a slug allow-list, not a global string search: the same
// sentence also appears in is-a-full-body-liposuction-worth-it-in-turkey,
// where it is genuinely on-topic and must be preserved untouched.
export const LIPOSUCTION_PARAGRAPH_TARGET_SLUGS = new Set([
  "breast-augmentation-in-2025",
  "comprehensive-medical-check-up-in-turkey-2025",
  "plastic-surgery-in-2025",
  "rhinoplasty-vs-non-surgical-nose-jobs",
  "understanding-the-different-types-of-hair-transplants-and-which-one-is-best",
]);

export function fixLiposuctionParagraph(html, slug) {
  if (!LIPOSUCTION_PARAGRAPH_TARGET_SLUGS.has(slug)) return { html, changed: false, removedCount: 0 };
  const idx = html.indexOf(LIPOSUCTION_PARAGRAPH);
  if (idx === -1) return { html, changed: false, removedCount: 0 };
  // also eat one trailing newline so we don't leave a double-blank line
  let end = idx + LIPOSUCTION_PARAGRAPH.length;
  if (html[end] === "\n") end += 1;
  const out = html.slice(0, idx) + html.slice(end);
  const secondIdx = out.indexOf(LIPOSUCTION_PARAGRAPH);
  return { html: out, changed: true, removedCount: 1, multipleFound: secondIdx !== -1 };
}

/**
 * Anchors whose href points to a Google Image Search results page
 * (google.com/search...) and whose entire content is nothing but a single
 * <img> (plus optional whitespace) are unwrapped: the <a> tags are removed,
 * the <img> itself is kept byte-for-byte. Anchors containing anything else
 * (text, multiple images, other links) are left untouched and flagged.
 */
export function analyzeGoogleImageLinks(html, slug) {
  const root = parseTree(html);
  const anchors = findAll(root, (n) => n.tag === "a" && typeof n.attribs.href === "string" && /google\.[a-z.]+\/search/i.test(n.attribs.href));
  const safe = [];
  const emptyConfirmed = [];
  const suspicious = [];
  for (const a of anchors) {
    const tags = childTags(a);
    const textOutsideTags = a.items
      .filter((i) => i.type === "text")
      .map((i) => i.data)
      .join("")
      .trim();
    if (tags.length === 1 && tags[0] === "img" && textOutsideTags === "") {
      safe.push(a);
    } else if (tags.length === 0 && textOutsideTags === "" && GOOGLE_EMPTY_ANCHOR_CONFIRMED_SLUGS.has(slug)) {
      // Phase 5F.1: manually confirmed on exactly these 2 slugs -- the
      // anchor wraps nothing at all (no image, no text), so there is
      // nothing to preserve; the whole <a>...</a> is deleted outright.
      emptyConfirmed.push(a);
    } else {
      suspicious.push(a);
    }
  }
  return { anchors, safe, emptyConfirmed, suspicious };
}

export function fixGoogleImageLinks(html, slug) {
  const { safe, emptyConfirmed, suspicious } = analyzeGoogleImageLinks(html, slug);
  if (safe.length === 0 && emptyConfirmed.length === 0) {
    return { html, changed: false, removedCount: 0, suspiciousCount: suspicious.length };
  }

  // Unwrap: for each safe anchor, delete just the <a ...> open tag and the
  // </a> close tag, keeping the <img> between them. For a confirmed-empty
  // anchor, delete the whole thing -- there is no inner content to keep.
  const ranges = [];
  for (const a of safe) {
    const openTagEnd = findOpenTagEnd(html, a.start);
    const closeTagStart = a.end - "</a>".length;
    ranges.push({ start: a.start, end: openTagEnd });
    ranges.push({ start: closeTagStart, end: a.end });
  }
  for (const a of emptyConfirmed) {
    ranges.push({ start: a.start, end: a.end });
  }
  const out = removeRanges(html, ranges);
  return { html: out, changed: true, removedCount: safe.length + emptyConfirmed.length, suspiciousCount: suspicious.length };
}

function findOpenTagEnd(html, start) {
  const close = html.indexOf(">", start);
  if (close === -1) throw new Error("malformed open tag");
  return close + 1;
}

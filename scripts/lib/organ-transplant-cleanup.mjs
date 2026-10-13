// Phase 5G.1 (2026-10-12): permanent removal of organ/bone-marrow transplant
// SERVICE-MARKETING language from articles Phase 5G's audit found had
// regressed back in after Phase 5F/5F.1/5F.2's re-imports (the Phase 5E fixes
// were hand-applied to content/blog/*.html directly and were never encoded
// at the import-script layer, so they didn't survive a from-scratch
// re-import). This is the permanent fix: every removal below is matched as
// an EXACT substring against the post-cleanContent/localizeImages/
// applyLinkAndImageFixes HTML (i.e. the same text that ends up in
// content/blog/<slug>.html absent this step), with an exact expected
// occurrence count. If a count doesn't match, the whole import stops rather
// than silently skipping or guessing -- see removeOrganTransplantPromotion().
//
// Scope discipline per the task: only the organ/bone-marrow-transplant
// SERVICE/CAPABILITY mentions are removed. General medical-education
// content (liver-disease.html, cancer articles explaining what a liver/
// bone-marrow transplant IS as a treatment concept, etc.), hair/beard
// transplant content, and the 2 corneal-transplant articles are explicitly
// NOT touched by this module -- they never have an entry below.
//
// Phase 5G.2A (2026-10-12): ORGAN_TRANSPLANT_REMOVALS and
// TEXT_QUALITY_REPLACEMENTS were refactored from slug-keyed OBJECTS to flat
// ARRAYS of { slug, find, expectedCount, label } entries. The object form
// let a same-named slug key silently overwrite an earlier one (exactly what
// happened once during Phase 5G.1E: a careless second `"treatment-in-
// turkey": [...]` entry wiped out the two rules that keep the USD 60.000
// bone-marrow package table removed, and it regenerated on the next
// import). A flat array has no such failure mode -- adding a rule for an
// already-listed slug is just another array element, never an overwrite.
// assertNoDuplicateRules() below additionally guards against adding the
// exact same rule (slug+find) twice by mistake.

const BAHCELIEVLER_PARAGRAPH =
  "Medical Park Bahçelievler Hospital is located in the last two years the most successful bone marrow with bone marrow transplants they perform medical staff experienced in our country as one of the centers that perform well in the first bone marrow transplant in Turkey. In addition, they work with international bone marrow banks (EBMT, CIBMTR, ISCT). ";

const KOC_TRANSPLANT_STATS_PARAGRAPH =
  "It is one of the best research hospitals in Turkey that carry out successful kidney, liver, and pancreas transplants. As an indication of this, 3,000 kidney transplants, 400 of which are children, have been transplanted. The success rate is 99.8%; 3000 liver transplants, 300 of which are children, the success rate - 90%. ";

const TREATMENT_IN_TURKEY_BONE_MARROW_SECTION =
  '<h2><span><strong>Can Turkey be preferred for bone marrow transplants?</strong></span></h2>\n' +
  "<span>One of Turkey's most successful areas of health is bone marrow transplantation, and Turkey is one of the world leaders in bone marrow transplantation. They have access to their own bone marrow donor base and the German Donor Bank. In this way, they perform both autologous (own cells) and allogeneic (related or unrelated donor) stem cell transplantation. More than 2,500 adult bone marrow transplants and up to 700 pediatric bone marrow transplants are successfully performed annually in Turkish clinics. Depending on the type of transplantation, 90% success in other words survival rate can be achieved in adult transplantation and 95% in child transplantation.</span>\n\n" +
  '<img src="/blog/treatment-in-turkey/Bone-marrow-treatment.png" alt="" width="600" height="400" />\n\n' +
  "<span>The bone marrow transplant package at Medical Center Turkey is as follows:</span>\n" +
  "<h3><span><strong>Bone Marrow Transplant in Turkey Summary (Price, Duration Time, Hospitalization)</strong></span></h3>\n" +
  "<table>\n<tbody>\n<tr>\n<td><span><strong>Operation Number</strong></span></td>\n<td><span>1</span></td>\n<td><span><strong>Time to return to work</strong></span></td>\n<td><span>8 weeks</span></td>\n</tr>\n<tr>\n<td><span><strong>Operation Time</strong></span></td>\n<td><span>3 hours</span></td>\n<td><span><strong>Recovery</strong></span></td>\n<td><span>8 weeks</span></td>\n</tr>\n<tr>\n<td><span><strong>Anesthesia</strong></span></td>\n<td><span>General</span></td>\n<td><span><strong>Persistence of Results</strong></span></td>\n<td><span>-</span></td>\n</tr>\n<tr>\n<td><span><strong>Sensitivity Time</strong></span></td>\n<td><span>6 weeks</span></td>\n<td><span><strong>Hospital Stay</strong></span></td>\n<td><span>5 days</span></td>\n</tr>\n<tr>\n<td><span><strong>Price</strong></span></td>\n<td><span>USD 60.000</span></td>\n</tr>\n</tbody>\n</table>\n";

export const ORGAN_TRANSPLANT_REMOVALS = [
  { slug: "treatment-in-turkey", label: "TOC list item", find: '<li><span>Can Turkey be preferred for bone marrow transplants?</span></li>\n \t', expectedCount: 1 },
  { slug: "treatment-in-turkey", label: "Full H2 section + USD 60.000 price table", find: TREATMENT_IN_TURKEY_BONE_MARROW_SECTION, expectedCount: 1 },
  { slug: "treatment-in-turkey", label: "transplantology in medical-tourism fields sentence", find: "transplantology, ", expectedCount: 1 },

  { slug: "the-best-hospitals-in-turkey", label: "Organ Transplantation Center (3x)", find: "Organ Transplantation Center, ", expectedCount: 3 },
  { slug: "the-best-hospitals-in-turkey", label: "and Bone Marrow Transplant Center (Sisli)", find: " and Bone Marrow Transplant Center", expectedCount: 1 },
  { slug: "the-best-hospitals-in-turkey", label: "Bone Marrow Transplantation Center Adult/Pediatric (Goztepe)", find: "Bone Marrow Transplantation Center (Adult and Pediatric), ", expectedCount: 1 },
  { slug: "the-best-hospitals-in-turkey", label: "Koc pediatric oncohematology sentence fragment", find: "bone marrow transplantation and ", expectedCount: 1 },
  { slug: "the-best-hospitals-in-turkey", label: "Bahcelievler 'first bone marrow transplant in Turkey' paragraph", find: BAHCELIEVLER_PARAGRAPH, expectedCount: 1 },
  { slug: "the-best-hospitals-in-turkey", label: "Koc kidney/liver/pancreas transplant stats paragraph", find: KOC_TRANSPLANT_STATS_PARAGRAPH, expectedCount: 1 },
  { slug: "the-best-hospitals-in-turkey", label: "transplantology in Memorial Sisli success-fields sentence", find: "transplantology, ", expectedCount: 1 },

  { slug: "are-turkish-doctors-reliable", label: "organ transplants in service list", find: ", organ transplants", expectedCount: 1 },
  {
    slug: "are-turkish-doctors-reliable",
    label: "Organ Transplants category block",
    find: "<li><strong><span>Organ Transplants:</span></strong>\n<ul>\n \t<li><span>Turkey has made significant advancements in organ transplantation. The country has skilled transplant surgeons and well-equipped transplant centers offering procedures such as kidney and liver transplantation.</span></li>\n</ul>\n</li>\n \t",
    expectedCount: 1,
  },

  { slug: "top-hospitals-in-turkey", label: "Dr. Koray Acarli organ transplant profile", find: "<li><span>Dr. Koray Acarlı, Organ Transplantation, Memorial Sisli Hospital, Istanbul/Turkey.</span></li>\n \t", expectedCount: 1 },
  { slug: "top-hospitals-in-turkey", label: "Kidney transplant procedure list item", find: "<li><span>Kidney transplant</span></li>\n", expectedCount: 1 },
  { slug: "top-hospitals-in-turkey", label: "Stem cell transplantation procedure list item", find: "<li><span>Stem cell transplantation</span></li>\n \t", expectedCount: 1 },
  { slug: "top-hospitals-in-turkey", label: "stem cell transplantation in 'most preferred treatments' sentence", find: "stem cell transplantation, ", expectedCount: 1 },

  { slug: "medicaltourismturkey", label: "organ transplantation in specialty sentence", find: ", organ transplantation", expectedCount: 1 },
  { slug: "medicaltourismturkey", label: "Bone Marrow Transplantation service list item", find: "<li><span>Bone Marrow Transplantation </span></li>\n \t", expectedCount: 1 },

  { slug: "health-tourism-in-turkey", label: "organ transplantation clause", find: "organ transplantation and in ", expectedCount: 1 },

  { slug: "turkey-health-tourism-in-2023", label: "liver/kidney transplants in clinical branches list", find: "liver/kidney transplants, ", expectedCount: 1 },

  { slug: "top-medical-travel-destinations", label: "organ transplants success-rate list item", find: "<li><span>Recently, the a high success rate of organ transplants in the world.</span></li>\n \t", expectedCount: 1 },

  { slug: "stem-cell-therapy-for-autism-a-revolutionary-step-towards-healing", label: "bone marrow transplants in legacy-of-excellence list item", find: "bone marrow transplants and ", expectedCount: 1 },

  { slug: "best-clinics-for-robotic-surgery-in-turkey", label: "Bone Marrow Transplant department list item", find: "<li><span>Bone Marrow Transplant</span></li>\n \t", expectedCount: 1 },
  { slug: "best-clinics-for-robotic-surgery-in-turkey", label: "bare Transplantation department list item", find: "<li><span>Transplantation</span></li>\n \t", expectedCount: 1 },

  { slug: "why-turkish-hair-transplant-is-so-popular", label: "organ transplants in specialty list", find: ", and organ transplants", expectedCount: 1 },

  // Phase 5G.1C additions (2026-10-12):
  {
    slug: "affordable-cancer-treatment-cost-advantages-of-treatment-in-turkey",
    label: "Stem Cell and Bone Marrow Transplants list item",
    find: "<li><span><strong>Stem Cell and Bone Marrow Transplants</strong> – Turkey’s healthcare system provides stem cell and bone marrow transplants, particularly for blood cancers like leukemia and lymphoma, with highly experienced teams in transplant centers.</span></li>\n \t",
    expectedCount: 1,
  },

  {
    slug: "best-cancer-treatment-procedures-in-turkey-in-2025",
    label: "Bone Marrow Transplant list item",
    find: "<li><span><strong>Bone Marrow Transplant:</strong> Replaces damaged bone marrow with healthy stem cells for cancers affecting blood or the immune system.</span></li>\n \t",
    expectedCount: 1,
  },
  {
    // Phase 5G.1D: a second, separate list item in the same listicle, overlapping with the one above.
    slug: "best-cancer-treatment-procedures-in-turkey-in-2025",
    label: "Stem Cell Transplantation list item (duplicate of above)",
    find: "<li><span><strong>Stem Cell Transplantation:</strong> A vital approach for blood cancers such as leukemia and lymphoma, using bone marrow or stem cells.</span></li>\n \t",
    expectedCount: 1,
  },

  { slug: "how-successful-is-leukemia-treatment", label: "bone marrow transplant Turkey age-eligibility sentence", find: "However, bone marrow transplant in Turkey is done for patients above 55 years old. ", expectedCount: 1 },

  // Phase 5G.1E additions (2026-10-12), from the 608-article comprehensive scan:
  {
    slug: "what-are-the-top-10-cancer-treatment-centers",
    label: "Stem cell transplant cost/destination-marketing paragraph",
    find: "<p><span>Stem cell transplant costs in Turkey are significantly more affordable compared to many Western countries, while maintaining high medical standards and advanced healthcare infrastructure. Turkey offers comprehensive treatment packages that often include medical procedures, hospital stays, and patient support services, ensuring transparency and cost efficiency. This makes Turkey an attractive destination for patients seeking high-quality stem cell transplantation at a more accessible cost.</span></p>\n",
    expectedCount: 1,
  },

  { slug: "how-to-prepare-for-your-first-medical-tourism-trip-a-step-by-step-guide", label: "organ transplants in generic medical-tourism example", find: "organ transplants or ", expectedCount: 1 },
];

/** Detects two rules for the same slug with the byte-identical `find` text
 * -- a near-certain copy/paste mistake (the same removal added twice) --
 * and throws immediately at module load. This is distinct from the
 * duplicate-KEY bug (now structurally impossible with the array form): this
 * catches duplicate VALUES instead. */
export function assertNoDuplicateRules(rules) {
  const seen = new Set();
  for (const rule of rules) {
    const key = `${rule.slug}\u0000${rule.find}`;
    if (seen.has(key)) {
      throw new Error(`organ-transplant-cleanup.mjs: duplicate rule detected for slug "${rule.slug}" (label: "${rule.label}"). Remove the repeated entry.`);
    }
    seen.add(key);
  }
}
assertNoDuplicateRules(ORGAN_TRANSPLANT_REMOVALS);

/**
 * Shared core used by removeOrganTransplantPromotion(), applyTextQualityFixes()
 * and medical-claims-cleanup.mjs's applyMedicalClaimsFixes(): validates and
 * applies `rules` against `html` in a SINGLE sequential pass over the
 * progressively-updated output (not the original html) -- a later rule may
 * legitimately target text an earlier rule in the same list just introduced
 * (Phase 5G.2A.1). On any count mismatch, every change so far is discarded
 * and the untouched original `html` is returned; still all-or-nothing.
 *
 * Exported (Phase 5G.2B.1) specifically so regression tests can pass an
 * explicitly reordered or truncated rules array without needing to mutate
 * the real, slug-filtered production data -- see
 * scripts/test-claims-cleanup-fixtures.mjs.
 */
export function applySequentialRules(html, rules) {
  const errors = [];
  let out = html;
  let appliedCount = 0;
  for (const rule of rules) {
    const actualCount = out.split(rule.find).length - 1;
    if (actualCount !== rule.expectedCount) {
      errors.push({ slug: rule.slug, label: rule.label, find: rule.find.slice(0, 100), expectedCount: rule.expectedCount, actualCount });
      continue;
    }
    out = out.split(rule.find).join(rule.replace ?? "");
    appliedCount += rule.expectedCount;
  }
  if (errors.length > 0) {
    return { html, changed: false, appliedCount: 0, ok: false, errors };
  }
  return { html: out, changed: rules.length > 0, appliedCount, ok: true };
}

/** Independent, hardcoded safety net -- NOT derived from the rule list
 * above, so it keeps working even if every rule for this slug were
 * accidentally deleted. Specifically targets the one regression that
 * already happened once (Phase 5G.1E): the "Can Turkey be preferred for
 * bone marrow transplants?" section and its USD 60.000 price table coming
 * back in treatment-in-turkey.html. */
const CANARY_CHECKS = [
  {
    slug: "treatment-in-turkey",
    forbidden: ["USD 60.000", "Can Turkey be preferred for bone marrow transplants", "Bone Marrow Transplant in Turkey Summary"],
  },
];

function runCanaryChecks(html, slug) {
  const check = CANARY_CHECKS.find((c) => c.slug === slug);
  if (!check) return { ok: true };
  const found = check.forbidden.filter((text) => html.includes(text));
  if (found.length > 0) {
    return { ok: false, slug, found };
  }
  return { ok: true };
}

/**
 * Applies this slug's removal rules. Returns { html, changed, removedCount }
 * on success. On any count mismatch (or a failed canary check), returns
 * { ok: false, errors } and does NOT modify the html at all (all-or-nothing
 * per file) -- the caller is expected to treat this as fatal and stop the
 * whole import.
 */
export function removeOrganTransplantPromotion(html, slug) {
  const rules = ORGAN_TRANSPLANT_REMOVALS.filter((r) => r.slug === slug);
  const result = applySequentialRules(html, rules);
  if (!result.ok) {
    return { html, changed: false, removedCount: 0, ok: false, errors: result.errors };
  }

  const canary = runCanaryChecks(result.html, slug);
  if (!canary.ok) {
    return {
      html,
      changed: false,
      removedCount: 0,
      ok: false,
      errors: [{ slug, label: "CANARY CHECK FAILED", find: canary.found.join(" | "), expectedCount: 0, actualCount: canary.found.length }],
    };
  }

  return { html: result.html, changed: result.changed, removedCount: result.appliedCount, ok: true };
}

// Phase 5G.1C (2026-10-12): unrelated-to-organ-transplant text-quality
// fixes, applied with the exact same slug-scoped/exact-match/FATAL-on-
// mismatch mechanism so they also survive a from-scratch re-import. Each
// entry replaces (not just removes) a confirmed, broken or risky sentence
// with a specific, pre-approved replacement -- nothing is reworded freely.
// Flat-array form for the same reason as ORGAN_TRANSPLANT_REMOVALS above.
export const TEXT_QUALITY_REPLACEMENTS = [
  {
    slug: "health-tourism-in-turkey",
    label: "broken 'Turkey has demonstrated...' sentence",
    find: "Turkey has demonstrated in the treatment of cancer often international medical tourism has been raised successfully.",
    replace: "Turkey has become a destination for patients seeking cancer treatment as part of international medical tourism.",
    expectedCount: 1,
  },
  {
    slug: "the-best-hospitals-in-turkey",
    label: "stray punctuation before da Vinci Robotic Surgery Center",
    find: "Oncology Center. , da Vinci Robotic Surgery Center.",
    replace: "Oncology Center, da Vinci Robotic Surgery Center.",
    expectedCount: 1,
  },
  { slug: "the-best-hospitals-in-turkey", label: "onchematology typo", find: "onchematology", replace: "oncohematology", expectedCount: 1 },
  {
    // Phase 5G.1E: de-frames the HSCT fact from a "Turkey is active in..."
    // service-capability claim into a plain, Turkey-agnostic medical fact.
    slug: "stem-cell-therapy-turkey",
    label: "HSCT 'Turkey has been active' service-capability framing",
    find: "Turkey has been active in the field of hematopoietic stem cell transplantation, commonly used to treat various blood disorders, such as leukemia and thalassemia.",
    replace: "Hematopoietic stem cell transplantation (HSCT) is a treatment used for certain blood disorders, including some forms of leukemia and thalassemia.",
    expectedCount: 1,
  },
];
assertNoDuplicateRules(TEXT_QUALITY_REPLACEMENTS);

/**
 * Same contract as removeOrganTransplantPromotion(): all-or-nothing per
 * file, FATAL (ok:false) on any count mismatch rather than a partial or
 * silent apply.
 */
export function applyTextQualityFixes(html, slug) {
  const rules = TEXT_QUALITY_REPLACEMENTS.filter((r) => r.slug === slug);
  const result = applySequentialRules(html, rules);
  if (!result.ok) {
    return { html, changed: false, appliedCount: 0, ok: false, errors: result.errors };
  }
  return result;
}

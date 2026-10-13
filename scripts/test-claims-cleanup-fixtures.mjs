#!/usr/bin/env node
// Phase 5G.2B.1 (2026-10-12): fast, isolated regression tests for the
// slug-scoped exact-match rule mechanism shared by organ-transplant-
// cleanup.mjs and medical-claims-cleanup.mjs. Runs in milliseconds against
// small in-memory fixtures -- no WXR export, no 608-article import needed.
// Does NOT touch content/blog/*.html and does not change production
// behavior; it only exercises the already-shipped functions with
// deliberately broken inputs (reordered/truncated rule lists) to prove the
// mechanism fails loudly and safely rather than silently misbehaving.
//
// Run with: node scripts/test-claims-cleanup-fixtures.mjs
// Exits 0 if every check passes, 1 otherwise.

import {
  applySequentialRules,
  assertNoDuplicateRules,
  removeOrganTransplantPromotion,
} from "./lib/organ-transplant-cleanup.mjs";
import { MEDICAL_CLAIMS_REPLACEMENTS } from "./lib/medical-claims-cleanup.mjs";

let failures = 0;
function check(name, condition, detail) {
  if (condition) {
    console.log(`  PASS  ${name}`);
  } else {
    failures++;
    console.error(`  FAIL  ${name}${detail ? " -- " + detail : ""}`);
  }
}

console.log("=== 1. Chained rules apply correctly, in order ===");
{
  // beard-transplant-cost-turkey has exactly 2 chained rules: the 5G.2A
  // rule's `find` IS the original raw document for this fixture; its
  // `replace` becomes the 5G.2A.1 rule's `find`.
  const rules = MEDICAL_CLAIMS_REPLACEMENTS.filter((r) => r.slug === "beard-transplant-cost-turkey");
  check("beard-transplant-cost-turkey has exactly 2 chained rules", rules.length === 2, `found ${rules.length}`);
  const originalFixture = rules[0].find;
  const result = applySequentialRules(originalFixture, rules);
  check("chained rules succeed end-to-end", result.ok === true);
  check("final output matches the last rule's replace text", result.html === rules[1].replace);
  check("appliedCount reflects both rules", result.appliedCount === 2, `got ${result.appliedCount}`);
}

console.log("\n=== 2. Reversed rule order fails safely (does not silently corrupt) ===");
{
  const rules = MEDICAL_CLAIMS_REPLACEMENTS.filter((r) => r.slug === "beard-transplant-cost-turkey");
  const originalFixture = rules[0].find;
  const reversed = [...rules].reverse();
  const result = applySequentialRules(originalFixture, reversed);
  check("reversed order returns ok:false", result.ok === false);
  check("reversed order returns the UNTOUCHED original html, not a partial/corrupted version", result.html === originalFixture);
  check("reversed order reports an error for the rule whose target text doesn't exist yet", result.errors?.length > 0);
}

console.log("\n=== 3. Removing an intermediate rule in a chain fails safely ===");
{
  // Synthetic 3-step chain, independent of any real production slug, so
  // this test stays valid even as the real rule data evolves: each rule's
  // `find` is the PREVIOUS rule's `replace`, exactly mirroring how
  // 5G.2A -> 5G.2A.1 chains in the real data.
  const slug = "synthetic-test-slug";
  const chain = [
    { slug, label: "step 1", find: "A", replace: "B", expectedCount: 1 },
    { slug, label: "step 2 (the one we will remove)", find: "B", replace: "C", expectedCount: 1 },
    { slug, label: "step 3", find: "C", replace: "D", expectedCount: 1 },
  ];
  const fixture = "A";

  const fullChainResult = applySequentialRules(fixture, chain);
  check("full 3-step chain succeeds and reaches the final state", fullChainResult.ok === true && fullChainResult.html === "D");

  const withMiddleRemoved = [chain[0], chain[2]]; // step 2 accidentally deleted
  const truncatedResult = applySequentialRules(fixture, withMiddleRemoved);
  check("removing the middle (intermediate) rule fails safely (ok:false)", truncatedResult.ok === false);
  check("removing the middle rule returns the untouched original fixture, not a half-applied 'B'", truncatedResult.html === fixture);
  check(
    "the reported error is for step 3, whose input ('B') was never produced",
    truncatedResult.errors?.some((e) => e.label === "step 3" && e.actualCount === 0)
  );
}

console.log("\n=== 4. Duplicate-rule detection is active ===");
{
  let threw = false;
  try {
    assertNoDuplicateRules([
      { slug: "x", find: "a", expectedCount: 1 },
      { slug: "x", find: "a", expectedCount: 1 },
    ]);
  } catch {
    threw = true;
  }
  check("assertNoDuplicateRules throws on an exact duplicate (slug+find)", threw === true);

  let threwOnRealData = false;
  try {
    assertNoDuplicateRules(MEDICAL_CLAIMS_REPLACEMENTS);
  } catch {
    threwOnRealData = true;
  }
  check("the real MEDICAL_CLAIMS_REPLACEMENTS array has no duplicates", threwOnRealData === false);
}

console.log("\n=== 5. Organ-transplant canary is independent of the rule list ===");
{
  // The canary (CANARY_CHECKS, hardcoded, slug-scoped) must fire for
  // treatment-in-turkey regardless of what ORGAN_TRANSPLANT_REMOVALS
  // contains for that slug. We prove independence by confirming the canary
  // is scoped to its registered slug only (not a global check that would
  // false-positive on every other article): a different slug with zero
  // rules and the same dangerous text is correctly left untouched.
  const dangerousText = "... USD 60.000 ... Can Turkey be preferred for bone marrow transplants ...";
  const otherSlugResult = removeOrganTransplantPromotion(dangerousText, "a-slug-with-no-rules-and-no-canary");
  check(
    "a different, unrelated slug with no rules is left untouched (canary does not fire globally)",
    otherSlugResult.ok === true && otherSlugResult.html === dangerousText
  );
}

console.log("\n=== 6. The exact Phase 5G.1E regression (USD 60.000 bone-marrow package) cannot reappear ===");
{
  const dangerousHtml =
    "intro text <h2>Can Turkey be preferred for bone marrow transplants?</h2> ... <td><span>Price</span></td><td><span>USD 60.000</span></td> ... Bone Marrow Transplant in Turkey Summary ... end";
  const result = removeOrganTransplantPromotion(dangerousHtml, "treatment-in-turkey");
  check("a fixture containing the dangerous content, run through the real treatment-in-turkey path, is rejected (ok:false)", result.ok === false);
  check("the rejection is NOT silently swallowed -- html returned unchanged", result.html === dangerousHtml);
}

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

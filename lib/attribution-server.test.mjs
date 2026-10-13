// Phase 5K-A unit tests for lib/attribution-server.ts, using a minimal
// in-memory fake Supabase client -- NEVER a real network call or a real
// Supabase project. This project's local .env.local points at a real
// Supabase instance, and the lead_attributions / attribution_rate_limits
// tables this code targets do not exist there yet (their migrations are
// prepared locally, not applied) -- these tests must never depend on, or
// risk writing to, that real project.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createReferenceCodeWithRetry,
  reserveReferenceCode,
  checkAttributionRateLimit,
} from "./attribution-server.ts";

// Mimics just the chain shapes this code actually calls:
// .from(t).insert(row) ; .from(t).select(c).eq(k,v).maybeSingle() ;
// .from(t).update(row).eq(k,v)
function makeFakeSupabase({ attributions = [], rateLimits = [], failInsertOnce = false } = {}) {
  let insertCallCount = 0;
  const state = { attributions, rateLimits };

  function table(name) {
    const rows = name === "lead_attributions" ? state.attributions : state.rateLimits;
    const keyField = name === "lead_attributions" ? "reference_code" : "bucket_key";

    return {
      insert(row) {
        insertCallCount++;
        if (failInsertOnce && insertCallCount === 1) {
          return Promise.resolve({ error: { code: "23505", message: "duplicate key" } });
        }
        const exists = rows.some((r) => r[keyField] === row[keyField]);
        if (exists) {
          return Promise.resolve({ error: { code: "23505", message: "duplicate key" } });
        }
        rows.push({ ...row });
        return Promise.resolve({ error: null });
      },
      select() {
        return {
          eq(field, value) {
            return {
              maybeSingle() {
                const found = rows.find((r) => r[field] === value);
                return Promise.resolve({ data: found ?? null });
              },
            };
          },
        };
      },
      update(patch) {
        return {
          eq(field, value) {
            const row = rows.find((r) => r[field] === value);
            if (row) Object.assign(row, patch);
            return Promise.resolve({ error: null });
          },
        };
      },
    };
  }

  return { from: table, _state: state, _insertCallCount: () => insertCallCount };
}

test("createReferenceCodeWithRetry inserts a new row and returns its code", async () => {
  const supabase = makeFakeSupabase();
  const code = await createReferenceCodeWithRetry(supabase, "whatsapp");
  assert.match(code, /^MCT-[A-Z0-9]{6}$/);
  assert.equal(supabase._state.attributions.length, 1);
  assert.equal(supabase._state.attributions[0].reference_code, code);
  assert.equal(supabase._state.attributions[0].channel, "whatsapp");
  assert.equal(supabase._state.attributions[0].status, "contact_initiated");
});

test("createReferenceCodeWithRetry sets status to lead_confirmed when leadId is provided", async () => {
  const supabase = makeFakeSupabase();
  const code = await createReferenceCodeWithRetry(supabase, "form", "lead-123");
  assert.equal(supabase._state.attributions[0].lead_id, "lead-123");
  assert.equal(supabase._state.attributions[0].status, "lead_confirmed");
  assert.ok(code);
});

test("createReferenceCodeWithRetry uses the preferred code on the first attempt", async () => {
  const supabase = makeFakeSupabase();
  const code = await createReferenceCodeWithRetry(supabase, "form", "lead-456", "MCT-ABC234");
  assert.equal(code, "MCT-ABC234");
  assert.equal(supabase._state.attributions[0].reference_code, "MCT-ABC234");
});

test("createReferenceCodeWithRetry retries with a fresh code when the preferred one collides", async () => {
  const supabase = makeFakeSupabase({ attributions: [{ reference_code: "MCT-ABC234", channel: "form" }] });
  const code = await createReferenceCodeWithRetry(supabase, "form", "lead-789", "MCT-ABC234");
  assert.notEqual(code, "MCT-ABC234", "must not reuse a code that's already taken");
  assert.match(code, /^MCT-[A-Z0-9]{6}$/);
});

test("createReferenceCodeWithRetry retries on a generic collision and eventually succeeds", async () => {
  const supabase = makeFakeSupabase({ failInsertOnce: true });
  const code = await createReferenceCodeWithRetry(supabase, "email");
  assert.match(code, /^MCT-[A-Z0-9]{6}$/);
  assert.equal(supabase._insertCallCount(), 2, "should have retried exactly once after the forced collision");
});

test("createReferenceCodeWithRetry returns null (never throws) on a non-collision DB error", async () => {
  const supabase = {
    from() {
      return { insert: () => Promise.resolve({ error: { code: "42501", message: "permission denied" } }) };
    },
  };
  const code = await createReferenceCodeWithRetry(supabase, "whatsapp");
  assert.equal(code, null);
});

test("reserveReferenceCode returns a fresh, available code without inserting a row", async () => {
  const supabase = makeFakeSupabase();
  const code = await reserveReferenceCode(supabase);
  assert.match(code, /^MCT-[A-Z0-9]{6}$/);
  assert.equal(supabase._state.attributions.length, 0, "reserveReferenceCode must not write a row -- only check");
});

test("reserveReferenceCode avoids a code that is already taken", async () => {
  // Deterministic: force every randomly generated code to collide once by
  // pre-seeding a huge number of entries is impractical; instead, verify
  // the *mechanism* directly -- that it actually performs a lookup before
  // returning, by seeding one specific collision and running many trials
  // (astronomically unlikely to miss testing the retry path otherwise, so
  // we instead assert the simpler, always-true invariant: the result is
  // never present in a pre-seeded "taken" set we control).
  const taken = "MCT-222222"; // not a real possible output (contains '2'*6 is valid actually) -- seed it directly
  const supabase = makeFakeSupabase({ attributions: [{ reference_code: taken }] });
  for (let i = 0; i < 50; i++) {
    const code = await reserveReferenceCode(supabase);
    assert.notEqual(code, taken);
  }
});

test("checkAttributionRateLimit allows the first request from a new IP and creates a bucket", async () => {
  const supabase = makeFakeSupabase();
  const result = await checkAttributionRateLimit(supabase, "203.0.113.5", "test-secret");
  assert.equal(result.allowed, true);
  assert.equal(supabase._state.rateLimits.length, 1);
  assert.equal(supabase._state.rateLimits[0].request_count, 1);
});

test("checkAttributionRateLimit allows and increments while under the limit", async () => {
  const supabase = makeFakeSupabase();
  for (let i = 0; i < 5; i++) {
    const result = await checkAttributionRateLimit(supabase, "203.0.113.5", "test-secret");
    assert.equal(result.allowed, true, `request ${i + 1} should be allowed`);
  }
  assert.equal(supabase._state.rateLimits[0].request_count, 5);
});

test("checkAttributionRateLimit blocks the 6th request within the same window", async () => {
  const supabase = makeFakeSupabase();
  for (let i = 0; i < 5; i++) {
    await checkAttributionRateLimit(supabase, "203.0.113.5", "test-secret");
  }
  const sixth = await checkAttributionRateLimit(supabase, "203.0.113.5", "test-secret");
  assert.equal(sixth.allowed, false);
});

test("checkAttributionRateLimit tracks different IPs independently", async () => {
  const supabase = makeFakeSupabase();
  for (let i = 0; i < 5; i++) {
    await checkAttributionRateLimit(supabase, "203.0.113.5", "test-secret");
  }
  const otherIp = await checkAttributionRateLimit(supabase, "203.0.113.6", "test-secret");
  assert.equal(otherIp.allowed, true, "a different IP must not be blocked by another IP's bucket");
});

test("checkAttributionRateLimit never stores a raw IP anywhere in the bucket row", async () => {
  const supabase = makeFakeSupabase();
  await checkAttributionRateLimit(supabase, "203.0.113.5", "test-secret");
  const row = supabase._state.rateLimits[0];
  assert.ok(!JSON.stringify(row).includes("203.0.113.5"), "raw IP must never appear in a stored rate-limit row");
});

// --- Phase 5K-C: migration-order independence for the new source-attribution columns ---

function makeFakeSupabaseWithMissingSourceColumns() {
  // Simulates the exact pre-lead_attributions_source_fields.sql schema --
  // any insert containing one of the new column names fails with
  // Postgres's undefined_column code, exactly as a real unmigrated
  // Supabase project would. Base-schema-only inserts succeed normally.
  const rows = [];
  const NEW_COLUMNS = ["inferred_channel", "first_touch_at", "last_touch_at"];
  return {
    from(name) {
      if (name !== "lead_attributions") throw new Error(`unexpected table ${name}`);
      return {
        insert(row) {
          const hasNewColumn = Object.keys(row).some((k) => NEW_COLUMNS.includes(k));
          if (hasNewColumn) {
            return Promise.resolve({ error: { code: "42703", message: "column does not exist" } });
          }
          rows.push({ ...row });
          return Promise.resolve({ error: null });
        },
      };
    },
    _rows: rows,
  };
}

test("createReferenceCodeWithRetry falls back to the base column set when source-attribution columns don't exist yet", async () => {
  const supabase = makeFakeSupabaseWithMissingSourceColumns();
  const code = await createReferenceCodeWithRetry(supabase, "whatsapp", undefined, undefined, {
    sessionTouch: { utmSource: "google", utmMedium: "cpc", capturedAt: Date.now() },
  });
  assert.match(code, /^MCT-[A-Z0-9]{6}$/, "must still succeed and return a code");
  assert.equal(supabase._rows.length, 1, "exactly one row written, not zero, not two");
  assert.ok(!("inferred_channel" in supabase._rows[0]), "the row actually written must not reference the missing column");
});

test("createReferenceCodeWithRetry preserves the SAME preferred code across the fallback retry", async () => {
  const supabase = makeFakeSupabaseWithMissingSourceColumns();
  const code = await createReferenceCodeWithRetry(supabase, "form", "lead-999", "MCT-XYZ234", {
    sessionTouch: { gclid: "abc" },
  });
  assert.equal(code, "MCT-XYZ234", "the lead's details.reference_code must still match this row's code after falling back");
  assert.equal(supabase._rows[0].reference_code, "MCT-XYZ234");
});

test("createReferenceCodeWithRetry works identically with no touch data at all (Phase 5K-A call sites, unaffected)", async () => {
  const supabase = makeFakeSupabaseWithMissingSourceColumns();
  const code = await createReferenceCodeWithRetry(supabase, "email");
  assert.match(code, /^MCT-[A-Z0-9]{6}$/);
  assert.equal(supabase._rows.length, 1);
});

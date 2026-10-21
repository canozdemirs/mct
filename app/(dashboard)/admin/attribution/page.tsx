import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient, type SupabaseClient } from "@supabase/supabase-js";
import { ADMIN_EMAILS } from "@/lib/admin";
import { isValidReferenceCodeFormat, type InferredChannel } from "@/lib/attribution";

// Phase 5K-A: staff-only reference-code lookup. Same server-side
// authorization pattern as app/(dashboard)/admin/leads/page.tsx -- the
// check happens here, in the Server Component itself, before any data is
// fetched, not by hiding a UI element. There is no public equivalent of
// this page and no public API route that can perform this lookup.
//
// Phase 5K-C: now shows the real inferred_channel + first/last-touch
// evidence when present. "UNKNOWN" is shown whenever any of these is
// actually absent (no consent was ever granted for that visit, the
// record predates this phase, or the visit genuinely had no UTM/referrer
// evidence) -- never fabricated. The select() below tries the Phase 5K-C
// columns first and falls back to the Phase 5K-A column set if that
// migration hasn't been applied yet, mirroring attribution-server.ts's
// own insert-side fallback -- this page must keep working regardless of
// migration order.
type AttributionRecord = {
  reference_code: string;
  channel: "whatsapp" | "email" | "form";
  created_at: string;
  status: "contact_initiated" | "lead_confirmed";
  lead_id: string | null;
  inferred_channel?: InferredChannel | null;
  first_touch_landing_page?: string | null;
  first_touch_referrer?: string | null;
  first_touch_utm_source?: string | null;
  first_touch_utm_medium?: string | null;
  first_touch_utm_campaign?: string | null;
  first_touch_gclid?: string | null;
  first_touch_at?: string | null;
  last_touch_landing_page?: string | null;
  last_touch_referrer?: string | null;
  last_touch_utm_source?: string | null;
  last_touch_utm_medium?: string | null;
  last_touch_utm_campaign?: string | null;
  last_touch_gclid?: string | null;
  last_touch_at?: string | null;
};

type LinkedLead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  treatment: string | null;
  status: string;
};

const CHANNEL_LABELS: Record<InferredChannel, string> = {
  google_ads: "Google Ads (inferred)",
  google_organic: "Google Organic (inferred)",
  other_paid: "Other Paid (inferred)",
  referral: "Referral (inferred)",
  direct_inferred: "Direct (inferred)",
  unknown: "Unknown",
};

const BASE_COLUMNS = "reference_code, channel, created_at, status, lead_id";
const SOURCE_COLUMNS =
  "inferred_channel, first_touch_landing_page, first_touch_referrer, first_touch_utm_source, first_touch_utm_medium, first_touch_utm_campaign, first_touch_gclid, first_touch_at, last_touch_landing_page, last_touch_referrer, last_touch_utm_source, last_touch_utm_medium, last_touch_utm_campaign, last_touch_gclid, last_touch_at";

async function fetchAttributionRecord(
  adminSupabase: SupabaseClient,
  code: string
): Promise<AttributionRecord | null> {
  const { data, error } = await adminSupabase
    .from("lead_attributions")
    .select(`${BASE_COLUMNS}, ${SOURCE_COLUMNS}`)
    .eq("reference_code", code)
    .maybeSingle();

  if (!error && data) return data as AttributionRecord;

  if (error) {
    // Phase 5K-C columns not migrated yet -- fall back to the base set so
    // this page keeps working against the pre-5K-C schema too.
    const code_ = (error as { code?: string }).code;
    if (code_ === "42703" || code_ === "PGRST204") {
      const { data: baseData } = await adminSupabase
        .from("lead_attributions")
        .select(BASE_COLUMNS)
        .eq("reference_code", code)
        .maybeSingle();
      if (baseData) return baseData as AttributionRecord;
    }
    // Any other error, including PGRST205 (table doesn't exist -- it
    // never has in this project), falls through to the contact_clicks
    // lookup below.
  }

  // 2026-10-21: whatsapp/email codes are no longer written to
  // lead_attributions at all (see supabase/migrations/contact_clicks.sql
  // and app/api/attribution/route.ts) -- every code not found above is
  // looked up there instead, normalized into the same shape this page
  // already renders. inferred_channel has no equivalent here (contact_clicks
  // doesn't classify a channel, only records what was literally observed),
  // so it's left undefined -- the UI already renders that as "UNKNOWN".
  const { data: clickData } = await adminSupabase
    .from("contact_clicks")
    .select("reference_code, channel, created_at, lead_id, landing_page, referrer_domain, utm_source, utm_medium, utm_campaign")
    .eq("reference_code", code)
    .maybeSingle();

  if (!clickData) return null;
  return {
    reference_code: clickData.reference_code,
    channel: clickData.channel,
    created_at: clickData.created_at,
    status: clickData.lead_id ? "lead_confirmed" : "contact_initiated",
    lead_id: clickData.lead_id,
    last_touch_utm_source: clickData.utm_source,
    last_touch_utm_medium: clickData.utm_medium,
    last_touch_utm_campaign: clickData.utm_campaign,
    last_touch_landing_page: clickData.landing_page,
    last_touch_referrer: clickData.referrer_domain,
  } as AttributionRecord;
}

export default async function AdminAttributionPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code: rawCode } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    redirect("/agency");
  }

  const code = (rawCode || "").trim().toUpperCase();
  let record: AttributionRecord | null = null;
  let linkedLead: LinkedLead | null = null;
  let searchError = "";

  if (code) {
    if (!isValidReferenceCodeFormat(code)) {
      searchError = "That doesn't look like a valid reference code (expected format: MCT-XXXXXX).";
    } else {
      const adminSupabase = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      record = await fetchAttributionRecord(adminSupabase, code);

      if (!record) {
        searchError = "No record found for that reference code.";
      } else if (record.lead_id) {
        const { data: lead } = await adminSupabase
          .from("leads")
          .select("id, name, email, phone, treatment, status")
          .eq("id", record.lead_id)
          .maybeSingle();
        linkedLead = (lead as LinkedLead) ?? null;
      }
    }
  }

  const channelLabel = record?.inferred_channel ? CHANNEL_LABELS[record.inferred_channel] : "UNKNOWN — no evidence captured";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-2xl font-bold text-brand-dark">Reference Code Lookup</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Search a patient-provided reference code (e.g. from a WhatsApp message or email).
        </p>

        <div className="flex gap-4 mb-6">
          <Link href="/admin/leads" className="text-sm text-gray-400 hover:text-brand transition-colors">
            ← Leads
          </Link>
        </div>

        <form method="get" className="flex flex-wrap gap-3 mb-6 bg-white border border-gray-100 rounded-2xl p-4">
          <input
            name="code"
            defaultValue={rawCode}
            placeholder="MCT-A7K2P9"
            className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700 w-48 uppercase tracking-wide"
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-[#154d8a] transition-colors">
            Search
          </button>
        </form>

        {searchError && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-sm text-gray-500">
            {searchError}
          </div>
        )}

        {record && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3 text-sm">
            <Row label="Reference" value={record.reference_code} />
            <Row label="Channel" value={record.channel} />
            <Row label="Created" value={new Date(record.created_at).toLocaleString("en-GB")} />
            <Row label="Status" value={record.status === "lead_confirmed" ? "Lead confirmed" : "Contact initiated — not independently verified"} />
            <Row label="Inferred acquisition source" value={channelLabel} />

            {(record.last_touch_utm_source || record.last_touch_utm_campaign || record.last_touch_gclid || record.last_touch_referrer) && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Last-Touch Evidence (observed, not verified)</p>
                <Row label="UTM Source" value={record.last_touch_utm_source || "—"} />
                <Row label="UTM Medium" value={record.last_touch_utm_medium || "—"} />
                <Row label="UTM Campaign" value={record.last_touch_utm_campaign || "—"} />
                <Row label="gclid present" value={record.last_touch_gclid ? "Yes" : "No"} />
                <Row label="Referrer" value={record.last_touch_referrer || "—"} />
                <Row label="Landing page" value={record.last_touch_landing_page || "—"} />
              </div>
            )}

            {record.first_touch_at && record.first_touch_landing_page !== record.last_touch_landing_page && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">First-Touch Evidence</p>
                <Row label="Landing page" value={record.first_touch_landing_page || "—"} />
                <Row label="First seen" value={new Date(record.first_touch_at).toLocaleString("en-GB")} />
              </div>
            )}

            {linkedLead ? (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Linked Lead</p>
                <Row label="Name" value={linkedLead.name} />
                <Row label="Email" value={linkedLead.email || "—"} />
                <Row label="Phone" value={linkedLead.phone || "—"} />
                <Row label="Treatment" value={linkedLead.treatment || "—"} />
              </div>
            ) : (
              <p className="pt-3 border-t border-gray-100 text-xs text-gray-400">
                No linked lead yet — a WhatsApp/email click is not proof that a message was sent.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-800 font-medium text-right break-all">{value}</span>
    </div>
  );
}

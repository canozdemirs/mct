function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-sm text-gray-800 font-medium">{value || "—"}</dd>
    </div>
  );
}

function formatDateTime(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export type AttributionInfo = {
  channel: string | null;
  landingPage: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrerDomain: string | null;
  clickedAt: string | null;
  // Grouped acquisition category (lib/patient-source.ts) -- always
  // computable (falls back to "Direct"/"WhatsApp"/"Partner" etc. when
  // there's no landing page/UTM evidence at all), unlike the other
  // fields here which can genuinely be absent.
  sourceCategory: string;
};

// Read-only, system-captured evidence -- "Source" itself as a category
// (editable via an override) and "Contact method" are now on
// patient-edit-card.tsx instead of being shown here (that card is also
// where a reference code can be linked after the fact if it wasn't
// entered at creation). Landing Page/UTM/referrer values come primarily
// from leads.landing_page/utm_*/referrer_domain -- parsed server-side
// from page_url at submit time for form-channel patients, or copied in
// from the linked contact_clicks row for WhatsApp/email-added ones
// (lib/attribution-server.ts's linkContactClickToLead()). The
// lead_attributions pipeline (consent-gated, client-side-only, and
// dormant in this database) is only a fallback for whatever those
// don't have.
export function SourceInfoBox({
  referenceCode,
  attribution,
  country,
}: {
  referenceCode: string | null;
  attribution: AttributionInfo;
  country: string | null;
}) {
  const hasLandingOrUtm = !!(attribution.landingPage || attribution.utmSource || attribution.utmMedium || attribution.utmCampaign || attribution.referrerDomain);

  return (
    <div className="mb-6">
      <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
        Attribution
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Field label="Source" value={attribution.sourceCategory} />
        {referenceCode && <Field label="Reference Code" value={referenceCode} />}
        {country && <Field label="Country" value={country} />}
        {attribution.clickedAt && <Field label="Clicked At" value={formatDateTime(attribution.clickedAt)} />}
        {hasLandingOrUtm && (
          <>
            <Field label="Landing Page" value={attribution.landingPage} />
            <Field label="Referrer" value={attribution.referrerDomain} />
            <Field label="UTM Source / Medium" value={attribution.utmSource || attribution.utmMedium ? `${attribution.utmSource || "—"} / ${attribution.utmMedium || "—"}` : null} />
            <Field label="UTM Campaign" value={attribution.utmCampaign} />
          </>
        )}
      </dl>
      {!hasLandingOrUtm && (
        <p className="text-xs text-gray-400 mt-3">No landing page/UTM/referrer evidence captured for this lead (predates attribution tracking, or arrived with no tracking parameters).</p>
      )}
    </div>
  );
}

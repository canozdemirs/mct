function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-sm text-gray-800 font-medium">{value || "—"}</dd>
    </div>
  );
}

export type AttributionInfo = {
  channel: string | null;
  landingPage: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

export function SourceInfoBox({
  source,
  referenceCode,
  firstContactedAt,
  attribution,
}: {
  source: string;
  referenceCode: string | null;
  firstContactedAt: string | null;
  attribution: AttributionInfo | null;
}) {
  return (
    <div className="mb-6">
      <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
        Source
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Field label="Source" value={source} />
        <Field label="Reference Code" value={referenceCode} />
        <Field
          label="First Contacted"
          value={firstContactedAt ? new Date(firstContactedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null}
        />
        {attribution && (
          <>
            <Field label="Landing Page" value={attribution.landingPage} />
            <Field label="UTM Source / Medium" value={attribution.utmSource || attribution.utmMedium ? `${attribution.utmSource || "—"} / ${attribution.utmMedium || "—"}` : null} />
            <Field label="UTM Campaign" value={attribution.utmCampaign} />
          </>
        )}
      </dl>
      {!attribution && referenceCode && (
        <p className="text-xs text-gray-400 mt-3">No attribution evidence captured for this reference code (no consent, or it predates attribution tracking).</p>
      )}
    </div>
  );
}

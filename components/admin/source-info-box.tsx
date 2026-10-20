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

// Read-only, system-captured evidence -- "Source" itself (the channel
// label) and "First contact date" are now editable fields on
// patient-edit-card.tsx instead of being shown here.
export function SourceInfoBox({
  referenceCode,
  attribution,
}: {
  referenceCode: string | null;
  attribution: AttributionInfo | null;
}) {
  if (!referenceCode) return null;

  return (
    <div className="mb-6">
      <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
        Attribution
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Field label="Reference Code" value={referenceCode} />
        {attribution && (
          <>
            <Field label="Landing Page" value={attribution.landingPage} />
            <Field label="UTM Source / Medium" value={attribution.utmSource || attribution.utmMedium ? `${attribution.utmSource || "—"} / ${attribution.utmMedium || "—"}` : null} />
            <Field label="UTM Campaign" value={attribution.utmCampaign} />
          </>
        )}
      </dl>
      {!attribution && (
        <p className="text-xs text-gray-400 mt-3">No attribution evidence captured for this reference code (no consent, or it predates attribution tracking).</p>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-sm text-gray-800 font-medium">{value || "—"}</dd>
    </div>
  );
}

export function PartnerInfoBox({
  companyName,
  contactName,
  email,
  partnerType,
}: {
  companyName: string | null;
  contactName: string | null;
  email: string | null;
  partnerType: string | null;
}) {
  return (
    <div className="mb-6">
      <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
        Partner
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Field label="Company / Agency" value={companyName} />
        <Field label="Contact Name" value={contactName} />
        <Field label="Partner Email" value={email} />
        <Field label="Partner Type" value={partnerType} />
      </dl>
    </div>
  );
}

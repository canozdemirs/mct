function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-sm text-gray-800 font-medium">{value || "—"}</dd>
    </div>
  );
}

export function PatientInfoCard({
  name,
  country,
  phone,
  email,
  treatment,
  hospital,
  submittedAt,
}: {
  name: string;
  country: string | null;
  phone: string | null;
  email: string | null;
  treatment: string | null;
  hospital: string | null;
  submittedAt: string;
}) {
  return (
    <div className="mb-6">
      <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
        Patient Information
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Field label="Full Name" value={name} />
        <Field label="Country" value={country} />
        <Field label="Phone / WhatsApp" value={phone} />
        <Field label="Email" value={email} />
        <Field label="Treatment" value={treatment} />
        <Field label="Hospital" value={hospital} />
        <Field
          label="Submitted"
          value={new Date(submittedAt).toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        />
      </dl>
    </div>
  );
}

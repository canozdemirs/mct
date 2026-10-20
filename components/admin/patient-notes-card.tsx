export function PatientNotesCard({ title, notes }: { title: string; notes: string | null }) {
  return (
    <div className="mb-6">
      <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
        {title}
      </div>
      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{notes || "—"}</p>
    </div>
  );
}

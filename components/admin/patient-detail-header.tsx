import Link from "next/link";
import { REFERRAL_STATUS_LABELS, type ReferralStatus } from "@/types";

export const STATUS_COLORS: Record<ReferralStatus, string> = {
  new: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  consultation: "bg-purple-100 text-purple-800",
  treatment_planned: "bg-indigo-100 text-indigo-800",
  treatment_completed: "bg-green-100 text-green-800",
  cancelled_lost: "bg-red-100 text-red-800",
};

export function PatientDetailHeader({
  name,
  subtitle,
  status,
}: {
  name: string;
  subtitle: string | null;
  status: ReferralStatus;
}) {
  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/leads" className="hover:text-brand transition-colors">
          Patients
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{name}</span>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">{name}</h1>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600"}`}>
          {REFERRAL_STATUS_LABELS[status] ?? status}
        </span>
      </div>
    </>
  );
}

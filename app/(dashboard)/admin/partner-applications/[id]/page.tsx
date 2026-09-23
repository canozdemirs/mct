import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { AdminActions } from "@/components/admin/admin-actions";
import { ADMIN_EMAILS } from "@/lib/admin";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  needs_info: "bg-blue-100 text-blue-800",
};

type PartnerApplication = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string | null;
  partner_type: string;
  partner_type_other: string | null;
  company_name: string;
  website: string | null;
  social_media: string | null;
  company_address: string | null;
  years_in_business: string | null;
  markets: string | null;
  monthly_patients: string;
  treatments_interest: string[];
  business_description: string;
  how_heard: string | null;
  status: string;
  admin_notes: string | null;
  reviewed_at: string | null;
  auth_user_id: string | null;
};

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-sm text-gray-800 font-medium">{value || "—"}</dd>
    </div>
  );
}

export default async function PartnerApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    redirect("/agency");
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: app, error } = await adminSupabase
    .from("partner_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !app) {
    notFound();
  }

  const application = app as PartnerApplication;

  const { data: linkedPartner } = await adminSupabase
    .from("partners")
    .select("id")
    .eq("application_id", id)
    .maybeSingle();

  let linkedReferralsCount = 0;
  let linkedCommissionsCount = 0;

  if (linkedPartner) {
    const { data: linkedReferrals } = await adminSupabase
      .from("referrals")
      .select("id")
      .eq("partner_id", linkedPartner.id);

    linkedReferralsCount = linkedReferrals?.length ?? 0;

    if (linkedReferralsCount > 0) {
      const { count } = await adminSupabase
        .from("commissions")
        .select("id", { count: "exact", head: true })
        .in("referral_id", linkedReferrals!.map((r) => r.id));
      linkedCommissionsCount = count ?? 0;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/admin/partner-applications" className="hover:text-brand transition-colors">
            Partner Applications
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{application.full_name}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">{application.full_name}</h1>
            <p className="text-gray-500 text-sm mt-1">{application.company_name} &mdash; {application.partner_type}</p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold capitalize ${
              STATUS_COLORS[application.status] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {application.status.replace("_", " ")}
          </span>
        </div>

        {/* Details grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-5">Application Details</h2>

          {/* Section: Personal */}
          <div className="mb-6">
            <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              Personal Information
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Field label="Full Name" value={application.full_name} />
              <Field label="Email" value={application.email} />
              <Field label="WhatsApp / Phone" value={application.phone} />
              <Field label="Country" value={application.country} />
              <Field label="City" value={application.city} />
            </dl>
          </div>

          {/* Section: Partnership */}
          <div className="mb-6">
            <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              Partnership Type
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Field label="Partner Type" value={application.partner_type} />
              {application.partner_type === "Other" && (
                <Field label="Partner Type Description" value={application.partner_type_other} />
              )}
            </dl>
          </div>

          {/* Section: Business */}
          <div className="mb-6">
            <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              Business Information
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Field label="Company Name" value={application.company_name} />
              <Field label="Website" value={application.website} />
              <Field label="Social Media" value={application.social_media} />
              <Field label="Company Address" value={application.company_address} />
              <Field label="Years in Business" value={application.years_in_business} />
              <Field label="Main Markets" value={application.markets} />
            </dl>
          </div>

          {/* Section: Patient Activity */}
          <div className="mb-6">
            <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              Patient Activity
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Monthly Patient Volume" value={application.monthly_patients} />
              <div>
                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Treatments of Interest</dt>
                <dd className="text-sm text-gray-800 font-medium">
                  {application.treatments_interest && application.treatments_interest.length > 0
                    ? application.treatments_interest.join(", ")
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Section: About */}
          <div className="mb-6">
            <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              About the Business
            </div>
            <dl className="grid grid-cols-1 gap-5">
              <div>
                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Business Description</dt>
                <dd className="text-sm text-gray-800 leading-relaxed">{application.business_description}</dd>
              </div>
              <Field label="How They Found MCT" value={application.how_heard} />
            </dl>
          </div>

          {/* Section: Meta */}
          <div>
            <div className="text-xs font-bold text-teal uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              Application Meta
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Field label="Application ID" value={application.id} />
              <Field
                label="Applied At"
                value={new Date(application.created_at).toLocaleString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
              {application.reviewed_at && (
                <Field
                  label="Reviewed At"
                  value={new Date(application.reviewed_at).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />
              )}
              {application.admin_notes && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Admin Notes</dt>
                  <dd className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{application.admin_notes}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Admin Actions */}
        <AdminActions
          applicationId={id}
          currentStatus={application.status}
          linkedReferralsCount={linkedReferralsCount}
          linkedCommissionsCount={linkedCommissionsCount}
        />
      </div>
    </div>
  );
}

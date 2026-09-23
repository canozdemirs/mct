import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { ReferralForm } from "@/components/partner/referral-form";

export default async function NewReferralPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/agency");
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: partner } = await adminSupabase
    .from("partners")
    .select("id, status")
    .eq("auth_user_id", user.id)
    .single();

  if (!partner || partner.status !== "active") {
    redirect("/agency");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/partner-portal" className="hover:text-brand transition-colors">
            Partner Portal
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Refer a Patient</span>
        </div>

        <h1 className="text-2xl font-bold text-brand-dark mb-1">Refer a Patient</h1>
        <p className="text-sm text-gray-500 mb-8">
          Submit your patient&apos;s details and our team will take it from there.
        </p>

        <ReferralForm mode="create" partnerId={partner.id} />
      </div>
    </div>
  );
}

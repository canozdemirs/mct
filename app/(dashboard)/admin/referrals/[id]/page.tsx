import { redirect, notFound } from "next/navigation";
import { createClient as createAdminClient } from "@supabase/supabase-js";

// This referral's detail/status/commission UI now lives on the unified
// Patients detail page (app/(dashboard)/admin/leads/[id]/page.tsx),
// which renders the partner-owned variant of the same shared components.
// Old links (emails, bookmarks) to /admin/referrals/{id} still resolve,
// via referrals.lead_id.
export default async function AdminReferralRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: referral } = await adminSupabase.from("referrals").select("lead_id").eq("id", id).maybeSingle();

  if (!referral?.lead_id) {
    notFound();
  }

  redirect(`/admin/leads/${referral.lead_id}`);
}

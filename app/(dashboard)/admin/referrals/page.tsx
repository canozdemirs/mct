import { redirect } from "next/navigation";

// The referrals list is now part of the unified Patients view --
// /admin/leads shows both MCT-direct and partner-owned patients, with an
// Owner filter for "just partner referrals" if needed. Individual
// referral detail pages (/admin/referrals/[id]) are unchanged and still
// linked to directly from that list for partner-owned rows.
export default function AdminReferralsRedirectPage() {
  redirect("/admin/leads");
}

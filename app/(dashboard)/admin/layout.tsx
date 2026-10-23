import { AdminNav } from "@/components/admin/admin-nav";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";

// Scoped to app/(dashboard)/admin/** only -- a sibling route segment to
// partner-portal within the (dashboard) route group, so this nav never
// renders for partner-portal pages.
//
// isAdmin here is purely a nav-visibility decision (which items AdminNav
// shows), not this area's access control -- every page under admin/
// already does its own ADMIN_EMAILS check + redirect("/agency"), same as
// before this file existed. This check is independent of those and only
// gates the "Traffic" item (the Vercel analytics link), since that's the
// one considered sensitive enough to hide rather than just rely on the
// page-level redirects elsewhere.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email ?? "");

  return (
    <>
      <AdminNav isAdmin={isAdmin} />
      {children}
    </>
  );
}

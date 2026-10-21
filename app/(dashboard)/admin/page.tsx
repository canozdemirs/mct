import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";

// Bare /admin has no content of its own -- Patients is the default
// landing page (same destination the login flow itself redirects admins
// to, see components/marketing/agency-page.tsx's handleLogin()).
export default async function AdminIndexPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    redirect("/agency");
  }

  redirect("/admin/leads");
}

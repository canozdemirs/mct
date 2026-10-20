import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";

export async function DELETE(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null) as { ids?: unknown } | null;
  const ids = body?.ids;

  if (!Array.isArray(ids) || ids.length === 0 || !ids.every((id) => typeof id === "string" && id.length > 0)) {
    return NextResponse.json({ error: "No valid lead ids provided." }, { status: 400 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Each patient is deleted via the delete_patient() Postgres function
  // (supabase/migrations/safe_patient_delete.sql) -- an audited, atomic
  // transaction that logs the patient (and, for a partner-owned one, its
  // referral + any commission) to deleted_records_log BEFORE removing
  // commissions -> referral_status_history -> referrals -> lead_attributions
  // -> leads. Every id is its own independent delete: one failure never
  // blocks or rolls back any other id in the same batch.
  const deleted: string[] = [];
  const failed: { id: string; error: string }[] = [];

  for (const id of ids) {
    const { error } = await adminSupabase.rpc("delete_patient", {
      p_lead_id: id,
      p_deleted_by: user.email,
    });

    if (error) {
      console.error("delete_patient error:", id, error);
      failed.push({ id, error: error.message });
    } else {
      deleted.push(id);
    }
  }

  revalidatePath("/admin/leads");

  return NextResponse.json({ ok: true, deleted, failed });
}

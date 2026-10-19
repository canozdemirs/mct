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

  // lead_attributions.lead_id -> leads(id) has no ON DELETE clause, which
  // Postgres defaults to NO ACTION -- deleting a lead with a linked
  // attribution row would otherwise fail with a foreign-key violation.
  // Cleaning up only the attribution rows tied to these exact ids first
  // keeps the schema's default RESTRICT behavior intact for every other
  // path (no migration, no ON DELETE CASCADE loosening).
  const { error: attributionError } = await adminSupabase
    .from("lead_attributions")
    .delete()
    .in("lead_id", ids);

  if (attributionError) {
    console.error("Lead attribution cleanup error:", attributionError);
    return NextResponse.json({ error: "Failed to delete linked attribution records." }, { status: 500 });
  }

  const { error, count } = await adminSupabase
    .from("leads")
    .delete({ count: "exact" })
    .in("id", ids);

  if (error) {
    console.error("Lead delete error:", error);
    return NextResponse.json({ error: "Failed to delete leads." }, { status: 500 });
  }

  revalidatePath("/admin/leads");

  return NextResponse.json({ ok: true, deleted: count ?? ids.length });
}

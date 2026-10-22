import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";
import { isValidReferenceCodeFormat } from "@/lib/attribution";
import { linkContactClickToLead } from "@/lib/attribution-server";

// Lets staff link a WhatsApp/email reference code onto a patient AFTER
// creation (e.g. they forgot to enter it in "Add new patient") --
// patient-edit-card.tsx's "Link reference code" control. Same linking
// logic as the one used at creation time
// (app/api/admin/leads/manual/route.ts), shared via
// lib/attribution-server.ts's linkContactClickToLead() so both paths
// stay identical.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null) as { refCode?: string } | null;
  const refCode = (body?.refCode || "").trim().toUpperCase();

  if (!refCode || !isValidReferenceCodeFormat(refCode)) {
    return NextResponse.json({ error: "That reference code doesn't look valid (expected format: MCT-XXXXXX)." }, { status: 400 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const linked = await linkContactClickToLead(adminSupabase, id, refCode);
  if (!linked) {
    return NextResponse.json({ error: "No click record found for that reference code." }, { status: 404 });
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  return NextResponse.json({ ok: true });
}

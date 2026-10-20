import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";

type OwnerChangeBody =
  | { action: "attach"; partnerId: string }
  | { action: "detach" };

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
  const body = await req.json().catch(() => null) as OwnerChangeBody | null;

  if (!body || (body.action !== "attach" && body.action !== "detach")) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (body.action === "attach") {
    if (!body.partnerId) {
      return NextResponse.json({ error: "Please select a partner." }, { status: 400 });
    }

    // referrals.patient_country/patient_phone/treatment are NOT NULL --
    // validated here, with a clear message, rather than letting
    // attach_patient_to_partner() fail with a raw constraint violation.
    const { data: lead, error: leadError } = await adminSupabase
      .from("leads")
      .select("id, owner_type, country, phone, treatment")
      .eq("id", id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: "Patient not found." }, { status: 404 });
    }
    if (lead.owner_type === "partner") {
      return NextResponse.json({ error: "This patient is already partner-owned." }, { status: 400 });
    }
    if (!lead.country || !lead.phone || !lead.treatment) {
      return NextResponse.json(
        { error: "Country, phone, and treatment must all be filled in before converting to a partner patient. Edit the patient first." },
        { status: 400 }
      );
    }

    const { data: referralId, error } = await adminSupabase.rpc("attach_patient_to_partner", {
      p_lead_id: id,
      p_partner_id: body.partnerId,
    });

    if (error) {
      console.error("attach_patient_to_partner error:", error);
      // Surfaced as-is: attach_patient_to_partner() raises specific,
      // admin-readable messages (e.g. "Cancel the revenue record
      // first.") for its blocking checks -- a generic message here
      // would hide exactly the information the admin needs to act on.
      return NextResponse.json({ error: error.message || "Failed to convert this patient to a partner patient." }, { status: 400 });
    }

    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${id}`);
    return NextResponse.json({ ok: true, referralId });
  }

  // detach
  const { error } = await adminSupabase.rpc("detach_single_patient", {
    p_lead_id: id,
    p_deleted_by: user.email,
  });

  if (error) {
    console.error("detach_single_patient error:", error);
    return NextResponse.json({ error: error.message || "Failed to detach this patient from the partner." }, { status: 400 });
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin/referrals");

  return NextResponse.json({ ok: true });
}

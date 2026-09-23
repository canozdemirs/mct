import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";
import { sendEmail } from "@/lib/email";
import { formatPersonName } from "@/lib/format";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://medicalcenterturkey.com";

async function requireAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user && ADMIN_EMAILS.includes(user.email ?? "") ? user : null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json() as {
    action: "approve" | "rejected" | "needs_info";
    admin_notes?: string;
  };

  const { action, admin_notes } = body;

  if (!action || !["approve", "rejected", "needs_info"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (action === "approve") {
    // Fetch application
    const { data: app, error: fetchError } = await adminSupabase
      .from("partner_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const formattedFullName = formatPersonName(app.full_name);

    // redirectTo must still be an allow-listed URL, but the actual link the
    // recipient clicks is built by the "Invite user" email template from
    // {{ .TokenHash }} (see app/auth/confirm/route.ts) rather than from
    // this value — change the destination there, not here.
    const { data: inviteData, error: inviteError } =
      await adminSupabase.auth.admin.inviteUserByEmail(app.email, {
        redirectTo: `${APP_URL}/partner-portal/set-password`,
        data: { full_name: formattedFullName },
      });

    if (inviteError || !inviteData?.user) {
      console.error("Invite error:", {
        status: inviteError?.status,
        code: inviteError?.code,
        message: inviteError?.message,
      });
      return NextResponse.json(
        {
          error: inviteError?.message || "Failed to invite user",
          status: inviteError?.status,
          code: inviteError?.code,
        },
        { status: 500 }
      );
    }

    const authUserId = inviteData.user.id;

    // Insert into partners table
    const { error: partnerError } = await adminSupabase.from("partners").insert({
      auth_user_id: authUserId,
      application_id: id,
      status: "active",
      company_name: app.company_name,
      partner_type: app.partner_type,
      full_name: formattedFullName,
      email: app.email,
    });

    if (partnerError) {
      console.error("Partner insert error:", partnerError);
      return NextResponse.json({ error: "Failed to create partner record" }, { status: 500 });
    }

    // Update application
    const { error: updateError } = await adminSupabase
      .from("partner_applications")
      .update({
        status: "approved",
        auth_user_id: authUserId,
        full_name: formattedFullName,
        reviewed_at: new Date().toISOString(),
        admin_notes: admin_notes || null,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Application update error:", updateError);
      return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
    }

    revalidatePath("/admin/partner-applications");
    revalidatePath(`/admin/partner-applications/${id}`);

    return NextResponse.json({ ok: true, action: "approved" });
  }

  // reject or needs_info — fetch first so we have the applicant's name/email
  // for the notification.
  const { data: app, error: fetchError } = await adminSupabase
    .from("partner_applications")
    .select("email, full_name")
    .eq("id", id)
    .single();

  if (fetchError || !app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const { error: updateError } = await adminSupabase
    .from("partner_applications")
    .update({
      status: action,
      reviewed_at: new Date().toISOString(),
      admin_notes: admin_notes || null,
    })
    .eq("id", id);

  if (updateError) {
    console.error("Application update error:", updateError);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }

  if (action === "rejected") {
    await sendEmail({
      to: app.email,
      subject: "Update on Your Medical Center Turkey Partner Application",
      text: [
        `Dear ${app.full_name},`,
        "",
        "Thank you for your interest in becoming a Medical Center Turkey Partner.",
        "",
        "After careful review, we are unable to move forward with your partner application at this time.",
        "",
        "We appreciate the time you took to apply and wish you continued success.",
        "",
        "Warm regards,",
        "Medical Center Turkey — Partner Relations",
      ].join("\n"),
    });
  } else {
    await sendEmail({
      to: app.email,
      subject: "Additional Information Needed — Medical Center Turkey Partner Application",
      text: [
        `Dear ${app.full_name},`,
        "",
        "Thank you for applying to become a Medical Center Turkey Partner.",
        "",
        "To continue reviewing your application, we need some additional information:",
        "",
        admin_notes && admin_notes.trim() ? admin_notes.trim() : "Our partnerships team will contact you shortly with details.",
        "",
        "Please reply to this email or contact us at hello@medicalcenterturkey.com with the requested details.",
        "",
        "Warm regards,",
        "Medical Center Turkey — Partner Relations",
      ].join("\n"),
    });
  }

  revalidatePath("/admin/partner-applications");
  revalidatePath(`/admin/partner-applications/${id}`);

  return NextResponse.json({ ok: true, action });
}

// TODO(pre-launch): This cascade hard-deletes a partner's entire referral and
// commission history whenever an admin deletes their application. That's fine
// for cleaning up test data, but once real partners have real referrals, this
// would destroy real business/financial records. Before going live, replace
// the "partner has referrals" branch below with a deactivation path instead
// (e.g. set partners.status = 'suspended' and stop here) rather than deleting
// referrals/commissions.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: app, error: fetchError } = await adminSupabase
    .from("partner_applications")
    .select("auth_user_id")
    .eq("id", id)
    .single();

  if (fetchError || !app) {
    return NextResponse.json({ error: "Application not found", failedStep: "fetch_application" }, { status: 404 });
  }

  const { data: partner, error: partnerFetchError } = await adminSupabase
    .from("partners")
    .select("id, auth_user_id")
    .eq("application_id", id)
    .maybeSingle();

  if (partnerFetchError) {
    console.error("Partner fetch error:", partnerFetchError);
    return NextResponse.json(
      { error: "Failed to look up the linked partner record.", failedStep: "fetch_partner" },
      { status: 500 }
    );
  }

  if (partner) {
    const { data: referrals, error: referralsFetchError } = await adminSupabase
      .from("referrals")
      .select("id, files")
      .eq("partner_id", partner.id);

    if (referralsFetchError) {
      console.error("Referrals fetch error:", referralsFetchError);
      return NextResponse.json(
        { error: "Failed to look up linked referrals.", failedStep: "fetch_referrals" },
        { status: 500 }
      );
    }

    const referralIds = (referrals ?? []).map((r) => r.id);
    const filePaths = (referrals ?? []).flatMap(
      (r) => (r.files ?? []).map((f: { path: string }) => f.path)
    );

    if (referralIds.length > 0) {
      const { error: commissionsError } = await adminSupabase
        .from("commissions")
        .delete()
        .in("referral_id", referralIds);

      if (commissionsError) {
        console.error("Commissions delete error:", commissionsError);
        return NextResponse.json(
          { error: "Failed to delete linked commission records.", failedStep: "delete_commissions" },
          { status: 500 }
        );
      }

      const { error: historyError } = await adminSupabase
        .from("referral_status_history")
        .delete()
        .in("referral_id", referralIds);

      if (historyError) {
        console.error("Referral status history delete error:", historyError);
        return NextResponse.json(
          { error: "Failed to delete referral status history.", failedStep: "delete_status_history" },
          { status: 500 }
        );
      }

      if (filePaths.length > 0) {
        const { error: storageError } = await adminSupabase.storage.from("referral-files").remove(filePaths);

        if (storageError) {
          console.error("Storage files delete error:", storageError);
          return NextResponse.json(
            { error: "Failed to delete uploaded referral files.", failedStep: "delete_storage_files" },
            { status: 500 }
          );
        }
      }

      const { error: referralsDeleteError } = await adminSupabase
        .from("referrals")
        .delete()
        .in("id", referralIds);

      if (referralsDeleteError) {
        console.error("Referrals delete error:", referralsDeleteError);
        return NextResponse.json(
          { error: "Failed to delete linked referrals.", failedStep: "delete_referrals" },
          { status: 500 }
        );
      }
    }

    const { error: partnerDeleteError } = await adminSupabase.from("partners").delete().eq("id", partner.id);

    if (partnerDeleteError) {
      console.error("Partner delete error:", partnerDeleteError);
      return NextResponse.json(
        { error: "Failed to delete the linked partner record.", failedStep: "delete_partner" },
        { status: 500 }
      );
    }
  }

  const { error: appDeleteError } = await adminSupabase
    .from("partner_applications")
    .delete()
    .eq("id", id);

  if (appDeleteError) {
    console.error("Application delete error:", appDeleteError);
    return NextResponse.json(
      { error: "Failed to delete the application.", failedStep: "delete_application" },
      { status: 500 }
    );
  }

  // Also remove the Supabase Auth account, if one was created on approval —
  // otherwise the email stays "already registered" and can never be
  // re-applied/re-approved.
  const authUserId = app.auth_user_id || partner?.auth_user_id;
  if (authUserId) {
    const { error: authDeleteError } = await adminSupabase.auth.admin.deleteUser(authUserId);
    if (authDeleteError) {
      console.error("Auth user delete error:", authDeleteError);
      revalidatePath("/admin/partner-applications");
      revalidatePath("/admin/referrals");
      return NextResponse.json(
        {
          error: "The application and its records were deleted, but the linked login account could not be removed.",
          failedStep: "delete_auth_user",
        },
        { status: 500 }
      );
    }
  }

  revalidatePath("/admin/partner-applications");
  revalidatePath("/admin/referrals");

  return NextResponse.json({ ok: true });
}

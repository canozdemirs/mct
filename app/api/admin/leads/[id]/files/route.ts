import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admin";
import type { ReferralFile } from "@/types";

const MAX_FILES = 5;
const BUCKET = "mct-patient-files";

// Admin-only uploads for MCT-direct patients (reports, photos) -- a
// dedicated private bucket, separate from the partner-scoped
// "referral-files" bucket, with no storage RLS policy at all: every
// read/write here goes through this service-role route, gated by the
// ADMIN_EMAILS check below, exactly like leads/deleted_records_log have
// no authenticated-role access either. Unlike referral-form.tsx (where
// the PARTNER's own session uploads directly to storage under their own
// RLS policy), there's no equivalent client-side path for admin here by
// design -- the browser never talks to this bucket directly.
async function requireAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user && ADMIN_EMAILS.includes(user.email ?? "") ? user : null;
}

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const adminSupabase = adminClient();

  const { data: lead, error: leadError } = await adminSupabase.from("leads").select("files").eq("id", id).single();
  if (leadError || !lead) {
    return NextResponse.json({ error: "Patient not found." }, { status: 404 });
  }

  const existingFiles: ReferralFile[] = lead.files ?? [];
  if (existingFiles.length >= MAX_FILES) {
    return NextResponse.json({ error: `A patient can have at most ${MAX_FILES} files.` }, { status: 400 });
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const originalName = "name" in file && typeof file.name === "string" ? file.name : "file";
  const path = `${id}/${Date.now()}-${originalName}`.replace(/\s+/g, "_");

  const { error: uploadError } = await adminSupabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "application/octet-stream",
  });

  if (uploadError) {
    console.error("Patient file upload error:", uploadError);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }

  const newFile: ReferralFile = { name: originalName, path, size: file.size, type: file.type || "application/octet-stream" };
  const updatedFiles = [...existingFiles, newFile];

  const { error: updateError } = await adminSupabase.from("leads").update({ files: updatedFiles }).eq("id", id);
  if (updateError) {
    console.error("Patient file list update error:", updateError);
    await adminSupabase.storage.from(BUCKET).remove([path]);
    return NextResponse.json({ error: "Failed to save file reference." }, { status: 500 });
  }

  revalidatePath(`/admin/leads/${id}`);

  return NextResponse.json({ ok: true, files: updatedFiles });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const path = req.nextUrl.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "No file path provided." }, { status: 400 });
  }

  const adminSupabase = adminClient();
  const { data: lead, error: leadError } = await adminSupabase.from("leads").select("files").eq("id", id).single();
  if (leadError || !lead) {
    return NextResponse.json({ error: "Patient not found." }, { status: 404 });
  }

  const existingFiles: ReferralFile[] = lead.files ?? [];
  const updatedFiles = existingFiles.filter((f) => f.path !== path);

  const { error: updateError } = await adminSupabase.from("leads").update({ files: updatedFiles }).eq("id", id);
  if (updateError) {
    console.error("Patient file list update error:", updateError);
    return NextResponse.json({ error: "Failed to remove file reference." }, { status: 500 });
  }

  await adminSupabase.storage.from(BUCKET).remove([path]);

  revalidatePath(`/admin/leads/${id}`);

  return NextResponse.json({ ok: true, files: updatedFiles });
}

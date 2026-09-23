import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Your session has expired. Please use your invitation link again." },
      { status: 401 }
    );
  }

  const { password } = await req.json() as { password?: string };

  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await adminSupabase.auth.admin.updateUserById(user.id, { password });

  if (error) {
    console.error("Set password error:", error);
    return NextResponse.json({ error: error.message || "Failed to set password." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

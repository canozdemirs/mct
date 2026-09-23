import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: partner } = await adminSupabase
    .from("partners")
    .select("status")
    .eq("auth_user_id", user.id)
    .single();

  if (!partner) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({ found: true, status: partner.status });
}

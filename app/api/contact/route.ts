import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const body = await req.json();
  const { name, contactMethod, contactValue, summary } = body as {
    name: string;
    contactMethod: "whatsapp" | "email";
    contactValue: string;
    summary: string;
  };

  if (!name || !contactValue || !summary) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "MCT Cost Calculator <noreply@medicalcenterturkey.com>",
    to: "hello@medicalcenterturkey.com",
    subject: `New enquiry from ${name} (via Cost Calculator)`,
    text: [
      `Name: ${name}`,
      `Contact method: ${contactMethod}`,
      `Contact: ${contactValue}`,
      "",
      summary,
    ].join("\n"),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

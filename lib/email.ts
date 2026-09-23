import nodemailer from "nodemailer";

const FROM = "Medical Center Turkey <hello@medicalcenterturkey.com>";

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_APP_PASSWORD } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_APP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for 465 (implicit TLS), false for 587 (STARTTLS)
    auth: {
      user: SMTP_USER,
      pass: SMTP_APP_PASSWORD,
    },
  });
}

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}) {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn("SMTP not configured — skipping email:", opts.subject);
    return;
  }

  try {
    await transporter.sendMail({
      from: FROM,
      to: opts.to,
      replyTo: opts.replyTo,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
  } catch (err) {
    console.error("Email send exception:", opts.subject, err);
  }
}

const REFERRAL_STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  consultation: "Consultation",
  treatment_planned: "Treatment Planned",
  treatment_completed: "Treatment Completed",
  cancelled_lost: "Cancelled / Lost",
};

const REFERRAL_STATUS_MESSAGES: Record<string, string> = {
  new: "Your referral has been received and is awaiting review by our team.",
  contacted: "Our team has contacted the patient to begin the coordination process.",
  consultation: "The patient is now in the consultation stage with our medical team.",
  treatment_planned: "A treatment plan has been prepared for the patient.",
  treatment_completed: "The patient's treatment has been completed. Thank you for your referral.",
  cancelled_lost: "This referral has been marked as cancelled/lost. Contact us if you have questions.",
};

export function buildReferralStatusEmail(opts: {
  patientName: string;
  referralId: string;
  status: string;
}) {
  const label = REFERRAL_STATUS_LABELS[opts.status] ?? opts.status;
  const message = REFERRAL_STATUS_MESSAGES[opts.status] ?? "";

  return {
    subject: `Referral Update: ${opts.patientName} — ${label}`,
    text: [
      `Dear Partner,`,
      "",
      `The status of your referral for ${opts.patientName} has been updated to: ${label}.`,
      "",
      message,
      "",
      `Referral Reference: ${opts.referralId}`,
      "",
      "You can view the full details in your Partner Portal.",
      "",
      "Warm regards,",
      "Medical Center Turkey — Partner Relations",
    ].join("\n"),
  };
}

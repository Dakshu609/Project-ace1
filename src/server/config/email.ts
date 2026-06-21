import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not defined - email functionality disabled");
}

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || "noreply@projectace.com",
  appName: "Project Ace",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.log("Email service not configured, skipping:", { to, subject });
    return { success: false, error: "Email service not configured" };
  }

  try {
    await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: String(error) };
  }
}

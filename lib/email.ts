import nodemailer, { type Transporter } from "nodemailer";

/**
 * Provider-agnostic SMTP mailer for transactional auth emails (verification +
 * reset). Works with any SMTP server — a dedicated Gmail, Brevo, Mailgun, etc.
 * — so the sender identity lives only in env, never in code or the repo.
 *
 * Env:
 *   SMTP_HOST  - e.g. "smtp.gmail.com" (Gmail) or "smtp-relay.brevo.com"
 *   SMTP_PORT  - 587 (STARTTLS, default) or 465 (implicit TLS)
 *   SMTP_USER  - SMTP username (the dedicated mailbox / API login)
 *   SMTP_PASS  - SMTP password / app password / API key
 *   SMTP_FROM  - "ResumeAI <resumeai.mailer@gmail.com>" shown to recipients
 *
 * If SMTP is not configured, sends are skipped and the link is logged so local
 * verification/reset still works without crashing the request.
 */

const FROM = process.env.SMTP_FROM ?? "ResumeAI <no-reply@example.com>";

let transporter: Transporter | null = null;

function getTransport(): Transporter | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  if (!transporter) {
    const port = Number(SMTP_PORT ?? 587);
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

/** Absolute base URL for building links inside emails. */
export function getAppUrl(): string {
  const fromEnv =
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  return (fromEnv ?? "http://localhost:3000").replace(/\/$/, "");
}

async function send(to: string, subject: string, html: string) {
  const transport = getTransport();
  if (!transport) {
    // SMTP not configured: don't fail the flow, surface the link in logs so the
    // developer can complete verification/reset locally.
    console.warn(
      `[email] SMTP not configured — skipping send to ${to}. Subject: ${subject}`
    );
    return;
  }
  try {
    await transport.sendMail({ from: FROM, to, subject, html });
  } catch (error: any) {
    // Log but do not leak provider detail to the caller.
    console.error(`[email] send failed: ${error?.message ?? error}`);
    throw new Error("Failed to send email");
  }
}

function layout(title: string, body: string, cta: { href: string; label: string }) {
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#0f172a">
    <h1 style="font-size:20px;font-weight:800">ResumeAI</h1>
    <h2 style="font-size:16px;margin-top:24px">${title}</h2>
    <p style="font-size:14px;color:#475569;line-height:1.6">${body}</p>
    <a href="${cta.href}" style="display:inline-block;margin-top:16px;padding:10px 20px;background:#1d4ed8;color:#fff;text-decoration:none;border-radius:9999px;font-weight:600;font-size:14px">${cta.label}</a>
    <p style="font-size:12px;color:#94a3b8;margin-top:24px">If the button does not work, paste this link into your browser:<br>${cta.href}</p>
    <p style="font-size:12px;color:#94a3b8">If you did not request this, you can safely ignore this email.</p>
  </div>`;
}

export async function sendVerificationEmail(to: string, token: string) {
  const href = `${getAppUrl()}/verify-email?token=${encodeURIComponent(token)}`;
  await send(
    to,
    "Verify your ResumeAI email",
    layout(
      "Confirm your email",
      "Click the button below to verify your email address and activate your account. This link expires in 24 hours.",
      { href, label: "Verify email" }
    )
  );
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const href = `${getAppUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  await send(
    to,
    "Reset your ResumeAI password",
    layout(
      "Reset your password",
      "Click the button below to choose a new password. This link expires in 1 hour. If you didn't ask to reset your password, ignore this email.",
      { href, label: "Reset password" }
    )
  );
}

/**
 * Website enquiry handler — Vercel Serverless Function.
 *
 * Every contact/quote form on this site POSTs here. We email the enquiry to
 * the business through the configured provider (api/_email.js), then
 * redirect the visitor to /thank-you/.
 *
 * Lives at `api/enquiry.js` (repo root) — Vercel deploys it as a function
 * alongside the static `dist/` output. Zero dependencies (uses global fetch).
 *
 * Reads EMAIL_PROVIDER ("resend" — the default — or "sendgrid"), the
 * matching key (RESEND_API_KEY / SENDGRID_API_KEY), and CONTACT_TO_EMAIL /
 * CONTACT_FROM_EMAIL from the Vercel environment. Goober sets these when you
 * save the Email launch item. Every value falls back to what was baked in at
 * scaffold time, so the form keeps working even before that item is set up.
 * The key is NEVER committed.
 *
 * `_smoke: true` in the body short-circuits the redirect (used by the
 * Launch panel's smoke test) — it still sends a real test email when a
 * provider key is configured, so you can confirm delivery end to end.
 */
import { sendEmail } from "./_email.js";

const BUSINESS_NAME = "Bond Design Studio";
const FALLBACK_TO = "hello@bonddesignstudio.com.au";
const FALLBACK_FROM_EMAIL = "noreply@goober.com.au";
const THANK_YOU = "/thank-you/";

function esc(v) {
  return String(v == null ? "" : v).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  // Vercel parses urlencoded / JSON bodies into req.body for Node functions.
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const isSmoke = body._smoke === true;

  // Honeypot: real users leave `_gotcha` empty; bots fill it. Pretend success.
  if (body._gotcha) return res.redirect(303, THANK_YOU);

  const name = (body.name || "").toString().trim();
  const email = (body.email || "").toString().trim();
  const phone = (body.phone || "").toString().trim();
  const message = (body.message || body.enquiry || "").toString().trim();
  // Qualifying fields from the contact form. Suburb and project type tell the
  // studio more before the first call than anything else on the form.
  const suburb = (body.suburb || "").toString().trim();
  const projectType = (body.project_type || "").toString().trim();
  const budget = (body.budget || "").toString().trim();

  const to = process.env.CONTACT_TO_EMAIL || FALLBACK_TO;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || FALLBACK_FROM_EMAIL;
  const from = `${BUSINESS_NAME} <${fromEmail}>`;

  const subject = isSmoke
    ? `[Goober smoke test] ${BUSINESS_NAME}`
    : `New website enquiry${name ? ` from ${name}` : ""}`;

  const lines = isSmoke
    ? [
        `Smoke test from the ${BUSINESS_NAME} enquiry function.`,
        "",
        "If you received this, email is wired up correctly.",
      ]
    : [
        `New enquiry from the ${BUSINESS_NAME} website:`,
        "",
        `Name:    ${name || "Not provided"}`,
        `Email:   ${email || "Not provided"}`,
        `Phone:   ${phone || "Not provided"}`,
        `Suburb:  ${suburb || "Not provided"}`,
        `Project: ${projectType || "Not provided"}`,
        `Budget:  ${budget || "Not provided"}`,
        "",
        "Message:",
        message || "(no message)",
      ];

  let sendResult = { ok: false, skipped: true };
  try {
    sendResult = await sendEmail({
      from,
      to,
      replyTo: email || undefined,
      subject,
      text: lines.join("\n"),
      html: `<p>${lines.map(esc).join("<br>")}</p>`,
    });
    if (!sendResult.ok) {
      console.error("[enquiry] send failed:", sendResult.reason || sendResult.status || "no provider key set");
    }
  } catch (e) {
    // Never block the visitor on a mail failure — log and still say thanks.
    console.error("[enquiry] send failed:", e);
  }

  if (isSmoke) {
    return res.status(200).json({ ok: true, smoke: true, emailed: !!sendResult.ok });
  }

  return res.redirect(303, THANK_YOU);
}

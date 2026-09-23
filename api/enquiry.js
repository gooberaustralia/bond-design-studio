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

const CONNECTOR_ENDPOINT = process.env.GOOBER_CONNECTOR_ENDPOINT || "https://adwords.goober.com.au/api";

/**
 * Forward the enquiry to the Goober CRM connector.
 *
 * Never throws and never blocks the visitor: the email in the caller is the
 * guaranteed delivery path, and this is the nice-to-have on top. A missing
 * connector env, a 500 from the CRM or a network timeout all resolve to a
 * reason string that gets logged and, on a smoke test, reported back.
 */
async function forwardToCrm(lead) {
  const id = process.env.GOOBER_CONNECTOR_ID;
  const key = process.env.GOOBER_CONNECTOR_KEY;
  if (!id || !key) return { ok: false, skipped: "connector not configured" };

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const r = await fetch(`${CONNECTOR_ENDPOINT}/enquiries/${id}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...lead, key }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!r.ok) return { ok: false, reason: `crm responded ${r.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.name === "AbortError" ? "crm timed out" : String(e.message || e) };
  }
}

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
  let attribution = null;
  try {
    const raw = JSON.parse((body.attribution || "null").toString().slice(0, 2000));
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      attribution = {};
      for (const key of ["gclid", "wbraid", "gbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "lp"]) {
        if (typeof raw[key] === "string") attribution[key] = raw[key].slice(0, 200);
      }
    }
  } catch (_) {}

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

  // CRM first, email second, and the email is sent whatever the CRM did.
  const crmResult = isSmoke
    ? await forwardToCrm({ name: "Goober smoke test", email: "smoke@goober.com.au", message: "Connector smoke test", source: "smoke_test" })
    : await forwardToCrm({
        name,
        email,
        phone,
        message,
        source: `website_form:${(req.headers && req.headers.referer) || "/contact"}`,
        fields: { suburb, project_type: projectType, budget },
        meta: attribution ? { attr: attribution } : undefined,
      });
  if (!crmResult.ok) {
    console.error("[enquiry] crm forward:", crmResult.reason || crmResult.skipped);
  }

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
    return res.status(200).json({
      ok: true,
      smoke: true,
      emailed: !!sendResult.ok,
      crm: crmResult.ok ? "ok" : crmResult.reason || crmResult.skipped || "failed",
    });
  }

  if (!crmResult.ok && !sendResult.ok) {
    return res.status(503).send("Your enquiry could not be sent. Please try again or contact Bond Design Studio directly.");
  }

  res.setHeader("Set-Cookie", "bond_enquiry_completed=1; Path=/; Max-Age=300; SameSite=Lax; Secure");
  return res.redirect(303, THANK_YOU);
}

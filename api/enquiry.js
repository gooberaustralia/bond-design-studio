/** Server-only form relay. The CRM owns delivery and all enquiry emails. */
import { randomUUID } from 'node:crypto';

const THANK_YOU = '/thank-you/';
const ATTR_KEYS = ['gclid', 'wbraid', 'gbraid', 'fbclid', 'msclkid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'lp'];
const text = (value) => typeof value === 'string' ? value.trim() : '';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
  const json = (req.headers?.accept || '').includes('application/json');
  const fail = (status, error) => json ? res.status(status).json({ ok: false, error }) : res.status(status).send(error);
  // Keep the existing honeypot response, without an accepted-enquiry cookie.
  if (body._gotcha || body._hp) return json ? res.status(200).json({ ok: true }) : res.redirect(303, THANK_YOU);

  const name = text(body.name), email = text(body.email), phone = text(body.phone);
  const message = text(body.message || body.enquiry);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(400, 'Please provide your name and a valid email address.');
  const fields = { suburb: text(body.suburb), project_type: text(body.project_type), budget: text(body.budget) };
  if (name.length > 200 || email.length > 200 || phone.length > 50 || message.length > 5000 || Object.values(fields).some(v => v.length > 2000)) {
    return fail(400, 'Your enquiry is too long. Please shorten it and try again.');
  }
  let attribution = {};
  try {
    const raw = typeof body.attribution === 'string' ? JSON.parse(body.attribution.slice(0, 6000)) : body.attribution;
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      for (const key of ATTR_KEYS) if (typeof raw[key] === 'string') attribution[key] = raw[key].slice(0, 500);
    }
  } catch (_) {}
  const submissionId = text(body.idempotency_key) || randomUUID();
  if (!/^[A-Za-z0-9._:-]{1,100}$/.test(submissionId)) return fail(400, 'Please reload the form and try again.');
  const endpoint = process.env.GOOBER_FORM_WEBHOOK_URL;
  if (!endpoint) return fail(503, 'Your enquiry could not be sent. Please try again or contact Bond Design Studio directly.');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        name, email, phone, message, fields, attribution,
        form_title: 'Request a free consultation',
        idempotency_key: submissionId,
        meta: { page: '/contact/', attr: attribution },
      }),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.ok !== true) return fail(503, 'Your enquiry could not be sent. Please try again or contact Bond Design Studio directly.');
  } catch (_) {
    return fail(503, 'Your enquiry could not be sent. Please try again or contact Bond Design Studio directly.');
  } finally {
    clearTimeout(timeout);
  }

  res.setHeader('Set-Cookie', 'bond_enquiry_completed=1; Path=/; Max-Age=300; SameSite=Lax; Secure');
  return json ? res.status(200).json({ ok: true }) : res.redirect(303, THANK_YOU);
}

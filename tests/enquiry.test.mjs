import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import enquiry from '../api/enquiry.js';
import contact from '../api/contact.js';
import lead from '../api/lead.js';
const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; delete process.env.GOOBER_FORM_WEBHOOK_URL; });
const valid = { name: 'Goober Test', email: 'info@goober.com.au', message: 'goober testing forms', suburb: 'Sydney', project_type: 'Renovation or extension', budget: 'Still working it out', idempotency_key: 'bond-test-local-20261118' };
function response() {
  return { headers: {}, statusCode: 200, setHeader(k, v) { this.headers[k] = v; }, status(n) { this.statusCode = n; return this; }, json(v) { this.body = v; return this; }, send(v) { this.body = v; return this; }, redirect(n, v) { this.statusCode = n; this.headers.Location = v; return this; } };
}
async function run(body = valid, handler = enquiry, method = 'POST') {
  const res = response(); await handler({ method, headers: {}, body }, res); return res;
}
function mock(result, status = 200) {
  process.env.GOOBER_FORM_WEBHOOK_URL = 'https://crm.test/form';
  const calls = []; global.fetch = async (url, options) => { calls.push({ url, ...options, body: JSON.parse(options.body) }); return new Response(JSON.stringify(result), { status }); }; return calls;
}
test('validated enquiry reaches CRM once with all qualifying fields and attribution, then redirects', async () => {
  const calls = mock({ ok: true });
  const res = await run({ ...valid, phone: '0499023908', attribution: JSON.stringify({ gclid: 'local-click', utm_campaign: 'local-test', bad: 'drop' }) });
  assert.equal(res.statusCode, 303); assert.equal(res.headers.Location, '/thank-you/'); assert.match(res.headers['Set-Cookie'], /bond_enquiry_completed=1/);
  assert.equal(calls.length, 1); assert.equal(calls[0].url, process.env.GOOBER_FORM_WEBHOOK_URL);
  assert.deepEqual(calls[0].body.fields, { suburb: 'Sydney', project_type: valid.project_type, budget: valid.budget });
  assert.deepEqual(calls[0].body.attribution, { gclid: 'local-click', utm_campaign: 'local-test' });
  assert.equal(calls[0].body.form_title, 'Request a free consultation'); assert.equal(calls[0].body.idempotency_key, valid.idempotency_key);
  assert.equal(calls[0].body.message, 'goober testing forms'); assert.equal(calls[0].body.phone, '0499023908');
});
test('CRM deduplication is an accepted response', async () => { mock({ ok: true, deduped: true }); assert.equal((await run()).statusCode, 303); });
test('missing environment fails closed', async () => { global.fetch = () => { throw Error('Must not call'); }; const res = await run(); assert.equal(res.statusCode, 503); assert.equal(res.headers['Set-Cookie'], undefined); });
test('CRM rejection, 500 and invalid JSON never produce success', async () => {
  for (const [result, status] of [[{ ok: false }, 200], [{ ok: false }, 500], ['invalid', 200]]) {
    mock(result, status); const res = await run(); assert.equal(res.statusCode, 503); assert.equal(res.headers['Set-Cookie'], undefined); assert.equal(res.headers.Location, undefined);
  }
});
test('network or timeout failure never produces success', async () => {
  process.env.GOOBER_FORM_WEBHOOK_URL = 'https://crm.test/form';
  for (const name of ['TypeError', 'AbortError']) { global.fetch = async () => { const error = new Error(); error.name = name; throw error; }; const res = await run(); assert.equal(res.statusCode, 503); assert.equal(res.headers['Set-Cookie'], undefined); }
});
test('honeypot skips delivery and conversion cookie', async () => { const calls = mock({ ok: true }); const res = await run({ ...valid, _gotcha: 'bot' }); assert.equal(res.statusCode, 303); assert.equal(calls.length, 0); assert.equal(res.headers['Set-Cookie'], undefined); });
test('invalid fields and submission ids never deliver', async () => { const calls = mock({ ok: true }); for (const body of [{ ...valid, name: '' }, { ...valid, email: 'bad' }, { ...valid, message: 'x'.repeat(5001) }, { ...valid, idempotency_key: 'bad value' }]) assert.equal((await run(body)).statusCode, 400); assert.equal(calls.length, 0); });
test('compatibility routes use CRM relay and JSON success', async () => { const calls = mock({ ok: true }); for (const handler of [contact, lead]) { const res = await run(valid, handler); assert.equal(res.statusCode, 200); assert.deepEqual(res.body, { ok: true }); } assert.equal(calls.length, 2); });
test('GET is rejected without submission', async () => { const calls = mock({ ok: true }); assert.equal((await run(valid, enquiry, 'GET')).statusCode, 405); assert.equal(calls.length, 0); });

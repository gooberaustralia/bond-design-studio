// Compatibility endpoint. All enquiries use the same CRM-only delivery path.
import enquiry from './enquiry.js';
export default function handler(req, res) {
  req.headers = { ...req.headers, accept: 'application/json' };
  return enquiry(req, res);
}

/**
 * The platform's notices for one airline, as the lines to show on a waybill form.
 *
 * F16s staff file a notice under an airline's two-letter code (superadmin → Settings). Nothing showed them to the
 * people filling in a waybill for that airline (found 2026-11-16), which is who they are written for.
 *
 * @param {Array<{carrier_code: string, user_notice_1: string}>} notices as `GET /user/get-notice` answers
 * @param {string} code the airline's two-letter code, any case
 * @returns {string[]} one entry per notice, in the order filed; empty when there is none
 */
export function noticesFor(notices, code) {
  const wanted = String(code || "").trim().toUpperCase();

  if (!wanted || !Array.isArray(notices)) return [];

  return notices
    .filter((n) => n && String(n.carrier_code || "").trim().toUpperCase() === wanted)
    .map((n) => String(n.user_notice_1 || "").trim())
    .filter(Boolean);
}

export default noticesFor;

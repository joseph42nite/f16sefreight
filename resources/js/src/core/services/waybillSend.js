/**
 * What to tell the person after a master or house waybill is saved or sent (frontend audit 2026-11-15, FW1).
 *
 * 🔴 Both screens printed "Saved in database -Pass" on any 200 and never read `send_response`, which is where the
 * server says whether the airline's gateway took the message. A refused Send looked like a success. And only a 422
 * carrying an `errors` object was shown: every other refusal left the screen blank.
 *
 * The error strings are HTML (the screens show them with `v-html`), so anything from the server is escaped here.
 */
const escapeHtml = (text) =>
  String(text == null ? "" : text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/**
 * @param {string} status  what was asked for: "send", "draft" or "generate_pdf"
 * @param {object} data    the response body: `{ data, send_response }`
 * @param {string} label   "e-AWB" or "e-HSWB"
 * @returns {{ success: string, error: string }} exactly one of the two is filled
 */
export function saveOutcome(status, data, label) {
  if (status !== "send") {
    return { success: `-${label} Saved in database -Pass`, error: "" };
  }

  const reply = (data && data.send_response) || {};
  const tid = reply.data && reply.data.tid;

  if (reply.status === "success" && tid) {
    return { success: `-${label} Sent to the airline -Pass`, error: "" };
  }

  const why = reply.error || "The airline gateway did not confirm it.";

  return { success: "", error: `NOT SENT to the airline. ${escapeHtml(why)}<br>The waybill itself is saved.` };
}

/**
 * @param {object} error    what axios rejected with
 * @param {function} format tidies one validation message (the master screen has its own wording rules)
 * @returns {string} HTML; never empty
 */
export function failureMessage(error, format = (message) => message) {
  const response = error && error.response;

  if (!response) {
    return "The server could not be reached, so nothing was saved or sent. Check the connection and try again.";
  }

  const body = response.data || {};

  if (response.status === 422 && body.errors && Object.keys(body.errors).length > 0) {
    return Object.keys(body.errors)
      .map((field) => `${escapeHtml(format([].concat(body.errors[field])[0]))}<br>`)
      .join("");
  }

  const said = typeof body.message === "string" && body.message ? body.message : typeof body.error === "string" ? body.error : "";

  // A 500 carries the framework's own wording ("Server Error"), which tells the person nothing.
  if (said && response.status < 500) {
    return escapeHtml(said);
  }

  return `Nothing was saved or sent: the server answered with an error (${response.status}). Try again; if it keeps happening, tell support.`;
}

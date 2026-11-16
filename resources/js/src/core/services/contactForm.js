/**
 * Turns one of the website's three contact forms into what `POST /api/contact` takes (frontend audit, FA1).
 *
 * The server keeps five things: first name, last name, email, phone, message, and wants all five. The forms ask for
 * different things (a company, a designation, a ticket number), so everything else goes into the message, labelled,
 * where the staff who read the contacts list will see it.
 *
 * @param {string} kind   what the form is, e.g. "Quote request"
 * @param {object} form   { name, email, phone?, message?, ...rest }
 * @param {object} labels label for each extra field, in the order to print them
 */
export function contactPayload(kind, form, labels = {}) {
  const words = String(form.name || "").trim().split(/\s+/).filter(Boolean);
  const extras = Object.keys(labels)
    .filter((key) => form[key] !== undefined && form[key] !== null && String(form[key]).trim() !== "")
    .map((key) => `${labels[key]}: ${String(form[key]).trim()}`);

  return {
    first_name: words[0] || "",
    // One-word names are real; the server requires something here.
    last_name: words.slice(1).join(" ") || "-",
    email: String(form.email || "").trim(),
    phone: String(form.phone || "").trim() || "Not given",
    message: [`[${kind}]`, ...extras, String(form.message || "").trim()].filter(Boolean).join("\n"),
  };
}

/** The first thing the server objected to, or a plain sentence. */
export function contactError(error) {
  const response = error && error.response;
  const body = (response && response.data) || {};
  const first = body.errors && Object.values(body.errors)[0];

  if (first) return [].concat(first)[0];
  if (response && response.status === 429) return "Too many messages from here just now. Please try again in a minute.";

  return "Your message could not be sent. Please try again, or email us instead.";
}

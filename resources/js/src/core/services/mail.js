/**
 * What a page hands the server to send a mail (frontend audit, duplicates: "compose-and-send 4 times").
 *
 * The address split was written in eight places and the multipart form in four. FC3 came from that: the address
 * box took a comma or a semicolon, four of the senders split on the comma only, and "a@x.com; b@y.com" went out
 * as one address and was refused.
 */

/** The addresses in a typed line: a comma or a semicolon between them, as the address box itself accepts. */
export function addressList(text) {
  if (Array.isArray(text)) return text.map((a) => String(a || "").trim()).filter(Boolean);

  return String(text || "").split(/[,;]/).map((a) => a.trim()).filter(Boolean);
}

/**
 * The multipart form `/inbox/compose` and a conversation's `/reply` read. Multipart, because files go with it.
 * `to` and `cc` are typed lines (or lists); what a mail does not have is left out of the form.
 */
export function mailForm({ to, cc, subject, body, includeSignature = true, files = [], attachmentIds = [], mode, inReplyTo } = {}) {
  const form = new FormData();

  addressList(to).forEach((a) => form.append("to[]", a));
  addressList(cc).forEach((a) => form.append("cc[]", a));
  form.append("subject", subject === null || subject === undefined ? "" : subject);
  form.append("body", body === null || body === undefined ? "" : body);
  form.append("include_signature", includeSignature ? "1" : "0");
  if (mode) form.append("mode", mode);
  if (inReplyTo) form.append("in_reply_to", inReplyTo);
  attachmentIds.forEach((id) => form.append("attachment_ids[]", id));
  files.forEach((f) => form.append("files[]", f));

  return form;
}

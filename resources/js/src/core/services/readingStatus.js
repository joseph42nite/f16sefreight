/**
 * Where a document's reading stands, from what `/user/ocr-status/{id}` answers.
 *
 * The waybill forms' upload window knew three answers: still working, done, failed. The server has two more. A
 * scan with no readable text is parked at `awaiting_vision_consent` until somebody says whether to spend a credit
 * on reading it; the window never asked, so it sat on "Extracting…" for five minutes and then said the document
 * was taking too long. A reading can also be `cancelled`.
 *
 * The bill-of-lading reader (`BlReader.vue`) reads its answers here too: it did not know `cancelled` either, and
 * asked again every second and a half for as long as the page stayed open.
 */

/** How long a document may sit queued before the page says no worker seems to be running. */
export const QUEUED_TOO_LONG = 60000;

export function readingStep(answer) {
  const data = answer || {};

  switch (data.job_status) {
    case "completed":
      return { step: "done", data: data.data };
    case "awaiting_vision_consent":
      // The price goes with the question: a yes/no with no figure is not a decision.
      return { step: "consent", cost: Number(data.credit_cost) || 1, pages: Number(data.page_count) || null };
    case "failed":
      // `error` and `code` are the server's own, for a page that words a failure itself.
      return { step: "failed", why: "Parsing failure: " + (data.error || "Unknown engine error"), error: data.error || null, code: data.failure_code || null };
    case "cancelled":
      return { step: "failed", why: data.error || "This reading was cancelled.", error: data.error || null, code: "cancelled" };
    default:
      // `queued`: nothing has picked the document up yet. A page that waits long on this has no worker running.
      return { step: "working", message: data.job_status === "processing" ? "Extracting IATA fields..." : null, queued: data.job_status === "pending" };
  }
}

/** "1 credit, 3 pages": what the consent question says a yes costs. */
export function consentPrice(cost, pages) {
  const credits = `${cost} credit${cost === 1 ? "" : "s"}`;
  return pages ? `${credits}, ${pages} page${pages === 1 ? "" : "s"}` : credits;
}

/**
 * Where a document's reading stands, from what `/user/ocr-status/{id}` answers.
 *
 * The waybill forms' upload window knew three answers: still working, done, failed. The server has two more. A
 * scan with no readable text is parked at `awaiting_vision_consent` until somebody says whether to spend a credit
 * on reading it; the window never asked, so it sat on "Extracting…" for five minutes and then said the document
 * was taking too long. A reading can also be `cancelled`.
 */
export function readingStep(answer) {
  const data = answer || {};

  switch (data.job_status) {
    case "completed":
      return { step: "done", data: data.data };
    case "awaiting_vision_consent":
      // The price goes with the question: a yes/no with no figure is not a decision.
      return { step: "consent", cost: Number(data.credit_cost) || 1, pages: Number(data.page_count) || null };
    case "failed":
      return { step: "failed", why: "Parsing failure: " + (data.error || "Unknown engine error") };
    case "cancelled":
      return { step: "failed", why: data.error || "This reading was cancelled." };
    default:
      return { step: "working", message: data.job_status === "processing" ? "Extracting IATA fields..." : null };
  }
}

/** "1 credit, 3 pages": what the consent question says a yes costs. */
export function consentPrice(cost, pages) {
  const credits = `${cost} credit${cost === 1 ? "" : "s"}`;
  return pages ? `${credits}, ${pages} page${pages === 1 ? "" : "s"}` : credits;
}

import ExtractionPanel from "@/view/pages/freight/components/ExtractionPanel.vue";
import ApiService from "@/core/services/api.service";

jest.mock("@/core/services/api.service", () => ({ get: jest.fn(), post: jest.fn(), delete: jest.fn() }));

/**
 * GAPS #261 — a scan parks at `awaiting_vision_consent`, and the panel could only say "this panel cannot ask for
 * yet, use the paste box". The consent API existed; the row now asks, and nothing is spent until "Read it".
 */
const panel = (doc) => {
  const ctx = { documents: [doc], assignment: {}, now: Date.now(), ticker: null };
  Object.keys(ExtractionPanel.methods).forEach((m) => { ctx[m] = ExtractionPanel.methods[m].bind(ctx); });
  ctx.tick = jest.fn();
  return ctx;
};

const flush = () => new Promise((r) => setTimeout(r, 0));

describe("a scan's credit prompt in the Extraction panel", () => {
  beforeEach(() => { jest.useRealTimers(); ApiService.get.mockReset(); ApiService.post.mockReset(); });

  it("asks, instead of failing, when the parser finds no text layer", async () => {
    jest.useFakeTimers();
    ApiService.get.mockResolvedValue({ data: { job_status: "awaiting_vision_consent", page_count: 2, credit_cost: 1 } });
    const doc = { uid: 1, jobId: 9, state: "reading", startedAt: Date.now(), consent: null, error: null };
    const p = panel(doc);

    p.poll(1);
    jest.advanceTimersByTime(1000);
    jest.useRealTimers();
    await flush();

    expect(doc.state).toBe("consent");
    expect(doc.consent).toEqual({ pages: 2, cost: 1, busy: false });
    expect(doc.error).toBeNull();
    expect(ApiService.post).not.toHaveBeenCalled();
  });

  it("reads on once the operator approves the credit", async () => {
    ApiService.post.mockResolvedValue({ data: { job_status: "processing" } });
    const doc = { uid: 1, jobId: 9, state: "consent", consent: { pages: 2, cost: 1, busy: false }, error: null };
    const p = panel(doc);
    p.poll = jest.fn();

    p.answerConsent(1, "accept");
    await flush();

    expect(ApiService.post).toHaveBeenCalledWith("/user/ocr-consent/9", { decision: "accept" });
    expect(doc.state).toBe("reading");
    expect(doc.consent).toBeNull();
    expect(p.poll).toHaveBeenCalledWith(1);
  });

  it("spends nothing and points at the paste box when declined", async () => {
    ApiService.post.mockResolvedValue({ data: { job_status: "cancelled" } });
    const doc = { uid: 1, jobId: 9, state: "consent", consent: { pages: 2, cost: 1, busy: false }, error: null };
    const p = panel(doc);

    p.answerConsent(1, "decline");
    await flush();

    expect(ApiService.post).toHaveBeenCalledWith("/user/ocr-consent/9", { decision: "decline" });
    expect(doc.state).toBe("failed");
    expect(doc.error).toContain("no credit spent");
  });

  it("says why when the credit is refused", async () => {
    ApiService.post.mockRejectedValue({ response: { status: 422, data: { error: "The AI budget for this month is used up. No credit was spent." } } });
    const doc = { uid: 1, jobId: 9, state: "consent", consent: { pages: 2, cost: 1, busy: false }, error: null };
    const p = panel(doc);

    p.answerConsent(1, "accept");
    await flush();

    expect(doc.state).toBe("failed");
    expect(doc.error).toContain("AI budget");
  });
});

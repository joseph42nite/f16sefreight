import ExtractionPanel from "@/view/pages/freight/components/ExtractionPanel.vue";
import ApiService from "@/core/services/api.service";

jest.mock("@/core/services/api.service", () => ({ get: jest.fn(), post: jest.fn(), delete: jest.fn() }));

/**
 * Frontend audit, duplicates: "OCR upload-and-poll written three times". The inbox's extraction panel now reads
 * `/user/ocr-status` through `readingStatus.js`, as the waybill upload window and the bill-of-lading reader do.
 * Found doing it: a row that had said "waiting to start" kept saying so after a worker picked the document up.
 */
const WAITING = "waiting to start — the background worker does not seem to be running";

const panel = (doc) => {
  const ctx = { documents: [doc], assignment: {}, countries: [], now: Date.now(), ticker: null };
  Object.keys(ExtractionPanel.methods).forEach((m) => { ctx[m] = ExtractionPanel.methods[m].bind(ctx); });
  ctx.tick = jest.fn();
  return ctx;
};

const row = (more = {}) => ({ uid: 1, jobId: 9, state: "reading", startedAt: Date.now(), consent: null, error: null, warning: null, ...more });

/** Lets one check run: its timer, then the answer's promise chain. */
const oneCheck = async (ms = 1000) => {
  jest.advanceTimersByTime(ms);
  for (let i = 0; i < 6; i++) await Promise.resolve();
};

describe("the extraction panel waiting for a document to be read", () => {
  beforeEach(() => { jest.useFakeTimers(); ApiService.get.mockReset(); });
  afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

  it("says no worker seems to be running once a document has sat queued for a minute", async () => {
    ApiService.get.mockResolvedValue({ data: { job_status: "pending" } });
    const doc = row({ startedAt: Date.now() - 61000 });

    panel(doc).poll(1);
    await oneCheck();

    expect(doc.warning).toBe(WAITING);
    expect(doc.state).toBe("reading");
  });

  it("says nothing while a queued document is still inside its minute", async () => {
    ApiService.get.mockResolvedValue({ data: { job_status: "pending" } });
    const doc = row();

    panel(doc).poll(1);
    await oneCheck();

    expect(doc.warning).toBeNull();
  });

  it("takes the notice back when a worker picks the document up", async () => {
    ApiService.get.mockResolvedValueOnce({ data: { job_status: "pending" } }).mockResolvedValue({ data: { job_status: "processing" } });
    const doc = row({ startedAt: Date.now() - 61000 });

    panel(doc).poll(1);
    await oneCheck();
    expect(doc.warning).toBe(WAITING);

    await oneCheck(2000);
    expect(doc.warning).toBeNull();
    expect(doc.state).toBe("reading");
  });

  it("leaves another warning alone while the document is read", async () => {
    ApiService.get.mockResolvedValue({ data: { job_status: "processing" } });
    const doc = row({ warning: "something else" });

    panel(doc).poll(1);
    await oneCheck();

    expect(doc.warning).toBe("something else");
  });

  it("ends on a cancelled reading and stops asking", async () => {
    ApiService.get.mockResolvedValue({ data: { job_status: "cancelled" } });
    const doc = row();
    const p = panel(doc);
    p.fail = jest.fn((uid, why) => { doc.state = "failed"; doc.error = why; });

    p.poll(1);
    await oneCheck();
    await oneCheck(5000);

    expect(p.fail).toHaveBeenCalledWith(1, "could not be read");
    expect(ApiService.get).toHaveBeenCalledTimes(1);
  });

  it("gives a failure in the server's own words", async () => {
    ApiService.get.mockResolvedValue({ data: { job_status: "failed", error: "no pages in the file" } });
    const doc = row();
    const p = panel(doc);
    p.fail = jest.fn((uid, why) => { doc.state = "failed"; doc.error = why; });

    p.poll(1);
    await oneCheck();

    expect(p.fail).toHaveBeenCalledWith(1, "no pages in the file");
  });
});

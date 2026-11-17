/**
 * The waybill forms' upload window and a scan (found 2026-11-17 while comparing the two upload windows). The
 * server parks a document with no readable text at `awaiting_vision_consent`; the window never asked, so it sat
 * on "Extracting…" for five minutes and then said the document was taking too long.
 */
import OcrUploadModal from "@/view/components/OcrUploadModal.vue";
import ApiService from "@/core/services/api.service";
import { readingStep, consentPrice } from "@/core/services/readingStatus";

jest.mock("@/core/services/api.service", () => ({ get: jest.fn(), post: jest.fn() }));

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

/** The window's own methods over plain data: it does not mount in jest with its pop-up. */
function modal(data = {}) {
  const vm = {
    isUploading: true, ocrPollInterval: null, ocrJobId: 7, ocrStatusMessage: "", consent: null, deciding: false,
    selectedFile: { name: "scan.pdf" }, $refs: { fileInput: { value: "x" } }, $bvModal: { hide: jest.fn() },
    $emit: jest.fn(), ...data,
  };
  Object.keys(OcrUploadModal.methods).forEach((m) => { vm[m] = OcrUploadModal.methods[m].bind(vm); });
  return vm;
}

describe("readingStep", () => {
  it("knows a finished reading", () => {
    expect(readingStep({ job_status: "completed", data: { awb_number: "176-1" } })).toEqual({ step: "done", data: { awb_number: "176-1" } });
  });

  it("asks about a scan, with the price", () => {
    expect(readingStep({ job_status: "awaiting_vision_consent", credit_cost: 1, page_count: 3 })).toEqual({ step: "consent", cost: 1, pages: 3 });
    expect(readingStep({ job_status: "awaiting_vision_consent" })).toEqual({ step: "consent", cost: 1, pages: null });
  });

  it("ends on a failure or a cancellation, with the reason", () => {
    expect(readingStep({ job_status: "failed", error: "no pages" }).why).toBe("Parsing failure: no pages");
    expect(readingStep({ job_status: "cancelled" })).toEqual({ step: "failed", why: "This reading was cancelled." });
  });

  it("keeps waiting otherwise", () => {
    expect(readingStep({ job_status: "pending" })).toEqual({ step: "working", message: null });
    expect(readingStep({ job_status: "processing" }).message).toBe("Extracting IATA fields...");
    expect(readingStep(undefined).step).toBe("working");
  });

  it("words the price", () => {
    expect(consentPrice(1, 3)).toBe("1 credit, 3 pages");
    expect(consentPrice(2, 1)).toBe("2 credits, 1 page");
    expect(consentPrice(1, null)).toBe("1 credit");
  });
});

describe("the upload window", () => {
  beforeEach(() => {
    ApiService.get.mockReset();
    ApiService.post.mockReset();
    window.alert = jest.fn();
  });

  afterEach(() => { jest.useRealTimers(); });

  /** One poll: the timer fires once and the answer is read. */
  async function pollOnce(vm) {
    jest.useFakeTimers();
    vm.startOcrPolling(7);
    jest.advanceTimersByTime(800);
    jest.useRealTimers();
    await flush();
  }

  it("stops asking the server and asks the person when the document is a scan", async () => {
    ApiService.get.mockResolvedValue({ data: { job_status: "awaiting_vision_consent", credit_cost: 1, page_count: 2 } });
    const vm = modal();

    await pollOnce(vm);

    expect(vm.consent).toEqual({ cost: 1, pages: 2 });
    expect(vm.ocrPollInterval).toBeNull();
    expect(window.alert).not.toHaveBeenCalled();
    expect(vm.$emit).not.toHaveBeenCalled();
  });

  it("a yes sends the reading back to work", async () => {
    ApiService.post.mockResolvedValue({ data: { job_status: "processing" } });
    const vm = modal({ consent: { cost: 1, pages: 2 } });
    vm.startOcrPolling = jest.fn();

    vm.decide("accept");
    await flush();

    expect(ApiService.post).toHaveBeenCalledWith("/user/ocr-consent/7", { decision: "accept" });
    expect(vm.consent).toBeNull();
    expect(vm.startOcrPolling).toHaveBeenCalledWith(7);
    expect(vm.isUploading).toBe(true);
    expect(vm.deciding).toBe(false);
  });

  it("a no ends it and says nothing was charged", async () => {
    ApiService.post.mockResolvedValue({ data: { job_status: "cancelled" } });
    const vm = modal({ consent: { cost: 1, pages: 2 } });
    vm.startOcrPolling = jest.fn();

    vm.decide("decline");
    await flush();

    expect(vm.consent).toBeNull();
    expect(vm.isUploading).toBe(false);
    expect(vm.startOcrPolling).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith("The scan was not read. Nothing was charged.");
  });

  it("a refusal (no credits left) is said in the server's words", async () => {
    ApiService.post.mockRejectedValue({ response: { status: 422, data: { error: "Your OCR credit balance is exhausted." } } });
    const vm = modal({ consent: { cost: 1, pages: 2 } });

    vm.decide("accept");
    await flush();

    expect(window.alert).toHaveBeenCalledWith("Your OCR credit balance is exhausted.");
    expect(vm.isUploading).toBe(false);
  });

  it("a second click while the answer is on its way sends nothing", () => {
    const vm = modal({ consent: { cost: 1, pages: 2 }, deciding: true });
    vm.decide("accept");
    expect(ApiService.post).not.toHaveBeenCalled();
  });

  it("a cancelled reading stops the wait", async () => {
    ApiService.get.mockResolvedValue({ data: { job_status: "cancelled" } });
    const vm = modal();

    await pollOnce(vm);

    expect(vm.isUploading).toBe(false);
    expect(window.alert).toHaveBeenCalledWith("This reading was cancelled.");
  });

  it("a finished reading still fills the form", async () => {
    ApiService.get.mockResolvedValue({ data: { job_status: "completed", data: { awb_number: "176-1" } } });
    const vm = modal();

    await pollOnce(vm);

    expect(vm.$emit).toHaveBeenCalledWith("extracted", { awb_number: "176-1" });
    expect(vm.$bvModal.hide).toHaveBeenCalledWith("upload-file-modal");
    expect(vm.isUploading).toBe(false);
  });
});

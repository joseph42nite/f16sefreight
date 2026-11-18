import { mount } from "@vue/test-utils";
import BlReader from "@/view/pages/freight/components/BlReader.vue";
import ApiService from "@/core/services/api.service";

jest.mock("@/core/services/api.service", () => ({ get: jest.fn(), post: jest.fn() }));

/** A read BL, as SeaBillReading returns it: a value with a problem is never ticked. */
const BILL = {
  fields: [
    { key: "bl_number", label: "BL number", value: "MEDUBOM12345", read: "MEDUBOM12345", problem: null, apply: true },
    { key: "vessel_name", label: "Vessel", value: "MSC ANNA", read: "MSC ANNA", problem: null, apply: true },
    { key: "pod_code", label: "Port of discharge", value: null, read: "HAMBURG", problem: "No single UN/LOCODE", apply: false },
  ],
  containers: [
    { container_number: "MSCU1234566", seal_number: "887766", problem: null, apply: true },
    { container_number: "TGHU7654321", seal_number: null, problem: "Fails the ISO 6346 check digit", apply: false },
  ],
  parties: [],
};

const shown = async (props) => {
  const wrapper = mount(BlReader, { propsData: props });
  wrapper.vm.show({ bill: JSON.parse(JSON.stringify(BILL)) });
  await wrapper.vm.$nextTick();
  return wrapper;
};

describe("BlReader (guide Step 12.4)", () => {
  beforeEach(() => { ApiService.get.mockReset(); ApiService.post.mockReset(); });

  it("puts only the ticked, checked values into the form", async () => {
    const wrapper = await shown({ jobId: 7 });

    await wrapper.find(".fx-btn--primary").trigger("click");

    expect(wrapper.emitted("apply")[0][0]).toEqual({
      fields: { bl_number: "MEDUBOM12345", vessel_name: "MSC ANNA" },
      containers: [{ container_number: "MSCU1234566", seal_number: "887766" }],
    });
  });

  it("saves to a house's HBL, keeps the master's fields and adds to the containers already there", async () => {
    ApiService.get.mockResolvedValue({ data: {
      document: "house", from_master: ["vessel_name"], locking: { containers_enabled: true },
      containers: [{ container_number: "OOLU0000001", container_type: "40HC", seal_number: "1" }],
    } });
    ApiService.post.mockResolvedValue({ data: {} });
    const wrapper = await shown({ jobId: 7, mode: "save" });

    await wrapper.find(".fx-btn--primary").trigger("click");
    await new Promise((r) => setTimeout(r, 0));

    expect(ApiService.post).toHaveBeenCalledWith("/jobs/7/sea-shipment", {
      hbl_number: "MEDUBOM12345",
      containers: [
        { container_number: "OOLU0000001", container_type: "40HC", seal_number: "1" },
        { container_number: "MSCU1234566", seal_number: "887766" },
      ],
    });
    expect(wrapper.text()).toContain("Left as the master has them: vessel name");
  });
});

/**
 * Frontend audit §7 ("OCR upload-and-poll written three times"): the reader had its own copy of the status check,
 * and it did not know `cancelled`. It reads the answer through `readingStatus.js` now.
 */
describe("BlReader waiting for a reading", () => {
  const waitingOn = (answers) => {
    jest.useFakeTimers();
    ApiService.get.mockReset();
    answers.forEach((data) => ApiService.get.mockResolvedValueOnce({ data }));
    const wrapper = mount(BlReader, { propsData: { jobId: 7 } });
    wrapper.setData({ reading: 55, busy: true, startedAt: Date.now() });
    return wrapper;
  };
  const settle = async () => { for (let i = 0; i < 5; i++) await Promise.resolve(); };

  afterEach(() => jest.useRealTimers());

  it("asks again while the document is being read, then shows it", async () => {
    const wrapper = waitingOn([{ job_status: "processing" }, { job_status: "completed", bill: JSON.parse(JSON.stringify(BILL)) }]);

    wrapper.vm.poll();
    await settle();
    expect(wrapper.vm.busy).toBe(true);

    jest.advanceTimersByTime(1500);
    await settle();

    expect(ApiService.get).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.bill.fields).toHaveLength(3);
    expect(wrapper.vm.busy).toBe(false);
  });

  it("stops on a cancelled reading and says so", async () => {
    const wrapper = waitingOn([{ job_status: "cancelled" }]);

    wrapper.vm.poll();
    await settle();
    jest.advanceTimersByTime(60000);
    await settle();

    expect(ApiService.get).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.busy).toBe(false);
    expect(wrapper.text()).toContain("This reading was cancelled.");
  });

  it("words a failure as before", async () => {
    let wrapper = waitingOn([{ job_status: "failed", failure_code: "upgrade_required", error: "plan" }]);
    wrapper.vm.poll();
    await settle();
    expect(wrapper.vm.error).toBe("Reading documents with AI is on the Tactical plan.");

    wrapper = waitingOn([{ job_status: "failed", error: "The PDF is password protected." }]);
    wrapper.vm.poll();
    await settle();
    expect(wrapper.vm.error).toBe("The PDF is password protected.");

    wrapper = waitingOn([{ job_status: "failed" }]);
    wrapper.vm.poll();
    await settle();
    expect(wrapper.vm.error).toBe("The document could not be read.");
  });

  it("asks before a scan is read, with the price", async () => {
    const wrapper = waitingOn([{ job_status: "awaiting_vision_consent", page_count: 2, credit_cost: 1 }]);

    wrapper.vm.poll();
    await settle();

    expect(wrapper.vm.consent).toEqual({ pages: 2, cost: 1 });
    expect(wrapper.text()).toContain("This looks like a scan (2 page(s)). Read it with AI for 1 credit(s)?");
  });

  it("says so when the document has sat in the queue for a minute", async () => {
    const wrapper = waitingOn([{ job_status: "pending" }, { job_status: "pending" }, { job_status: "processing" }]);

    wrapper.vm.poll();
    await settle();
    expect(wrapper.vm.waiting).toBeNull();

    wrapper.setData({ startedAt: Date.now() - 61000 });
    jest.advanceTimersByTime(1500);
    await settle();
    expect(wrapper.text()).toContain("The background worker does not seem to be running.");

    // Picked up: the notice goes.
    jest.advanceTimersByTime(1500);
    await settle();
    expect(wrapper.vm.waiting).toBeNull();
  });
});

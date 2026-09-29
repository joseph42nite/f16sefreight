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

/**
 * Platform admin screens, mounted (2026-11-15 frontend audit, tests section: "nothing under pages/admin is tested").
 * The airline directory, the airline notices and the list helper every admin table shares.
 */
import { mount } from "@vue/test-utils";
import { Form } from "vform";
import ApiService from "@/core/services/api.service";
import AirlineDirectory from "@/view/pages/admin/AirlineDirectory.vue";
import Settings from "@/view/pages/admin/Settings.vue";
import adminList from "@/core/mixins/adminList.mixin";

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const refused = (status, data) => Object.assign(new Error("refused"), { response: { status, data } });
const airlines = [
  { id: 1, prefix: "176", code: "EK", name: "Emirates SkyCargo", domain: "emirates.test", country: "AE" },
  { id: 2, prefix: "020", code: "LH", name: "Lufthansa Cargo", domain: null, country: "DE" },
  { id: 3, prefix: "999", code: null, name: "No Code Air", domain: null, country: null },
];

beforeAll(() => { window.Form = Form; });
afterEach(() => jest.restoreAllMocks());

describe("the airline directory", () => {
  const open = async () => {
    const get = jest.spyOn(ApiService, "get").mockResolvedValue({ data: { data: airlines } });
    const wrapper = mount(AirlineDirectory);
    await flush();

    return { wrapper, get };
  };

  it("lists every airline, asking for the whole list (FA9)", async () => {
    const { wrapper, get } = await open();

    expect(get).toHaveBeenCalledWith("/superadmin/airlines?per_page=500&q=");
    expect(wrapper.findAll("tbody tr")).toHaveLength(3);
    expect(wrapper.text()).toContain("no domain — classifies nothing");
  });

  it("searches on the server", async () => {
    const { wrapper, get } = await open();

    await wrapper.find("input").setValue("luft hansa");
    await wrapper.findAll("button").at(0).trigger("click");

    expect(get).toHaveBeenLastCalledWith("/superadmin/airlines?per_page=500&q=luft%20hansa");
  });

  it("saves an edit to that airline and reloads", async () => {
    const { wrapper, get } = await open();
    const put = jest.spyOn(ApiService, "put").mockResolvedValue({ data: {} });

    await wrapper.findAll("tbody tr").at(1).find("button").trigger("click");
    await wrapper.find('input[placeholder="lhcargo.test"]').setValue("lufthansa-cargo.test");
    await wrapper.find("button.btn-primary:not(.ml-auto)").trigger("click");
    await flush();

    expect(put).toHaveBeenCalledWith("/superadmin/airlines/2", expect.objectContaining({ domain: "lufthansa-cargo.test", prefix: "020" }));
    expect(get).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.editing).toBeNull();
  });

  it("shows why a save was refused and keeps the form open", async () => {
    const { wrapper } = await open();
    jest.spyOn(ApiService, "post").mockRejectedValue(refused(422, { errors: { prefix: ["That prefix is taken."], name: ["A name is needed."] } }));

    await wrapper.find("button.ml-auto").trigger("click");
    await wrapper.find("button.btn-primary:not(.ml-auto)").trigger("click");
    await flush();

    expect(wrapper.text()).toContain("That prefix is taken. A name is needed.");
    expect(wrapper.vm.editing).toBe("new");
  });
});

describe("airline notices", () => {
  const open = async (notices = [{ carrier_code: "EK", user_notice_1: "Embargo on lithium." }]) => {
    jest.spyOn(ApiService, "get").mockImplementation((url) => Promise.resolve({
      data: url.includes("get-notice") ? notices : { data: airlines },
    }));
    const wrapper = mount(Settings);
    await flush();

    return wrapper;
  };

  it("offers the airlines that have a code, from the platform list (FA4)", async () => {
    const wrapper = await open();
    const offered = wrapper.findAll("select option").wrappers.map((o) => o.text());

    expect(offered).toEqual(["Select Airline", "EK — Emirates SkyCargo", "LH — Lufthansa Cargo"]);
    expect(wrapper.text()).toContain("Embargo on lithium.");
  });

  it("asks before deleting a carrier's notices, and does nothing on No (FA9)", async () => {
    const wrapper = await open();
    const post = jest.spyOn(ApiService, "post").mockResolvedValue({ data: {} });
    const confirm = jest.spyOn(window, "confirm").mockReturnValue(false);

    await wrapper.find("button.btn-danger").trigger("click");
    expect(confirm).toHaveBeenCalledWith("Delete every notice for EK?");
    expect(post).not.toHaveBeenCalled();

    confirm.mockReturnValue(true);
    await wrapper.find("button.btn-danger").trigger("click");
    expect(post).toHaveBeenCalledWith("/superadmin/delete-notice", { carrier_code: "EK" });
  });

  it("says when the airline list could not be loaded", async () => {
    jest.spyOn(ApiService, "get").mockImplementation((url) => (url.includes("get-notice")
      ? Promise.resolve({ data: [] })
      : Promise.reject(refused(500, null))));
    const wrapper = mount(Settings);
    await flush();

    expect(wrapper.find("[role=alert]").text()).toBe("The airline list could not be loaded.");
    expect(wrapper.text()).toContain("No airline notices configured yet.");
  });
});

describe("the helper every admin table shares", () => {
  const table = () => {
    const toast = jest.fn();
    const wrapper = mount({ mixins: [adminList], render: (h) => h("div") }, { mocks: { $bvToast: { toast } } });

    return { vm: wrapper.vm, toast };
  };

  it("loads rows and counts them", async () => {
    jest.spyOn(ApiService, "get").mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] });
    const { vm } = table();

    await vm.loadItems("/superadmin/all-company");

    expect(vm.items).toHaveLength(2);
    expect(vm.totalRows).toBe(2);
    expect(vm.isLoading).toBe(false);
  });

  it("says when loading failed instead of showing an empty table (FA8)", async () => {
    jest.spyOn(ApiService, "get").mockRejectedValue(refused(403, { message: "This action is unauthorized." }));
    const { vm, toast } = table();

    await vm.loadItems("/superadmin/all-company");

    expect(toast).toHaveBeenCalledWith("This action is unauthorized.", expect.objectContaining({ title: "The list could not be loaded" }));
    expect(vm.isLoading).toBe(false);
  });

  it("deletes only after a yes, and says when the delete was refused", async () => {
    const remove = jest.spyOn(ApiService, "delete").mockResolvedValue({});
    const confirm = jest.spyOn(window, "confirm").mockReturnValue(false);
    const { vm, toast } = table();

    await expect(vm.confirmRemove("/superadmin/user/9")).resolves.toBe(false);
    expect(remove).not.toHaveBeenCalled();

    confirm.mockReturnValue(true);
    await expect(vm.confirmRemove("/superadmin/user/9")).resolves.toBe(true);

    remove.mockRejectedValue(refused(422, { error: "This user still has open shipments." }));
    await expect(vm.confirmRemove("/superadmin/user/9")).resolves.toBe(false);
    expect(toast).toHaveBeenCalledWith("This user still has open shipments.", expect.objectContaining({ title: "Not deleted" }));
  });
});

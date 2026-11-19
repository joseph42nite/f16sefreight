/**
 * The company, branch and contact lists and the two system template pages, mounted (2026-11-15 frontend audit,
 * tests: "the other admin pages are untested").
 */
import { mount, createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import Swal from "sweetalert2";
import ApiService from "@/core/services/api.service";
import AllCompany from "@/view/pages/admin/AllCompany.vue";
import AllBranch from "@/view/pages/admin/AllBranch.vue";
import AllContacts from "@/view/pages/admin/AllContacts.vue";
import AllSystemTemplates from "@/view/pages/admin/AllSystemTemplates.vue";
import EditSystemTemplate from "@/view/pages/admin/EditSystemTemplate.vue";

jest.mock("sweetalert2", () => ({ fire: jest.fn() }));

const flush = async () => { for (let i = 0; i < 4; i++) await new Promise((resolve) => setTimeout(resolve, 0)); };
const refused = (status, data) => Object.assign(new Error("refused"), { response: { status, data } });
const link = { props: ["to"], template: '<a :data-to="to"><slot /></a>' };
const text = (wrapper) => wrapper.text().replace(/\s+/g, " ");

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const openList = async (page, answer) => {
  const get = jest.spyOn(ApiService, "get").mockReturnValue(answer);
  const wrapper = mount(page, { localVue, stubs: { RouterLink: link, SkeletonTable: true } });
  jest.spyOn(wrapper.vm.$bvToast, "toast").mockImplementation(() => {});
  await flush();

  return { wrapper, get };
};

afterEach(() => { jest.restoreAllMocks(); Swal.fire.mockReset(); });

describe("the company list", () => {
  const companies = [
    { id: 1, name: "focus air", code: "FOC", tier: "pro", outlook_approved_at: "2026-10-01T10:00:00Z" },
    { id: 2, name: "Kerala Lines", code: "KER", tier: null, outlook_approved_at: null },
  ];

  it("lists the companies with their plan and whether Outlook is approved", async () => {
    const { wrapper, get } = await openList(AllCompany, Promise.resolve({ data: companies }));
    const rows = wrapper.findAll("tbody tr");

    expect(get).toHaveBeenCalledWith("/superadmin/all-company/0");
    expect(rows).toHaveLength(2);
    expect(rows.at(0).text()).toContain("Pro");
    expect(rows.at(0).text()).toContain("Approved");
    expect(rows.at(1).text()).toContain("Not approved yet");
    expect(rows.at(1).find("a").attributes("data-to")).toBe("/superadmin/new-company/2");
    expect(text(wrapper)).toContain("Showing 1 to 2 of 2");
  });

  it("still draws a company that has no name", async () => {
    const { wrapper } = await openList(AllCompany, Promise.resolve({ data: [{ id: 3, name: null, code: "X" }] }));

    expect(wrapper.findAll("tbody tr")).toHaveLength(1);
    expect(wrapper.find(".symbol-label").text()).toBe("?");
  });

  it("counts from nought when the search matches nothing", async () => {
    const { wrapper } = await openList(AllCompany, Promise.resolve({ data: companies }));

    wrapper.setData({ filter: "no such company" });
    await flush();

    expect(text(wrapper)).toContain("Showing 0 to 0 of 0");

    wrapper.setData({ filter: "kerala" });
    await flush();

    expect(text(wrapper)).toContain("Showing 1 to 1 of 1");
  });

  it("says the list could not be loaded", async () => {
    const { wrapper } = await openList(AllCompany, Promise.reject(refused(500, { message: "Server Error" })));

    expect(wrapper.vm.$bvToast.toast).toHaveBeenCalledWith("Server Error", expect.objectContaining({ title: "The list could not be loaded" }));
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it("copies the approval link and marks the row", async () => {
    const { wrapper, get } = await openList(AllCompany, Promise.resolve({ data: companies }));
    const writeText = jest.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    get.mockResolvedValue({ data: { url: "https://login.example/consent" } });

    await wrapper.findAll("tbody tr").at(1).find("button").trigger("click");
    await flush();

    expect(get).toHaveBeenLastCalledWith("/superadmin/companies/2/outlook-approval-link");
    expect(writeText).toHaveBeenCalledWith("https://login.example/consent");
    expect(wrapper.findAll("tbody tr").at(1).find("button").text()).toBe("Link copied");
    expect(wrapper.findAll("tbody tr").at(0).find("button").text()).toBe("Copy approval link");
  });

  it("gives the server's reason when there is no link to copy", async () => {
    const { wrapper, get } = await openList(AllCompany, Promise.resolve({ data: companies }));
    get.mockRejectedValue(refused(503, { error: "Outlook is not set up on this server yet." }));

    wrapper.vm.copyApprovalLink(companies[0]);
    await flush();

    expect(wrapper.vm.$bvToast.toast).toHaveBeenCalledWith("Outlook is not set up on this server yet.", expect.objectContaining({ title: "The link was not copied" }));
    expect(wrapper.vm.copied).toBe(null);
  });

  it("does not blame the connection when the browser will not copy", async () => {
    const { wrapper, get } = await openList(AllCompany, Promise.resolve({ data: companies }));
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("NotAllowedError")) }, configurable: true });
    get.mockResolvedValue({ data: { url: "https://login.example/consent" } });

    wrapper.vm.copyApprovalLink(companies[0]);
    await flush();

    expect(wrapper.vm.$bvToast.toast).toHaveBeenCalledWith("This browser would not copy the link.", expect.anything());
    expect(wrapper.vm.copied).toBe(null);
  });
});

describe("the branch list", () => {
  const branches = [
    { id: 7, company_name: { name: "Focus Air" }, agent_name: "Focus Air Kochi", iata_agent_code: "14-3 1234", iata_agent_cass: "0011" },
    { id: 8, company_name: null, agent_name: "Orphan", iata_agent_code: null, iata_agent_cass: null },
  ];

  it("lists the branches under their company, one without a company included", async () => {
    const { wrapper, get } = await openList(AllBranch, Promise.resolve({ data: branches }));
    const rows = wrapper.findAll("tbody tr");

    expect(get).toHaveBeenCalledWith("/superadmin/all-branch/0");
    expect(rows).toHaveLength(2);
    expect(rows.at(0).text()).toContain("Focus Air");
    expect(rows.at(0).text()).toContain("14-3 1234");
    expect(rows.at(0).find("a").attributes("data-to")).toBe("/superadmin/new-branch/7");
    expect(rows.at(1).text()).toContain("Orphan");
  });

  it("says the list could not be loaded", async () => {
    const { wrapper } = await openList(AllBranch, Promise.reject(new Error("Network Error")));

    expect(wrapper.vm.$bvToast.toast).toHaveBeenCalledWith(expect.stringContaining("Could not reach the server"), expect.anything());
    expect(text(wrapper)).toContain("Showing 0 to 0 of 0");
  });
});

describe("the contact list", () => {
  const contacts = [{ id: 4, first_name: "Asha", last_name: "Nair", email: "asha@example.test", company: "Blue Cargo", designation: "Manager", phone: "0484", message: "Please call." }];

  it("lists the messages with the full name", async () => {
    const { wrapper, get } = await openList(AllContacts, Promise.resolve({ data: contacts }));

    expect(get).toHaveBeenCalledWith("/superadmin/all-contacts");
    expect(wrapper.find("tbody tr").text()).toContain("Asha Nair");
    expect(wrapper.find("tbody tr").text()).toContain("Please call.");
  });

  it("deletes only after a yes, then reloads", async () => {
    const { wrapper, get } = await openList(AllContacts, Promise.resolve({ data: contacts }));
    const remove = jest.spyOn(ApiService, "delete").mockResolvedValue({ data: {} });
    const ask = jest.spyOn(window, "confirm").mockReturnValueOnce(false).mockReturnValueOnce(true);

    await wrapper.find("tbody tr button").trigger("click");
    await flush();

    expect(remove).not.toHaveBeenCalled();
    expect(get).toHaveBeenCalledTimes(1);

    await wrapper.find("tbody tr button").trigger("click");
    await flush();

    expect(ask).toHaveBeenCalledTimes(2);
    expect(remove).toHaveBeenCalledWith("/superadmin/delete-contact/4");
    expect(get).toHaveBeenCalledTimes(2);
  });

  it("keeps the list and gives the reason when a delete is refused", async () => {
    const { wrapper, get } = await openList(AllContacts, Promise.resolve({ data: contacts }));
    jest.spyOn(ApiService, "delete").mockRejectedValue(refused(403, { message: "Staff only." }));
    jest.spyOn(window, "confirm").mockReturnValue(true);

    await wrapper.find("tbody tr button").trigger("click");
    await flush();

    expect(wrapper.vm.$bvToast.toast).toHaveBeenCalledWith("Staff only.", expect.objectContaining({ title: "Not deleted" }));
    expect(get).toHaveBeenCalledTimes(1);
    expect(wrapper.findAll("tbody tr")).toHaveLength(1);
  });
});

describe("the system template list", () => {
  const templates = [
    { id: 1, key: "ksr", coordinates: { shipper: [1, 2, 3, 4], consignee: [5, 6, 7, 8] }, updated_at: "2026-11-01T08:30:00Z" },
    { id: 2, key: "blank", coordinates: null, updated_at: null },
  ];
  const open = async (answer = Promise.resolve({ data: { templates, schema: ["shipper", "consignee"] } })) => {
    const get = jest.spyOn(ApiService, "get").mockReturnValue(answer);
    const push = jest.fn();
    const wrapper = mount(AllSystemTemplates, { localVue, stubs: { RouterLink: link }, mocks: { $router: { push } } });
    await flush();

    return { wrapper, get, push };
  };

  it("lists the templates with how many regions each holds", async () => {
    const { wrapper, get } = await open();
    const rows = wrapper.findAll("tbody tr");

    expect(get).toHaveBeenCalledWith("/superadmin/system-templates");
    expect(rows).toHaveLength(2);
    expect(text(rows.at(0))).toContain("2 standard regions");
    expect(text(rows.at(1))).toContain("0 standard regions");
    expect(text(rows.at(1))).toContain("N/A");
  });

  it("opens a template by its key", async () => {
    const { wrapper, push } = await open();

    await wrapper.findAll("tbody tr").at(0).findAll("button").at(0).trigger("click");

    expect(push).toHaveBeenCalledWith("/superadmin/edit-template/ksr");
  });

  it("says there are none only when the server said so", async () => {
    const none = await open(Promise.resolve({ data: { templates: [] } }));

    expect(none.wrapper.text()).toContain("No system templates defined.");

    const failed = await open(Promise.reject(refused(500, { message: "Server Error" })));

    expect(failed.wrapper.find("[role=alert]").text()).toBe("Server Error");
    expect(failed.wrapper.text()).not.toContain("No system templates defined.");
    expect(failed.wrapper.vm.loading).toBe(false);
  });

  it("deletes only after a yes, then reloads", async () => {
    const { wrapper, get } = await open();
    const remove = jest.spyOn(ApiService, "delete").mockResolvedValue({ data: { success: true } });

    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    wrapper.vm.deleteRow(templates[0]);
    await flush();

    expect(remove).not.toHaveBeenCalled();

    Swal.fire.mockResolvedValue({ isConfirmed: true });
    wrapper.vm.deleteRow(templates[0]);
    await flush();

    expect(remove).toHaveBeenCalledWith("/superadmin/system-templates/1");
    expect(get).toHaveBeenCalledTimes(2);
  });

  it("gives the server's reason when a template in use cannot be deleted", async () => {
    const { wrapper, get } = await open();
    jest.spyOn(ApiService, "delete").mockRejectedValue(refused(409, { message: "Delete Failed: System Template actively bound to customer profiles." }));
    Swal.fire.mockResolvedValue({ isConfirmed: true });

    wrapper.vm.deleteRow(templates[0]);
    await flush();

    expect(Swal.fire).toHaveBeenLastCalledWith("Not deleted", "Delete Failed: System Template actively bound to customer profiles.", "error");
    expect(get).toHaveBeenCalledTimes(1);
  });
});

describe("the system template form", () => {
  const answer = () => ({
    data: {
      schema: ["shipper", "consignee", "weight_charge"],
      templates: [{ id: 1, key: "ksr", coordinates: { shipper: [1, 2, 3, 4], consignee: "broken", extra: [9, 9, 9, 9] } }],
    },
  });
  const open = async ({ key, get = Promise.resolve(answer()) } = {}) => {
    jest.spyOn(ApiService, "get").mockReturnValue(get);
    const push = jest.fn();
    const wrapper = mount(EditSystemTemplate, { localVue, mocks: { $route: { params: { key } }, $router: { push, go: jest.fn() } } });
    await flush();

    return { wrapper, push };
  };
  const save = (wrapper) => wrapper.findAll("button").wrappers.find((b) => b.text().includes("Commit"));

  it("starts a new template with every region at nought", async () => {
    const { wrapper } = await open();

    expect(wrapper.text()).toContain("Define New System Template");
    expect(wrapper.vm.coords).toEqual({ shipper: [0, 0, 0, 0], consignee: [0, 0, 0, 0], weight_charge: [0, 0, 0, 0] });
    expect(wrapper.findAll("input[type=number]")).toHaveLength(12);
    expect(save(wrapper).attributes("disabled")).toBeUndefined();
  });

  it("opens an existing template, a missing or broken region back at nought", async () => {
    const { wrapper } = await open({ key: "ksr" });

    expect(wrapper.text()).toContain("Configure Coordinates");
    expect(wrapper.vm.coords.shipper).toEqual([1, 2, 3, 4]);
    expect(wrapper.vm.coords.consignee).toEqual([0, 0, 0, 0]);
    expect(wrapper.vm.coords.weight_charge).toEqual([0, 0, 0, 0]);
    expect(wrapper.find("input.form-control-lg").attributes("disabled")).toBe("disabled");
    expect(wrapper.find("[role=alert]").exists()).toBe(false);
  });

  it("says so, and holds saving back, when the template is not there", async () => {
    const { wrapper } = await open({ key: "gone" });

    expect(wrapper.find("[role=alert]").text()).toContain('There is no template called "gone"');
    expect(save(wrapper).attributes("disabled")).toBe("disabled");
  });

  it("says why it could not be loaded, and holds saving back", async () => {
    const { wrapper } = await open({ key: "ksr", get: Promise.reject(refused(403, { message: "Staff only." })) });

    expect(wrapper.find("[role=alert]").text()).toBe("Staff only.");
    expect(wrapper.vm.loadingSchema).toBe(false);
    expect(save(wrapper).attributes("disabled")).toBe("disabled");
  });

  it("asks for a key before saving", async () => {
    const { wrapper } = await open();
    const post = jest.spyOn(ApiService, "post");

    wrapper.setData({ templateKey: "   " });
    wrapper.vm.saveData();

    expect(post).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith("Empty Key", expect.any(String), "warning");
  });

  it("saves the trimmed key with the grid, then goes back to the list", async () => {
    const { wrapper, push } = await open();
    const post = jest.spyOn(ApiService, "post").mockResolvedValue({ data: { success: true } });
    Swal.fire.mockResolvedValue({});

    wrapper.setData({ templateKey: " air_main_v2 " });
    await wrapper.findAll("input[type=number]").at(0).setValue("15");
    wrapper.vm.saveData();
    await flush();

    expect(post).toHaveBeenCalledWith("/superadmin/system-templates/save", {
      key: "air_main_v2",
      coordinates: { shipper: [15, 0, 0, 0], consignee: [0, 0, 0, 0], weight_charge: [0, 0, 0, 0] },
    });
    expect(push).toHaveBeenCalledWith("/superadmin/all-templates");
    expect(wrapper.vm.isSaving).toBe(false);
  });

  it("stays on the form with the server's reason when a save is refused", async () => {
    const { wrapper, push } = await open({ key: "ksr" });
    jest.spyOn(ApiService, "post").mockRejectedValue(refused(422, { errors: { "coordinates.shipper.0": ["The coordinates.shipper.0 must be at least 0."] } }));

    wrapper.vm.saveData();
    await flush();

    expect(Swal.fire).toHaveBeenLastCalledWith("Not saved", "The coordinates.shipper.0 must be at least 0.", "error");
    expect(push).not.toHaveBeenCalled();
    expect(wrapper.vm.isSaving).toBe(false);
  });
});

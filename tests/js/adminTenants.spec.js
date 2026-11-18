/**
 * Two more platform admin screens, mounted (2026-11-15 frontend audit, tests: "the other admin pages are untested"):
 * Companies & branches, where a new client is made, and the domain directory, whose approvals apply to every tenant.
 */
import { mount } from "@vue/test-utils";
import ApiService from "@/core/services/api.service";
import Tenants from "@/view/pages/admin/Tenants.vue";
import DomainDirectory from "@/view/pages/admin/DomainDirectory.vue";

const flush = async () => { for (let i = 0; i < 4; i++) await new Promise((resolve) => setTimeout(resolve, 0)); };
const refused = (status, data) => Object.assign(new Error("refused"), { response: { status, data } });

afterEach(() => jest.restoreAllMocks());

describe("Companies & branches", () => {
  const companies = [
    { id: 1, name: "Kerala Lines", code: "KRL", tier: "tactical", branches: 1, people: 2 },
    { id: 2, name: "Malabar Cargo", code: "MLB", tier: "core", branches: 0, people: 0 },
  ];
  const detail = {
    1: { company: companies[0],
      branches: [{ id: 11, agent_name: "Kochi", branch_code: "COK", agent_city: "Kochi", gst_no: null, iata_agent_code: null, people: 2 }],
      people: [{ id: 21, name: "Anu", email: "anu@krl.test", designation: "boss", branch: "Kochi", is_active: 1 }] },
    2: { company: companies[1], branches: [], people: [] },
    3: { company: { id: 3, name: "New Co", code: "NEW", tier: "tactical" }, branches: [], people: [] },
  };

  const open = async (query = {}) => {
    const get = jest.spyOn(ApiService, "get").mockImplementation((url) => {
      const id = url.split("/superadmin/tenants/")[1];

      return Promise.resolve({ data: id ? detail[id] : { companies } });
    });
    const replace = jest.fn(() => Promise.resolve());
    const wrapper = mount(Tenants, { mocks: { $route: { query }, $router: { replace } }, stubs: { RouterLink: { template: "<a><slot /></a>" } } });
    await flush();

    return { wrapper, get, replace };
  };
  const pick = async (wrapper, at) => { await wrapper.findAll(".fx-tenants__item").at(at).trigger("click"); await flush(); };

  it("lists the companies and flags one with no branch", async () => {
    const { wrapper } = await open();
    const rows = wrapper.findAll(".fx-tenants__item");

    expect(rows).toHaveLength(2);
    expect(rows.at(0).text()).toContain("KRL · Tactical · 1 branch · 2 people");
    expect(rows.at(1).text()).toContain("no branch yet");
    expect(wrapper.text()).toContain("Choose a company to see its branches and people");
  });

  it("finds a company by name or code", async () => {
    const { wrapper } = await open();

    await wrapper.find('input[aria-label="Find a company"]').setValue("mlb");
    expect(wrapper.findAll(".fx-tenants__item")).toHaveLength(1);

    await wrapper.find('input[aria-label="Find a company"]').setValue("zzz");
    expect(wrapper.text()).toContain("No company matches.");
  });

  it("opens the company named in the address", async () => {
    const { wrapper, get, replace } = await open({ company: "1" });

    expect(get).toHaveBeenCalledWith("/superadmin/tenants/1");
    expect(wrapper.text()).toContain("Branches (1)");
    expect(wrapper.text()).toContain("anu@krl.test");
    expect(wrapper.text()).toContain("sea only");
    expect(replace).not.toHaveBeenCalled();
  });

  it("puts the opened company in the address", async () => {
    const { wrapper, replace } = await open();

    await pick(wrapper, 0);

    expect(replace).toHaveBeenCalledWith({ query: { company: "1" } });
  });

  it("will not add a person to a company with no branch", async () => {
    const { wrapper } = await open();

    await pick(wrapper, 1);

    expect(wrapper.text()).toContain("nobody can sign in or number a document until there is one");
    const add = wrapper.findAll("button").wrappers.find((b) => b.text() === "+ Add person");
    expect(add.attributes("disabled")).toBe("disabled");
  });

  it("makes a new client: the company, then straight on to its first branch", async () => {
    const { wrapper } = await open();
    const post = jest.spyOn(ApiService, "post").mockResolvedValue({ data: { company: { id: 3 } } });

    await wrapper.find('[data-test="new-client"]').trigger("click");
    const boxes = wrapper.findAll("form input");
    await boxes.at(0).setValue("New Co");
    await boxes.at(1).setValue("new");
    await wrapper.find("form").trigger("submit");
    await flush();

    expect(post).toHaveBeenCalledWith("/superadmin/create-company", { name: "New Co", code: "NEW", tier: "tactical" });
    expect(wrapper.vm.step).toBe("branch");
    expect(wrapper.text()).toContain("1 Company ✓");
  });

  it("saves a branch under the open company, codes in capitals and empty boxes as nothing", async () => {
    const { wrapper } = await open({ company: "2" });
    const post = jest.spyOn(ApiService, "post").mockResolvedValue({ data: {} });

    wrapper.vm.startBranch(false);
    Object.assign(wrapper.vm.branch, { agent_name: "Calicut", branch_code: "ccj", agent_address: "1 Beach Rd", agent_city: "Calicut", agent_pincode: "673001", gst_no: "32aabck1234e1z2" });
    await wrapper.vm.$nextTick();
    await wrapper.find("form").trigger("submit");
    await flush();

    expect(post).toHaveBeenCalledWith("/superadmin/create-branch", expect.objectContaining({
      company_id: 2, branch_code: "CCJ", gst_no: "32AABCK1234E1Z2", iata_agent_code: null, agent_issue_sign: null,
    }));
    expect(wrapper.vm.step).toBeNull();
  });

  it("shows every complaint when a save is refused, and keeps the form", async () => {
    const { wrapper } = await open();
    jest.spyOn(ApiService, "post").mockRejectedValue(refused(422, { errors: { code: ["That code is taken."], name: ["That name is taken."] } }));

    await wrapper.find('[data-test="new-client"]').trigger("click");
    await wrapper.find("form").trigger("submit");
    await flush();

    expect(wrapper.find("form [role=alert]").text()).toBe("That code is taken. That name is taken.");
    expect(wrapper.vm.step).toBe("company");
    expect(wrapper.vm.busy).toBe(false);
  });

  it("closes a half-typed branch when another company is picked, so it cannot be saved under the wrong one", async () => {
    const { wrapper } = await open({ company: "1" });
    const post = jest.spyOn(ApiService, "post").mockResolvedValue({ data: {} });

    wrapper.vm.startBranch(false);
    await wrapper.vm.$nextTick();
    expect(wrapper.find("form").exists()).toBe(true);

    await pick(wrapper, 1);

    expect(wrapper.vm.open.company.id).toBe(2);
    expect(wrapper.find("form").exists()).toBe(false);
    expect(post).not.toHaveBeenCalled();
  });

  it("leaves the new-client form when a company is picked from the list", async () => {
    const { wrapper } = await open();

    await wrapper.find('[data-test="new-client"]').trigger("click");
    await pick(wrapper, 0);

    expect(wrapper.vm.step).toBeNull();
    expect(wrapper.text()).toContain("Branches (1)");
  });

  it("says when the companies could not be loaded", async () => {
    jest.spyOn(ApiService, "get").mockRejectedValue(refused(500, null));
    const wrapper = mount(Tenants, { mocks: { $route: { query: {} }, $router: { replace: jest.fn() } }, stubs: { RouterLink: true } });
    await flush();

    expect(wrapper.find("[role=alert]").text()).toBe("Could not load the companies.");
  });
});

describe("the domain directory", () => {
  const answer = {
    rows: [
      { id: 5, domain: "emirates.test", classification: "airline", status: "proposed", source: "partner", confirmations: 1 },
      { id: 6, domain: "maersk.test", classification: "other", status: "proposed", source: "agreement", confirmations: 3 },
    ],
    counts: { proposed: 2, approved: 7, rejected: 1 },
    classifications: ["customer_enquiry", "airline", "shipping_line", "other"],
  };
  const open = async () => {
    const get = jest.spyOn(ApiService, "get").mockResolvedValue({ data: answer });
    const wrapper = mount(DomainDirectory);
    await flush();

    return { wrapper, get };
  };

  it("opens on what is waiting, with the counts on the filters", async () => {
    const { wrapper, get } = await open();

    expect(get).toHaveBeenCalledWith("/superadmin/domain-directory?status=proposed");
    expect(wrapper.findAll("tbody tr")).toHaveLength(2);
    expect(wrapper.findAll(".btn-group .btn").wrappers.map((b) => b.text().replace(/\s+/g, " "))).toEqual(["Waiting 2", "Live 7", "Refused 1"]);
  });

  it("approves a proposal as it stands with one click", async () => {
    const { wrapper, get } = await open();
    const post = jest.spyOn(ApiService, "post").mockResolvedValue({ data: {} });

    await wrapper.findAll("tbody tr").at(0).find(".btn-success").trigger("click");
    await flush();

    expect(post).toHaveBeenCalledWith("/superadmin/domain-directory/5/approve", { classification: "airline" });
    expect(get).toHaveBeenCalledTimes(2);
  });

  it("approves with the reviewer's correction", async () => {
    const { wrapper } = await open();
    const post = jest.spyOn(ApiService, "post").mockResolvedValue({ data: {} });
    const row = wrapper.findAll("tbody tr").at(1);

    await row.find("select").setValue("shipping_line");
    await row.find(".btn-success").trigger("click");

    expect(post).toHaveBeenCalledWith("/superadmin/domain-directory/6/approve", { classification: "shipping_line" });
  });

  it("refuses nothing when the question is cancelled, and sends the note when it is not", async () => {
    const { wrapper } = await open();
    const post = jest.spyOn(ApiService, "post").mockResolvedValue({ data: {} });
    const ask = jest.spyOn(window, "prompt").mockReturnValue(null);
    const button = wrapper.findAll("tbody tr").at(0).find(".btn-outline-danger");

    await button.trigger("click");
    expect(post).not.toHaveBeenCalled();

    ask.mockReturnValue("a personal address");
    await button.trigger("click");
    expect(post).toHaveBeenCalledWith("/superadmin/domain-directory/5/reject", { note: "a personal address" });
  });

  it("asks the server for the list a filter names", async () => {
    const { wrapper, get } = await open();

    await wrapper.findAll(".btn-group .btn").at(2).trigger("click");

    expect(get).toHaveBeenLastCalledWith("/superadmin/domain-directory?status=rejected");
  });

  it("says why an approval was refused", async () => {
    const { wrapper } = await open();
    jest.spyOn(ApiService, "post").mockRejectedValue(refused(409, { error: "Already reviewed by someone else." }));

    await wrapper.findAll("tbody tr").at(0).find(".btn-success").trigger("click");
    await flush();

    expect(wrapper.find(".alert-danger").text()).toBe("Already reviewed by someone else.");
    expect(wrapper.vm.busy).toBeNull();
  });
});

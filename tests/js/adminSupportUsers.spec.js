/**
 * The support desk and the user registry, mounted (2026-11-15 frontend audit, tests: "the other admin pages are
 * untested").
 */
import { mount, createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import ApiService from "@/core/services/api.service";
import SupportDeskTickets from "@/view/pages/admin/SupportDeskTickets.vue";
import AllUsers from "@/view/pages/admin/AllUsers.vue";

const settle = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
const refused = (status, data) => Object.assign(new Error("refused"), { response: { status, data } });

afterEach(() => { jest.restoreAllMocks(); jest.clearAllTimers(); jest.useRealTimers(); });

describe("the support desk", () => {
  const tickets = [
    { id: 1, created_at: "2026-11-10T08:00:00Z", branch: { agent_name: "Kochi" }, reporter: { name: "Anu", designation: "operations" },
      route: "/inbox", description: "Send button does nothing", status: "open", channel: "report", element_selector: "button.send" },
    { id: 2, created_at: "2026-11-11T08:00:00Z", branch: null, reporter: null, route: "/billing", description: "Need help with a bill",
      status: "investigating", channel: "chat", waiting_messages: 2 },
  ];
  let wrappers = [];
  const open = async (messages = { messages: [], status: "investigating" }) => {
    jest.useFakeTimers();
    const get = jest.spyOn(ApiService, "get").mockImplementation((url) => Promise.resolve({
      data: url.includes("/messages") ? messages : { data: tickets },
    }));
    const wrapper = mount(SupportDeskTickets, { stubs: { Figure: true, StatusChip: true } });
    wrappers.push(wrapper);
    await settle();

    return { wrapper, get };
  };
  const button = (wrapper, text) => wrapper.findAll("button").wrappers.find((b) => b.text() === text);

  afterEach(() => { wrappers.forEach((w) => w.destroy()); wrappers = []; });

  it("lists the queue, with what is waiting in a chat", async () => {
    const { wrapper, get } = await open();

    expect(get).toHaveBeenCalledWith("/admin/tickets");
    expect(wrapper.findAll("tbody tr")).toHaveLength(2);
    expect(wrapper.text()).toContain("button.send");
    expect(wrapper.text()).toContain("2 waiting");
  });

  it("offers only the next step: open to investigating, investigating to resolved", async () => {
    const { wrapper } = await open();
    const rows = wrapper.findAll("tbody tr");

    expect(rows.at(0).findAll("button").wrappers.map((b) => b.text())).toEqual(["Investigating"]);
    expect(rows.at(1).findAll("button").wrappers.map((b) => b.text())).toEqual(["Open chat", "Resolve"]);
  });

  it("moves a ticket on and reloads the queue", async () => {
    const { wrapper, get } = await open();
    const patch = jest.spyOn(ApiService, "patch").mockResolvedValue({ data: {} });

    await button(wrapper, "Investigating").trigger("click");
    await settle();

    expect(patch).toHaveBeenCalledWith("/admin/tickets", 1, { status: "investigating" });
    expect(get).toHaveBeenCalledTimes(2);
  });

  it("keeps the queue on the page when a step is refused, with the server's reason above it", async () => {
    const { wrapper } = await open();
    jest.spyOn(ApiService, "patch").mockRejectedValue(refused(422, { error: "A ticket only moves forward." }));

    await button(wrapper, "Resolve").trigger("click");
    await settle();

    expect(wrapper.find("[role=alert]").text()).toBe("A ticket only moves forward.");
    expect(wrapper.findAll("tbody tr")).toHaveLength(2);
    expect(wrapper.vm.busy).toBe(false);
  });

  it("asks for one status when the filter is set", async () => {
    const { wrapper, get } = await open();

    await wrapper.find("select").setValue("open");

    expect(get).toHaveBeenLastCalledWith("/admin/tickets?status=open");
  });

  it("looks at the queue again every 15 seconds", async () => {
    const { get } = await open();

    jest.advanceTimersByTime(15000);
    await settle();

    expect(get).toHaveBeenCalledTimes(2);
  });

  it("says the queue could not be loaded, not that it is empty", async () => {
    jest.useFakeTimers();
    jest.spyOn(ApiService, "get").mockRejectedValue(refused(500, null));
    const wrapper = mount(SupportDeskTickets, { stubs: { Figure: true, StatusChip: true } });
    wrappers.push(wrapper);
    await settle();

    expect(wrapper.find("[role=alert]").text()).toBe("Something went wrong.");
    expect(wrapper.text()).toContain("The queue could not be loaded.");
    expect(wrapper.text()).not.toContain("Nothing in the queue.");
  });

  it("opens a chat and asks only for what came after the last message it has", async () => {
    const { wrapper, get } = await open({ messages: [{ id: 7, sender: "user", body: "Hello?" }], status: "investigating" });

    await button(wrapper, "Open chat").trigger("click");
    await settle();
    expect(get).toHaveBeenLastCalledWith("/admin/tickets/2/messages?after_id=0");
    expect(wrapper.find(".fx-help__log").text()).toContain("Hello?");

    jest.advanceTimersByTime(3000);
    await settle();
    expect(get).toHaveBeenLastCalledWith("/admin/tickets/2/messages?after_id=7");
    expect(wrapper.findAll(".fx-help__msg")).toHaveLength(1);
  });

  it("sends a reply and shows it once, even when the check brought it back first", async () => {
    const { wrapper } = await open();
    await button(wrapper, "Open chat").trigger("click");
    await settle();

    let answer;
    const post = jest.spyOn(ApiService, "post").mockReturnValue(new Promise((resolve) => { answer = resolve; }));
    await wrapper.find("textarea").setValue("  Looking at it now  ");
    await wrapper.find("form").trigger("submit");
    expect(post).toHaveBeenCalledWith("/admin/tickets/2/messages", { body: "Looking at it now" });

    // The 3-second check returns the reply before the send itself answers.
    wrapper.vm.chat.messages.push({ id: 9, sender: "agent", body: "Looking at it now" });
    answer({ data: { id: 9, sender: "agent", body: "Looking at it now" } });
    await settle();

    expect(wrapper.vm.chat.messages).toHaveLength(1);
    expect(wrapper.vm.draft).toBe("");
    expect(wrapper.vm.busy).toBe(false);
  });

  it("does not break when the chat is closed before a reply is answered", async () => {
    const { wrapper } = await open();
    await button(wrapper, "Open chat").trigger("click");
    await settle();

    let answer;
    jest.spyOn(ApiService, "post").mockReturnValue(new Promise((resolve) => { answer = resolve; }));
    await wrapper.find("textarea").setValue("On it");
    await wrapper.find("form").trigger("submit");
    await button(wrapper, "Back to the queue").trigger("click");
    answer({ data: { id: 10, sender: "agent", body: "On it" } });
    await settle();

    expect(wrapper.vm.error).toBeNull();
    expect(wrapper.vm.busy).toBe(false);
  });

  it("closes an open chat in two steps, because a ticket only moves forward one at a time", async () => {
    const { wrapper } = await open({ messages: [], status: "open" });
    const patch = jest.spyOn(ApiService, "patch").mockResolvedValue({ data: {} });
    await button(wrapper, "Open chat").trigger("click");
    await settle();

    await button(wrapper, "Close chat").trigger("click");
    await settle();

    expect(patch.mock.calls.map((c) => c[2].status)).toEqual(["investigating", "resolved"]);
  });

  it("stops both timers when the page is left", async () => {
    const { wrapper, get } = await open();
    await button(wrapper, "Open chat").trigger("click");
    await settle();
    const asked = get.mock.calls.length;

    wrapper.destroy();
    jest.advanceTimersByTime(60000);

    expect(get.mock.calls.length).toBe(asked);
  });
});

describe("the user registry", () => {
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);

  const users = [
    { id: 1, name: "anu", email: "anu@krl.test", company_name: 1, designation: "boss", is_active: 1 },
    { id: 2, name: "Biju", email: "biju@mlb.test", company_name: 2, designation: "sales", is_active: 0 },
    { id: 3, name: "Chitra", email: "chitra@krl.test", company_name: "Kerala Lines", designation: null, is_active: 1 },
  ];
  const companies = [{ id: 1, name: "Kerala Lines" }, { id: 2, name: "Malabar Cargo" }];
  const flush = async () => { for (let i = 0; i < 4; i++) await new Promise((resolve) => setTimeout(resolve, 0)); };
  const open = async (companyAnswer = Promise.resolve({ data: companies })) => {
    const get = jest.spyOn(ApiService, "get").mockImplementation((url) => (url.includes("all-company") ? companyAnswer : Promise.resolve({ data: users })));
    const wrapper = mount(AllUsers, { localVue, stubs: { RouterLink: { template: "<a><slot /></a>" }, SkeletonTable: true } });
    // BootstrapVue brings its own toaster; what the page hands it is what is checked.
    const toast = jest.spyOn(wrapper.vm.$bvToast, "toast").mockImplementation(() => {});
    await flush();

    return { wrapper, get, toast };
  };

  it("lists the users with their company's name, role and status", async () => {
    const { wrapper } = await open();
    const rows = wrapper.findAll("tbody tr");

    expect(rows).toHaveLength(3);
    expect(rows.at(0).text()).toContain("Kerala Lines");
    expect(rows.at(0).text()).toContain("Boss");
    expect(rows.at(1).text()).toContain("Inactive");
    expect(wrapper.text()).toContain("Showing 1 to 3 of 3 entries");
  });

  it("filters by company, whether a user holds its number or its name", async () => {
    const { wrapper } = await open();

    wrapper.vm.selectedCompany = 1;
    await flush();

    expect(wrapper.findAll("tbody tr")).toHaveLength(2);
    expect(wrapper.vm.totalRows).toBe(2);
  });

  it("asks before deleting, and reloads only after a yes", async () => {
    const { wrapper, get } = await open();
    const remove = jest.spyOn(ApiService, "delete").mockResolvedValue({ data: {} });
    const confirm = jest.spyOn(window, "confirm").mockReturnValue(false);
    const bin = wrapper.findAll("tbody tr").at(1).find("button.btn-light-danger");

    await bin.trigger("click");
    await flush();
    expect(remove).not.toHaveBeenCalled();

    confirm.mockReturnValue(true);
    await bin.trigger("click");
    await flush();
    expect(remove).toHaveBeenCalledWith("/superadmin/user/2");
    expect(get.mock.calls.filter((c) => c[0].includes("all-user"))).toHaveLength(2);
  });

  it("says when the companies could not be loaded (FA8)", async () => {
    const { toast } = await open(Promise.reject(refused(500, null)));

    expect(toast).toHaveBeenCalledWith("The server refused that (500).", expect.objectContaining({ title: "The companies could not be loaded" }));
  });

  it("says when the users could not be loaded", async () => {
    jest.spyOn(ApiService, "get").mockImplementation((url) => (url.includes("all-company") ? Promise.resolve({ data: companies }) : Promise.reject(refused(403, { message: "Not for you." }))));
    const wrapper = mount(AllUsers, { localVue, stubs: { RouterLink: true, SkeletonTable: true } });
    const toast = jest.spyOn(wrapper.vm.$bvToast, "toast").mockImplementation(() => {});
    await flush();

    expect(toast).toHaveBeenCalledWith("Not for you.", expect.objectContaining({ title: "The users could not be loaded" }));
  });
});

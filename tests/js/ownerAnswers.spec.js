/**
 * The owner's answers of 2026-11-21 to what the click-through left open: a notice at the top of the screen when
 * something worked, "Clear" on the waybill forms, enquiry rows that open their mail, a question before a new master,
 * plainer words about ICEGATE, and the sent and created dates of a client's shipment.
 */
import fs from "fs";
import path from "path";
import { say } from "@/core/services/toast";
import mixin from "@/core/mixins/airWayBillMixin";
import EnquiryBoard from "@/view/pages/freight/EnquiryBoard.vue";
import FocusSeaMaster from "@/view/pages/freight/FocusSeaMaster.vue";
import ManifestFiling from "@/view/pages/freight/ManifestFiling.vue";
import ClientShipments from "@/view/pages/admin/ClientShipments.vue";
import ApiService from "@/core/services/api.service";

const read = (file) => fs.readFileSync(path.join(__dirname, "../../resources/js/src", file), "utf8");
const flush = async () => { for (let i = 0; i < 4; i++) await new Promise((resolve) => setTimeout(resolve, 0)); };

afterEach(() => jest.restoreAllMocks());

describe("the notice at the top of the screen", () => {
  const page = () => ({ $root: { $bvToast: { toast: jest.fn() } } });

  it("is raised on the root, so it outlives the page that asked for it", () => {
    const vm = page();

    say(vm, "Line added.");

    expect(vm.$root.$bvToast.toast).toHaveBeenCalledWith("Line added.", expect.objectContaining({ title: "Done", variant: "success", solid: true, autoHideDelay: 4000 }));
  });

  it("stays longer, and says so, when something was not done", () => {
    const vm = page();

    say(vm, "The house waybill was not deleted. Try again.", "danger");

    expect(vm.$root.$bvToast.toast).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ title: "Not done", variant: "danger", autoHideDelay: 8000 }));
  });

  it("says nothing when there is nothing to say, or nowhere to say it", () => {
    const vm = page();

    say(vm, "");
    say({}, "Saved.");
    say(null, "Saved.");

    expect(vm.$root.$bvToast.toast).not.toHaveBeenCalled();
  });

  // The pages are too many to mount one by one: each is held to having the notice beside the request it follows.
  it.each([
    ["view/pages/freight/JobInbox.vue", 9], ["view/pages/freight/Billing.vue", 5], ["view/pages/freight/components/CostSheet.vue", 4],
    ["view/pages/freight/components/EntityPanel.vue", 2], ["view/pages/freight/EnquiryBoard.vue", 2], ["view/pages/freight/ImportJob.vue", 2],
    ["view/pages/freight/FocusSeaConsol.vue", 3], ["view/pages/freight/FocusSeaMaster.vue", 2], ["view/pages/freight/ImportList.vue", 1],
    ["view/pages/freight/Clients.vue", 2], ["view/pages/freight/DirectoryTable.vue", 3], ["view/pages/freight/Collections.vue", 2],
    ["view/pages/freight/MoneyOut.vue", 2], ["view/pages/freight/Financials.vue", 8], ["view/pages/freight/CloseMonth.vue", 2],
    ["view/pages/freight/ManifestFiling.vue", 2], ["view/pages/freight/SalesDashboard.vue", 2], ["view/pages/freight/components/TeamMails.vue", 2],
    ["view/pages/freight/BossDashboard.vue", 1], ["view/pages/freight/FinanceSettings.vue", 10], ["view/pages/freight/MailboxSettings.vue", 4],
    ["view/pages/dashboard/MessageLog.vue", 2], ["view/pages/admin/SupportDeskTickets.vue", 2], ["view/pages/admin/DomainDirectory.vue", 3],
    ["view/pages/admin/Tenants.vue", 2], ["view/pages/admin/AirlineDirectory.vue", 1],     ["view/pages/admin/AiUsage.vue", 1], ["view/pages/admin/Settings.vue", 2], ["view/pages/admin/NewUsers.vue", 1],
    ["view/pages/admin/NewCompany.vue", 1], ["view/pages/admin/NewBranch.vue", 1], ["view/pages/admin/Account.vue", 1],
  ])("%s says what worked", (file, atLeast) => {
    const source = read(file);

    expect(source).toContain('import { say } from "@/core/services/toast";');
    expect((source.match(/say\(this, /g) || []).length).toBeGreaterThanOrEqual(atLeast);
  });

  it("no longer uses the browser's own alert box for a notice that was added", () => {
    expect(read("view/pages/admin/Settings.vue")).not.toMatch(/\balert\(/);
  });
});

describe("the waybill forms", () => {
  const form = (route = {}) => ({
    $bvToast: { toast: jest.fn() },
    $bvModal: { msgBoxConfirm: jest.fn(() => Promise.resolve(true)) },
    $route: { params: {}, ...route },
    $router: { resolve: jest.fn(() => ({ href: "/master-airway-bill" })) },
    blankFormRoute: "Master Airway Bill",
  });
  const toasted = (vm) => vm.$bvToast.toast.mock.calls[0];

  it.each([
    ["draft", { success: "-e-AWB Saved in database -Pass", error: "" }, "The waybill is saved.", "success"],
    ["send", { success: "-e-AWB Sent to the airline -Pass", error: "" }, "The waybill was sent to the airline.", "success"],
    ["send", { success: "", error: "NOT SENT to the airline." }, "Not sent to the airline. The waybill itself is saved.", "danger"],
    ["draft", { error: "The server could not be reached" }, "Not saved. The reason is beside the buttons.", "danger"],
  ])("say at the top what a %s came to", (asked, outcome, words, variant) => {
    const vm = form();

    mixin.methods.sayOutcome.call(vm, asked, outcome);

    expect(toasted(vm)[0]).toBe(words);
    expect(toasted(vm)[1]).toMatchObject({ variant, solid: true });
  });

  it("both call it after every save, and both have a Clear button", () => {
    ["view/pages/dashboard/FocusAir.vue", "view/pages/dashboard/HouseWayBill.vue"].forEach((file) => {
      const source = read(file);

      expect((source.match(/this\.sayOutcome\(asked, /g) || []).length).toBe(4);
      expect(source).toMatch(/type="button"[^>]*@click="clearForm">Clear<\/b-button>/);
      expect(source).toMatch(/blankFormRoute: '(Master Airway Bill|House Way Bill)'/);
    });
  });

  it.each([
    ["view/pages/dashboard/FocusAir.vue"], ["view/pages/dashboard/HouseWayBill.vue"],
  ])("%s names its save button after what is open", (file) => {
    const label = eval("(function " + read(file).match(/submitButtonText\(\) \{[\s\S]*?\n        \}/)[0] + ")");
    const on = (mode, status) => label.call({ mode, form: { first_box: { status } } });

    expect(on("add", "")).toBe("Add Draft");
    expect(on("update", "draft")).toBe("Update Draft");
    expect(on("update", "")).toBe("Update Draft");
    expect(on("update", "generate_pdf")).toBe("Save changes");
    expect(on("update", "send")).toBe("Save changes");
  });

  describe("Clear", () => {
    const { location } = window;

    beforeEach(() => { delete window.location; window.location = { reload: jest.fn(), assign: jest.fn() }; });
    afterEach(() => { window.location = location; });

    it("asks first, then loads the page again: every box is empty", async () => {
      const vm = form();

      await mixin.methods.clearForm.call(vm);

      expect(vm.$bvModal.msgBoxConfirm).toHaveBeenCalledWith("Everything typed here that is not saved will be lost.", expect.objectContaining({ title: "Clear the form?", okTitle: "Clear" }));
      expect(window.location.reload).toHaveBeenCalledTimes(1);
    });

    it("opens the blank form in place of a waybill opened for a change", async () => {
      const vm = form({ params: { id: "17612345675" } });

      await mixin.methods.clearForm.call(vm);

      expect(vm.$router.resolve).toHaveBeenCalledWith({ name: "Master Airway Bill" });
      expect(window.location.assign).toHaveBeenCalledWith("/master-airway-bill");
      expect(window.location.reload).not.toHaveBeenCalled();
    });

    it.each([["the answer is no", () => Promise.resolve(false)], ["the question is closed", () => Promise.resolve(null)]])("leaves everything as it is when %s", async (_, answer) => {
      const vm = form();
      vm.$bvModal.msgBoxConfirm = jest.fn(answer);

      await mixin.methods.clearForm.call(vm);

      expect(window.location.reload).not.toHaveBeenCalled();
      expect(window.location.assign).not.toHaveBeenCalled();
    });
  });
});

describe("an enquiry's row", () => {
  const board = () => ({ $router: { push: jest.fn() }, mailOf: EnquiryBoard.methods.mailOf });

  it("opens its mail in the inbox", () => {
    const vm = board();

    EnquiryBoard.methods.openMail.call(vm, { id: 4, thread_id: 31 });

    expect(vm.$router.push).toHaveBeenCalledWith({ path: "/inbox", query: { thread: "31" } });
  });

  it("opens nothing for an enquiry made by hand: there is no mail behind it", () => {
    const vm = board();

    EnquiryBoard.methods.openMail.call(vm, { id: 4, thread_id: null });

    expect(vm.$router.push).not.toHaveBeenCalled();
    expect(EnquiryBoard.methods.mailOf({ thread_id: null })).toBeNull();
  });

  it("is not opened by selecting its text", () => {
    const vm = board();
    jest.spyOn(window, "getSelection").mockReturnValue({ toString: () => "ENQ-0004" });

    EnquiryBoard.methods.openMail.call(vm, { id: 4, thread_id: 31 });

    expect(vm.$router.push).not.toHaveBeenCalled();
  });

  it("keeps Confirm shipment a click of its own", () => {
    expect(read("view/pages/freight/EnquiryBoard.vue")).toContain('@click.stop="convert(row)"');
  });
});

describe("a new master", () => {
  const page = (answer) => ({
    $bvModal: { msgBoxConfirm: jest.fn(() => Promise.resolve(answer)) },
    createMaster: jest.fn(),
  });

  it("is created only after a yes", async () => {
    const yes = page(true);
    const no = page(false);

    await FocusSeaMaster.methods.newMaster.call(yes);
    await FocusSeaMaster.methods.newMaster.call(no);

    expect(yes.$bvModal.msgBoxConfirm).toHaveBeenCalledWith(expect.stringContaining("new shipment with its own number"), expect.objectContaining({ title: "Create a new master?", okTitle: "Create" }));
    expect(yes.createMaster).toHaveBeenCalledTimes(1);
    expect(no.createMaster).not.toHaveBeenCalled();
  });

  it("then opens its page", async () => {
    const vm = { $router: { push: jest.fn() }, $root: {}, creating: false, readable: () => "" };
    jest.spyOn(ApiService, "post").mockResolvedValue({ data: { job: { id: 88 } } });

    await FocusSeaMaster.methods.createMaster.call(vm);
    await flush();

    expect(ApiService.post).toHaveBeenCalledWith("/sea-shipments", {});
    expect(vm.$router.push).toHaveBeenCalledWith("/focus-sea/88");
    expect(vm.creating).toBe(false);
  });
});

describe("why Auto File is off", () => {
  const notice = (connection) => ManifestFiling.computed.connectionNotice.call({ connection });

  it("is said without the server's setting names", () => {
    const words = notice({ can_transmit: false, missing: ["ICEGATE_BASE_URL"], reason: "ICEGATE is not connected: ICEGATE_BASE_URL not set." });

    expect(words).toBe("Automatic filing with ICEGATE is not switched on for your company yet. Ask F16s support to switch it on.");
    expect(words).not.toMatch(/ICEGATE_/);
  });

  it("is said differently when only the building is left", () => {
    expect(notice({ can_transmit: false, missing: [] })).toBe("Automatic filing with ICEGATE is not ready yet: F16s is still building it.");
  });

  it("no longer prints the server's reason", () => {
    expect(read("view/pages/freight/ManifestFiling.vue")).not.toContain("connection.reason");
  });
});

describe("a client's shipment", () => {
  const vm = { formatDate: ClientShipments.methods.formatDate, formatTime: ClientShipments.methods.formatTime };
  const revised = (item) => ClientShipments.methods.wasRevised.call(vm, item);

  it("shows when it was first created only if it was sent again later", () => {
    expect(revised({ created_at: "2026-11-18T05:00:00Z", updated_at: "2026-11-19T06:30:00Z" })).toBe(true);
    expect(revised({ created_at: "2026-11-18T05:00:00Z", updated_at: "2026-11-18T05:00:20Z" })).toBe(false);
    expect(revised({ created_at: null, updated_at: "2026-11-18T05:00:20Z" })).toBe(false);
  });

  it("exports the sent date from the last send, with the created date beside it", () => {
    const source = read("view/pages/admin/ClientShipments.vue");

    expect(source).toContain("const dateSent = this.formatDate(item.updated_at);");
    expect(source).toContain("const dateCreated = this.formatDate(item.created_at);");
  });
});

describe("the notice on the board and the bell", () => {
  it.each([["view/pages/freight/JobBoard.vue", 4], ["view/pages/freight/components/BellPanel.vue", 1]])("%s says what worked", (file, atLeast) => {
    const source = read(file);

    expect(source).toContain('import { say } from "@/core/services/toast";');
    expect((source.match(/say\(this, /g) || []).length).toBeGreaterThanOrEqual(atLeast);
  });
});

describe("the shipment on a new bill", () => {
  const Billing = require("@/view/pages/freight/Billing.vue").default;
  const form = (over = {}) => ({ raise: { job_id: null }, jobs: [], jobSearch: "", jobsBusy: false, jobsTotal: 0, jobsAsked: 0, jobsTimer: null, ...over });
  const find = (vm) => Billing.methods.findJobs.call(vm);
  const note = (vm) => Billing.computed.jobsNote.call(vm);

  it("opens on the newest fifty, not on every shipment the company has", async () => {
    const vm = form();
    const get = jest.spyOn(ApiService, "get").mockResolvedValue({ data: { data: [{ id: 3 }, { id: 2 }], total: 169 } });

    await find(vm);

    expect(get).toHaveBeenCalledWith("/jobs");
    expect(vm.jobs.map((j) => j.id)).toEqual([3, 2]);
    expect(note(vm)).toBe("The newest 50 of 169. Type above to find an older one.");
    expect(read("view/pages/freight/Billing.vue")).not.toMatch(/wholeList\("\/jobs"\)|jobs\?per_page/);
  });

  it("asks the server for what was typed", async () => {
    const vm = form({ jobSearch: " JOB/26 0042 " });
    const get = jest.spyOn(ApiService, "get").mockResolvedValue({ data: { data: [{ id: 42 }], total: 1 } });

    await find(vm);

    expect(get).toHaveBeenCalledWith("/jobs?search=JOB%2F26%200042");
    expect(note(vm)).toBe("1 found.");
  });

  it("says so when nothing matches, and when there are more matches than it shows", async () => {
    const vm = form({ jobSearch: "zz" });
    jest.spyOn(ApiService, "get").mockResolvedValueOnce({ data: { data: [], total: 0 } }).mockResolvedValueOnce({ data: { data: [{ id: 1 }], total: 80 } });

    await find(vm);
    expect(note(vm)).toBe("No shipment matches that.");

    await find(vm);
    expect(note(vm)).toBe("The first 50 of 80 matches. Type more to narrow it.");
  });

  it("keeps the shipment already chosen when the answer does not hold it", async () => {
    const vm = form({ raise: { job_id: 7 }, jobs: [{ id: 7, customer_id: 4 }, { id: 8 }], jobSearch: "DXB" });
    jest.spyOn(ApiService, "get").mockResolvedValue({ data: { data: [{ id: 9 }], total: 1 } });

    await find(vm);

    expect(vm.jobs.map((j) => j.id)).toEqual([7, 9]);
  });

  it("does not let an earlier search that answers late replace a later one", async () => {
    const vm = form({ jobSearch: "a" });
    let answerFirst;
    jest.spyOn(ApiService, "get")
      .mockImplementationOnce(() => new Promise((resolve) => { answerFirst = resolve; }))
      .mockResolvedValueOnce({ data: { data: [{ id: 2 }], total: 1 } });

    const first = find(vm);
    vm.jobSearch = "ab";
    await find(vm);
    answerFirst({ data: { data: [{ id: 1 }], total: 1 } });
    await first;

    expect(vm.jobs.map((j) => j.id)).toEqual([2]);
    expect(vm.jobsBusy).toBe(false);
  });

  it("waits for a pause in the typing before it asks", () => {
    jest.useFakeTimers();
    const vm = form({ findJobs: jest.fn() });

    Billing.methods.findJobsSoon.call(vm);
    Billing.methods.findJobsSoon.call(vm);
    jest.advanceTimersByTime(349);
    expect(vm.findJobs).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(vm.findJobs).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});

describe("a record that is not there, or not this person's to open", () => {
  const { serverMessage } = require("@/core/services/serverMessage");
  const refused = (status, data) => ({ response: { status, data } });

  it("is said in plain words, not in the framework's", () => {
    const words = serverMessage(refused(404, { message: "No query results for model [App\\Job] 1172" }), "Something went wrong.");

    expect(words).toBe("That could not be found. It may have been removed, or it is not yours to open.");
    expect(words).not.toMatch(/model|App/);
  });

  it("leaves every other message from the server as it is", () => {
    expect(serverMessage(refused(422, { message: "The period is closed." }))).toBe("The period is closed.");
    expect(serverMessage(refused(404, { error: "This shipment has no waybill yet." }))).toBe("This shipment has no waybill yet.");
  });
});

/**
 * Faults found clicking through the app on 2026-11-21.
 */
import fs from "fs";
import path from "path";
import { shallowMount } from "@vue/test-utils";
import ApiService from "@/core/services/api.service";
import XmlView from "@/view/pages/dashboard/XmlView.vue";

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const read = (file) => fs.readFileSync(path.join(__dirname, "../..", file), "utf8");
const page = (file) => read("resources/js/src/view/pages/" + file);

afterEach(() => jest.restoreAllMocks());

describe("the XML view", () => {
  const open = async (id, answer) => {
    const get = jest.spyOn(ApiService, "get").mockReturnValue(answer || Promise.resolve({ data: "<Waybill/>" }));
    const wrapper = shallowMount(XmlView, { mocks: { $route: { params: { id } } }, stubs: ["b-container", "SideBar"] });
    await flush();

    return { wrapper, get };
  };

  it("shows the waybill's XML", async () => {
    const { wrapper, get } = await open("17610000409");

    expect(get).toHaveBeenCalledWith("/user/get-xml/17610000409");
    expect(wrapper.text()).toContain("<Waybill/>");
    expect(wrapper.find("[role=alert]").exists()).toBe(false);
  });

  it("asks the server for nothing when no waybill is in the address", async () => {
    const { wrapper, get } = await open(undefined);

    expect(get).not.toHaveBeenCalled();
    expect(wrapper.find("[role=alert]").text()).toContain("No waybill was chosen");
  });

  it("says why the XML could not be loaded", async () => {
    const refused = Object.assign(new Error("no"), { response: { status: 404, data: { message: "No such waybill." } } });
    const { wrapper } = await open("999", Promise.reject(refused));

    expect(wrapper.find("[role=alert]").text()).toBe("No such waybill.");
  });
});

describe("the new invoice form", () => {
  // Imported here: the page brings the whole billing screen with it.
  const Billing = require("@/view/pages/freight/Billing.vue").default;
  const missing = (raise, more = {}) => Billing.computed.raiseMissing.call({ raise, isNote: false, jobClient: null, ...more });
  const line = { description: "Freight", rate: 100 };

  it("says a shipment is still needed, where the button was simply off", () => {
    expect(missing({ type: "invoice", general: false, job_id: null, customer_id: 26, lines: [line] }))
      .toEqual(["a shipment (or tick Not for a shipment)"]);
  });

  it("asks for a branch and a client when it is not for a shipment", () => {
    expect(missing({ type: "invoice", general: true, agent_id: null, customer_id: null, lines: [line] }))
      .toEqual(["a branch", "a client"]);
  });

  it("asks for the lines to be filled", () => {
    expect(missing({ type: "invoice", general: true, agent_id: 4, customer_id: 26, lines: [{ description: "", rate: 0 }] }))
      .toEqual(["a description on every line", "a rate above nought on every line"]);
  });

  it("asks a note for its invoice and a reason", () => {
    expect(missing({ type: "credit_note", parent_invoice_id: null, reason: " ", lines: [line] }, { isNote: true }))
      .toEqual(["the invoice it corrects", "a reason"]);
  });

  it("says nothing when the document can be raised", () => {
    expect(missing({ type: "invoice", general: true, agent_id: 4, customer_id: 26, lines: [line] })).toEqual([]);
    expect(missing(null)).toEqual([]);
  });
});

describe("the sales dashboard", () => {
  const SalesDashboard = require("@/view/pages/freight/SalesDashboard.vue").default;
  const age = (age_minutes) => SalesDashboard.computed.ageInWords.call({ staleness: { age_minutes } });

  it("says how old the figures are in minutes, hours or days", () => {
    expect(age(1)).toBe("1 minute");
    expect(age(45)).toBe("45 minutes");
    expect(age(180)).toBe("3 hours");
    expect(age(3653)).toBe("3 days");
    expect(age(null)).toBe("0 minutes");
  });
});

describe("the cost sheet", () => {
  const CostSheet = require("@/view/pages/freight/components/CostSheet.vue").default;
  const label = CostSheet.methods.label;
  const same = (description, type) => CostSheet.methods.sameWords.call({ label }, description, type);
  const sentAt = (at) => CostSheet.computed.sentAt.call({ sheet: at === undefined ? null : { sent_to_accounts: { at } } });

  it("names the kind of charge only when the line's own words differ", () => {
    expect(same("air freight", "air_freight")).toBe(true);
    expect(same(" Air Freight ", "air_freight")).toBe(true);
    expect(same("Pharma uplift", "air_freight")).toBe(false);
    expect(same("", "air_freight")).toBe(false);
  });

  it("writes when it went to accounts the way every other date is written", () => {
    expect(sentAt("2026-10-09 16:31:07")).toBe("09-Oct-2026 16:31");
    expect(sentAt(undefined)).toBe("");
  });
});

describe("wording and titles", () => {
  it.each(["public/Solutions.vue", "public/BlogsAndNews.vue", "public/PasswordForgotForm.vue"])("%s has a tab title of its own", (file) => {
    expect(page(file)).toMatch(/metaInfo: \{\s+title: "/);
  });

  it.each(["dashboard/FocusAir.vue", "dashboard/HouseWayBill.vue"])("%s spells Extra and ULD", (file) => {
    const source = page(file);

    expect(source).not.toMatch(/Exta Print|>UID /);
    expect(source).toMatch(/title="Extra Print Informa/);
    expect(source).toMatch(/>ULD Rate Class</);
  });

  it.each(["dashboard/FocusAir.vue", "dashboard/HouseWayBill.vue"])("%s opens a draft that has no parties yet", (file) => {
    const source = page(file);

    // Assigned only when there is one: a null here made the form throw while drawing and freeze.
    expect(source).toMatch(/if \(this\.existingData\.way_bill_address\) \{\s+this\.form\.consignee_address = this\.existingData\.way_bill_address;/);
    expect(source.match(/this\.form\.shipper_address = this\.existingData\.way_bill_address;/g)).toHaveLength(1);
  });

  it("the contact page promises no ticket number", () => {
    expect(page("public/ContactUs.vue")).not.toMatch(/Ticket Number will be generated/);
  });

  it("the message log says when a search finds nothing", () => {
    expect(page("dashboard/MessageLog.vue")).toMatch(/show-empty empty-text="No messages found for that waybill\."/);
  });

  it("a failed message log search does not leave the list from before on screen", () => {
    const source = page("dashboard/MessageLog.vue");
    const failed = source.slice(source.indexOf(".catch(error => {", source.indexOf("searchAWB() {")));

    expect(failed.indexOf("this.data_items = [];")).toBeGreaterThan(-1);
    expect(failed.indexOf("this.data_items = [];")).toBeLessThan(failed.indexOf("clearSearch() {"));
  });

  it("the profile card is given names, not ids", () => {
    const source = read("app/Http/Controllers/Logistics/AddressBookController.php");

    expect(source).not.toMatch(/'branch' => \$user->branch_name,/);
    expect(source).toMatch(/'company' => optional\(\$user->company\)->name,/);
  });
});

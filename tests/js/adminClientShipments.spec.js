/**
 * The client shipments screen, mounted (2026-11-15 frontend audit, tests: "the other admin pages are untested").
 */
import { mount, createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import Swal from "sweetalert2";
import ApiService from "@/core/services/api.service";
import { saveFile } from "@/core/services/download";
import ClientShipments from "@/view/pages/admin/ClientShipments.vue";

jest.mock("sweetalert2", () => ({ fire: jest.fn() }));
jest.mock("@/core/services/download", () => ({ saveFile: jest.fn() }));
jest.mock("vue2-datepicker", () => ({ name: "DatePicker", props: ["value"], render(h) { return h("input", { class: "dates" }); } }));

const flush = async () => { for (let i = 0; i < 4; i++) await new Promise((resolve) => setTimeout(resolve, 0)); };
const refused = (status, data) => Object.assign(new Error("refused"), { response: { status, data } });
const later = () => { let done; const promise = new Promise((resolve) => { done = resolve; }); return { promise, done }; };
const text = (wrapper) => wrapper.text().replace(/\s+/g, " ");

const localVue = createLocalVue();
localVue.use(BootstrapVue);
// The tooltips have nothing to hang on in a test and only warn.
localVue.directive("b-tooltip", {});

const shipment = (more = {}) => ({
  id: "157-12345675", awb_code: "157", awb_no: "12345675", house_way_bills_count: 2,
  departure_airport: "COK, Cochin International", destination_airport: "DXB",
  consignment_data: { pieces: 4, gross_weight: 120.5, weight_code: null },
  agents_info: { company_name: { name: "Focus Air" } },
  created_at: "2026-11-18T05:00:00Z", updated_at: "2026-11-18T06:30:00Z",
  fna_received: false, fna_reason: null, fma_reason: null, latest_status: null, ...more,
});
const page = (rows = [shipment()], more = {}) => ({ data: { shipments: rows, total_awb: 31, total_hawb: 7, pagination: { total: 31 }, ...more } });

const open = async ({ shipments = Promise.resolve(page()), companies = Promise.resolve({ data: [{ id: 5, name: "Focus Air" }] }) } = {}) => {
  const query = jest.spyOn(ApiService, "query").mockReturnValue(shipments);
  const get = jest.spyOn(ApiService, "get").mockReturnValue(companies);
  const wrapper = mount(ClientShipments, { localVue, stubs: { SkeletonTable: true, BModal: { template: "<div><slot /></div>" } } });
  jest.spyOn(wrapper.vm.$bvToast, "toast").mockImplementation(() => {});
  jest.spyOn(wrapper.vm.$bvModal, "show").mockImplementation(() => {});
  await flush();

  return { wrapper, query, get };
};
const asked = (query, n = query.mock.calls.length - 1) => query.mock.calls[n][1].params;

let pages = [];
afterEach(() => { pages.forEach((w) => w.destroy()); pages = []; jest.restoreAllMocks(); Swal.fire.mockReset(); saveFile.mockReset(); });
const opened = async (options) => { const result = await open(options); pages.push(result.wrapper); return result; };

describe("the client shipments list", () => {
  it("lists the shipments with the totals and the clients to filter by", async () => {
    const { wrapper, query } = await opened();
    const row = wrapper.find("tbody tr");

    expect(asked(query)).toMatchObject({ page: 1, per_page: 50, search: "", company_id: null });
    expect(wrapper.findAll(".stats-value").wrappers.map((s) => s.text())).toEqual(["31", "7"]);
    expect(text(row)).toContain("157-12345675");
    expect(text(row)).toContain("Focus Air");
    expect(text(row)).toContain("COK");
    expect(text(row)).toContain("Cochin International");
    expect(text(row)).toContain("120.5 K");
    expect(text(row)).toContain("2 HAWB");
    expect(text(row)).toContain("FMA");
    expect(text(wrapper)).toContain("Showing 1 to 31 of 31 entries");
    expect(wrapper.vm.companyOptions.map((o) => o.text)).toEqual(["All Clients / Companies", "Focus Air"]);
    expect(wrapper.vm.lastUpdated).not.toBe("");
  });

  it("marks a refused shipment, and one whose acceptance speaks of rejection", async () => {
    const { wrapper } = await opened({ shipments: Promise.resolve(page([
      shipment({ id: "1-1", fna_received: true, fna_reason: "AWB000 bad weight" }),
      shipment({ id: "1-2", fma_reason: "Partly REJECTED by handler", latest_status: "FMA" }),
      shipment({ id: "1-3", consignment_data: null, departure_airport: null, agents_info: null }),
    ])) });
    const rows = wrapper.findAll("tbody tr");

    expect(rows.at(0).classes()).toContain("table-row-fna");
    expect(text(rows.at(0))).toContain("FNA Received");
    expect(text(rows.at(1))).toContain("Rejected");
    expect(rows.at(1).classes()).not.toContain("table-row-fna");
    expect(text(rows.at(2))).toContain("—");
  });

  it("says there are none", async () => {
    const { wrapper } = await opened({ shipments: Promise.resolve(page([], { total_awb: 0, total_hawb: 0, pagination: { total: 0 } })) });

    expect(wrapper.text()).toContain("No shipments found matching the filters.");
    expect(wrapper.find(".admin-pagination-wrap").exists()).toBe(false);
  });

  it("gives the server's reason when the list cannot be loaded", async () => {
    const { wrapper } = await opened({ shipments: Promise.reject(refused(403, { message: "Staff only." })) });

    expect(Swal.fire).toHaveBeenCalledWith("The shipments could not be loaded", "Staff only.", "error");
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it("says when the clients did not arrive", async () => {
    const { wrapper } = await opened({ companies: Promise.reject(refused(500, { message: "Server Error" })) });

    expect(wrapper.vm.$bvToast.toast).toHaveBeenCalledWith("Server Error", expect.objectContaining({ title: "The clients could not be loaded" }));
    expect(wrapper.vm.companyOptions).toHaveLength(1);
  });
});

describe("filtering and paging the shipments", () => {
  it("asks the server with the filters, from page one", async () => {
    const { wrapper, query } = await opened();

    await wrapper.setData({ currentPage: 3 });
    await flush();
    expect(asked(query).page).toBe(3);

    wrapper.vm.filters.origin = "COK";
    wrapper.vm.filters.fna_status = "yes";
    wrapper.vm.applyFilters();
    await flush();

    expect(asked(query)).toMatchObject({ page: 1, origin: "COK", fna_status: "yes" });
    expect(wrapper.vm.isFiltered).toBe(true);
    expect(wrapper.text()).toContain("Filtering Active (Clear)");
  });

  it("keeps days and months apart", async () => {
    const { wrapper, query } = await opened();

    wrapper.vm.filters.dates = ["2026-11-18"];
    wrapper.vm.setDateFilterType("month");
    await flush();

    expect(asked(query).dates).toEqual([]);

    wrapper.vm.filters.months = ["2026-11"];
    wrapper.vm.setDateFilterType("day");
    await flush();

    expect(asked(query).months).toEqual([]);
  });

  it("searches a waybill number on the server, and comes back to everything when the box is emptied", async () => {
    const { wrapper, query } = await opened();

    await wrapper.setData({ searchText: " 157-1234 " });
    wrapper.vm.handleAwbSearch();
    await flush();

    expect(asked(query).search).toBe(" 157-1234 ");

    await wrapper.setData({ searchText: "" });
    await flush();

    expect(asked(query).search).toBe("");
  });

  it("clears every filter on reset", async () => {
    const { wrapper, query } = await opened();

    wrapper.vm.filters.company_id = 5;
    await wrapper.setData({ currentPage: 2 });
    await flush();
    wrapper.vm.resetFilters();
    await flush();

    expect(asked(query)).toMatchObject({ page: 1, company_id: null });
    expect(wrapper.vm.isFiltered).toBe(false);
  });

  it("shows the latest answer, not a slower earlier one", async () => {
    const first = later();
    const { wrapper, query } = await opened({ shipments: first.promise });

    query.mockReturnValue(Promise.resolve(page([shipment({ id: "9-9", awb_code: "999", awb_no: "00000001" })], { total_awb: 1, pagination: { total: 1 } })));
    wrapper.vm.filters.origin = "DEL";
    wrapper.vm.applyFilters();
    await flush();
    first.done(page());
    await flush();

    expect(wrapper.vm.items).toHaveLength(1);
    expect(wrapper.vm.items[0].awb_code).toBe("999");
    expect(wrapper.vm.totalAwb).toBe(1);
    expect(wrapper.vm.isLoading).toBe(false);
  });
});

describe("the 60 second refresh", () => {
  it("refreshes quietly, a failure leaving the list as it was", async () => {
    const { wrapper, query } = await opened();

    query.mockReturnValue(Promise.reject(refused(500, {})));
    wrapper.vm.fetchShipments(false);
    await flush();

    expect(wrapper.vm.isLoading).toBe(false);
    expect(Swal.fire).not.toHaveBeenCalled();
    expect(wrapper.vm.items).toHaveLength(1);
    expect(wrapper.vm.pollTimer).not.toBe(null);
  });

  it("stops when the tab is hidden, and refreshes at once when it is back", async () => {
    const { wrapper, query } = await opened();
    const visibility = jest.spyOn(document, "visibilityState", "get");

    visibility.mockReturnValue("hidden");
    document.dispatchEvent(new Event("visibilitychange"));
    expect(wrapper.vm.pollTimer).toBe(null);

    visibility.mockReturnValue("visible");
    document.dispatchEvent(new Event("visibilitychange"));
    await flush();

    expect(query).toHaveBeenCalledTimes(2);
  });

  it("does not start again when an answer arrives after the page was left", async () => {
    const slow = later();
    const { wrapper } = await open({ shipments: slow.promise });

    wrapper.destroy();
    slow.done(page());
    await flush();

    expect(wrapper.vm.pollTimer).toBe(null);
  });
});

describe("exporting the shipments", () => {
  it("exports everything the filters match, quoted for a spreadsheet", async () => {
    const { wrapper, query } = await opened();

    wrapper.vm.filters.company_id = 5;
    query.mockReturnValue(Promise.resolve(page([shipment({ agents_info: { company_name: { name: 'Blue "Sky", Ltd' } } })], { truncated: false })));
    wrapper.vm.downloadCsv();
    await flush();

    const [csv, name, type] = saveFile.mock.calls[0];

    expect(asked(query)).toMatchObject({ export: "all", company_id: 5 });
    expect(asked(query).page).toBeUndefined();
    expect(csv.split("\n")[0]).toBe("AWB Number,Client/Company,HAWB Count,Origin,Destination,Pieces,Weight,Date Sent,Time Sent,Date Created,Time Created,FNA Status");
    expect(csv.split("\n")[1]).toContain('"157-12345675","Blue ""Sky"", Ltd","2","COK","DXB","4","120.5 K"');
    expect(name).toMatch(/^shipments_export_\d{4}-\d{2}-\d{2}\.csv$/);
    expect(type).toContain("text/csv");
    expect(Swal.fire).not.toHaveBeenCalled();
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it("says when the file holds only part of the list", async () => {
    const { wrapper, query } = await opened();

    query.mockReturnValue(Promise.resolve(page([shipment()], { truncated: true, total_awb: 8200 })));
    wrapper.vm.downloadCsv();
    await flush();

    expect(Swal.fire).toHaveBeenCalledWith("Only part of the list is in the file", expect.stringContaining("the newest 1 of 8,200 shipments"), "warning");
  });

  it("gives the reason and saves nothing when the export is refused", async () => {
    const { wrapper, query } = await opened();

    query.mockReturnValue(Promise.reject(refused(500, { message: "Server Error" })));
    wrapper.vm.downloadCsv();
    await flush();

    expect(saveFile).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith("Not exported", "Server Error", "error");
  });
});

describe("the house waybills of a shipment", () => {
  const hawbs = [{ id: "HAWB001", destination_airport: "DXB", consignment_data: { pieces: 1, gross_weight: 10, weight_code: "K" }, fna_received: true, fna_reason: "Bad" }];

  it("lists them", async () => {
    const { wrapper, get } = await opened();

    get.mockResolvedValue({ data: hawbs });
    await wrapper.find("tbody tr .badge-pill").trigger("click");
    await flush();

    expect(get).toHaveBeenLastCalledWith("/superadmin/mawb-hawbs/157/12345675");
    expect(wrapper.vm.$bvModal.show).toHaveBeenCalledWith("hawbs-list-modal");
    expect(wrapper.text()).toContain("HAWB001");
    expect(wrapper.text()).not.toContain("No House Air Waybills found");
  });

  it("says none were found only when the server said so", async () => {
    const { wrapper, get } = await opened();

    get.mockResolvedValue({ data: [] });
    wrapper.vm.viewHawbs(shipment());
    await flush();

    expect(wrapper.text()).toContain("No House Air Waybills found for this shipment.");

    get.mockRejectedValue(refused(500, { error: "Failed to fetch house way bills" }));
    wrapper.vm.viewHawbs(shipment());
    await flush();

    expect(wrapper.find("[role=alert]").text()).toBe("Failed to fetch house way bills");
    expect(wrapper.text()).not.toContain("No House Air Waybills found");
    expect(wrapper.vm.isHawbsLoading).toBe(false);
  });

  it("shows the shipment opened last", async () => {
    const slow = later();
    const { wrapper, get } = await opened();

    get.mockReturnValueOnce(slow.promise).mockResolvedValueOnce({ data: hawbs });
    wrapper.vm.viewHawbs(shipment({ awb_no: "1" }));
    wrapper.vm.viewHawbs(shipment({ awb_no: "2" }));
    await flush();
    slow.done({ data: [{ id: "OTHER" }] });
    await flush();

    expect(wrapper.vm.hawbsList.map((h) => h.id)).toEqual(["HAWB001"]);
  });
});

describe("the message sent for a shipment", () => {
  it("shows it, and lets it be copied and kept", async () => {
    const { wrapper, get } = await opened();
    const writeText = jest.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });

    get.mockResolvedValue({ data: "<Waybill>157</Waybill>" });
    wrapper.vm.viewXml("157-12345675");
    await flush();

    expect(get).toHaveBeenLastCalledWith("/superadmin/shipment-xml/157-12345675");
    expect(wrapper.find(".xml-code-content").text()).toBe("<Waybill>157</Waybill>");

    wrapper.vm.copyXml();
    wrapper.vm.downloadXml();
    await flush();

    expect(writeText).toHaveBeenCalledWith("<Waybill>157</Waybill>");
    expect(saveFile).toHaveBeenCalledWith("<Waybill>157</Waybill>", "xml_airway_bill_157-12345675.xml", "application/xml");
  });

  it("names a house waybill's file as one, whatever kind of number it has", async () => {
    const { wrapper, get } = await opened();

    get.mockResolvedValue({ data: "<House/>" });
    wrapper.vm.viewHawbXml(4412);
    await flush();
    wrapper.vm.downloadXml();

    expect(get).toHaveBeenLastCalledWith("/superadmin/hawb-xml/4412");
    expect(saveFile).toHaveBeenCalledWith("<House/>", "xml_houseway_bill_4412.xml", "application/xml");
  });

  it("gives the reason when the message was not kept, with nothing to copy or keep", async () => {
    const { wrapper, get } = await opened();
    const writeText = jest.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });

    get.mockRejectedValue(refused(404, { error: "The message sent for this waybill was not kept, so there is nothing to show." }));
    wrapper.vm.viewXml("157-1");
    await flush();
    wrapper.vm.copyXml();
    wrapper.vm.downloadXml();

    expect(wrapper.find(".xml-code-content").text()).toContain("was not kept");
    expect(wrapper.findAll(".xml-action-btn").wrappers.every((b) => b.attributes("disabled") === "disabled")).toBe(true);
    expect(writeText).not.toHaveBeenCalled();
    expect(saveFile).not.toHaveBeenCalled();
  });

  it("shows the message opened last", async () => {
    const slow = later();
    const { wrapper, get } = await opened();

    get.mockReturnValueOnce(slow.promise).mockResolvedValueOnce({ data: "<Second/>" });
    wrapper.vm.viewXml("157-1");
    wrapper.vm.viewXml("157-2");
    await flush();
    slow.done({ data: "<First/>" });
    await flush();

    expect(wrapper.vm.xmlContent).toBe("<Second/>");
    expect(wrapper.vm.selectedAwbId).toBe("157-2");
  });

  it("copies an airline's answer, and says when the browser will not", async () => {
    const { wrapper } = await opened();
    Object.defineProperty(navigator, "clipboard", { value: { writeText: jest.fn(() => Promise.resolve()) }, configurable: true });

    wrapper.vm.copyFnaReason(null);
    await flush();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Message not specified");
    expect(wrapper.vm.$bvToast.toast).toHaveBeenLastCalledWith("Message copied to clipboard", expect.objectContaining({ variant: "success" }));

    Object.defineProperty(navigator, "clipboard", { value: { writeText: jest.fn(() => Promise.reject(new Error("no"))) }, configurable: true });
    wrapper.vm.copyFnaReason("AWB000");
    await flush();

    expect(wrapper.vm.$bvToast.toast).toHaveBeenLastCalledWith("Failed to copy text", expect.objectContaining({ variant: "danger" }));
  });
});

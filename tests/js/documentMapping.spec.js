/**
 * Frontend audit FW16: what a read document puts on a waybill form. Both forms had their own copy of the mapping;
 * it is one module now, and these are the four faults it had.
 */
import fs from "fs";
import path from "path";
import {
  plainLine, within, partyFields, cargoFields, flightsOf, cutNotice,
} from "@/core/services/documentMapping";
import mixin from "@/core/mixins/airWayBillMixin";

const form = (name) => fs.readFileSync(path.resolve(__dirname, "../../resources/js/src/view/pages/dashboard", name), "utf8");

describe("a party read from a document", () => {
  it("fills the boxes the form has", () => {
    const { fields, cuts } = partyFields(
      { name: "Müller & Co.", address: "12, Dock Road", city: "Kochi", pin: "682001", state: "KL", phone: "0484 1234", email: "ops@example.test" },
      "ship_", "Shipper",
    );

    expect(fields).toEqual({
      ship_name: "M ller Co", ship_address: "12 Dock Road", ship_city: "Kochi", ship_post_code: "682001",
      ship_state: "KL", ship_phone: "0484 1234",
    });
    expect(cuts).toEqual([]);
  });

  it("does not write the email into the Fax box", () => {
    const { fields } = partyFields({ name: "A", address: "B", email: "ops@example.test" }, "cons_", "Consignee");
    expect(Object.keys(fields)).not.toContain("cons_fax");
    expect(Object.values(fields)).not.toContain("ops@example.test");
  });

  it("does not throw when the document has no name or address", () => {
    expect(partyFields({ city: "Kochi" }, "ship_", "Shipper").fields).toMatchObject({ ship_name: "", ship_address: "", ship_city: "Kochi" });
    expect(partyFields(null, "ship_", "Shipper").fields.ship_name).toBe("");
  });

  it("says when the address was cut", () => {
    const long = "Plot 14 Industrial Estate Phase Two Kakkanad";
    const { fields, cuts } = partyFields({ name: "A", address: long }, "cons_", "Consignee");
    expect(fields.cons_address).toBe("Plot 14 Industrial Estate Phas");
    expect(cuts).toEqual([{ what: "Consignee address", from: long.length, to: 30 }]);
  });
});

describe("the goods read from a document", () => {
  it("gives this document's dimension rows", () => {
    const goods = cargoFields({ description: "Spare parts", hs_codes: ["8409"], dimensions: [{ count: 2, dimension: "40X30X20" }, { count: 1, dimension: "10 x 5" }] });
    expect(goods.description).toBe("Spare parts");
    expect(goods.hsCodes).toEqual(["8409"]);
    expect(goods.rows).toEqual([
      { pcs: 2, wgt: "", length: "40", width: "30", height: "20", unit: "CMT" },
      { pcs: 1, wgt: "", length: "10", width: "5", height: "", unit: "CMT" },
    ]);
  });

  it("does not throw on a missing description or a row with no size", () => {
    const goods = cargoFields({ dimensions: [{ count: 3 }, null] });
    expect(goods.description).toBe("");
    expect(goods.rows).toEqual([{ pcs: 3, wgt: "", length: "", width: "", height: "", unit: "CMT" }]);
    expect(cargoFields(undefined).rows).toEqual([]);
  });

  it("says when the description was cut", () => {
    const long = "x".repeat(90);
    const goods = cargoFields({ description: long });
    expect(goods.description).toHaveLength(70);
    expect(goods.cuts).toEqual([{ what: "Goods description", from: 90, to: 70 }]);
  });
});

describe("the small pieces", () => {
  it("keeps letters, digits and single spaces", () => {
    expect(plainLine("  A/B,  C-9 ")).toBe("A B C 9");
    expect(plainLine(null)).toBe("");
  });

  it("leaves text within its limit alone", () => {
    expect(within("short", 30)).toEqual({ value: "short", cut: null });
  });

  it("gives no flights when the transit has none", () => {
    expect(flightsOf({ transit_airports: ["DXB"] })).toEqual([]);
    expect(flightsOf(undefined)).toEqual([]);
    expect(flightsOf({ flights: [{ flight_number: "EK530" }] })).toHaveLength(1);
  });

  it("writes one sentence about what was cut, and nothing when nothing was", () => {
    expect(cutNotice([])).toBe("");
    expect(cutNotice([{ what: "Shipper address", from: 48, to: 30 }, { what: "Goods description", from: 90, to: 70 }]))
      .toBe("The document had more text than the form holds. Cut short: Shipper address (48 characters, kept the first 30); "
        + "Goods description (90 characters, kept the first 70). Check it against the document.");
  });
});

describe("before the next document is read", () => {
  it("the goods of the last one are emptied", () => {
    const vm = { consignment_list: { rate_class: "Q", pieces: 3, rate: 95, gross_weight: 120, chargable_weight: 130,
      description: "Parts", itemss: [{ pcs: 2 }], hsCodes: ["8409"], unit: "CMT" } };
    mixin.methods.clearReadConsignment.call(vm);
    expect(vm.consignment_list).toEqual({ rate_class: "", pieces: "", rate: "", gross_weight: "", chargable_weight: "",
      description: "", itemss: [], hsCodes: [], unit: "CMT" });
  });
});

describe("both waybill forms", () => {
  it.each(["FocusAir.vue", "HouseWayBill.vue"])("%s reads a document through the shared mapping", (name) => {
    const source = form(name);
    expect(source).toContain("partyFields(shipper, 'ship_', 'Shipper')");
    expect(source).toContain("partyFields(consignee, 'cons_', 'Consignee')");
    expect(source).toContain("cargoFields(cargo_data)");
    expect(source).toContain("this.sayWhatWasCut(cuts)");
    // A second document starts with no dimension rows.
    expect(source).toContain("this.clearReadConsignment();");
    // The four faults, as they were written.
    expect(source).not.toMatch(/_fax\s*=\s*\w+\.email/);
    expect(source).not.toContain("transit.flights[");
    expect(source).not.toContain(".slice(0, 30)");
    expect(source).not.toContain(".slice(0, 70)");
  });
});

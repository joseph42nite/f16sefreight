/**
 * The waybill form defects of the 2026-11-15 frontend audit (FW7–FW14, FW18).
 */
const fs = require("fs");
const path = require("path");
const mixin = require("../../resources/js/src/core/mixins/airWayBillMixin").default;

const read = (file) => fs.readFileSync(path.join(__dirname, "../../resources/js/src", file), "utf8");
const master = read("view/pages/dashboard/FocusAir.vue");
const house = read("view/pages/dashboard/HouseWayBill.vue");

describe("splitFlight (FW8)", () => {
  const split = mixin.methods.splitFlight;

  it("takes a two-character carrier, digits and letters alike", () => {
    expect(split("EK501")).toEqual({ carrier: "EK", flight: "501" });
    expect(split("6E 123")).toEqual({ carrier: "6E", flight: "123" });
    expect(split("ek0501a")).toEqual({ carrier: "EK", flight: "0501A" });
  });

  it("leaves the carrier empty for a three-letter code instead of inventing another airline", () => {
    expect(split("UAE501")).toEqual({ carrier: "", flight: "501" });
  });

  it("copes with nothing", () => {
    expect(split(undefined)).toEqual({ carrier: "", flight: "" });
  });

  it.each([["master", master], ["house", house]])("the %s form uses it for all three flights", (_, source) => {
    expect(source.match(/this\.splitFlight\(transit\.flights\[\d\]\?\.flight_number\)\.carrier/g)).toHaveLength(3);
    expect(source).not.toMatch(/flight_number\?\.slice\(0, ?2\)/);
  });
});

describe("the party name watchers (FW11)", () => {
  it.each([
    ["form.shipper_address.ship_name", "shipper_address", "selectedShipper"],
    ["form.consignee_address.cons_name", "consignee_address", "selectedConsignee"],
    ["form.also_notify_address.also_name", "also_notify_address", "selectAlsoNotify"],
  ])("emptying %s drops the pick and keeps the address", (watcher, key, picked) => {
    const address = { name: "", address: "12 Dock Road", city: "Kochi" };
    const vm = { form: { [key]: address }, [picked]: { id: 1 }, shippers: [], consignees: [], alsoNotify: [] };

    mixin.watch[watcher].call(vm, "");

    expect(vm[picked]).toBeNull();
    expect(vm.form[key]).toBe(address);
  });
});

describe("customs lines and charges (FW12)", () => {
  it("an edit begun on a customs line is not finished by adding a charge", () => {
    const vm = {
      editIndex: null, ociEditIndex: null,
      oci_info: {}, form: { oci_entries: [{ info_identifier: "SHP", supplementary_info: "A" }], charges: [{ amount: 1 }] },
      $set(list, i, value) { list.splice(i, 1, value); },
    };

    mixin.methods.editOciInfo.call(vm, 0);

    expect(vm.ociEditIndex).toBe(0);
    expect(vm.editIndex).toBeNull();

    vm.oci_info.supplementary_info = "B";
    mixin.methods.addOtherCustomInfo.call(vm);

    expect(vm.form.oci_entries).toHaveLength(1);
    expect(vm.form.oci_entries[0].supplementary_info).toBe("B");
    expect(vm.form.charges).toEqual([{ amount: 1 }]);
    expect(vm.ociEditIndex).toBeNull();
  });

  it.each([["master", master], ["house", house]])("the %s form's two Add buttons read their own index", (_, source) => {
    expect(source.match(/\{\{ ociEditIndex !== null \? 'Update' : 'Add' \}\}/g)).toHaveLength(1);
    expect(source.match(/\{\{ editIndex !== null \? 'Update' : 'Add' \}\}/g)).toHaveLength(1);
  });
});

describe("the forms", () => {
  it("units return to their defaults after a piece row is added (FW13)", () => {
    const source = read("core/mixins/airWayBillMixin.js");

    expect(source).toMatch(/this\.consignment_list\.weight_code = 'KGM';\s+this\.consignment_list\.unit = 'CMT';/);
  });

  it("the master form never writes an unknown airport as text (FW7)", () => {
    expect(master).toMatch(/rows\[i\] && rows\[i\]\.iata_code \?/);
    expect(master).not.toMatch(/response2\[0\]\['iata_code'\]/);
  });

  it("the master form checks line lengths before a send (FW10)", () => {
    const submit = master.slice(master.indexOf("        onSubmit() {"));

    expect(submit.slice(0, 1200)).toMatch(/if \(asked === 'send'\) \{\s+const iata = this\.iataViolations\(\);/);
  });

  it("the house form keeps a one-letter rate class and loads a draft with no consignment (FW9)", () => {
    expect(house).not.toMatch(/rate_class=piece_weight\.rate_class\?\.slice\(2\)/);
    expect(house).toMatch(/this\.form\.entries = entry \? \[\{/);
  });

  it("drafts from the extraction panel carry the codes the message uses (FW14)", () => {
    const mapping = read("core/config/awbMapping.js");

    expect(mapping).toMatch(/weight_code: "KGM"/);
    expect(mapping).toMatch(/dimention_unit: "MTQ"/);
    expect(mapping).not.toMatch(/weight_code: "K"|dimention_unit: "CMT"/);
  });

  it("the history window no longer links to the removed consolidation PDF (FW18)", () => {
    expect(read("view/components/DashboardHistoryModal.vue")).not.toMatch(/openPdf\(`\/download-multiple-consolidation-pdf/);
  });
});

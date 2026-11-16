/** A platform notice reaches the waybill form of the airline it was filed under. */
const fs = require("fs");
const path = require("path");
const { noticesFor } = require("../../resources/js/src/core/services/airlineNotice");

const read = (file) => fs.readFileSync(path.join(__dirname, "../../resources/js/src", file), "utf8");
const notices = [
  { carrier_code: "EK", user_notice_1: "Embargo on lithium batteries until 30 Nov." },
  { carrier_code: "LH", user_notice_1: "FRA closed on 24 Dec." },
  { carrier_code: "ek", user_notice_1: " Second notice " },
  { carrier_code: "QR", user_notice_1: "" },
];

describe("noticesFor", () => {
  it("gives every notice filed under the airline, whatever the case", () => {
    expect(noticesFor(notices, "ek")).toEqual(["Embargo on lithium batteries until 30 Nov.", "Second notice"]);
    expect(noticesFor(notices, " LH ")).toEqual(["FRA closed on 24 Dec."]);
  });

  it("gives nothing for another airline, an empty notice, or no airline", () => {
    expect(noticesFor(notices, "SQ")).toEqual([]);
    expect(noticesFor(notices, "QR")).toEqual([]);
    expect(noticesFor(notices, "")).toEqual([]);
    expect(noticesFor(null, "EK")).toEqual([]);
  });
});

describe("the waybill forms", () => {
  it("load the notices and pick by the prefix's airline, else the first carrier", () => {
    const mixin = read("core/mixins/airWayBillMixin.js");

    expect(mixin).toMatch(/ApiService\.get\(`\/user\/get-notice`\)/);
    expect(mixin).toMatch(/noticesFor\(this\.airlineNotices, this\.awb_airline_code \|\| routing\.by\)/);
  });

  it.each(["FocusAir.vue", "HouseWayBill.vue"])("%s shows it as plain text", (page) => {
    const source = read("view/pages/dashboard/" + page);
    const banner = source.slice(source.indexOf('v-if="airlineNotice.length"'), source.indexOf('v-if="airlineNotice.length"') + 400);

    expect(banner).toMatch(/\{\{ line \}\}/);
    expect(banner).not.toMatch(/v-html/);
    expect(source).toMatch(/this\.awb_airline_code = code \|\| '';/);
  });
});

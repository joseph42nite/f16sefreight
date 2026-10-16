/**
 * Walk 7: the receipt form (and supplier payments, and the Boss's target month) defaulted to the UTC date, so from
 * midnight to 05:30 in India a receipt recorded on the 10th was dated the 9th. The default is the browser's own day.
 */
const { localToday } = require("@/core/config/format");

describe("localToday", () => {
  afterEach(() => jest.useRealTimers());

  it("is the local day, not the UTC one, in the hours they differ", () => {
    // 00:45 on 10 Oct in India is still 9 Oct in UTC. (The container runs in UTC, so the two clocks are set apart here.)
    jest.useFakeTimers().setSystemTime(new Date("2026-10-09T19:15:00Z"));
    jest.spyOn(Date.prototype, "getDate").mockReturnValue(10);
    expect(new Date().toISOString().slice(0, 10)).toBe("2026-10-09");
    expect(localToday()).toBe("2026-10-10");
    Date.prototype.getDate.mockRestore();
  });

  it("pads the month and day", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-02-03T06:00:00Z"));
    expect(localToday()).toBe("2026-02-03");
  });
});

describe("the forms that default to today", () => {
  const fs = require("fs");
  const path = require("path");

  it.each(["Billing.vue", "MoneyOut.vue", "BossDashboard.vue"])("%s does not take today from the UTC clock", (page) => {
    const source = fs.readFileSync(path.join(__dirname, "../../resources/js/src/view/pages/freight", page), "utf8");
    expect(source).not.toMatch(/new Date\(\)\.toISOString\(\)\.slice\(0, (7|10)\)/);
  });
});

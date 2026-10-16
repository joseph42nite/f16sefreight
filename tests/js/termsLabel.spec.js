const { termsLabel } = require("@/core/config/format");

/** #55 (owner, 2026-10-10): 0-day terms is cash and carry — the client pays before we execute. */
describe("termsLabel", () => {
  it("names 0 days cash and carry", () => expect(termsLabel(0)).toBe("Cash and carry"));
  it("gives a credit period in days", () => expect(termsLabel(30)).toBe("30 days credit"));
  it("says nothing it does not know", () => expect(termsLabel(null)).toBe("—"));
});

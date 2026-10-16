import { yearChoices } from "@/core/config/financialYear";

/** The books' year defaults to the Indian financial year, 1 April – 31 March, and the calendar year is a choice (owner, 2026-10-09). */
describe("yearChoices", () => {
  it("starts with the financial year the date falls in", () => {
    const [first] = yearChoices(new Date(2026, 9, 9)); // 9 Oct 2026

    expect(first).toMatchObject({ key: "fy-2026", name: "FY 2026-27", start: "2026-04-01", end: "2027-03-31" });
  });

  it("treats January to March as the previous financial year", () => {
    const [first] = yearChoices(new Date(2027, 1, 15)); // 15 Feb 2027

    expect(first).toMatchObject({ name: "FY 2026-27", start: "2026-04-01", end: "2027-03-31" });
  });

  it("rolls over on 1 April", () => {
    expect(yearChoices(new Date(2026, 2, 31))[0].name).toBe("FY 2025-26");
    expect(yearChoices(new Date(2026, 3, 1))[0].name).toBe("FY 2026-27");
  });

  it("offers next and last year, then the calendar year", () => {
    const names = yearChoices(new Date(2026, 9, 9)).map((c) => c.name);

    expect(names).toEqual(["FY 2026-27", "FY 2027-28", "FY 2025-26", "CY 2026"]);
    expect(yearChoices(new Date(2026, 9, 9))[3]).toMatchObject({ start: "2026-01-01", end: "2026-12-31" });
  });
});

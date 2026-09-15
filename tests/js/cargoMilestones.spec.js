/**
 * The In Transit progress bar, from an AWB's Cargo Status codes.
 */
import { cargoProgress, milestoneFeed, MILESTONES } from "@/core/config/cargoMilestones";

describe("cargoProgress", () => {
  it("says so when no status has arrived", () => {
    expect(cargoProgress([])).toMatchObject({ step: 0, total: 7, label: "No airline status yet", discrepancy: false });
  });

  it("follows the usual spine to the step reached", () => {
    expect(cargoProgress(["FOH", "RCS", "MAN", "DEP"])).toMatchObject({ step: 3, label: "Departed", code: "DEP" });
    expect(cargoProgress(["RCS", "MAN", "DEP", "ARR", "RCF", "NFD", "AWD", "CCD", "DLV"])).toMatchObject({ step: 7, label: "Delivered" });
  });

  it("puts customs clearance after the consignee is notified, as the spine runs", () => {
    expect(cargoProgress(["RCS", "MAN", "DEP", "ARR", "RCF", "NFD", "CCD"])).toMatchObject({ step: 5, label: "Customs cleared", code: "CCD" });
  });

  it("keeps the furthest step when messages arrive out of order", () => {
    expect(cargoProgress(["DEP", "MAN"])).toMatchObject({ step: 3, code: "DEP" });
  });

  it("ignores codes that are not a step, and flags a discrepancy", () => {
    expect(cargoProgress(["BKD", "RCS", "DIS", "OCI"])).toMatchObject({ step: 1, label: "Cargo accepted", discrepancy: true });
  });

  it("gives every code to one step only", () => {
    const codes = MILESTONES.flatMap((m) => m.codes);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe("milestoneFeed", () => {
  it("marks every step up to the furthest as reached, with the first message's time where there is one", () => {
    const feed = milestoneFeed([
      { code: "RCS", at: "2026-09-10T08:00:00" },
      { code: "DEP", at: "2026-09-11T02:15:00" },
      { code: "DEP", at: "2026-09-11T09:00:00" },
    ]);

    expect(feed.map((f) => f.reached)).toEqual([true, true, true, false, false, false, false]);
    expect(feed[0]).toMatchObject({ label: "Cargo accepted", at: "2026-09-10T08:00:00", code: "RCS" });
    // Manifested was never reported, but the cargo departed, so it is reached with no time.
    expect(feed[1]).toMatchObject({ reached: true, at: null, code: null });
    expect(feed[2]).toMatchObject({ at: "2026-09-11T02:15:00" });
  });

  it("is all pending when nothing has arrived", () => {
    expect(milestoneFeed([]).every((f) => !f.reached)).toBe(true);
  });
});

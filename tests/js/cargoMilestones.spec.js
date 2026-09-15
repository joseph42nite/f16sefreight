/**
 * The In Transit progress bar, from an AWB's Cargo Status codes.
 */
import { cargoProgress, MILESTONES } from "@/core/config/cargoMilestones";

describe("cargoProgress", () => {
  it("says so when no status has arrived", () => {
    expect(cargoProgress([])).toMatchObject({ step: 0, total: 7, label: "No airline status yet", discrepancy: false });
  });

  it("follows the usual spine to the step reached", () => {
    expect(cargoProgress(["FOH", "RCS", "MAN", "DEP"])).toMatchObject({ step: 3, label: "Departed", code: "DEP" });
    expect(cargoProgress(["RCS", "MAN", "DEP", "ARR", "RCF", "NFD", "AWD", "CCD", "DLV"])).toMatchObject({ step: 7, label: "Delivered" });
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

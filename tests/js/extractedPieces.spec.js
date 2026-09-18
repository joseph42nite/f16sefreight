/**
 * The piece count on a draft written from an extraction (user, 2026-09-18: "after the extraction the number of pieces
 * is not mentioned in the draft"). The real document read on 2026-09-18 said 10 boxes of 60x30x30 and the model
 * answered `no_of_pieces: 0`, so the draft saved no pieces at all.
 */
import { flattenCargo, buildPayload } from "@/core/config/awbMapping";

const realDocument = {
  cargo: {
    description: "CONSOLIDATED AS PER ATTACHED CARGO MANIFEST",
    dimensions: [{ count: 10, dimension: "60X30X30" }],
  },
  piece_weight: { no_of_pieces: 0, gross_weight: 102, chargeable_weight: 102 },
};

describe("pieces from an extracted document", () => {
  it("counts the dimension lines when the model read none, and says to check it", () => {
    const fields = flattenCargo(realDocument);

    expect(fields.pieces).toEqual({ value: "10", confidence: "low" });
    // The row says which pieces the size covers.
    expect(fields.dimensions.value).toBe("60X30X30 — 10 pcs");
  });

  it("keeps the model's own count when it read one", () => {
    const fields = flattenCargo({ ...realDocument, piece_weight: { no_of_pieces: 26, gross_weight: 102 } });

    expect(fields.pieces).toEqual({ value: "26", confidence: "high" });
  });

  it("puts the pieces and one line per dimension on the waybill entry", () => {
    const payload = buildPayload("mawb", flattenCargo({
      cargo: { description: "Machine parts", dimensions: [{ count: 6, dimension: "120x80x90" }, { count: 4, dimension: "60x30x30" }] },
      piece_weight: { no_of_pieces: 0, gross_weight: 480 },
    }), { awbCode: "176", awbNo: "12345678" });

    expect(payload.entries[0].pieces).toBe("10");
    expect(payload.entries[0].gross_weight).toBe("480");
    expect(payload.entries[0].itemss).toEqual([
      { pcs: 6, wgt: "", length: 120, width: 80, height: 90, unit: "CMT" },
      { pcs: 4, wgt: "", length: 60, width: 30, height: 30, unit: "CMT" },
    ]);
  });
});

/**
 * How forwarders write sizes (user, 2026-09-18): "60x40x30" with PCS 60 is all 60 pieces at that size;
 * "60x40x30/30 and 40x20x10/30" is 30 pieces of each.
 */
import { describeDimensions, dimensionLines, volumetricWeight } from "@/core/config/awbMapping";

describe("dimension lines", () => {
  it("reads one size as every piece on the document", () => {
    const lines = dimensionLines("60x40x30", 60);

    expect(lines).toEqual([{ dimension: "60x40x30", count: 60 }]);
    expect(describeDimensions(lines)).toBe("60x40x30 — 60 pcs");
    // 60×40×30 × 60 ÷ 6000
    expect(volumetricWeight(lines)).toBe(720);
  });

  it("reads a count written after the slash, per size", () => {
    const lines = dimensionLines("60x40x30/30 and 40x20x10/30", 60);

    expect(lines).toEqual([{ dimension: "60x40x30", count: 30 }, { dimension: "40x20x10", count: 30 }]);
    expect(describeDimensions(lines)).toBe("60x40x30 — 30 pcs · 40x20x10 — 30 pcs");
    // (72000 × 30 + 8000 × 30) ÷ 6000
    expect(volumetricWeight(lines)).toBe(400);
  });

  it("leaves the count unknown when several sizes are written without one", () => {
    expect(dimensionLines("60x40x30, 40x20x10", 60)).toEqual([
      { dimension: "60x40x30", count: null }, { dimension: "40x20x10", count: null },
    ]);
  });

  it("puts each size on its own waybill line with its pieces", () => {
    const fields = flattenCargo({
      cargo: { description: "Cartons", dimensions: ["60x40x30/30", "40x20x10/30"] },
      piece_weight: { gross_weight: 480, no_of_pieces: 0 },
    });

    expect(fields.pieces.value).toBe("60");
    expect(buildPayload("mawb", fields, { awbCode: "176", awbNo: "12345678" }).entries[0].itemss).toEqual([
      { pcs: 30, wgt: "", length: 60, width: 40, height: 30, unit: "CMT" },
      { pcs: 30, wgt: "", length: 40, width: 20, height: 10, unit: "CMT" },
    ]);
  });
});

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
    expect(fields.dimensions.value).toBe("60X30X30");
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

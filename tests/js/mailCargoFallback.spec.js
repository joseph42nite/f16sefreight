import ExtractionPanel from "@/view/pages/freight/components/ExtractionPanel.vue";

/**
 * What the mail said fills the waybill's cargo when no document gives it (GAPS #466, found clicking as pricing): the
 * BLR → ORD mail's 21 pcs, 300 kg and 60 x 30 x 20 were saved to the enquiry, yet "What will be used" showed them
 * "not set" — only the route fell back to the mail.
 */
const panel = (overrides = {}) => {
  const ctx = {
    manual: {}, pastedFields: {}, assignment: {}, documents: [],
    mailCargo: {
      pieces: { value: 21, confidence: "high" },
      gross_weight: { value: 300, confidence: "high" },
      dimensions: { value: "60 x 30 x 20", confidence: "high" },
      origin: { value: "BLR", confidence: "low" },
      destination: { value: "ORD", confidence: "low" },
    },
    ...overrides,
  };
  Object.keys(ExtractionPanel.methods).forEach((m) => { if (!(m in ctx)) ctx[m] = ExtractionPanel.methods[m].bind(ctx); });
  return ctx;
};

describe("the mail's cargo as a fallback", () => {
  it("gives pieces, gross weight and dimensions, marked as from the mail", () => {
    const p = panel();
    expect(p.sourceField("pieces", "cargo")).toEqual(expect.objectContaining({ value: 21, fromMail: true }));
    expect(p.sourceField("gross_weight", "weights")).toEqual(expect.objectContaining({ value: 300, fromMail: true }));
    expect(p.sourceField("dimensions", "cargo")).toEqual(expect.objectContaining({ value: "60 x 30 x 20", fromMail: true }));
    expect(p.sourceField("route_origin", "route")).toEqual(expect.objectContaining({ value: "BLR", fromMail: true }));
  });

  it("gives way to a document that was read for the group", () => {
    const doc = { uid: "d1", state: "ready", fields: { pieces: { value: 20 } } };
    const p = panel({ documents: [doc], assignment: { cargo: "d1" } });
    expect(p.sourceField("pieces", "cargo")).toEqual({ value: 20 });
  });

  it("says nothing for a field the mail did not give", () => {
    const p = panel({ mailCargo: { origin: { value: "BLR" } } });
    expect(p.sourceField("pieces", "cargo")).toBeUndefined();
    expect(p.sourceField("description", "cargo")).toBeUndefined();
  });

  it("goes into what is saved to the waybill, under anything typed", () => {
    const p = panel({ manual: { gross_weight: { value: 310 } } });
    p.resolved = { parties: {}, cargo: {}, weights: {}, route: {} };
    const out = ExtractionPanel.computed.flatFields.call(p);
    expect(out.pieces).toEqual(expect.objectContaining({ value: 21 }));
    expect(out.dimensions).toEqual(expect.objectContaining({ value: "60 x 30 x 20" }));
    expect(out.gross_weight).toEqual({ value: 310 });
  });
});

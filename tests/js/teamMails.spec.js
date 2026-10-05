import TeamMails from "@/view/pages/freight/components/TeamMails.vue";
import HealthBars from "@/view/pages/freight/components/HealthBars.vue";

/** The quarterly staff review on a mail card (GAPS #457), and our ops facts under the health bars (GAPS #456). */
describe("TeamMails — the quarterly review card", () => {
  const review = {
    kind: "quarterly_review", branch: "BOM",
    facts: { client: "Northwind", mode: "air", quarter: "Q2 FY 2026-27", shipments: 12, previous_shipments: 9,
      lost: [{}, {}], cancelled: [{}], rejected_by_airline: [{}, {}, {}] },
  };

  it("says what the quarter was, airline rejections on air only", () => {
    expect(TeamMails.methods.summary(review))
      .toBe("Air · Q2 FY 2026-27: 12 shipments (9 before), enquiries lost 2, cancelled 1, rejected by the airline 3.");
    const sea = { ...review, facts: { ...review.facts, mode: "sea" } };
    expect(TeamMails.methods.summary(sea)).toBe("Sea · Q2 FY 2026-27: 12 shipments (9 before), enquiries lost 2, cancelled 1.");
  });

  it("heads a review by its quarter and any other mail by its branch", () => {
    expect(TeamMails.methods.heading(review)).toBe("Q2 FY 2026-27");
    expect(TeamMails.methods.heading({ kind: "volume_drop", branch: "BOM" })).toBe("BOM");
  });
});

describe("HealthBars — our ops, measured not scored", () => {
  it("shows a figure with its unit, and too little data as an em dash, never 0", () => {
    expect(HealthBars.methods.fact(1.5, " d slower")).toBe("1.5 d slower");
    expect(HealthBars.methods.fact(null, "%")).toBe("—");
  });
});

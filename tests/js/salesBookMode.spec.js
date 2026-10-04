import SalesDashboard from "@/view/pages/freight/SalesDashboard.vue";

/** The Boss's client book spans air and sea, so each row names its mode; a portal-scoped book is one mode already. */
describe("SalesDashboard — the mode on each row of the client book", () => {
  it("shows the mode column only when the book is not scoped to one portal", () => {
    expect(SalesDashboard.computed.bookShowsMode.call({ mode: null })).toBe(true);
    expect(SalesDashboard.computed.bookShowsMode.call({ mode: "air" })).toBe(false);
  });

  it("names air and sea so they cannot be confused", () => {
    expect(SalesDashboard.methods.modeName("air")).toBe("✈ Air");
    expect(SalesDashboard.methods.modeName("sea")).toBe("⚓ Sea");
  });
});

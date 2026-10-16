import Financials from "@/view/pages/freight/Financials.vue";

/** Walk 7: the Boss's Invoices list showed a void credit note with INR 1,180.00 still to settle. A void owes nothing. */
describe("Financials balanceOf", () => {
  const balanceOf = Financials.methods.balanceOf;

  it("is what is left to settle", () => {
    expect(balanceOf({ grand_total: "50976.00", amount_paid: "976.00", status: "finalized" })).toBe(50000);
  });

  it("is nothing on a void document", () => {
    expect(balanceOf({ grand_total: "1180.00", amount_paid: "0.00", status: "void" })).toBe(0);
  });
});

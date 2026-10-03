import BellPanel from "@/view/pages/freight/components/BellPanel.vue";

/** The accounts desk's alerts (GAPS #448): the card says what the server wrote, and opens where it points. */
const CARD = {
  id: "n1", type: "AccountsAlert", pinned: false, read_at: null, created_at: "2026-10-03T10:00:00Z",
  data: { kind: "supplier_due_tomorrow", text: "1 supplier bill(s) fall due tomorrow, ₹50,000.00 unpaid: Emirates.",
    to: { path: "/money-out", query: { stage: "due" } }, key: "due:2026-10-04" },
};

describe("BellPanel — an accounts alert", () => {
  it("reads as the server's sentence", () => {
    expect(BellPanel.methods.describe(CARD)).toBe(CARD.data.text);
  });

  it("opens the stage it names", () => {
    const vm = { open: true, $router: { push: jest.fn(() => Promise.resolve()) } };

    BellPanel.methods.goTo.call(vm, CARD);

    expect(vm.$router.push).toHaveBeenCalledWith({ path: "/money-out", query: { stage: "due" } });
    expect(vm.open).toBe(false);
  });
});

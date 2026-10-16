/**
 * Walk 7: Money out's payment dialog and Financials' vendor statement said an airline's commission and discount "are
 * recorded as income". Since #465 (owner, 2026-10-06) they post to 5010-Airline-Discounts under Direct Costs — a lower
 * cost, never income. The screens say what the ledger does.
 */
const fs = require("fs");
const path = require("path");

describe.each(["MoneyOut.vue", "Financials.vue"])("%s", (page) => {
  const source = fs.readFileSync(path.join(__dirname, "../../resources/js/src/view/pages/freight", page), "utf8");

  it("calls the deduction a lower cost, not income", () => {
    expect(source).not.toMatch(/recorded as income/);
    expect(source).toMatch(/lower(s)? the cost/);
  });
});

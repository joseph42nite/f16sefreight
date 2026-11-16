/**
 * Fixes from the 2026-11-15 frontend audit that live inside large single-file pages (FW3, FW5, FA3, FM2, FM3, FM4).
 * Read from the source, the way generatePdfPanel.spec.js does: these pages do not mount in jest.
 */
const fs = require("fs");
const path = require("path");

const read = (page) => fs.readFileSync(path.join(__dirname, "../../resources/js/src/view/pages", page), "utf8");
const method = (source, opening) => {
  const from = source.slice(source.indexOf(opening));

  return from.slice(0, from.indexOf("\n    },") === -1 ? undefined : from.search(/\n {4,8}\},\n/));
};

describe("Consolidation", () => {
  const source = read("dashboard/Consolidation.vue");

  it("sends the edited fields, not the form's own (FW3)", () => {
    expect(source).toMatch(/ApiService\.put\(`\/user\/update-consolidation\/\$\{this\.form\.id\}`, updateData\)/);
    expect(source).not.toMatch(/this\.form\.put\([^)]*, updateData\)/);
  });

  it("says whether the manifest was sent (FW5)", () => {
    const send = method(source, "manifest_send(){");

    expect(send).toMatch(/\.then\(\(\) => say\('Sent'/);
    expect(send).toMatch(/\.catch\(/);
    expect(send).toMatch(/NOT sent/);
  });

  it("shows Send only to a person who may send (FS3)", () => {
    expect(source).toMatch(/<b-button v-if="current_user && current_user\.can_send"[^>]*id="manifest-send-btn">/);
  });
});

describe("the business cards", () => {
  it.each(["public/DeepanjanCard.vue", "public/JosephCard.vue"])("%s uses the company's own domain (FA3)", (page) => {
    const addresses = read(page).match(/[\w.]+@[\w.]+\.com/g) || [];

    expect(addresses.length).toBeGreaterThan(0);
    addresses.forEach((address) => expect(address).toMatch(/@f16sefreight\.com$/));
  });
});

describe("accounts screens", () => {
  it("clears a payment run's commission and discount with its picks (FM2)", () => {
    expect(read("freight/MoneyOut.vue")).toMatch(/this\.picked = \{\};\s+this\.amounts = \{\};[\s\S]{0,300}this\.deductions = \{\};/);
  });

  it("previews a purchase voucher's own journal after posting it (FM3)", () => {
    const preview = method(read("freight/Financials.vue"), "loadPreview() {");

    expect(preview).toMatch(/this\.view === "vouchers" \? "vouchers" : "invoices"/);
    expect(preview).not.toMatch(/`\/invoices\/\$\{this\.selected\.id\}\/posting-preview`/);
  });

  it("has the error helper Close Month calls (FM4)", () => {
    const source = read("freight/CloseMonth.vue");

    expect(source).toMatch(/this\.messageFor\(e\)/);
    expect(source).toMatch(/\n    messageFor\(e\) \{/);
  });
});

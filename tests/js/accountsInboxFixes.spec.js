/**
 * The accounts and inbox findings of the 2026-11-15 frontend audit (FM1, FM5–FM10, FC4–FC6).
 * `paise` is run; the rest is read from the source, as frontendAuditFixes.spec.js does: these pages do not mount in jest.
 */
const fs = require("fs");
const path = require("path");
const { paise, WHOLE_LIST } = require("../../resources/js/src/core/config/format");

const read = (page) => fs.readFileSync(path.join(__dirname, "../../resources/js/src/view/pages/freight", page), "utf8");

describe("paise", () => {
  it("rounds a money figure to two places (FM9)", () => {
    expect(paise(100.1 + 200.2)).toBe(300.3);
    expect(paise(1.005)).toBe(1.01);
    expect(paise("12.345")).toBe(12.35);
    expect(paise(-1.005)).toBe(-1.01);
    expect(paise(undefined)).toBe(0);
  });

  it("rounds a line as the server does: amount, then tax, then the sum (FM9)", () => {
    // The page's own lineNet, lifted out so it is the code that runs.
    const body = read("Billing.vue").match(/lineNet\(line\) \{([\s\S]*?)\n {4}\},/)[1];
    const lineNet = new Function("paise", "line", body).bind(null, paise);

    // 10.005 → 10.01, 5% of it 0.5005 → 0.50: 10.51. Rounded once it was 10.50525 → 10.51 as well; the pair that
    // differs is 0.125 at 18%: 0.13 + 0.02 = 0.15 in steps, as the server saves it.
    expect(lineNet({ quantity: 1, rate: 10.005, tax_percentage: 5 })).toBe(10.51);
    expect(lineNet({ quantity: 1, rate: 0.125, tax_percentage: 18 })).toBe(0.15);
    expect(lineNet({ quantity: 3, rate: 33.335, tax_percentage: 18 })).toBe(118.01);
    expect(lineNet({ quantity: 2, rate: 50, tax_percentage: 0 })).toBe(100);
  });
});

describe("Billing", () => {
  const source = read("Billing.vue");

  it("says the amount placed is rupees (FM1)", () => {
    expect(source).toMatch(/Rupees placed against it/);
    expect(source).toMatch(/v-if="isForeign\(d\)"/);
  });

  it("reloads when the stage's filter changes, not only its view (FM5)", () => {
    expect(source).toMatch(/stageKey\(\) \{\s+return this\.initialView \+ "\|" \+ JSON\.stringify\(this\.stageFilter/);
    expect(source).not.toMatch(/\n {4}initialView\(view\) \{/);
  });

  it("asks the server which invoices can carry a note (FM8)", () => {
    expect(source).toMatch(/ApiService\.get\("\/billing\?types\[\]=invoice&issued=1"\)/);
    expect(source).toMatch(/\(this\.parents \|\| this\.rows\)\.filter/);
  });

  it("posts a receipt amount rounded to the paisa (FM9)", () => {
    expect(source).toMatch(/this\.receipt\.amount = paise\(/);
  });
});

describe("pick-lists hold the whole list (FM7)", () => {
  it("asks for the server's largest page", () => expect(WHOLE_LIST).toBe("?per_page=500"));

  it.each([
    ["Billing.vue", 4], ["FinanceSettings.vue", 2], ["ImportJob.vue", 1], ["FocusSeaMaster.vue", 1],
    ["components/EntityPanel.vue", 2], ["components/CostSheet.vue", 1], ["Financials.vue", 1],
  ])("%s", (page, lists) => {
    const source = read(page);

    expect((source.match(/ApiService\.get\("\/(customers|partners)" \+ WHOLE_LIST/g) || []).length).toBe(lists);
    expect(source).not.toMatch(/ApiService\.get\("\/(customers|partners)"\)/);
  });
});

describe("Financials", () => {
  const source = read("Financials.vue");

  it("sends Status only to the invoice views (FM6)", () => {
    expect(source).toMatch(/\["invoices", "awaiting"\]\.includes\(this\.view\) && this\.status/);
  });

  it("offers no Unmatch, which could never succeed (FM10)", () => {
    expect(source).not.toMatch(/@click="unmatch\(/);
    expect(source).not.toMatch(/\/unmatch`/);
  });
});

describe("inbox and imports", () => {
  it("does not claim the screenshot is attached (FC4)", () => {
    const source = read("components/VisualReporter.vue");

    expect(source).not.toMatch(/"attached"/);
    expect(source).toMatch(/not sent with the report/);
  });

  it("sends an emptied IGM box as null (FC5)", () => {
    const source = read("ImportJob.vue");
    const body = source.match(/emptied\(obj, names\) \{([\s\S]*?)\n {4}\},/)[1];
    const emptied = new Function("obj", "names", body).bind({
      clean: (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== "" && v !== undefined)),
    });

    expect(emptied({ igm_no: "", igm_date: "2026-09-29", flight_number: "" }, ["igm_no", "igm_date"]))
      .toEqual({ igm_no: null, igm_date: "2026-09-29" });
    expect(source).toMatch(/const CLEARABLE = \["igm_no", "igm_date"/);
  });

  it("files a chasing mail under the branch chosen (FC6)", () => {
    expect(read("Collections.vue")).toMatch(/agent_id: this\.chase\.agent_id \|\|/);
  });

  it("lets the latest conversation clicked win (FC6)", () => {
    expect(read("JobInbox.vue")).toMatch(/if \(asked !== this\.openSeq\) return;/);
  });
});

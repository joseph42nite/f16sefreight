/**
 * Generate PDF on the Master and House AWB pages (Walk 2 #18).
 *
 * 🔴 The button opens a choice of PDF layouts; the waybill is checked and saved only when one is clicked
 * (`handleSaveAndGeneratePDF` → `onSubmit`). The panel said "Cargo document created — Airway bill message saved in
 * database — PDF documents prepared" after a pretend two-second spinner, before anything had been saved or made.
 */
const fs = require("fs");
const path = require("path");

const pages = ["dashboard/FocusAir.vue", "dashboard/HouseWayBill.vue"];
const read = (page) => fs.readFileSync(path.join(__dirname, "../../resources/js/src/view/pages", page), "utf8");

describe.each(pages)("%s Generate PDF panel", (page) => {
  const source = read(page);

  it("does not claim the waybill was saved or the PDF made before a layout is chosen", () => {
    expect(source).not.toMatch(/saved in database/);
    expect(source).not.toMatch(/PDF documents prepared/);
    expect(source).not.toMatch(/>\s*Cargo document created\s*</);
  });

  it("does not run a pretend spinner before showing the choice", () => {
    const method = source.slice(source.indexOf("isGeneratePdf(generateButton) {"));
    expect(method.slice(0, method.indexOf("\n        },"))).not.toMatch(/setTimeout/);
  });
});

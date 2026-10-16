/**
 * Walk 4 #32: on the Master AWB form in an 800 px pane, the Routing table ran past the card and cut off its Date
 * column. Its wrapper must not scroll (`overflow: visible`, so the airport search lists can drop below the rows), yet
 * the table forced `min-width: 650px` into a column 487 px wide. The table now fits its column: no forced width, and
 * the Date column gets the room From and To gave up. The House AWB form has the same table.
 */
const fs = require("fs");
const path = require("path");

const pages = ["dashboard/FocusAir.vue", "dashboard/HouseWayBill.vue"];

describe.each(pages)("%s routing table", (page) => {
  const source = fs.readFileSync(path.join(__dirname, "../../resources/js/src/view/pages", page), "utf8");
  const table = source.match(/<table class="table fx-routing"[^>]*>[\s\S]*?<\/thead>/);

  it("fits its column instead of forcing 650 px", () => {
    expect(source).not.toMatch(/min-width:650px/);
    expect(table).not.toBeNull();
  });

  it("gives the date room to show in full", () => {
    const widths = [...table[0].matchAll(/width: (\d+)%/g)].map((m) => Number(m[1]));
    // blank, From, To, By, Flight, Date, calendar
    expect(widths.slice(1, 6)).toEqual([18, 18, 11, 12, 28]);
  });
});

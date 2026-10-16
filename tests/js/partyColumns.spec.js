/**
 * Walk 7 #56: at 800 px the Master AWB's Consignee name box ran past the card. Shipper and Consignee sat side by side
 * from 768 px (`md="6"`), leaving each about 256 px for a label, a 300 px box and its icon. They now share a row only
 * from 992 px (`lg="6"`) and stack below it. The House AWB has the same pair.
 */
const fs = require("fs");
const path = require("path");

describe.each(["dashboard/FocusAir.vue", "dashboard/HouseWayBill.vue"])("%s Shipper and Consignee", (page) => {
  const source = fs.readFileSync(path.join(__dirname, "../../resources/js/src/view/pages", page), "utf8");
  const column = (heading) => {
    const at = source.search(new RegExp("<h4 class=\"h-color ml-2\">\\s*" + heading + "\\s*</h4>"));
    const open = source.lastIndexOf("<b-col cols=\"12\"", at);
    return source.slice(open, source.indexOf(">", open) + 1);
  };

  it.each(["Shipper", "Consignee"])("%s takes half the row only on a wide screen", (heading) => {
    expect(column(heading)).toMatch(/\blg="6"/);
    expect(column(heading)).not.toMatch(/\bmd="6"/);
  });
});

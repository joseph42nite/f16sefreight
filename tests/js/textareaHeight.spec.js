/**
 * Walk 7: `.fx-input` is 32 px tall, and nine text areas use it — the invoice mail's Message, Close the month's note,
 * the signature, the client update — so each showed one line whatever its `rows`. A text area keeps its own height.
 */
const fs = require("fs");
const path = require("path");

it("a text area styled as an input keeps the height its rows give it", () => {
  const css = fs.readFileSync(path.join(__dirname, "../../resources/css/app.css"), "utf8");
  const rule = css.match(/textarea\.fx-input\s*\{([^}]*)\}/);

  expect(rule).not.toBeNull();
  expect(rule[1]).toMatch(/height:\s*auto/);
});

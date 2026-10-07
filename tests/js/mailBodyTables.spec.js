import MailBodyFrame from "@/view/pages/freight/components/MailBodyFrame.vue";

/**
 * A wide table in a mail keeps its words whole and scrolls sideways (GAPS #466): an airline's FNA table wrapped one
 * letter per line ("SKYLIN / K / FREIGH / T") because the body broke words anywhere and tables were squeezed to fit.
 */
describe("the mail frame's styles", () => {
  const css = MailBodyFrame.computed.document.call({ html: "<table><tr><td>SKYLINK FREIGHT</td></tr></table>" });

  it("does not squeeze a table to the frame or break words inside it", () => {
    expect(css).not.toMatch(/table\{max-width:100%\}/);
    expect(css).toMatch(/td,th\{[^}]*overflow-wrap:normal/);
  });

  it("lets a wide mail scroll sideways inside its frame", () => {
    expect(css).toMatch(/html\{[^}]*overflow-x:auto/);
  });
});

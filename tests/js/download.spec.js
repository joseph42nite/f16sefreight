/**
 * Frontend audit §7: handing a file to the browser was written out in a dozen pages. It is one module now.
 */
import fs from "fs";
import path from "path";
import { saveFile, showFile } from "@/core/services/download";

const page = (name) => fs.readFileSync(path.resolve(__dirname, "../../resources/js/src/view/pages", name), "utf8");

describe("download", () => {
  let made, clicked;

  beforeEach(() => {
    jest.useFakeTimers();
    made = [];
    clicked = [];
    window.URL.createObjectURL = jest.fn((blob) => { made.push(blob); return "blob:file-" + made.length; });
    window.URL.revokeObjectURL = jest.fn();
    jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function () {
      clicked.push({ href: this.getAttribute("href"), download: this.download, inPage: document.body.contains(this) });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("saves text under a name, as the kind of file it is", () => {
    saveFile("a,b\n1,2", "list.csv", "text/csv");

    expect(clicked).toEqual([{ href: "blob:file-1", download: "list.csv", inPage: true }]);
    expect(made[0].type).toBe("text/csv");
    expect(document.querySelector("a[download]")).toBeNull();
  });

  it("keeps the kind of a file the server sent", () => {
    const sent = new Blob(["x"], { type: "application/pdf" });
    saveFile(sent, "bill.pdf");
    expect(made[0]).toBe(sent);
  });

  it("frees the file later, not at the click", () => {
    saveFile("x", "a.txt", "text/plain");
    expect(window.URL.revokeObjectURL).not.toHaveBeenCalled();
    jest.advanceTimersByTime(30000);
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith("blob:file-1");
  });

  it("shows a file in the tab opened inside the click", () => {
    const tab = { location: "" };
    const open = jest.spyOn(window, "open").mockImplementation(() => null);
    showFile("pdf", "application/pdf", tab);
    expect(tab.location).toBe("blob:file-1");
    expect(open).not.toHaveBeenCalled();
  });

  it("opens a tab of its own when it was given none", () => {
    const open = jest.spyOn(window, "open").mockImplementation(() => null);
    showFile("pdf", "application/pdf");
    expect(open).toHaveBeenCalledWith("blob:file-1", "_blank");
  });
});

describe("the pages", () => {
  it.each([
    "admin/MailFiling.vue", "admin/ClientShipments.vue", "freight/MoneyOut.vue", "freight/Profitability.vue",
    "freight/Financials.vue", "freight/Journal.vue", "freight/Collections.vue", "freight/CloseMonth.vue",
    "freight/Billing.vue", "freight/FocusSeaMaster.vue", "freight/ImportJob.vue",
  ])("%s hands its files over through the shared module", (name) => {
    const source = page(name);
    expect(source).toContain('from "@/core/services/download"');
    expect(source).not.toContain('document.createElement("a")');
  });
});

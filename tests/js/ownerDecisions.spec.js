/**
 * The owner's decisions of 2026-11-16 on the audit's open questions: FW4 (the consolidation trash deletes the house
 * waybill), FW19 (no "Send & Clear"), FS14 (search engines kept off the business cards).
 */
import ApiService from "@/core/services/api.service";
import Consolidation from "@/view/pages/dashboard/Consolidation.vue";
import JosephCard from "@/view/pages/public/JosephCard.vue";
import DeepanjanCard from "@/view/pages/public/DeepanjanCard.vue";

const fs = require("fs");
const path = require("path");
const read = (file) => fs.readFileSync(path.join(__dirname, "../../resources/js/src/view/pages", file), "utf8");
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("the trash on a house row (FW4)", () => {
  const screen = () => ({
    consolidation: [{ id: 11 }, { id: 12 }], deletingHouse: null, mode: "update", form: { id: "12", tableCodes: ["EAP"] },
    $bvToast: { toast: jest.fn() },
  });
  const press = (page, id) => Consolidation.methods.deleteConsolidation.call(page, id);

  afterEach(() => jest.restoreAllMocks());

  it("deletes nothing without a yes", () => {
    const remove = jest.spyOn(ApiService, "delete");
    jest.spyOn(window, "confirm").mockReturnValue(false);
    const page = screen();

    press(page, 12);

    expect(remove).not.toHaveBeenCalled();
    expect(page.consolidation).toHaveLength(2);
  });

  it("deletes that house waybill on the server and takes the row off", async () => {
    const remove = jest.spyOn(ApiService, "delete").mockResolvedValue({});
    jest.spyOn(window, "confirm").mockReturnValue(true);
    const page = screen();

    press(page, 12);
    await flush();

    expect(remove).toHaveBeenCalledWith("/user/house-way-bills/12");
    expect(page.consolidation).toEqual([{ id: 11 }]);
    // The handling codes of the form being edited are no longer what the trash touches.
    expect(page.form.tableCodes).toEqual(["EAP"]);
    // It was the one open for editing, so the edit form closes.
    expect(page.mode).toBe("");
    expect(page.$bvToast.toast).toHaveBeenCalledWith("House waybill 12 was deleted.", expect.objectContaining({ title: "Deleted" }));
    expect(page.deletingHouse).toBeNull();
  });

  it("keeps the row and says why when the server refuses", async () => {
    jest.spyOn(ApiService, "delete").mockRejectedValue({ response: { status: 403, data: { message: "Unauthorized to delete this house way bill" } } });
    jest.spyOn(window, "confirm").mockReturnValue(true);
    const page = screen();

    press(page, 11);
    await flush();

    expect(page.consolidation).toHaveLength(2);
    expect(page.$bvToast.toast).toHaveBeenCalledWith(
      "House waybill 11 was NOT deleted. Unauthorized to delete this house way bill", expect.objectContaining({ title: "Not deleted" }));
  });

  it("ignores a second click while one delete is under way", () => {
    const remove = jest.spyOn(ApiService, "delete").mockReturnValue(new Promise(() => {}));
    jest.spyOn(window, "confirm").mockReturnValue(true);
    const page = screen();

    press(page, 11);
    press(page, 12);

    expect(remove).toHaveBeenCalledTimes(1);
  });
});

describe("Send & Clear (FW19)", () => {
  it.each(["dashboard/FocusAir.vue", "dashboard/HouseWayBill.vue"])("%s offers Send once", (page) => {
    const source = read(page);

    expect(source).not.toMatch(/Send & Clear/);
    expect(source.match(/@click="form\.status='send';">Send<\/b-button>/g)).toHaveLength(1);
  });
});

describe("the business cards (FS14)", () => {
  it.each([["Joseph", JosephCard], ["Deepanjan", DeepanjanCard]])("%s's card asks search engines to skip it", (name, card) => {
    const robots = card.metaInfo.call({}).meta.find((tag) => tag.name === "robots");

    expect(robots.content).toBe("noindex, nofollow, noarchive, nosnippet");
  });

  it("are not named in robots.txt or the sitemap, which would publish their addresses", () => {
    const root = path.join(__dirname, "../../public");

    ["robots.txt", "sitemap.xml"].filter((file) => fs.existsSync(path.join(root, file))).forEach((file) => {
      expect(fs.readFileSync(path.join(root, file), "utf8")).not.toMatch(/joseph-ceo|deepanjan-coo/);
    });
  });
});

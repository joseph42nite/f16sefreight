/**
 * Frontend audit FM7: a pick-list of clients or partners held one page of 500, so number 501 could not be chosen.
 * `wholeList` reads every page the server says there is.
 */
import ApiService from "@/core/services/api.service";
import { wholeList, MOST_PAGES } from "@/core/services/wholeList";

const rows = (from, count) => Array.from({ length: count }, (_, i) => ({ id: from + i, name: "Client " + (from + i) }));
const answer = (data, lastPage) => Promise.resolve({ data: { data, last_page: lastPage } });

afterEach(() => jest.restoreAllMocks());

describe("wholeList", () => {
  it("asks once when the list fits on a page", async () => {
    const get = jest.spyOn(ApiService, "get").mockImplementation(() => answer(rows(1, 3), 1));

    expect(await wholeList("/customers")).toEqual(rows(1, 3));
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith("/customers?per_page=500");
  });

  it("reads the other pages when there are more, in order", async () => {
    const pages = { 1: rows(1, 500), 2: rows(501, 500), 3: rows(1001, 20) };
    const get = jest.spyOn(ApiService, "get").mockImplementation((url) => {
      const page = Number((url.match(/[?&]page=(\d+)/) || [])[1] || 1);
      return answer(pages[page], 3);
    });

    const all = await wholeList("/customers");

    expect(all).toHaveLength(1020);
    expect(all[500]).toEqual({ id: 501, name: "Client 501" });
    expect(all[1019].id).toBe(1020);
    expect(get.mock.calls.map((c) => c[0])).toEqual([
      "/customers?per_page=500", "/customers?per_page=500&page=2", "/customers?per_page=500&page=3",
    ]);
  });

  it("keeps a filter on every page and leaves an empty one out", async () => {
    const get = jest.spyOn(ApiService, "get").mockImplementation(() => answer(rows(1, 1), 2));

    await wholeList("/partners", { type: "co loader", q: "" });

    expect(get.mock.calls.map((c) => c[0])).toEqual([
      "/partners?per_page=500&type=co%20loader", "/partners?per_page=500&type=co%20loader&page=2",
    ]);
  });

  it("lists a row once when it turns up on two pages", async () => {
    jest.spyOn(ApiService, "get").mockImplementation((url) => (/page=2/.test(url) ? answer([{ id: 2 }, { id: 3 }], 2) : answer([{ id: 1 }, { id: 2 }], 2)));

    expect((await wholeList("/customers")).map((r) => r.id)).toEqual([1, 2, 3]);
  });

  it("is an empty list for an answer with no rows", async () => {
    jest.spyOn(ApiService, "get").mockImplementation(() => Promise.resolve({ data: {} }));

    expect(await wholeList("/customers")).toEqual([]);
  });

  it("stops at a ceiling when the server claims an absurd number of pages", async () => {
    const get = jest.spyOn(ApiService, "get").mockImplementation(() => answer([], 100000));

    await wholeList("/customers");

    expect(get).toHaveBeenCalledTimes(MOST_PAGES);
  });

  it("fails when a page fails, so the caller's own handling runs", async () => {
    jest.spyOn(ApiService, "get").mockImplementation((url) => (/page=2/.test(url) ? Promise.reject(new Error("down")) : answer(rows(1, 500), 2)));

    await expect(wholeList("/customers")).rejects.toThrow("down");
  });
});

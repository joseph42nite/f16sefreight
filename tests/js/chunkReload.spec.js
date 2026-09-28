import { isChunkLoadError, reloadOnChunkError } from "@/core/services/chunkReload";

/*
 * A tab from before a deploy asks for a chunk the deploy removed: load the page it was
 * going to, once.
 */
const memory = () => {
  const data = {};
  return { getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = v; } };
};
const chunkError = () => Object.assign(new Error("Loading chunk 1118 failed.\n(error: /js/chunk/1118.abc.js)"), { name: "ChunkLoadError" });

describe("reloading on a missing chunk", () => {
  it("recognises webpack's chunk errors and nothing else", () => {
    expect(isChunkLoadError(chunkError())).toBe(true);
    expect(isChunkLoadError(new Error("Loading CSS chunk 12 failed."))).toBe(true);
    expect(isChunkLoadError(new TypeError("x is undefined"))).toBe(false);
  });

  it("loads the page the person was going to", () => {
    const location = { assign: jest.fn(), href: "/boss" };
    expect(reloadOnChunkError(chunkError(), "/billing?tab=gst", { storage: memory(), location, now: 1e6 })).toBe(true);
    expect(location.assign).toHaveBeenCalledWith("/billing?tab=gst");
  });

  it("reloads once — a second failure within a minute is left alone", () => {
    const storage = memory();
    const location = { assign: jest.fn(), href: "/boss" };
    reloadOnChunkError(chunkError(), "/billing", { storage, location, now: 1e6 });
    expect(reloadOnChunkError(chunkError(), "/billing", { storage, location, now: 1e6 + 5000 })).toBe(false);
    expect(location.assign).toHaveBeenCalledTimes(1);
  });

  it("does not reload when it cannot remember doing so", () => {
    const blocked = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };
    const location = { assign: jest.fn(), href: "/boss" };
    expect(reloadOnChunkError(chunkError(), "/billing", { storage: blocked, location })).toBe(false);
    expect(location.assign).not.toHaveBeenCalled();
  });

  it("ignores ordinary errors", () => {
    const location = { assign: jest.fn(), href: "/boss" };
    expect(reloadOnChunkError(new Error("Request failed"), "/billing", { storage: memory(), location })).toBe(false);
  });
});

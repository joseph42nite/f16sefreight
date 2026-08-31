/**
 * The console recorder — PRD §5.10.
 *
 * 🔴 The rule under test: the recorder must never SWALLOW output. A reporter that
 * intercepted errors and forgot to re-emit them would blind the devtools of the person
 * debugging the very bug being reported.
 *
 * ⚠️ The spy is installed BEFORE the recorder, and never replaced afterwards. That
 * mirrors the real lifecycle — `install()` runs once at boot and wraps whatever
 * `console.error` is at that moment — and an earlier version of this spec reassigned
 * `console.error` after install, which silently unhooked the wrapper and made every
 * assertion read an empty buffer.
 */
import recorder from "@/core/services/console.recorder";

const seen = [];

beforeAll(() => {
  console.error = (...args) => seen.push(args.join(" "));
  console.warn = () => {};
  recorder.install();
});

beforeEach(() => {
  recorder.clear();
  seen.length = 0;
});

describe("console recorder", () => {
  it("records an error and still passes it through", () => {
    console.error("boom");

    expect(recorder.entries().map((e) => e.text)).toContain("boom");
    expect(seen).toContain("boom");  // 🔴 the original still ran
  });

  it("serialises an Error, which would not survive JSON", () => {
    console.error(new TypeError("bad thing"));

    expect(recorder.entries().pop().text).toContain("bad thing");
  });

  it("records the level, so a warning is not read as a failure", () => {
    console.warn("just a warning");

    expect(recorder.entries().pop().level).toBe("warn");
  });

  it("keeps a bounded buffer, dropping the oldest", () => {
    for (let i = 0; i < 60; i++) console.error("line " + i);

    const texts = recorder.entries().map((e) => e.text);
    expect(texts.length).toBeLessThanOrEqual(50);
    expect(texts).toContain("line 59");
    expect(texts).not.toContain("line 0");
  });

  it("truncates per entry, so one huge stack cannot evict the lines around it", () => {
    console.error("x".repeat(5000));
    console.error("the line after");

    const texts = recorder.entries().map((e) => e.text);
    expect(texts[0].length).toBeLessThanOrEqual(2000);
    expect(texts).toContain("the line after");
  });

  it("clears on request, so one report's logs do not leak into the next", () => {
    console.error("first report");
    recorder.clear();

    expect(recorder.entries()).toEqual([]);
  });

  it("survives an unserialisable object rather than throwing inside the reporter", () => {
    const circular = {};
    circular.self = circular;

    expect(() => console.error(circular)).not.toThrow();
    expect(recorder.entries().pop().text).toContain("unserialisable");
  });
});

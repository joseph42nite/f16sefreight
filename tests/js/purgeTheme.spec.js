/**
 * The rule that decides which of the old theme's styles survive (build/purge-theme.js, 2026-11-15 frontend audit
 * FP3). A mistake here shows up as a screen that looks subtly wrong, so each way a class can be "written
 * somewhere" is pinned down, with the three cases the on-screen comparison caught while it was being written.
 */
const postcss = require("postcss");
const { reasonFor, keptSelectors, withoutNot, purge, isTheme } = require("../../build/purge-theme");

describe("a class is kept when", () => {
  it("it is written in the app's source", () => {
    expect(reasonFor("btn-primary")).toBe("written");
    expect(reasonFor("fx-rail__item")).toBe("written");
  });

  it("a library writes it", () => {
    expect(reasonFor("swal2-popup")).not.toBeNull();
    expect(reasonFor("modal-backdrop")).not.toBeNull();
  });

  it("a library our library depends on writes it (the blog editor's toolbar)", () => {
    expect(reasonFor("ql-picker-label")).not.toBeNull();
    expect(reasonFor("ql-toolbar")).not.toBeNull();
  });

  it("a library builds it from a prefix and a word of ours", () => {
    expect(reasonFor("modal-lg")).toMatch(/builds it/);
    expect(reasonFor("b-toast-danger")).toMatch(/builds it/);
  });

  it("a script adds an ending to a base name", () => {
    expect(reasonFor("navbar-toggler-icon")).toMatch(/built from a base name/);   // BootstrapVue
    expect(reasonFor("aside-on")).toMatch(/built from a base name/);              // the theme's own script
  });

  it("it is part of Bootstrap's grid, or assembled by BootstrapVue from three pieces", () => {
    ["col-md-6", "offset-lg-2", "order-1", "col-auto", "col"].forEach((c) => expect(reasonFor(c)).not.toBeNull());
    // Written nowhere: only the grid rule keeps it.
    expect(reasonFor("offset-xl-7")).toBe("grid");
    expect(reasonFor("bs-popover-top")).not.toBeNull();
    expect(reasonFor("b-tooltip-danger")).not.toBeNull();
  });
});

describe("a class is dropped when", () => {
  it.each(["btn-hover-light-primary", "symbol-light-success-hover", "fc-event-harness", "min-w-475px", "select2-container"])(
    "nothing writes or builds %s", (cls) => expect(reasonFor(cls)).toBeNull());
});

describe("a selector", () => {
  it("is kept whole when every class in it can exist", () => {
    expect(keptSelectors(".btn.btn-primary:hover")).toBe(".btn.btn-primary:hover");
  });

  it("loses only the comma-separated parts that can never match", () => {
    expect(keptSelectors(".btn-primary,.btn-hover-light-primary")).toBe(".btn-primary");
    expect(keptSelectors(".btn-hover-light-primary,.fc-event-harness")).toBe("");
  });

  it("is always kept with no class in it", () => {
    ["body", "a:hover", "*,::after,::before", "input[type=number]", ":root", "#kt_header"].forEach((s) => expect(keptSelectors(s)).toBe(s));
  });

  it("does not need a class that stands inside :not()", () => {
    // What it must NOT have. The platform pages' top spacing depended on exactly this rule.
    const selector = ".subheader-enabled:not(.subheader-mobile-fixed) .content";

    expect(reasonFor("subheader-mobile-fixed")).toBeNull();
    expect(keptSelectors(selector)).toBe(selector);
    expect(withoutNot(".a:not(.b):not(.c .d) .e")).toBe(".a .e");
  });

  it("does not read an attribute's value as a class", () => {
    expect(keptSelectors('[class*="col-"]')).toBe('[class*="col-"]');
    expect(keptSelectors('a[href$=".fc-event-harness"]')).toBe('a[href$=".fc-event-harness"]');
  });
});

describe("the stylesheet", () => {
  const run = (css) => { const root = postcss.parse(css); const stats = purge(root); return { css: root.toString(), stats }; };

  it("keeps keyframes, font faces and classless rules; drops dead rules and the @media left empty", () => {
    const { css, stats } = run([
      "body{margin:0}",
      "@font-face{font-family:X;src:url(x.woff2)}",
      "@keyframes fc-spin{from{opacity:0}to{opacity:1}}",
      ".btn-primary{color:red}",
      ".fc-event-harness{color:blue}",
      "@media (min-width:992px){.select2-container{display:none}}",
      "@media (min-width:992px){.btn-primary{color:green}.btn-hover-light-primary{color:pink}}",
    ].join(""));

    expect(css).toContain("body{margin:0}");
    expect(css).toContain("@font-face");
    expect(css).toContain("@keyframes fc-spin");
    expect(css).toContain(".btn-primary{color:red}");
    expect(css).not.toContain("fc-event-harness{");
    expect(css).not.toContain("select2-container");
    expect(css).toContain("@media (min-width:992px){.btn-primary{color:green}}");
    expect(stats.removed).toBe(3);
  });

  it("is only ever the theme's own: no page's styles go through it", () => {
    expect(isTheme("/x/resources/js/src/App.vue")).toBe(true);
    expect(isTheme("/x/resources/js/src/App.vue?vue&type=style&index=0&lang=scss")).toBe(true);
    expect(isTheme("/x/resources/js/src/view/pages/freight/Billing.vue")).toBe(false);
    expect(isTheme("/x/resources/css/app.css")).toBe(false);
  });
});

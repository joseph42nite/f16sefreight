/**
 * The app registers only the Bootstrap icons its source names (2026-11-15 frontend audit, FP3). An icon missing
 * from the list draws as an empty box and nothing else complains, so the list is checked here on every run — and
 * the pre-push hook runs this.
 */
const fs = require("fs");
const path = require("path");
const { usedIcons, render, TARGET } = require("../../build/used-icons");

const SOURCE = path.join(__dirname, "../../resources/js/src");
const pascal = (name) => name.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
const vueFiles = (dir, found = []) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const file = path.join(dir, entry.name);

    if (entry.isDirectory()) return entry.name === "assets" ? null : vueFiles(file, found);
    if (entry.name.endsWith(".vue")) found.push(file);

    return null;
  });

  return found;
};

it("the written list is what the source names today", () => {
  // Out of date? Run `node build/used-icons.js` (a build does it too) and commit the file.
  expect(fs.readFileSync(TARGET, "utf8")).toBe(render(usedIcons()));
});

it("every icon written in a template is registered", () => {
  const library = require("bootstrap-vue");
  const registered = new Set(usedIcons());
  const missing = [];

  vueFiles(SOURCE).forEach((file) => {
    (fs.readFileSync(file, "utf8").match(/<b-icon[^>]*?\sicon="[a-z0-9-]+"/g) || []).forEach((tag) => {
      const component = "BIcon" + pascal(tag.match(/icon="([a-z0-9-]+)"/)[1]);

      // A name the library does not have draws nothing with or without this list; that is another matter.
      if (library[component] && !registered.has(component)) missing.push(`${path.basename(file)}: ${component}`);
    });
  });

  expect(missing).toEqual([]);
});

it("finds an icon named far from where it is drawn", () => {
  // `:icon="item.icon"` with the name in a list: any quoted word that is an icon's name is kept.
  expect(usedIcons()).toEqual(expect.arrayContaining(["BIconInbox", "BIconChatDots", "BIconCheckLg", "BIconLink45deg"]));
  expect(usedIcons().length).toBeLessThan(400);
});

it("the app installs the list, not the whole set", () => {
  const plugin = fs.readFileSync(path.join(SOURCE, "core/plugins/bootstrap-vue.js"), "utf8");

  expect(plugin).not.toMatch(/IconsPlugin/);
  expect(plugin).toMatch(/from "\.\/bootstrap-icons\.generated"/);
});

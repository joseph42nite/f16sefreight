/**
 * Fonts come from our own site. Every component's styles end up in the one shared stylesheet, so a single
 * `@import url(https://fonts.googleapis.com/...)` in any page makes every page of every portal wait on Google
 * before it can paint (two card pages did exactly that until 2026-11-17).
 */
const fs = require("fs");
const path = require("path");

const ROOTS = ["resources/js/src", "resources/css", "resources/views"].map(p => path.join(__dirname, "../..", p));
const SKIP = path.join("assets", "plugins");

function files(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (full.includes(SKIP)) continue;
        if (entry.isDirectory()) files(full, out);
        else if (/\.(vue|js|scss|css|php)$/.test(entry.name)) out.push(full);
    }
    return out;
}

describe("fonts", () => {
    it("are never imported from an outside font service", () => {
        const offenders = ROOTS.filter(fs.existsSync)
            .flatMap(root => files(root))
            .filter(file => /fonts\.(googleapis|gstatic)\.com|use\.typekit\.net|fonts\.bunny\.net/.test(fs.readFileSync(file, "utf8")))
            .map(file => path.relative(path.join(__dirname, "../.."), file));
        expect(offenders).toEqual([]);
    });

    it("has every Inter weight the pages ask for", () => {
        const app = fs.readFileSync(path.join(ROOTS[0], "App.vue"), "utf8");
        for (const weight of [300, 400, 500, 600, 700, 800, 900]) {
            expect(app).toContain(`@fontsource/inter/${weight}.css`);
        }
    });
});

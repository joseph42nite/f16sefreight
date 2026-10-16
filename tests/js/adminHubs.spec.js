import { ADMIN_HUBS, hubFor } from "@/core/config/adminHubs";

const fs = require("fs");
const path = require("path");

/**
 * The superadmin portal in five hubs (owner, 2026-10-11). Nothing the portal had may fall out of the menu: every
 * superadmin route in the router belongs to exactly one hub.
 */
describe("admin hubs", () => {
  const router = fs.readFileSync(path.join(__dirname, "../../resources/js/src/router.js"), "utf8");
  const block = router.slice(router.indexOf('path: "/superadmin/"'), router.indexOf("-----------superadmin route", 0) + 1 || undefined);
  const start = router.indexOf('path: "/superadmin/"');
  const end = router.indexOf("\n    },\n", start);
  const paths = [...router.slice(start, end).matchAll(/path: ["']([a-z-]+)(?:\/:[a-z?]+)?["']/g)]
    .map((m) => "/superadmin/" + m[1]).filter((p) => p !== "/superadmin/");

  it("is five hubs", () => expect(ADMIN_HUBS.map((h) => h.label)).toEqual(["Overview", "Tickets", "Tenants", "Library", "Settings"]));

  it("puts every superadmin page in exactly one hub", () => {
    expect(paths.length).toBeGreaterThan(15);
    paths.forEach((p) => {
      const owners = ADMIN_HUBS.filter((h) => h.tabs.some((t) => t.to === p) || (h.hidden || []).includes(p));
      expect([p, owners.length]).toEqual([p, 1]);
    });
  });

  it("finds a form's hub with its id on the end", () => {
    expect(hubFor("/superadmin/new-branch/12").key).toBe("tenants");
    expect(hubFor("/superadmin/monitor").key).toBe("overview");
    expect(hubFor("/focus-air")).toBeNull();
  });
});

/**
 * The admin findings of the 2026-11-15 frontend audit (FA4–FA9). `serverMessage` is run; the pages are read from
 * the source, as frontendAuditFixes.spec.js does: they do not mount in jest.
 */
const fs = require("fs");
const path = require("path");
const { serverMessage } = require("../../resources/js/src/core/services/serverMessage");

const read = (file) => fs.readFileSync(path.join(__dirname, "../../resources/js/src", file), "utf8");

describe("serverMessage", () => {
  const refused = (status, data) => ({ response: { status, data } });

  it("prefers the server's own words", () => {
    expect(serverMessage(refused(422, { error: "Already used." }))).toBe("Already used.");
    expect(serverMessage(refused(422, { message: "Invalid", errors: { email: ["That address is taken."] } })))
      .toBe("That address is taken.");
    expect(serverMessage(refused(403, { message: "Forbidden." }))).toBe("Forbidden.");
  });

  it("falls back to what the caller says, then to the status", () => {
    expect(serverMessage(refused(500, "<html>"), "The user could not be saved.")).toBe("The user could not be saved.");
    expect(serverMessage(refused(500, null))).toBe("The server refused that (500).");
  });

  it("says when there was no answer at all", () => {
    expect(serverMessage(new Error("Network Error"), "x")).toMatch(/Could not reach the server/);
  });
});

describe("saves that failed silently (FA8)", () => {
  it.each([
    ["view/pages/admin/NewUsers.vue", /this\.saveError = serverMessage\(err/g, 2],
    ["view/pages/admin/NewCompany.vue", /\.catch\(failed\)/g, 2],
    ["view/pages/admin/NewBranch.vue", /\.catch\(failed\)/g, 2],
  ])("%s shows why", (file, pattern, times) => {
    const source = read(file);

    expect(source.match(pattern)).toHaveLength(times);
    expect(source).toMatch(/v-if="saveError"/);
    expect(source).not.toMatch(/\.catch\(\(?err\)? => \{\s*\}\)/);
  });

  it("the reset form says why a reset was refused", () => {
    const source = read("view/pages/public/PasswordForgotForm.vue");

    expect(source).toMatch(/this\.reset_error = serverMessage\(err/);
    expect(source).toMatch(/v-if="reset_error"/);
  });

  it("the admin lists say when loading or deleting failed", () => {
    const mixin = read("core/mixins/adminList.mixin.js");

    expect(mixin).toMatch(/\.catch\(\(error\) => this\.sayFailed\("The list could not be loaded", error\)\)/);
    expect(mixin).toMatch(/this\.sayFailed\("Not deleted", error\)/);
    expect(read("view/pages/admin/AllUsers.vue")).toMatch(/this\.sayFailed\("The users could not be loaded", err\)/);
  });

  it("a template save reports the server's reason, not always coordinates", () => {
    const source = read("view/pages/admin/EditSystemTemplate.vue");

    expect(source).not.toMatch(/Coordinate vectors must contain/);
    expect(source).toMatch(/Swal\.fire\("Not saved", serverMessage\(err/);
  });
});

describe("Settings (FA4, FA9)", () => {
  const source = read("view/pages/admin/Settings.vue");

  it("reads the airline list from a route that exists", () => {
    expect(source).not.toMatch(/get-airline-list/);
    expect(source).toMatch(/\/superadmin\/airlines\?per_page=500/);
    expect(source).toMatch(/:value="airline\.code"/);
  });

  it("asks before deleting every notice for a carrier", () => {
    expect(source).toMatch(/if \(!confirm\(`Delete every notice for \$\{carrier_code\}\?`\)\) return;/);
  });
});

describe("the blog editor (FA5)", () => {
  const source = read("view/pages/admin/NewBlog.vue");

  it("calls the button Publish on a draft", () => {
    expect(source).toMatch(/\{\{ isPublished \? 'Update' : 'Publish' \}\} Blog/);
    expect(source).toMatch(/isPublished\(\) \{\s+return !!\(this\.blogId && this\.blogData\.published_at\);/);
  });

  it("sends an empty takeaways when none are left", () => {
    expect(source).toMatch(/if \(!filteredTakeaways\.length\) fd\.append\('takeaways', ''\);/);
  });
});

describe("the shipments screen (FA6, FA7)", () => {
  const source = read("view/pages/admin/ClientShipments.vue");

  it("always searches and exports on the server", () => {
    expect(source).not.toMatch(/localMatches/);
    expect(source).not.toMatch(/this\.generateAndDownloadCsv\(this\.items\)/);
  });

  it("goes back to page one when the filters change", () => {
    const reset = source.slice(source.indexOf("resetFilters() {"), source.indexOf("downloadCsv() {"));

    expect(reset.match(/this\.applyFilters\(\);/g)).toHaveLength(2);
    expect(reset).not.toMatch(/this\.fetchShipments\(\);/);
  });

  it("does not offer a missing message for download", () => {
    expect(source).toMatch(/:disabled="xmlMissing" @click="downloadXml"/);
    expect(source).toMatch(/downloadXml\(\) \{\s+if \(this\.xmlMissing\) return;/);
  });
});

describe("routes that do not exist (FA9)", () => {
  it("the admin layout sends a signed-out visitor to the sign-in page", () => {
    const source = read("view/layouts/admin/Layout.vue");

    expect(source).not.toMatch(/name: "superadminlogin"/);
    expect(source).toMatch(/this\.\$router\.push\("\/sign-in"\)/);
  });

  it("the airline directory asks for every airline", () => {
    expect(read("view/pages/admin/AirlineDirectory.vue")).toMatch(/\/superadmin\/airlines\?per_page=500&q=/);
  });
});

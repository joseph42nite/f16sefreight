/**
 * The website's contact forms and the sign-in box's "Forgot Password?" (frontend audit 2026-11-15, FA1 and FA2),
 * and the rest of that batch that lives inside large pages (FC1–FC3, FS7, FK3).
 */
const fs = require("fs");
const path = require("path");
const { contactPayload, contactError } = require("../../resources/js/src/core/services/contactForm");

const read = (file) => fs.readFileSync(path.join(__dirname, "../../resources/js/src", file), "utf8");

describe("contactPayload", () => {
  it("gives the server its five fields and puts the rest in the message", () => {
    const payload = contactPayload("Quote request",
      { name: "  Asha  Menon Nair ", email: " a@x.com ", phone: "98", company: "Acme", designation: "", employees: 12 },
      { company: "Company", designation: "Designation", employees: "Employees" });

    expect(payload).toEqual({
      first_name: "Asha", last_name: "Menon Nair", email: "a@x.com", phone: "98",
      message: "[Quote request]\nCompany: Acme\nEmployees: 12",
    });
  });

  it("copes with a one-word name and a form that has no phone box", () => {
    const payload = contactPayload("Message", { name: "Asha", email: "a@x.com", message: "Hello" });

    expect(payload.last_name).toBe("-");
    expect(payload.phone).toBe("Not given");
    expect(payload.message).toBe("[Message]\nHello");
  });
});

describe("contactError", () => {
  it("shows the server's first objection, else a plain sentence", () => {
    expect(contactError({ response: { status: 422, data: { errors: { email: ["The email must be a valid email address."] } } } }))
      .toBe("The email must be a valid email address.");
    expect(contactError({ response: { status: 429, data: {} } })).toMatch(/Too many/);
    expect(contactError({})).toMatch(/could not be sent/);
  });
});

describe("the pages", () => {
  it("all three contact forms post", () => {
    const source = read("view/pages/public/ContactUs.vue");

    ["query", "quote", "feedback"].forEach((key) => expect(source).toContain(`@submit.prevent="send('${key}')"`));
    expect(source).not.toMatch(/<form class="ultra-form">/);
    expect(source).not.toMatch(/<button type="button" class="ultra-submit-btn"/);
    expect(source).toMatch(/ApiService\.post\("\/contact", payload\)/);
    expect(source).not.toMatch(/console\.log\("Form submitted"\)/);
  });

  it("Forgot Password asks for the reset mail instead of opening the contact page", () => {
    const source = read("view/layouts/public/AuthModals.vue");

    expect(source).toMatch(/ApiService\.post\("\/Forgotpassword", \{ email \}\)/);
    expect(source).not.toMatch(/to="\/contact-us" class="forgot-pwd"/);
  });

  it("the inbox does not reopen a conversation over a reply being typed (FC2)", () => {
    const source = read("view/pages/freight/JobInbox.vue");

    expect(source).toMatch(/this\.active\.id === claimed && !this\.composing/);
    expect(source).not.toMatch(/setTimeout\(\(\) => \{ this\.open\(this\.active\); \}, 60000\)/);
  });

  it("each shipment gets its own extraction panel (FC1)", () => {
    expect(read("view/pages/freight/JobInbox.vue")).toMatch(/ref="extraction"\s+:key="'extraction-' \+ \(active\.job \? active\.job\.id : 'none'\)"/);
  });

  it.each(["JobInbox.vue", "Financials.vue", "Collections.vue", "ImportJob.vue", "components/NewMail.vue",
    "components/ClientUpdateEditor.vue", "components/TeamMails.vue"])("%s takes semicolons between addresses (FC3)", (file) => {
    const source = read("view/pages/freight/" + file);

    expect(source).toMatch(/split\(\/\[,;\]\/\)/);
  });

  it.each([["view/layouts/admin/aside/Menu.vue", "/superadmin/logout"], ["view/layouts/public/Header.vue", "/user/logout"]])(
    "%s ends the session on the server (FS7)", (file, url) => {
      const source = read(file);

      expect(source).toContain(`ApiService.post("${url}", {})`);
      expect(source).toMatch(/import ApiService from/);
    });

  it("a check with no answer does not throw (FK3)", () => {
    const source = read("core/services/store/auth.module.js");

    expect(source).not.toMatch(/\.catch\(\(\{ response \}\) => \{\s+if \(response\.status == 401\)/);
    expect(source).toMatch(/if \(!response\) return;/);
  });
});

/**
 * Frontend audit, duplicates: the address split was written in eight places and the mail form in four. FC3 (a
 * semicolon between addresses sent them as one) came from the copies drifting apart.
 */
import fs from "fs";
import path from "path";
import { addressList, mailForm } from "@/core/services/mail";

const source = (name) => fs.readFileSync(path.resolve(__dirname, "../../resources/js/src/view/pages/freight", name), "utf8");

describe("addressList", () => {
  it("splits on a comma or a semicolon and drops the blanks", () => {
    expect(addressList("a@x.com; b@y.com , c@z.com,, ")).toEqual(["a@x.com", "b@y.com", "c@z.com"]);
  });

  it("is empty for nothing typed", () => {
    expect(addressList("")).toEqual([]);
    expect(addressList(null)).toEqual([]);
    expect(addressList(undefined)).toEqual([]);
  });

  it("takes a list as it is, trimmed", () => {
    expect(addressList([" a@x.com ", "", null, "b@y.com"])).toEqual(["a@x.com", "b@y.com"]);
  });
});

describe("mailForm", () => {
  const entries = (form) => [...form.entries()];

  it("is a plain mail with the signature when nothing else is said", () => {
    const form = mailForm({ to: "a@x.com; b@y.com", subject: "Payment", body: "<p>Hello</p>" });

    expect(entries(form)).toEqual([
      ["to[]", "a@x.com"], ["to[]", "b@y.com"],
      ["subject", "Payment"], ["body", "<p>Hello</p>"], ["include_signature", "1"],
    ]);
  });

  it("carries a reply's copies, mode, conversation and files", () => {
    const file = new File(["x"], "awb.pdf", { type: "application/pdf" });
    const form = mailForm({
      to: "a@x.com", cc: "c@z.com, d@z.com", subject: "Re: AWB", body: "ok", includeSignature: false,
      mode: "reply", inReplyTo: 41, attachmentIds: [7, 8], files: [file],
    });

    expect(form.getAll("cc[]")).toEqual(["c@z.com", "d@z.com"]);
    expect(form.get("include_signature")).toBe("0");
    expect(form.get("mode")).toBe("reply");
    expect(form.get("in_reply_to")).toBe("41");
    expect(form.getAll("attachment_ids[]")).toEqual(["7", "8"]);
    expect(form.getAll("files[]")).toHaveLength(1);
    expect(form.get("files[]").name).toBe("awb.pdf");
  });

  it("leaves out what a mail does not have, and never writes 'undefined'", () => {
    const form = mailForm({ to: "a@x.com" });

    expect(form.has("cc[]")).toBe(false);
    expect(form.has("mode")).toBe(false);
    expect(form.has("in_reply_to")).toBe(false);
    expect(form.get("subject")).toBe("");
    expect(form.get("body")).toBe("");
  });
});

describe("the pages that send mail", () => {
  const pages = [
    "JobInbox.vue", "Financials.vue", "Collections.vue", "ImportJob.vue", "components/NewMail.vue",
    "components/TeamMails.vue", "components/ClientUpdateEditor.vue", "components/InvoiceMailCard.vue",
  ];

  it.each(pages)("%s splits addresses with the shared helper", (name) => {
    const text = source(name);
    expect(text).toContain('from "@/core/services/mail"');
    expect(text).not.toContain("split(/[,;]/)");
  });

  it.each(["JobInbox.vue", "Financials.vue", "Collections.vue", "components/NewMail.vue"])("%s builds its mail with mailForm", (name) => {
    const text = source(name);
    expect(text).toContain("mailForm(");
    expect(text).not.toContain('form.append("to[]"');
  });
});

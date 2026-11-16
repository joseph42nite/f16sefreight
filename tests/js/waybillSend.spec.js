/**
 * What the Master and House AWB screens say after a save or a Send (frontend audit 2026-11-15, FW1 and FW2).
 */
const fs = require("fs");
const path = require("path");
const { saveOutcome, failureMessage } = require("../../resources/js/src/core/services/waybillSend");
const mixin = require("../../resources/js/src/core/mixins/airWayBillMixin").default;

describe("saveOutcome", () => {
  it("says saved for a draft or a PDF, whatever send_response holds", () => {
    expect(saveOutcome("draft", { send_response: [] }, "e-AWB")).toEqual({ success: "-e-AWB Saved in database -Pass", error: "" });
    expect(saveOutcome("generate_pdf", {}, "e-HSWB").success).toBe("-e-HSWB Saved in database -Pass");
  });

  it("says sent only when the gateway gave a transaction id", () => {
    const sent = saveOutcome("send", { send_response: { status: "success", data: { tid: "T1" } } }, "e-AWB");
    expect(sent).toEqual({ success: "-e-AWB Sent to the airline -Pass", error: "" });

    expect(saveOutcome("send", { send_response: { status: "success", data: {} } }, "e-AWB").success).toBe("");
    expect(saveOutcome("send", { send_response: [] }, "e-AWB").success).toBe("");
    expect(saveOutcome("send", {}, "e-AWB").error).toMatch(/NOT SENT/);
  });

  it("shows the server's reason for a refused send, escaped", () => {
    const refused = saveOutcome("send", { send_response: { status: "failed", error: "The airline gateway did not accept <the> message." } }, "e-AWB");

    expect(refused.success).toBe("");
    expect(refused.error).toContain("NOT SENT to the airline. The airline gateway did not accept &lt;the&gt; message.");
    expect(refused.error).toContain("The waybill itself is saved.");
  });
});

describe("failureMessage", () => {
  it("lists a 422's field errors through the screen's own formatter", () => {
    const error = { response: { status: 422, data: { errors: { a: ["First <b>"], b: ["Second"] } } } };

    expect(failureMessage(error, (m) => m.toUpperCase())).toBe("FIRST &lt;B&gt;<br>SECOND<br>");
  });

  it("shows the message of a 422 with no field errors, a 403 and a 404", () => {
    const say = (status, data) => failureMessage({ response: { status, data } });

    expect(say(422, { message: "The waybill has no charges. Complete it, then send again." })).toBe("The waybill has no charges. Complete it, then send again.");
    expect(say(403, { message: "You are not allowed to send to the airline." })).toBe("You are not allowed to send to the airline.");
    expect(say(404, { message: "Waybill not found." })).toBe("Waybill not found.");
  });

  it("never comes back empty", () => {
    expect(failureMessage({ response: { status: 500, data: { message: "Server Error" } } })).toMatch(/error \(500\)/);
    expect(failureMessage({ response: { status: 419, data: "" } })).toMatch(/error \(419\)/);
    expect(failureMessage({})).toMatch(/could not be reached/);
  });
});

describe("noEnterSubmit", () => {
  const press = (tagName) => {
    const event = { target: { tagName }, preventDefault: jest.fn() };
    mixin.methods.noEnterSubmit(event);

    return event.preventDefault.mock.calls.length;
  };

  it("stops Enter in a text box and nowhere else", () => {
    expect(press("INPUT")).toBe(1);
    expect(press("TEXTAREA")).toBe(0);
    expect(press("BUTTON")).toBe(0);
  });
});

describe.each(["dashboard/FocusAir.vue", "dashboard/HouseWayBill.vue"])("%s", (page) => {
  const source = fs.readFileSync(path.join(__dirname, "../../resources/js/src/view/pages", page), "utf8");

  it("reads the gateway's answer on both create and update, and never prints Pass unread", () => {
    expect(source.match(/saveOutcome\(asked, response\.data, /g)).toHaveLength(2);
    expect(source.match(/failureMessage\(error/g)).toHaveLength(2);
    expect(source).not.toMatch(/successMessage = '-e-/);
  });

  it("a PDF link saves and never sends", () => {
    // One copy, in the mixin both pages share; run, not read.
    expect(source).not.toMatch(/handleSaveAndGeneratePDF\(pdf_generate_type\) \{/);

    const page = { form: { status: "send" }, generatePDFAfterSave: null, onSubmit: jest.fn(function () { this.sentAs = this.form.status; }) };
    mixin.methods.handleSaveAndGeneratePDF.call(page, "classic");

    expect(page.onSubmit).toHaveBeenCalledTimes(1);
    expect(page.sentAs).toBe("generate_pdf");
    expect(page.generatePDFAfterSave).toBe("classic");
  });

  it("does not submit on Enter", () => {
    expect(source).toMatch(/<b-form @submit\.prevent="onSubmit" @keydown\.enter="noEnterSubmit">/);
  });
});

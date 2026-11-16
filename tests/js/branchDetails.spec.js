/**
 * The branch's details on a waybill form (owner, 2026-11-16; 2026-11-15 frontend audit FW15): nothing is saved while
 * typing; on Send, a changed box raises one question — save to the branch for future shipments, or not.
 */
import ApiService from "@/core/services/api.service";
import mixin from "@/core/mixins/airWayBillMixin";
import { branchDetailsOn, changedBranchDetails, branchDetailsQuestion } from "@/core/services/branchDetails";

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const branch = { agent_name: "Demo BOM", agent_address: "1 Cargo Rd", agent_city: "Mumbai", agent_pincode: "400099",
  agent_issue_sign: null, participant: 0, iata_agent_code: "1234567", iata_agent_cass: "0042" };
const boxes = (over = {}, iata = {}) => [{ ...branch, ...over }, { iata_agent_code: "1234567", iata_agent_cass: "0042", ...iata }];

describe("what changed", () => {
  const loaded = branchDetailsOn(...boxes());

  it("is nothing when the boxes are as the branch has them", () => {
    expect(changedBranchDetails(loaded, branchDetailsOn(...boxes()))).toEqual([]);
    // Empty where the branch has nothing, spaces, and a 0 that arrives as "0" are not changes.
    expect(changedBranchDetails(loaded, branchDetailsOn(...boxes({ agent_issue_sign: "  ", participant: "0" })))).toEqual([]);
  });

  it("names each changed box, with the IATA pair read from its own boxes", () => {
    const now = branchDetailsOn(...boxes({ agent_issue_sign: "A. Rao" }, { iata_agent_code: "7654321" }));

    expect(changedBranchDetails(loaded, now)).toEqual([
      { key: "iata_agent_code", label: "IATA code", from: "1234567", to: "7654321" },
      { key: "agent_issue_sign", label: "Issuing signature", from: "", to: "A. Rao" },
    ]);
  });

  it("asks nothing before the branch's details have arrived", () => {
    expect(changedBranchDetails(null, branchDetailsOn(...boxes({ agent_city: "Pune" })))).toEqual([]);
  });

  it("puts the question in plain words", () => {
    const question = branchDetailsQuestion([{ key: "agent_issue_sign", label: "Issuing signature", from: "", to: "A. Rao" }]);

    expect(question).toContain("Issuing signature: (empty) → A. Rao");
    expect(question).toContain("for this and future shipments");
    expect(question).toContain("sent with the branch's saved details");
  });
});

describe("on Send", () => {
  const form = (answer, over = {}, iata = {}) => {
    const [agent_information, iata_cass] = boxes(over, iata);
    const page = {
      agent_information, iata_cass, branchDetailsLoaded: branchDetailsOn(...boxes()), branchDetailsSettled: false,
      main_error_msg: "", onSubmit: jest.fn(),
      $bvModal: { msgBoxConfirm: jest.fn(() => Promise.resolve(answer)) },
      $set: (target, key, value) => { target[key] = value; },
    };
    Object.keys(mixin.methods).forEach((name) => { page[name] = page[name] || mixin.methods[name].bind(page); });

    return page;
  };

  afterEach(() => jest.restoreAllMocks());

  it("asks nothing and saves nothing when no box was changed", () => {
    const put = jest.spyOn(ApiService, "put");
    const page = form(true);

    expect(page.branchDetailsAllowSend("send")).toBe(true);
    expect(page.$bvModal.msgBoxConfirm).not.toHaveBeenCalled();
    expect(put).not.toHaveBeenCalled();
  });

  it("asks nothing for a draft or a PDF, whatever was typed", () => {
    const page = form(true, { agent_city: "Pune" });

    expect(page.branchDetailsAllowSend("draft")).toBe(true);
    expect(page.branchDetailsAllowSend("generate_pdf")).toBe(true);
    expect(page.$bvModal.msgBoxConfirm).not.toHaveBeenCalled();
  });

  it("Save: updates the branch with the changed boxes only, then sends", async () => {
    const put = jest.spyOn(ApiService, "put").mockResolvedValue({ data: { status: true } });
    const page = form(true, { agent_issue_sign: "A. Rao" }, { iata_agent_cass: "" });

    expect(page.branchDetailsAllowSend("send")).toBe(false);
    expect(page.onSubmit).not.toHaveBeenCalled();
    await flush();

    expect(put).toHaveBeenCalledWith("/user/agent-info", { iata_agent_cass: null, agent_issue_sign: "A. Rao" });
    expect(page.onSubmit).toHaveBeenCalledTimes(1);
    // The second pass goes straight through, and the next Send asks again only if something changes again.
    expect(page.branchDetailsAllowSend("send")).toBe(true);
    expect(page.branchDetailsSettled).toBe(false);
    expect(changedBranchDetails(page.branchDetailsLoaded, branchDetailsOn(page.agent_information, page.iata_cass))).toEqual([]);
  });

  it("Don't save: puts the boxes back and sends with what the branch has", async () => {
    const put = jest.spyOn(ApiService, "put");
    const page = form(false, { agent_issue_sign: "A. Rao" }, { iata_agent_code: "7654321" });

    page.branchDetailsAllowSend("send");
    await flush();

    expect(put).not.toHaveBeenCalled();
    expect(page.agent_information.agent_issue_sign).toBeNull();
    expect(page.iata_cass.iata_agent_code).toBe("1234567");
    expect(page.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("closing the question sends nothing", async () => {
    const page = form(null, { agent_issue_sign: "A. Rao" });

    page.branchDetailsAllowSend("send");
    await flush();

    expect(page.onSubmit).not.toHaveBeenCalled();
    expect(page.agent_information.agent_issue_sign).toBe("A. Rao");
  });

  it("a refused save sends nothing and says why", async () => {
    jest.spyOn(ApiService, "put").mockRejectedValue({ response: { status: 422, data: { errors: { iata_agent_code: ["The IATA code is seven digits."] } } } });
    const page = form(true, {}, { iata_agent_code: "12AB" });

    page.branchDetailsAllowSend("send");
    await flush();

    expect(page.onSubmit).not.toHaveBeenCalled();
    expect(page.main_error_msg).toBe("The branch details were NOT saved, so nothing was sent. The IATA code is seven digits.");
  });
});

/**
 * The branch's own details shown on a waybill form: agent name and address, IATA code and CASS, the issuing
 * signature, place and date, and the office and participant identifiers.
 *
 * They are the BRANCH's, kept in its settings and printed on every waybill it issues; the form shows them in boxes
 * that could be typed in, and whatever was typed was thrown away (2026-11-15 frontend audit, FW15). The owner's
 * rule (2026-11-16): nothing is saved while typing; when Send is clicked and a box differs from what the branch
 * has, the person is asked whether to save it to the branch for this and future shipments, or not.
 */
export const BRANCH_FIELDS = {
  agent_name: "Agent name",
  agent_address: "Agent address",
  agent_city: "Agent city",
  agent_pincode: "Agent postcode",
  agent_account: "Agent account",
  iata_agent_code: "IATA code",
  iata_agent_cass: "CASS",
  agent_issue_sign: "Issuing signature",
  agent_issue_loc_code: "Place of issue",
  agent_issue_date: "Date of issue",
  office_airport: "Office airport",
  office_function_designator: "Office function designator",
  office_company_designator: "Office company designator",
  office_file_reference: "Office file reference",
  participant: "Participant",
  participant_airport: "Participant airport",
  prticipant_identifer: "Participant identifier",
  participant_code: "Participant code",
};

const text = (value) => (value === null || value === undefined ? "" : String(value).trim());

/** The details as the form holds them now. The IATA code and CASS sit in their own pair of boxes. */
export function branchDetailsOn(agentInformation, iataCass) {
  const agent = agentInformation || {};
  const iata = iataCass || {};
  const details = {};

  Object.keys(BRANCH_FIELDS).forEach((key) => {
    details[key] = text(key in iata ? iata[key] : agent[key]);
  });

  return details;
}

/**
 * What differs from what the branch has. A box left empty where the branch has nothing is not a change.
 *
 * @returns {Array<{key: string, label: string, from: string, to: string}>}
 */
export function changedBranchDetails(loaded, now) {
  if (!loaded || !now) return [];

  return Object.keys(BRANCH_FIELDS)
    .filter((key) => text(loaded[key]) !== text(now[key]))
    .map((key) => ({ key, label: BRANCH_FIELDS[key], from: text(loaded[key]), to: text(now[key]) }));
}

/** The question put to the person on Send, in plain words. */
export function branchDetailsQuestion(changes) {
  const lines = changes.map((c) => `${c.label}: ${c.from || "(empty)"} → ${c.to || "(empty)"}`);

  return "You changed the branch's details on this form:\n\n" + lines.join("\n")
    + "\n\nSave them to the branch, for this and future shipments?"
    + "\nIf you choose not to, this waybill is sent with the branch's saved details.";
}

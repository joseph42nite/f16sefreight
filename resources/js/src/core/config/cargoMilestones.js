/**
 * Where an air shipment is, from the airline's Cargo Status messages in the Message Log.
 *
 * 🔴 The seven steps are PRD §5.5's cargo tracking feed. The codes under each are the IATA status codes
 * `config/common-data.php` describes (user, 2026-09-15: "get the details from the message log for every awb").
 * Which code counts as which step is our reading of those descriptions — GAPS #280.
 *
 * ⚠️ The step shown is the FURTHEST one reached, not the latest message: status messages can arrive out of
 * order, and a shipment does not go backwards.
 */
export const MILESTONES = [
  { key: "accepted", label: "Cargo accepted", codes: ["FOH", "RCS", "DPU", "FIW"] },
  { key: "manifested", label: "Manifested", codes: ["PRE", "MAN", "TRM"] },
  { key: "departed", label: "Departed", codes: ["DEP"] },
  { key: "arrived", label: "Arrived at destination", codes: ["ARR", "RCF", "AWR"] },
  { key: "cleared", label: "Customs cleared", codes: ["CCD"] },
  { key: "out", label: "Out for delivery", codes: ["NFD", "AWD", "FOW"] },
  { key: "delivered", label: "Delivered", codes: ["DLV", "DDL"] },
];

/**
 * @param {string[]} codes the AWB's Cargo Status codes, oldest first
 * @returns {{step: number, total: number, label: string, code: string|null, discrepancy: boolean}}
 *          step 0 means no status has arrived yet
 */
export function cargoProgress(codes) {
  const list = (codes || []).map((c) => String(c || "").toUpperCase());
  let step = 0;
  let code = null;

  list.forEach((c) => {
    const at = MILESTONES.findIndex((m) => m.codes.includes(c)) + 1;
    if (at >= step && at > 0) {
      step = at;
      code = c;
    }
  });

  return {
    step,
    total: MILESTONES.length,
    label: step ? MILESTONES[step - 1].label : "No airline status yet",
    code,
    // DIS: the airline reported a handling or documentation discrepancy.
    discrepancy: list.includes("DIS"),
  };
}

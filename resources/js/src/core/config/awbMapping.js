/**
 * How an extracted or pasted field becomes an airway bill payload.
 *
 * 🔴 **ONE PLACE, because there are two targets.** A master (`/create-focusair`) and a
 * house (`/create-houseway-bill`) take the same shape under different key prefixes —
 * `ship_*` and `cons_*` are shared, the first box differs (`awb_code` + `awb_no` vs
 * `hawb_no`). Mapping inline in the panel would mean writing the same field list twice and
 * having them drift the first time either endpoint changes.
 *
 * ⚠️ **Nothing here invents a value.** A field the extractor did not find stays absent, so
 * the form shows it empty rather than showing a default that looks like a reading. A
 * plausible wrong consignee is the error that survives a glance and fails at customs.
 */

/** The party blocks, by target. Same fields, different prefixes. */
const PARTY_KEYS = {
  shipper: {
    payloadKey: "shipper_address",
    name: "ship_name", address: "ship_address", city: "ship_city",
    state: "ship_state", country: "ship_country", postcode: "ship_post_code",
    airport: "ship_airport_code", phone: "ship_phone",
  },
  consignee: {
    payloadKey: "consignee_address",
    name: "cons_name", address: "cons_address", city: "cons_city",
    state: "cons_state", country: "cons_country", postcode: "cons_post_code",
    airport: "cons_airport_code", phone: "cons_phone",
  },
  notify: {
    payloadKey: "also_notify_address",
    name: "also_name", address: "also_address", city: "also_city",
    state: "also_state", country: "also_country", postcode: "also_post_code",
    airport: "also_airport_code", phone: "also_phone",
  },
};

/** Unwrap `{value, confidence}` — or a bare value — to the value. */
function raw(node) {
  if (node === undefined || node === null) return null;
  if (typeof node === "object" && "value" in node) return node.value;
  return node;
}

/**
 * `120x80x90` or `120 X 80 X 90` → one dimension line.
 *
 * ⚠️ Returns NULL rather than a partial line when it cannot read three numbers. A
 * dimension line with a missing height is worse than no line: it prices and it prints.
 */
function dimensionLine(text, pieces) {
  const parts = String(text || "").split(/\s*[xX*]\s*/).map((p) => parseFloat(p));

  if (parts.length < 3 || parts.some((n) => isNaN(n))) return null;

  return {
    pcs: pieces || "",
    wgt: "",
    length: parts[0], width: parts[1], height: parts[2],
    // CMT is what the live form defaults to; the operator can change it on the form.
    unit: "CMT",
  };
}

/**
 * Build the payload for a target from resolved extraction fields.
 *
 * @param {"mawb"|"hawb"} target
 * @param {object} fields   flat map of field key -> {value, confidence} or value
 * @param {object} identity {awbCode, awbNo} for a master, {hawbNo} for a house
 */
export function buildPayload(target, fields, identity) {
  const payload = {};

  payload.first_box = target === "mawb"
    ? {
        awb_code: identity.awbCode, awb_no: identity.awbNo,
        consolidated_mawb: "false", awb: "true",
      }
    : { hawb_no: identity.hawbNo };

  // ── Parties ───────────────────────────────────────────────────────────────
  Object.keys(PARTY_KEYS).forEach((party) => {
    const keys = PARTY_KEYS[party];
    const name = raw(fields[party]) || raw(fields[party + "_name"]);

    if (!name) return;

    const block = {};
    block[keys.name] = name;

    [["address", "_address"], ["city", "_city"], ["state", "_state"],
     ["country", "_country"], ["postcode", "_post_code"], ["airport", "_airport_code"],
     ["phone", "_phone"]].forEach(([slot, suffix]) => {
      const value = raw(fields[party + suffix]);
      if (value) block[keys[slot]] = value;
    });

    payload[keys.payloadKey] = block;
  });

  // ── Cargo ─────────────────────────────────────────────────────────────────
  const pieces = raw(fields.pieces);
  const weight = raw(fields.gross_weight) || raw(fields.weight);
  // ⚠️ Chargeable is what the airline bills, and it is NOT the gross weight — on a light,
  // bulky shipment it is the volumetric figure instead. Sending gross into both would
  // under-bill every low-density consignment.
  const chargeable = raw(fields.chargeable_weight);
  const goods = raw(fields.goods) || raw(fields.description);
  const dimensions = raw(fields.dimensions);

  if (pieces || weight || goods || dimensions) {
    const entry = {
      pieces: pieces || "",
      description: goods || "",
      gross_weight: weight || "",
      // Fields the AWB form owns and extraction never supplies. Sent empty rather than
      // omitted because the controller reads them positionally on the entry.
      rate_class: "", uld_rate_class: "", service_code: "", commodity_item: "",
      country_origin_goods: "", slac: "", weight_code: "K", chargable_weight: "", rate: "",
      hsCodes: [], uld_infos: [],
      itemss: [],
    };

    const line = dimensionLine(dimensions, pieces);
    if (line) entry.itemss.push(line);

    payload.entries = [entry];
  }

  // ── Totals ────────────────────────────────────────────────────────────────
  // ⚠️ Only sent when BOTH are present: `totalAmountValume` requires volume AND amount,
  // and amount is commercial — it never comes from a scanned packing list.
  const volume = raw(fields.volume);
  const amount = raw(fields.amount);

  if (volume && amount) {
    payload.totals = { total_volume: volume, total_amount: amount, dimention_unit: "CMT" };
  }

  return payload;
}

/**
 * Where a saved draft lives, so the operator lands ON IT rather than on a blank form.
 *
 * 🔴 The EDIT route with the document's key, not the create route. Sending the operator to
 * `/master-airway-bill` after saving a draft opens an empty form — they then have to find
 * the draft they just made, and the obvious move is to key it again, which is how a second
 * waybill gets raised for one shipment.
 */
export function formRoute(target, key) {
  const base = target === "mawb" ? "/edit-airway-bill" : "/edit-houseway-bill";

  return key ? base + "/" + key : base;
}

/** The eleven-digit key a master is stored under — `176` + `10000008`. */
export function masterKey(awbCode, awbNo) {
  return String(awbCode || "") + String(awbNo || "");
}

/** Which endpoint creates it. */
export function createEndpoint(target) {
  return target === "mawb" ? "/user/create-focusair" : "/user/create-houseway-bill";
}

export const TARGETS = [
  { key: "mawb", label: "Master AWB" },
  { key: "hawb", label: "House AWB" },
];

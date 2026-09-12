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
      // 🔴 `chargable_weight` (the endpoint's spelling) was hardcoded empty while the value sat
      // in `chargeable` just above, so a chargeable weight never reached a draft at all —
      // extracted, pasted or typed.
      country_origin_goods: "", slac: "", weight_code: "K", chargable_weight: chargeable || "", rate: "",
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

/**
 * A document's parties, in the flat keys the panel and `buildPayload` work on.
 *
 * 🔴 A document's party arrives NESTED: `shipper: { name, address, city, state, pin,
 * country, full_details }`, each a `{value, confidence}`. The paste, the address book, Fit
 * and `buildPayload` all use FLAT keys (`shipper`, `shipper_address`, `shipper_city`…), so a
 * party read from a document was found by none of them: the panel printed the nested object
 * as JSON, and the draft dropped the party as incomplete.
 *
 * ⚠️ The address comes from `full_details`, not `address`. The parser cuts `address` at 30
 * characters ("…CEE PEE BUILDING MAS"), and a cut address in a draft is data lost without a
 * word. `full_details` is the whole block, so the name is taken off its front.
 *
 * ⚠️ A part the document did not give is LEFT OUT, not set to null. The panel holds back a
 * party with missing parts; an empty `{value: null}` would look present and send a
 * half-filled party that the create endpoint refuses.
 */
export function flattenParties(fields, countries) {
  const out = { ...fields };

  ["shipper", "consignee", "notify"].forEach((party) => {
    const node = fields[party];

    // Already flat (a pasted value), or not there at all.
    if (!node || typeof node !== "object" || "value" in node) return;

    const part = (key) => (node[key] && node[key].value) || null;
    const put = (key, value, from) => {
      if (value) out[key] = { value, confidence: (node[from] && node[from].confidence) || "low" };
    };

    delete out[party];

    const name = part("name");
    const address = withoutLabel(afterName(part("full_details") || "", name)) || part("address");

    put(party, name, "name");
    put(party + "_address", address, "full_details");

    // 🔴 FALLBACK WHERE CONFIDENCE IS LOW. The parser's split is the first answer; a part it
    // found nothing for comes back low, and the rule that splits a pasted block fills the gap
    // from the same address. On the real invoice the parser missed the consignee's city and
    // Jordan entirely. A filled-in part is marked "medium", so it lands on the review list
    // instead of passing as read.
    const guess = parsePartyBlock([name, address].filter(Boolean).join("\n"), countries);

    [["_city", "city", "city"], ["_state", "state", "state"], ["_post_code", "pin", "post_code"],
     ["_country", "country", "country"]].forEach(([suffix, from, guessKey]) => {
      const found = part(from);

      // Whatever the document gave — the model's own split, or the parser's — wins. The rule
      // only fills what neither produced.
      if (found) put(party + suffix, found, from);
      else if (guess[guessKey]) out[party + suffix] = { value: guess[guessKey], confidence: "medium" };
    });
  });

  return out;
}

/**
 * The text after the name.
 *
 * ⚠️ Compared on letters and digits only: the name is the parser's CLEANED copy
 * ("TSGEXP 001 25 08 2026") while `full_details` keeps the punctuation
 * ("TSGEXP/001 & 25-08-2026"), so a plain `startsWith` misses whenever the name has any.
 */
function afterName(full, name) {
  const target = String(name || "").replace(/[^a-z0-9]/gi, "").toLowerCase();
  let seen = 0;
  let i = 0;

  while (i < full.length && seen < target.length) {
    if (/[a-z0-9]/i.test(full[i])) {
      if (full[i].toLowerCase() !== target[seen]) return full;
      seen += 1;
    }
    i += 1;
  }

  return seen === target.length ? full.slice(i) : full;
}

/** The model copies a label along with the value after it: "Address : GARDENS WASFI…". */
function withoutLabel(text) {
  return text.replace(/^[\s,.:-]*address\s*:\s*/i, "").trim();
}

/** Names the country list does not carry, as operators write them. */
const COUNTRY_ALIASES = { UAE: "AE", "U.A.E": "AE", USA: "US", "U.S.A": "US", UK: "GB" };

/**
 * A country as the form stores it: an ISO alpha-2 code.
 *
 * 🔴 The create endpoint accepts only a 2-letter code, so "INDIA" or "Jordan" failed the
 * whole request. A name the list does not know comes back NULL.
 */
export function countryCode(value, countries) {
  const text = String(value || "").trim().replace(/\.$/, "");
  const list = countries || {};

  if (!text) return null;

  if (/^[a-z]{2}$/i.test(text)) {
    const code = text.toUpperCase();
    return !Object.keys(list).length || list[code] ? code : null;
  }

  const upper = text.toUpperCase();
  if (COUNTRY_ALIASES[upper]) return COUNTRY_ALIASES[upper];

  return Object.keys(list).find((code) => String(list[code]).toUpperCase() === upper) || null;
}

/** "Amman 11191 Jordan": a country written at the end of a line rather than on its own. */
function trailingCountry(text, countries) {
  const names = Object.keys(countries || {}).map((code) => [code, String(countries[code])])
    .concat(Object.keys(COUNTRY_ALIASES).map((name) => [COUNTRY_ALIASES[name], name]));
  let best = null;

  names.forEach(([code, name]) => {
    const m = text.match(new RegExp("[\\s,–-]+" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\.?$", "i"));
    if (m && (!best || name.length > best.length)) best = { code, rest: text.slice(0, m.index).trim(), length: name.length };
  });

  return best;
}

/**
 * A party block, split the way the form stores it.
 *
 * "Shipper:" then the whole address, on one line or several. The first line is the name (on
 * a single line, the text before the first comma). The last part is the country, if the list
 * knows it. The last part that begins or ends with a 4-10 digit number holds the post code,
 * and the words beside it are the city. Anything between that part and the country is the
 * state. The rest is the address.
 *
 * ⚠️ A RULE, not a reader. It will be wrong on some layouts, so every part it produces is
 * shown in "What will be used", and a "Shipper city: …" line still overrides it.
 */
export function parsePartyBlock(text, countries) {
  const lines = String(text || "").split(/\r?\n/).map((l) => withoutLabel(l.trim())).filter(Boolean);
  if (!lines.length) return {};

  let name = lines[0];
  let rest = lines.slice(1);

  if (!rest.length && name.includes(",")) {
    rest = [name.slice(name.indexOf(",") + 1)];
    name = name.slice(0, name.indexOf(","));
  }

  const parts = rest.join(", ").split(/\s*,\s*/).map((p) => p.trim()).filter(Boolean);
  const out = { name: name.trim() };

  const last = parts[parts.length - 1];
  const code = last ? countryCode(last, countries) : null;
  if (code) {
    out.country = code;
    parts.pop();
  } else if (last) {
    const hit = trailingCountry(last, countries);
    if (hit) {
      out.country = hit.code;
      parts[parts.length - 1] = hit.rest;
    }
  }

  for (let i = parts.length - 1; i >= 0; i -= 1) {
    const end = parts[i].match(/^(.*?)[\s,–-]*\b(\d{4,10})$/); // "Amman 11191", "ERNAKULAM - 683503"
    const start = parts[i].match(/^(\d{4,10})\s+(\D.*)$/); // "20457 Hamburg"

    // ⚠️ "P.O Box 9192" is a box number, not a post code.
    if (!start && (!end || /\bbox$/i.test(end[1].trim()))) continue;

    out.post_code = start ? start[1] : end[2];
    if (i + 1 < parts.length) out.state = parts.slice(i + 1).join(", ");

    const before = start ? "" : end[1].trim();
    // "P.O Box 9192 Amman": the city is the words after the last number.
    const city = start ? start[2].trim() : before.replace(/^.*\d\S*\s*/, "").trim();
    const lead = before.slice(0, before.length - city.length).replace(/[\s,–-]+$/, "").trim();

    parts.splice(i);
    if (lead) parts.push(lead);

    if (city) out.city = city;
    else if (parts.length > 1) out.city = parts.pop();
    break;
  }

  if (!out.post_code && parts.length > 1) out.city = parts.pop();
  if (parts.length) out.address = parts.join(", ");

  return out;
}

/**
 * A document's pieces, weights, description and dimensions, in the panel's flat keys.
 *
 * 🔴 The same nesting as the parties: a document gives `piece_weight.no_of_pieces` and
 * `cargo.description`, while the panel and `buildPayload` read `pieces` and `goods`, so a
 * document's cargo reached neither the table nor the draft. A zero is "not found" (the
 * parser writes 0 for a missing figure), so it is left out rather than shown as 0.
 */
export function flattenCargo(fields) {
  const out = { ...fields };
  const pw = fields.piece_weight || {};
  const cargo = fields.cargo || {};
  const value = (node) => (node && typeof node === "object" && "value" in node ? node.value : node);
  const confidence = (node) => (node && node.confidence) || "high";

  [["pieces", pw.no_of_pieces], ["gross_weight", pw.gross_weight], ["chargeable_weight", pw.chargeable_weight]]
    .forEach(([key, node]) => {
      const n = parseFloat(value(node));
      if (n > 0 && out[key] === undefined) out[key] = { value: String(n), confidence: confidence(node) };
    });

  const goods = value(cargo.description);
  if (goods && out.goods === undefined) out.goods = { value: goods, confidence: confidence(cargo.description) };

  const dims = (Array.isArray(cargo.dimensions) ? cargo.dimensions : [])
    .map((d) => value(d && typeof d === "object" && "dimension" in d ? d.dimension : d))
    .filter(Boolean);
  if (dims.length && out.dimensions === undefined) out.dimensions = { value: dims.join(", "), confidence: "high" };

  return out;
}

/**
 * What a draft is allowed to carry: everything except a state or country the model WORKED OUT.
 *
 * 🔴 The user's rule: "if the confidence on the country is low then just ignore it and still
 * let it be saved as draft." On the real invoice the model answered the shipper's country as
 * "Iraq" — the shipment's destination, printed elsewhere on the page — and that value would
 * otherwise have gone onto a waybill.
 *
 * ⚠️ Only LOW goes. The rule-derived fallback (#177) reads a party's OWN address and is marked
 * medium, so "Amman" and "JO" still reach the draft; the operator sees both on the review list.
 */
export function withoutWorkedOutParts(fields) {
  const out = { ...fields };

  ["shipper", "consignee", "notify"].forEach((party) => {
    ["_state", "_country"].forEach((suffix) => {
      const node = out[party + suffix];

      if (node && typeof node === "object" && node.confidence === "low") delete out[party + suffix];
    });
  });

  return out;
}

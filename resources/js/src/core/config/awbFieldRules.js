/**
 * What a waybill field will actually accept, and how to make a value fit it.
 *
 * 🔴 **The master and the house are NOT the same form.** A house bill allows 40 characters
 * of address where the master allows 255, and 9 of state against 35 — so an address that
 * saves perfectly on the MAWB has to be shortened for its own HAWB. Cleaning without
 * knowing which document is being written is therefore not cleaning, it is guessing.
 *
 * 🔴 **NOTHING IS TRUNCATED SILENTLY.** `clean()` reports every change it wants to make and
 * the caller shows them; the operator accepts. This codebase has already shipped the other
 * behaviour once — `inputLimit()` in both air forms stripped characters and cut values on
 * the way into the model, turning "Müller & Co." into "Mller Co" with nothing on screen to
 * say so. A consignee that is wrong in a way nobody saw is the error that reaches customs.
 *
 * ⚠️ This is deliberately NOT an AI call. Character limits and a charset have exact right
 * answers; a model would be slower, cost a credit, give a different answer next Tuesday,
 * and — worst — produce a plausible shortening that nobody could check. The judgement work
 * (messy free text into structured fields) is a different problem and belongs to the
 * unstructured parser.
 */

/** Per-target limits, taken from the controllers' own validators. */
const LIMITS = {
  mawb: {
    name: 70, address: 255, address_line_2: 30, city: 70,
    state: 35, post_code: 15, country: 2, airport_code: 3, phone: 20,
  },
  hawb: {
    name: 70, address: 40, address_line_2: 30, city: 70,
    state: 9, post_code: 15, country: 2, airport_code: 3, phone: 20,
  },
};

/**
 * Characters the address fields accept — the widened set (GAPS #44), matching
 * `ADDRESS_PATTERN` on both controllers.
 *
 * ⚠️ Kept in step with the server BY HAND. If they drift, the server is right and this is
 * wrong: a value cleaned to something the validator then rejects is worse than uncleaned.
 */
const ADDRESS_ALLOWED = /[^\p{L}\p{M}\p{N}\s.,\-/&()#'":;+]/gu;

/** Names and cities are looser in the validators — letters, digits, ordinary punctuation. */
const TEXT_ALLOWED = /[^\p{L}\p{M}\p{N}\s.,\-'&()/]/gu;

export function limitFor(target, field) {
  const set = LIMITS[target] || LIMITS.mawb;

  return set[field] ?? null;
}

/**
 * Make one value fit one field, reporting every change.
 *
 * @returns {{value: string, changes: string[], overLimit: boolean}}
 */
export function clean(target, field, raw) {
  const changes = [];
  let value = String(raw ?? "");

  const collapsed = value.replace(/\s+/g, " ").trim();
  if (collapsed !== value) {
    changes.push("collapsed extra spaces");
    value = collapsed;
  }

  // Country is an ISO alpha-2 and is printed uppercase; leaving "in" produces a waybill
  // that reads wrong and a filing that may not match.
  if (field === "country") {
    const up = value.toUpperCase();
    if (up !== value) {
      changes.push("upper-cased the country code");
      value = up;
    }
  }

  const pattern = field === "address" || field === "address_line_2" ? ADDRESS_ALLOWED : TEXT_ALLOWED;
  const stripped = value.replace(pattern, "");

  if (stripped !== value) {
    // ⚠️ Named, not counted. "removed 3 characters" leaves the operator hunting; showing
    // WHICH ones lets them decide whether the loss matters.
    const removed = [...new Set(value.match(pattern) || [])].join(" ");
    changes.push(`removed ${removed}`);
    // ⚠️ Collapse AGAIN: removing a character from the middle of a word leaves the spaces
    // that surrounded it, so "Co. ★ Exports" became "Co.  Exports" — a double space that
    // then prints on the waybill.
    value = stripped.replace(/\s+/g, " ").trim();
  }

  const limit = limitFor(target, field);
  const overLimit = limit !== null && value.length > limit;

  if (overLimit) {
    // 🔴 Reported, NOT applied. Shortening an address is a judgement about which part
    // matters — "Unit 4" or "Industrial Estate" — and the machine does not know. It says
    // so and the operator decides.
    changes.push(`too long for a ${target.toUpperCase()}: ${value.length} of ${limit} characters`);
  }

  return { value, changes, overLimit };
}

/**
 * Split an address that is too long for line 1 at the last word break that fits.
 *
 * Nothing is dropped: what does not fit goes to line 2 (before anything already there). No break
 * inside the limit — one very long word — returns null, and the length is reported instead.
 */
export function spillAddress(address, lineTwo, limit) {
  const text = String(address || "");
  if (text.length <= limit) return null;

  const cut = text.slice(0, limit + 1).lastIndexOf(" ");
  if (cut <= 0) return null;

  const first = text.slice(0, cut).replace(/[\s,]+$/, "");
  const rest = text.slice(cut).replace(/^[\s,]+/, "");

  return { first, second: [rest, lineTwo].filter(Boolean).join(", ") };
}

/** Clean a whole party block, returning the fields that changed and why. */
export function cleanParty(target, party, fields) {
  const out = { values: {}, changes: [], overLimit: false };

  // 🔴 A long first address line spills into line 2 (user, 2026-09-14) — cleaned first, so the
  // lengths are the lengths that will be saved.
  const addressKey = party + "_address";
  const lineTwoKey = party + "_address_line_2";
  const text = (key) => {
    const node = fields[key];
    return node && typeof node === "object" ? node.value : node;
  };
  const address = text(addressKey) ? clean(target, "address", text(addressKey)).value : "";
  const lineTwo = text(lineTwoKey) ? clean(target, "address_line_2", text(lineTwoKey)).value : "";
  const split = spillAddress(address, lineTwo, limitFor(target, "address"));

  if (split) {
    fields = { ...fields, [addressKey]: split.first, [lineTwoKey]: split.second };
    out.changes.push(`address: moved "${split.second}" to address line 2`);
  }

  ["", "_address", "_address_line_2", "_city", "_state", "_post_code", "_country"].forEach((suffix) => {
    const key = party + suffix;
    const raw = fields[key];

    if (raw === undefined || raw === null || raw === "") {
      return;
    }

    const field = suffix === "" ? "name" : suffix.slice(1);
    const result = clean(target, field, typeof raw === "object" ? raw.value : raw);

    out.values[key] = result.value;
    out.overLimit = out.overLimit || result.overLimit;

    result.changes.forEach((c) => out.changes.push(`${field.replace(/_/g, " ")}: ${c}`));
  });

  return out;
}

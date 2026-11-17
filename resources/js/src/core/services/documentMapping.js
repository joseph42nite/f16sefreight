/**
 * What a read document puts on a waybill form (frontend audit, FW16). Both forms carried their own copy of this
 * mapping, with the same four faults:
 *
 *   - the party's email was written into the Fax box, which the server refuses and the airline reads as a number;
 *   - a document with no shipper name, address, goods description or flight list threw, and everything after it
 *     on the form stayed empty;
 *   - a second document added its dimension rows under the first one's;
 *   - an address over 30 characters and a description over 70 were cut without a word.
 *
 * Nothing here touches the form: each function answers with plain values and a list of what it had to cut, so the
 * form can say so.
 */
export const ADDRESS_LIMIT = 30;
export const DESCRIPTION_LIMIT = 70;

const text = (value) => (value === null || value === undefined ? "" : String(value));

/** Letters, digits and single spaces: what the name and address boxes accept. */
export function plainLine(value) {
  return text(value).replace(/[^a-zA-Z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

/** `{ value, cut }`: the text within its limit, and how long it was when something had to go. */
export function within(value, limit) {
  const whole = text(value).trim();
  if (whole.length <= limit) return { value: whole, cut: null };
  return { value: whole.slice(0, limit).trim(), cut: { from: whole.length, to: limit } };
}

/**
 * A shipper or consignee as the form's boxes hold it. `prefix` is `ship_` or `cons_`; `label` is the party's name
 * in a notice. The email is left out: the form has no box for it.
 */
export function partyFields(party, prefix, label) {
  const source = party || {};
  const address = within(plainLine(source.address), ADDRESS_LIMIT);

  return {
    fields: {
      [prefix + "name"]: plainLine(source.name),
      [prefix + "address"]: address.value,
      [prefix + "city"]: source.city,
      [prefix + "post_code"]: source.pin,
      [prefix + "state"]: source.state,
      [prefix + "phone"]: source.phone,
    },
    cuts: address.cut ? [{ what: label + " address", ...address.cut }] : [],
  };
}

/** The goods as the consignment pop-up holds them: description, HS codes and the dimension rows of THIS document. */
export function cargoFields(cargo) {
  const source = cargo || {};
  const description = within(text(source.description).replace(/[&/=]/g, " "), DESCRIPTION_LIMIT);

  const rows = (Array.isArray(source.dimensions) ? source.dimensions : [])
    .filter((d) => d)
    .map((d) => {
      const [length, width, height] = text(d.dimension).split(/x/i).map((part) => part.trim());
      return { pcs: d.count, wgt: "", length: length || "", width: width || "", height: height || "", unit: "CMT" };
    });

  return {
    description: description.value,
    hsCodes: source.hs_codes,
    rows,
    cuts: description.cut ? [{ what: "Goods description", ...description.cut }] : [],
  };
}

/** The flights of a transit, or none: a document may give the airports and no flights. */
export function flightsOf(transit) {
  return transit && Array.isArray(transit.flights) ? transit.flights : [];
}

/** One sentence for the operator, or "" when nothing was cut. */
export function cutNotice(cuts) {
  if (!cuts || !cuts.length) return "";
  const parts = cuts.map((c) => `${c.what} (${c.from} characters, kept the first ${c.to})`);
  return "The document had more text than the form holds. Cut short: " + parts.join("; ") + ". Check it against the document.";
}

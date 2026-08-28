/**
 * Display formatting — ui_ux_guide.md §4.4.
 *
 * Centralised because these are RULES, not preferences. A weight rendered to one
 * decimal in one table and three in another is not a style inconsistency; it reads as
 * two different measurements of the same shipment.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** §4.1 — NULL is not zero. Nothing here ever turns an absent value into a number. */
export function isEmpty(v) {
  return v === null || v === undefined || v === "";
}

/**
 * `DD-MMM-YYYY` — unambiguous across locales, and it matches the customs forms.
 * `12-06-2026` means two different dates on two sides of an ocean; `12-Jun-2026` does not.
 */
export function date(value) {
  if (isEmpty(value)) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
}

/** `DD-MMM-YYYY HH:mm`. Branch local time; the zone belongs in a tooltip. */
export function dateTime(value) {
  if (isEmpty(value)) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${date(value)} ${hh}:${mm}`;
}

/** 3 dp and an explicit unit — never a bare number. `450.000 kg`, not `450.5`. */
export function weight(value, unit = "kg") {
  if (isEmpty(value)) return null;
  return `${Number(value).toFixed(3)} ${unit}`;
}

/** 3 dp + CBM. */
export function volume(value, unit = "CBM") {
  if (isEmpty(value)) return null;
  return `${Number(value).toFixed(3)} ${unit}`;
}

/** Thousands separators + 2 dp, prefixed with the currency. */
export function currency(value, code) {
  if (isEmpty(value)) return null;
  const n = Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return code ? `${code} ${n}` : n;
}

/** Whole counts — thousands separators, no decimals. */
export function count(value) {
  if (isEmpty(value)) return null;
  return Number(value).toLocaleString();
}

export default { isEmpty, date, dateTime, weight, volume, currency, count };

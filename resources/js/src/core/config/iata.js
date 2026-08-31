/**
 * IATA / Cargo-IMP field constraints — implementation_guide.md §4.1.2, PRD.md §5.9.
 *
 * ═══ 🔴 SURFACE THE VIOLATION. NEVER SILENTLY FIX IT. ═══════════════════════
 * The guide is explicit about why:
 *
 *   *"A `maxLength: 35` on a shipper name makes the model silently truncate a
 *    60-character legal name. You would destroy data and never know."*
 *
 * A truncated consignee on a customs declaration is not a recoverable error, and the
 * operator is the only one who can decide HOW to abbreviate a legal name — "Müller
 * Maschinenbau GmbH & Co. KG" has a correct short form and a wrong one, and only a
 * human knows which.
 *
 * So nothing in this module edits a value. It reports.
 *
 * ⚠️ THE 35-CHARACTER LIMIT IS PER LINE, NOT PER FIELD. An address well inside the
 * 500-character cumulative cap still fails if any single line exceeds 35 — checking
 * only the total is what makes the rule feel arbitrary when it finally fires at the
 * gateway.
 */

export const CARGO_IMP_LINE = 35;
export const NAME_MAX = 50;
export const ADDRESS_CUMULATIVE_MAX = 500;
export const ICEGATE_ID_MAX = 20;

/** MAWB is 11 characters as NNN-NNNNNNNN; HAWB is alphanumeric only, no spaces. */
export const MAWB_PATTERN = /^\d{3}-\d{8}$/;
export const HAWB_PATTERN = /^[A-Za-z0-9]{1,20}$/;

/**
 * Every line of a multi-line value that exceeds the Cargo-IMP limit.
 *
 * @returns {{line: number, length: number, text: string}[]}
 */
export function overlongLines(value, max = CARGO_IMP_LINE) {
  if (value === null || value === undefined || value === "") return [];

  return String(value)
    .split(/\r\n|\r|\n/)
    .map((text, i) => ({ line: i + 1, length: text.length, text }))
    .filter((l) => l.length > max);
}

/**
 * Check one field against its constraint.
 *
 * @returns {{ok: boolean, message: string|null, overBy: number}}
 */
export function checkField(value, rule) {
  const text = value === null || value === undefined ? "" : String(value);

  if (text === "") return { ok: true, message: null, overBy: 0 };

  if (rule.pattern) {
    return rule.pattern.test(text)
      ? { ok: true, message: null, overBy: 0 }
      : { ok: false, overBy: 0, message: rule.patternMessage || "Wrong format." };
  }

  if (rule.perLine) {
    const bad = overlongLines(text, rule.max);
    if (bad.length) {
      const worst = bad[0];
      return {
        ok: false,
        overBy: worst.length - rule.max,
        /* Naming the LINE matters: "line 2 is 44 characters" is fixable, "too long"
           sends the operator hunting through a five-line address. */
        message: `Line ${worst.line} is ${worst.length} characters. Cargo-IMP allows ${rule.max} per line.`,
      };
    }

    if (rule.cumulative && text.length > rule.cumulative) {
      return {
        ok: false,
        overBy: text.length - rule.cumulative,
        message: `${text.length} characters across all lines; the cap is ${rule.cumulative}.`,
      };
    }

    return { ok: true, message: null, overBy: 0 };
  }

  if (rule.max && text.length > rule.max) {
    return {
      ok: false,
      overBy: text.length - rule.max,
      message: `${text.length} characters; the limit is ${rule.max}. Abbreviate it — do not let it be truncated.`,
    };
  }

  return { ok: true, message: null, overBy: 0 };
}

/** The rules, by the field names the air forms already use. */
export const RULES = {
  awb_number: { pattern: MAWB_PATTERN, patternMessage: "A master air waybill is 11 characters as NNN-NNNNNNNN." },
  hawb_number: { pattern: HAWB_PATTERN, patternMessage: "A house waybill is up to 20 characters, letters and digits only — no spaces or punctuation." },
  ship_name: { max: NAME_MAX },
  ship_name_2: { max: NAME_MAX },
  cons_name: { max: NAME_MAX },
  cons_name_2: { max: NAME_MAX },
  ship_address: { perLine: true, max: CARGO_IMP_LINE, cumulative: ADDRESS_CUMULATIVE_MAX },
  ship_address_line_2: { perLine: true, max: CARGO_IMP_LINE, cumulative: ADDRESS_CUMULATIVE_MAX },
  cons_address: { perLine: true, max: CARGO_IMP_LINE, cumulative: ADDRESS_CUMULATIVE_MAX },
  cons_address_line_2: { perLine: true, max: CARGO_IMP_LINE, cumulative: ADDRESS_CUMULATIVE_MAX },
  icegate_id: { max: ICEGATE_ID_MAX },
};

/**
 * Check a whole form.
 *
 * @returns {{field: string, message: string, overBy: number}[]}
 */
export function checkAll(values, rules = RULES) {
  const out = [];

  Object.keys(rules).forEach((field) => {
    if (!(field in values)) return;
    const result = checkField(values[field], rules[field]);
    if (!result.ok) out.push({ field, message: result.message, overBy: result.overBy });
  });

  return out;
}

/**
 * Chargeable weight for loose air cargo — PRD.md §5.9.
 *
 *     max(gross, volume in cm³ / 6000)
 *
 * ⚠️ COMPUTED, NEVER EXTRACTED (§4.1.2). A model asked to read a chargeable weight off
 * a page will happily invent one; the formula cannot. Returns null rather than 0 when
 * there is nothing to compute from — §4.1, an absent weight is not a weight of zero.
 */
export function chargeableWeight(grossKg, volumeCm3) {
  const gross = Number(grossKg);
  const volume = Number(volumeCm3);
  const hasGross = Number.isFinite(gross) && grossKg !== null && grossKg !== "";
  const hasVolume = Number.isFinite(volume) && volumeCm3 !== null && volumeCm3 !== "";

  if (!hasGross && !hasVolume) return null;

  return Math.max(hasGross ? gross : 0, hasVolume ? volume / 6000 : 0);
}

export default { CARGO_IMP_LINE, NAME_MAX, ADDRESS_CUMULATIVE_MAX, RULES,
                 overlongLines, checkField, checkAll, chargeableWeight };

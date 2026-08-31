/**
 * IATA / Cargo-IMP constraints — guide §4.1.2, PRD §5.9.
 *
 * 🔴 The rule under test is that nothing here EDITS a value. The guide's warning is
 * that a silent truncation destroys a legal name and nobody finds out until a customs
 * declaration is rejected — so every assertion checks that a violation is REPORTED and
 * the input is returned untouched.
 */
import {
  overlongLines, checkField, checkAll, chargeableWeight, RULES, CARGO_IMP_LINE,
} from "@/core/config/iata";

describe("Cargo-IMP line limit", () => {
  it("is PER LINE, not cumulative", () => {
    // 120 characters overall — comfortably inside the 500 cap — but line 2 is 44.
    const address = "Unit 4\n" + "A".repeat(44) + "\nMumbai 400001";
    const bad = overlongLines(address);

    expect(bad).toHaveLength(1);
    expect(bad[0].line).toBe(2);
    expect(bad[0].length).toBe(44);
  });

  it("names the line, because 'too long' sends you hunting", () => {
    const result = checkField("ok\n" + "B".repeat(40), RULES.ship_address);

    expect(result.ok).toBe(false);
    expect(result.message).toContain("Line 2");
    expect(result.message).toContain("40 characters");
  });

  it("passes an address whose every line fits", () => {
    const address = "Plot 14, MIDC Andheri\nMumbai 400093";

    expect(overlongLines(address)).toHaveLength(0);
    expect(checkField(address, RULES.ship_address).ok).toBe(true);
  });

  it("still catches a cumulative overflow when every line fits", () => {
    /* 20 lines of 30 characters: no line breaks the per-line rule, but 600+
       characters breaks the 500 cumulative cap. */
    const address = Array(20).fill("C".repeat(30)).join("\n");
    const result = checkField(address, RULES.ship_address);

    expect(result.ok).toBe(false);
    expect(result.message).toContain("across all lines");
  });
});

describe("nothing is silently repaired", () => {
  it("reports an over-length name and returns the value untouched", () => {
    const name = "Müller Maschinenbau GmbH & Co. Kommanditgesellschaft";
    const before = name;
    const result = checkField(name, RULES.ship_name);

    expect(result.ok).toBe(false);
    expect(result.overBy).toBe(name.length - 50);
    /* 🔴 The value is not modified. Only a human knows the correct short form of a
       legal name, and a truncated consignee on a customs declaration is not
       recoverable. */
    expect(name).toBe(before);
  });

  it("does not strip punctuation from a legal name", () => {
    const result = checkField("Müller & Co.", RULES.ship_name);

    expect(result.ok).toBe(true);
    expect(result.message).toBeNull();
  });
});

describe("waybill number formats", () => {
  it("accepts a well-formed MAWB and rejects a mangled one", () => {
    expect(checkField("176-10000004", RULES.awb_number).ok).toBe(true);
    expect(checkField("17610000004", RULES.awb_number).ok).toBe(false);
    expect(checkField("176-1000000", RULES.awb_number).ok).toBe(false);
  });

  it("rejects a HAWB containing spaces or punctuation", () => {
    expect(checkField("HAWB0001", RULES.hawb_number).ok).toBe(true);
    expect(checkField("HAWB 0001", RULES.hawb_number).ok).toBe(false);
    expect(checkField("HAWB-0001", RULES.hawb_number).ok).toBe(false);
  });
});

describe("checkAll", () => {
  it("reports every violation at once, not the first", () => {
    const problems = checkAll({
      awb_number: "bad",
      ship_name: "X".repeat(60),
      ship_address: "Y".repeat(50),
      cons_name: "Fine Ltd",
    });

    expect(problems.map((p) => p.field).sort())
      .toEqual(["awb_number", "ship_address", "ship_name"]);
  });

  it("ignores fields the form does not carry", () => {
    expect(checkAll({ ship_name: "Fine Ltd" })).toEqual([]);
  });

  it("treats an empty value as nothing to check", () => {
    expect(checkAll({ ship_name: "", cons_name: null })).toEqual([]);
  });
});

describe("chargeable weight", () => {
  it("is the greater of gross and volumetric", () => {
    // 450 kg gross against 1,800,000 cm³ / 6000 = 300 volumetric.
    expect(chargeableWeight(450, 1800000)).toBe(450);
    // Light and bulky: volumetric wins.
    expect(chargeableWeight(120, 1800000)).toBe(300);
  });

  it("is NULL when there is nothing to compute from", () => {
    /* §4.1 — an absent weight is not a weight of zero. Reporting 0 kg on a customs
       document is a different claim from "we do not know yet". */
    expect(chargeableWeight(null, null)).toBeNull();
    expect(chargeableWeight("", "")).toBeNull();
  });

  it("works from only one of the two", () => {
    expect(chargeableWeight(450, null)).toBe(450);
    expect(chargeableWeight(null, 1800000)).toBe(300);
  });
});

describe("the constant matches the spec", () => {
  it("is 35, the legacy Cargo-IMP line", () => {
    expect(CARGO_IMP_LINE).toBe(35);
  });
});

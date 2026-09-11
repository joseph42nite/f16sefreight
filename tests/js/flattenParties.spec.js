/**
 * A document's parties, flattened into the keys the Extraction panel and the draft use.
 *
 * 🔴 The fixture is REAL: job #8, the Commercial Invoice read by gemma3:4b, exactly as the
 * status endpoint handed it to the panel. The panel printed this nested object as JSON, and
 * the draft dropped both parties as incomplete because it looks for flat keys.
 */
import { flattenParties } from "@/core/config/awbMapping";

const JOB8 = {
  "shipper": {
    "fax": {
      "value": null,
      "confidence": "low"
    },
    "pin": {
      "value": "683503",
      "confidence": "high"
    },
    "city": {
      "value": "KALAMASEERY",
      "confidence": "high"
    },
    "eori": {
      "value": null,
      "confidence": "low"
    },
    "name": {
      "value": "TRAILSPEC GEARS PRIVATE LIMITED",
      "confidence": "high"
    },
    "email": {
      "value": null,
      "confidence": "low"
    },
    "phone": {
      "value": null,
      "confidence": "low"
    },
    "state": {
      "value": null,
      "confidence": "low"
    },
    "address": {
      "value": "22 702 01 CEE PEE BUILDING MAS",
      "confidence": "high"
    },
    "country": {
      "value": null,
      "confidence": "low"
    },
    "full_details": {
      "value": "TRAILSPEC GEARS PRIVATE LIMITED 22/702/01 - CEE PEE BUILDING MASJID ROAD, HMT P.O, KALAMASEERY , ERNAKULAM - 683503",
      "confidence": "high"
    }
  },
  "consignee": {
    "fax": {
      "value": null,
      "confidence": "low"
    },
    "pin": {
      "value": "11191",
      "confidence": "high"
    },
    "city": {
      "value": null,
      "confidence": "low"
    },
    "eori": {
      "value": null,
      "confidence": "low"
    },
    "name": {
      "value": "SILVER MOON COMMERCIAL BROKERAG CO",
      "confidence": "high"
    },
    "email": {
      "value": null,
      "confidence": "low"
    },
    "phone": {
      "value": null,
      "confidence": "low"
    },
    "state": {
      "value": null,
      "confidence": "low"
    },
    "address": {
      "value": "Address GARDENS WASFI AL TAL S",
      "confidence": "high"
    },
    "country": {
      "value": null,
      "confidence": "low"
    },
    "full_details": {
      "value": "SILVER MOON COMMERCIAL BROKERAG CO Address : GARDENS WASFI AL TAL ST. P.O Box 9192 Amman 11191 JORDAN",
      "confidence": "high"
    }
  }
};

const node = (value) => ({ value, confidence: "high" });

describe("flattenParties", () => {
  const flat = flattenParties(JOB8);

  it("gives the name its own key, instead of the nested object", () => {
    expect(flat.shipper.value).toBe("TRAILSPEC GEARS PRIVATE LIMITED");
    expect(flat.consignee.value).toBe("SILVER MOON COMMERCIAL BROKERAG CO");
  });

  it("takes the WHOLE address, not the parser's 30-character cut", () => {
    expect(flat.shipper_address.value).toBe(
      "22/702/01 - CEE PEE BUILDING MASJID ROAD, HMT P.O, KALAMASEERY , ERNAKULAM - 683503"
    );
  });

  it("drops the label the model copied into the address", () => {
    expect(flat.consignee_address.value).toBe("GARDENS WASFI AL TAL ST. P.O Box 9192 Amman 11191 JORDAN");
  });

  it("maps the parser's pin to the form's post code", () => {
    expect(flat.shipper_city.value).toBe("KALAMASEERY");
    expect(flat.shipper_post_code.value).toBe("683503");
  });

  it("leaves out what neither the document nor the fallback found", () => {
    expect(flat.shipper_state).toBeUndefined();
    expect(flat.shipper_country).toBeUndefined();
  });

  it("leaves a pasted, already-flat party alone", () => {
    const pasted = { shipper: node("Globex Exports Pvt Ltd") };
    expect(flattenParties(pasted)).toEqual(pasted);
  });

  it("finds the address even when the parser stripped punctuation from the name", () => {
    const out = flattenParties({ shipper: {
      name: node("TSGEXP 001 25 08 2026"),
      full_details: node("TSGEXP/001 & 25-08-2026 12 Dock Road"),
    } });
    expect(out.shipper_address.value).toBe("12 Dock Road");
  });
});

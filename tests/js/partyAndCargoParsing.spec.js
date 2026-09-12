/**
 * Splitting a party block, the low-confidence fallback, and a document's cargo in the
 * panel's keys.
 *
 * 🔴 The first two blocks are the real invoice's parties, written the way an operator pastes
 * them. The fallback fixture is job #8's real consignee; the cargo fixture is job #6's shape.
 */
import { buildPayload, countryCode, flattenCargo, flattenParties, parsePartyBlock } from "@/core/config/awbMapping";

const C = { IN: "India", JO: "Jordan", AE: "United Arab Emirates", DE: "Germany", IQ: "Iraq" };
const node = (value, confidence = "high") => ({ value, confidence });

describe("parsePartyBlock", () => {
  it("splits the real shipper: name, address, city, state, post code, country", () => {
    expect(parsePartyBlock([
      "TRAILSPEC GEARS PRIVATE LIMITED",
      "22/702/01 - CEE PEE BUILDING, MASJID ROAD, HMT P.O",
      "KALAMASEERY, ERNAKULAM - 683503",
      "KERALA, INDIA",
    ].join("\n"), C)).toEqual({
      name: "TRAILSPEC GEARS PRIVATE LIMITED",
      address: "22/702/01 - CEE PEE BUILDING, MASJID ROAD, HMT P.O, KALAMASEERY",
      city: "ERNAKULAM", state: "KERALA", post_code: "683503", country: "IN",
    });
  });

  it("splits the real consignee, dropping the copied 'Address :' label and keeping the P.O Box", () => {
    expect(parsePartyBlock([
      "SILVER MOON COMMERCIAL BROKERAG CO",
      "Address : GARDENS WASFI AL TAL ST.",
      "P.O Box 9192 Amman 11191",
      "Jordan",
    ].join("\n"), C)).toEqual({
      name: "SILVER MOON COMMERCIAL BROKERAG CO",
      address: "GARDENS WASFI AL TAL ST., P.O Box 9192",
      city: "Amman", post_code: "11191", country: "JO",
    });
  });

  it("finds a country written at the end of a line", () => {
    const out = parsePartyBlock("SILVER MOON COMMERCIAL BROKERAG CO\nGARDENS WASFI AL TAL ST.\nAmman 11191 Jordan", C);
    expect([out.city, out.post_code, out.country]).toEqual(["Amman", "11191", "JO"]);
  });

  it("reads a whole party on one line", () => {
    expect(parsePartyBlock("Globex Exports Pvt Ltd, Plot 42/A, MIDC Andheri East, Mumbai 400093, Maharashtra, India", C))
      .toEqual({
        name: "Globex Exports Pvt Ltd", address: "Plot 42/A, MIDC Andheri East",
        city: "Mumbai", state: "Maharashtra", post_code: "400093", country: "IN",
      });
  });

  it("knows UAE, and takes the city from the last part when there is no post code", () => {
    expect(parsePartyBlock("Emirates Trading LLC, Jebel Ali Free Zone, Dubai, UAE", C))
      .toEqual({ name: "Emirates Trading LLC", address: "Jebel Ali Free Zone", city: "Dubai", country: "AE" });
  });

  it("reads a post code written before the city", () => {
    expect(parsePartyBlock("Hansa Logistik GmbH\nGrosse Elbstrasse 145\n20457 Hamburg, Germany", C))
      .toEqual({ name: "Hansa Logistik GmbH", address: "Grosse Elbstrasse 145", city: "Hamburg", post_code: "20457", country: "DE" });
  });

  it("does not take a P.O Box number for a post code", () => {
    expect(parsePartyBlock("Gulf Freight LLC\nP.O Box 9192\nDubai\nUAE", C))
      .toEqual({ name: "Gulf Freight LLC", address: "P.O Box 9192", city: "Dubai", country: "AE" });
  });
});

describe("countryCode", () => {
  it("turns a name into the code the form stores", () => {
    expect([countryCode("India", C), countryCode("JORDAN", C), countryCode("UAE", C)]).toEqual(["IN", "JO", "AE"]);
  });

  it("accepts a code the list has, and refuses one it does not", () => {
    expect([countryCode("in", C), countryCode("PO", C), countryCode("Atlantis", C)]).toEqual(["IN", null, null]);
  });
});

describe("flattenParties: the low-confidence fallback", () => {
  // Job #8's real consignee: the parser found the post code, and nothing for city or country.
  const JOB8_CONSIGNEE = {
    name: node("SILVER MOON COMMERCIAL BROKERAG CO"),
    full_details: node("SILVER MOON COMMERCIAL BROKERAG CO Address : GARDENS WASFI AL TAL ST. P.O Box 9192 Amman 11191 JORDAN"),
    address: node("Address GARDENS WASFI AL TAL S"),
    city: node(null, "low"), state: node(null, "low"), pin: node("11191"), country: node(null, "low"),
  };
  const flat = flattenParties({ consignee: JOB8_CONSIGNEE }, C);

  it("fills the city and country the parser missed, marked for review", () => {
    expect(flat.consignee_city).toEqual({ value: "Amman", confidence: "medium" });
    expect(flat.consignee_country).toEqual({ value: "JO", confidence: "medium" });
  });

  it("keeps what the parser did find", () => {
    expect(flat.consignee_post_code).toEqual({ value: "11191", confidence: "high" });
  });

  it("still leaves out what neither found", () => {
    expect(flat.consignee_state).toBeUndefined();
  });

  it("flattens the notify party like the others", () => {
    const n = flattenParties({ notify: {
      name: node("ACME CLEARING LTD"), full_details: node("ACME CLEARING LTD 12 Dock Road Chennai 600001"),
      city: node("Chennai"), pin: node("600001"),
    } });
    expect([n.notify.value, n.notify_address.value, n.notify_city.value, n.notify_post_code.value])
      .toEqual(["ACME CLEARING LTD", "12 Dock Road Chennai 600001", "Chennai", "600001"]);
  });
});

describe("flattenCargo", () => {
  const JOB6 = {
    piece_weight: { no_of_pieces: node("50"), gross_weight: node("364.09"), chargeable_weight: node("0") },
    cargo: {
      description: node("PU coated polyester travel backpack"),
      dimensions: [{ dimension: node("64X32X64"), count: node("1") }],
    },
  };
  const flat = flattenCargo(JOB6);

  it("brings pieces, gross weight, description and dimensions into the panel's keys", () => {
    expect([flat.pieces.value, flat.gross_weight.value, flat.goods.value, flat.dimensions.value])
      .toEqual(["50", "364.09", "PU coated polyester travel backpack", "64X32X64"]);
  });

  it("leaves out a zero, which the parser writes for a figure it did not find", () => {
    expect(flat.chargeable_weight).toBeUndefined();
  });
});

describe("buildPayload", () => {
  /**
   * 🔴 The field was hardcoded empty while the value sat in a variable beside it, so a
   * chargeable weight never reached a draft — extracted, pasted, or typed by the operator
   * accepting the suggested figure.
   */
  it("carries the chargeable weight into the draft", () => {
    const payload = buildPayload("mawb", {
      pieces: node("14"), gross_weight: node("698.5"), chargeable_weight: node("2016"),
    }, { awbCode: "176", awbNo: "90000001" });

    expect(payload.entries[0].chargable_weight).toBe("2016");
    expect(payload.entries[0].gross_weight).toBe("698.5");
  });
});

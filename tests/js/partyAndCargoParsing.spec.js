/**
 * Splitting a party block, the low-confidence fallback, and a document's cargo in the
 * panel's keys.
 *
 * 🔴 The first two blocks are the real invoice's parties, written the way an operator pastes
 * them. The fallback fixture is job #8's real consignee; the cargo fixture is job #6's shape.
 */
import {
  airportCode, buildPayload, countryCode, flattenCargo, flattenParties, flattenRoute, mailDeviations,
  parsePartyBlock, routeDeviations, withoutWorkedOutParts,
} from "@/core/config/awbMapping";

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

describe("withoutWorkedOutParts", () => {
  /**
   * 🔴 On the real invoice the model answered the shipper's country as "Iraq" — the
   * shipment's destination, printed elsewhere on the page — marked low.
   */
  it("keeps a worked-out state and country out of the draft", () => {
    const out = withoutWorkedOutParts({
      shipper: node("TRAILSPEC GEARS PRIVATE LIMITED"),
      shipper_country: { value: "IQ", confidence: "low" },
      shipper_state: { value: "ERNAKULAM", confidence: "low" },
    });

    expect(out.shipper_country).toBeUndefined();
    expect(out.shipper_state).toBeUndefined();
    expect(out.shipper.value).toBe("TRAILSPEC GEARS PRIVATE LIMITED");
  });

  it("keeps what was read from the party's own address, and what a person typed", () => {
    const out = withoutWorkedOutParts({
      consignee_city: { value: "Amman", confidence: "medium" },
      consignee_country: { value: "JO", confidence: "medium" },
      shipper_country: node("IN"),
    });

    expect(out.consignee_country.value).toBe("JO");
    expect(out.consignee_city.value).toBe("Amman");
    expect(out.shipper_country.value).toBe("IN");
  });
});

describe("mailDeviations", () => {
  /** 🔴 The user: "show if there is a deviation from what the mail said". */
  it("flags where the document disagrees with the mail", () => {
    expect(mailDeviations({ pieces: { value: 3, confidence: "high" } }, { pieces: "26", gross_weight: "364.09" }))
      .toEqual([{ key: "pieces", label: "pieces", mail: "3", document: "26" }]);
  });

  it("says nothing when they agree, or when either side is missing", () => {
    expect(mailDeviations({ pieces: { value: 26 } }, { pieces: "26" })).toEqual([]);
    expect(mailDeviations(null, { pieces: "26" })).toEqual([]);
    expect(mailDeviations({ gross_weight: { value: 364 } }, { gross_weight: null })).toEqual([]);
  });
});

describe("the route", () => {
  // The normalised shape `/ocr-status` returns for job #16's route.
  const route = {
    origin: node("NHAVA SHEVA"), origin_code: node(null, "low"),
    destination: node("Frankfurt"), destination_code: node("FRA"),
  };

  it("keeps a document's route under its own keys, with the airport code when there is one", () => {
    const out = flattenRoute({ route, destination: node("UMM QASR") });

    expect(out.route).toBeUndefined();
    // ⚠️ The label reading's own `destination` is left alone.
    expect(out.destination.value).toBe("UMM QASR");
    expect(out.route_origin).toEqual({ value: "NHAVA SHEVA", written: "NHAVA SHEVA", airport: false, confidence: "high" });
    expect(out.route_destination).toEqual({ value: "FRA", written: "Frankfurt", airport: true, confidence: "high" });
  });

  it("saves a route only as two airport codes", () => {
    const identity = { awbCode: "176", awbNo: "99990006" };

    expect(buildPayload("mawb", { route_origin: node("BOM"), route_destination: node("fra") }, identity).routing_information)
      .toEqual({ departure_airport: "BOM", destination_airport: "FRA", from: "BOM" });
    expect(buildPayload("mawb", flattenRoute({ route }), identity).routing_information).toBeUndefined();
  });

  /** 🔴 The user: "don't accept a country as the route". Job #17 gave destination "India". */
  it("does not take a country as a route end, unless it is also an airport", () => {
    const out = flattenRoute({
      route: { origin: node("Singapore"), origin_code: node("SIN"), destination: node("India"), destination_code: node(null, "low") },
    }, { IN: "India", SG: "Singapore" });

    expect(out.route_destination).toBeUndefined();
    expect(out.route_origin.value).toBe("SIN");
  });

  it("does not take a three-letter sea port for an airport", () => {
    expect(airportCode({ value: "SEA", airport: false })).toBeNull();
    expect(airportCode(node("amm"))).toBe("AMM");
  });

  /** 🔴 The user: "you can mention the mismatch from the mail and the extracted data." */
  it("names each document whose route disagrees with the mail", () => {
    const mail = { origin: node("BOM", "low"), destination: node("FRA", "low") };
    const invoice = { name: "Commercial Invoice.pdf", ...flattenRoute({ route }) };

    expect(routeDeviations(mail, [invoice])).toEqual([{
      document: "Commercial Invoice.pdf", mail: "BOM → FRA", found: "NHAVA SHEVA → Frankfurt", notAirports: true,
    }]);
    expect(routeDeviations(mail, [{ name: "ok.pdf", route_origin: node("BOM"), route_destination: node("FRA") }])).toEqual([]);
    expect(routeDeviations(mail, [{ name: "none.pdf" }])).toEqual([]);
    // Job #18: the destination was a country and was dropped.
    expect(routeDeviations(mail, [{ name: "invoice.pdf", route_origin: { value: "Umm Qasr", written: "Umm Qasr", airport: false } }])[0].found)
      .toBe("Umm Qasr → no destination");
  });
});

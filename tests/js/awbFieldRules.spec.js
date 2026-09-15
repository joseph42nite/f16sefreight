/**
 * "Clean for MAWB/HAWB" — awbFieldRules.
 *
 * 🔴 A long address line 1 spills into line 2 at a word break (user, 2026-09-14). Nothing is dropped:
 * what does not fit is either on line 2 or reported as too long.
 */
import { cleanParty, spillAddress } from "@/core/config/awbFieldRules";
import { buildPayload } from "@/core/config/awbMapping";

const ADDRESS = "22/702/01 - CEE PEE BUILDING, MASJID ROAD, HMT P.O"; // 50 characters

describe("spillAddress", () => {
  it("leaves an address that fits alone", () => {
    expect(spillAddress("PLOT 7, MG ROAD", "", 40)).toBeNull();
  });

  it("splits at the last word break inside the limit, without the joining comma", () => {
    expect(spillAddress(ADDRESS, "", 40)).toEqual({
      first: "22/702/01 - CEE PEE BUILDING, MASJID",
      second: "ROAD, HMT P.O",
    });
  });

  it("puts the spilled words before a line 2 that was already there", () => {
    expect(spillAddress(ADDRESS, "NEAR BUS STAND", 40).second).toBe("ROAD, HMT P.O, NEAR BUS STAND");
  });

  it("does not cut a single word with no break inside the limit", () => {
    expect(spillAddress("A".repeat(45), "", 40)).toBeNull();
  });
});

describe("cleanParty", () => {
  it("spills on a house bill and reports the move", () => {
    const out = cleanParty("hawb", "shipper", { shipper: "INDIA EXPORTS PVT LTD", shipper_address: ADDRESS });

    expect(out.values.shipper_address).toBe("22/702/01 - CEE PEE BUILDING, MASJID");
    expect(out.values.shipper_address_line_2).toBe("ROAD, HMT P.O");
    expect(out.overLimit).toBe(false);
    expect(out.changes.join("; ")).toContain('moved "ROAD, HMT P.O" to address line 2');
  });

  it("does not spill on a master bill, where line 1 takes 255", () => {
    const out = cleanParty("mawb", "shipper", { shipper_address: ADDRESS });

    expect(out.values.shipper_address).toBe(ADDRESS);
    expect(out.values.shipper_address_line_2).toBeUndefined();
  });

  it("still reports when line 2 is too long after the spill", () => {
    const long = "UNIT 4 " + "INDUSTRIAL ESTATE ".repeat(5).trim();
    const out = cleanParty("hawb", "consignee", { consignee_address: long });

    expect(out.overLimit).toBe(true);
    expect(out.changes.join("; ")).toContain("address line 2: too long for a HAWB");
  });

  it("reads {value, confidence} nodes as well as bare values", () => {
    const out = cleanParty("hawb", "shipper", { shipper_address: { value: ADDRESS, confidence: "high" } });

    expect(out.values.shipper_address_line_2).toBe("ROAD, HMT P.O");
  });
});

describe("buildPayload", () => {
  it("sends address line 2 under the endpoint's key", () => {
    const payload = buildPayload("hawb", {
      shipper: "INDIA EXPORTS PVT LTD",
      shipper_address: "22/702/01 - CEE PEE BUILDING, MASJID",
      shipper_address_line_2: "ROAD, HMT P.O",
    }, { hawbNo: "H1" });

    expect(payload.shipper_address.ship_address_line_2).toBe("ROAD, HMT P.O");
  });
});

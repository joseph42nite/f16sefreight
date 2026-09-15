/**
 * Choosing a portal at sign-in.
 */
import { portalFromHost, portalSignInUrl, SIGN_IN_PORTALS } from "@/core/config/portalHosts";

describe("portalFromHost", () => {
  it("reads the portal from the first label", () => {
    expect(portalFromHost("focussea.localhost")).toBe("focussea");
    expect(portalFromHost("accounts.f16sefreight.com")).toBe("accounts");
  });

  it("gives null for a bare host or an unknown label", () => {
    expect(portalFromHost("localhost")).toBeNull();
    expect(portalFromHost("www.f16sefreight.com")).toBeNull();
  });
});

describe("portalSignInUrl", () => {
  it("swaps the portal subdomain and keeps protocol, domain and port", () => {
    expect(portalSignInUrl("focussea", { protocol: "http:", hostname: "focusair.localhost", port: "8099" }))
      .toBe("http://focussea.localhost:8099/?signin=1");
  });

  it("adds the subdomain to a bare host", () => {
    expect(portalSignInUrl("accounts", { protocol: "https:", hostname: "f16sefreight.com", port: "" }))
      .toBe("https://accounts.f16sefreight.com/?signin=1");
  });
});

describe("SIGN_IN_PORTALS", () => {
  it("never offers the platform admin portal", () => {
    expect(SIGN_IN_PORTALS.map((p) => p.key)).not.toContain("superadmin");
  });
});

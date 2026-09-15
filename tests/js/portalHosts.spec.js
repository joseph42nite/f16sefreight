/**
 * Choosing a portal at sign-in.
 */
import { mainSiteUrl, portalFromHost, portalSignInUrl, SIGN_IN_PORTALS } from "@/core/config/portalHosts";

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
      .toBe("http://focussea.localhost:8099/sign-in");
  });

  it("adds the subdomain to a bare host", () => {
    expect(portalSignInUrl("accounts", { protocol: "https:", hostname: "f16sefreight.com", port: "" }))
      .toBe("https://accounts.f16sefreight.com/sign-in");
  });
});

describe("mainSiteUrl", () => {
  it("drops the portal subdomain and keeps the page", () => {
    expect(mainSiteUrl({ protocol: "https:", hostname: "focusair.f16sefreight.com", port: "" }, "/about-us"))
      .toBe("https://f16sefreight.com/about-us");
    expect(mainSiteUrl({ protocol: "http:", hostname: "focusair.localhost", port: "8099" }))
      .toBe("http://localhost:8099/");
  });
});

describe("SIGN_IN_PORTALS", () => {
  it("never offers the platform admin portal", () => {
    expect(SIGN_IN_PORTALS.map((p) => p.key)).not.toContain("superadmin");
  });
});

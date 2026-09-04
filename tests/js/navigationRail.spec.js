import { visibleNavFor } from "@/core/config/navigation";

/**
 * 🔴 The rail decides what a user can find. Both bugs below shipped, and both were
 * INVISIBLE to the server: the token was valid, every endpoint still enforced its own
 * gates, and nothing was logged. The only symptom was a sidebar that quietly showed the
 * wrong things.
 */
const labels = (opts) =>
  visibleNavFor({ tierAtLeast: () => true, ...opts }).map((i) => i.label);

describe("the navigation rail", () => {
  it("keeps one portal's documents off another portal", () => {
    const air = labels({ designation: "pricing", tier: "command", portalKey: "focusair" });

    expect(air).toContain("Documents");
    expect(air).not.toContain("Master Bill of Lading");
  });

  /**
   * 🔴 THE LEAK. The portal check used to read `item.portals && portalKey && …`, so an
   * unknown portal SKIPPED it and every portal's items rendered together — which is how
   * FocusSea's "Master Bill of Lading" appeared on FocusAir.
   */
  it("hides portal-specific items when the portal is unknown, rather than showing them all", () => {
    const unknown = labels({ designation: "pricing", tier: "command", portalKey: null });

    expect(unknown).not.toContain("Master Bill of Lading");
    expect(unknown).not.toContain("Documents");
    // Portal-independent surfaces are unaffected.
    expect(unknown).toContain("Inbox");
  });

  it("shows pricing the enquiries board and operations not", () => {
    const common = { tier: "command", portalKey: "focusair" };

    expect(labels({ ...common, designation: "pricing" })).toContain("Enquiries");
    expect(labels({ ...common, designation: "operations" })).not.toContain("Enquiries");
  });

  /**
   * ⚠️ What a session with no context renders. This is the state a lost localStorage
   * entry produces, and it is why /me exists: the rail collapses to almost nothing while
   * the user is still perfectly authenticated, so nothing tells them what went wrong.
   */
  it("collapses when the designation is unknown, which is what /me recovers from", () => {
    const none = labels({ designation: null, tier: null, portalKey: null });

    expect(none).not.toContain("Inbox");
    expect(none).not.toContain("Enquiries");
    expect(none).not.toContain("Clients & Partners");
    // and crucially it no longer leaks another portal's forms into the gap
    expect(none).not.toContain("Master Bill of Lading");
  });
});

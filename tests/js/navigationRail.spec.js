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

  it("opens a sales login on their dashboard, above the inbox", () => {
    const sales = labels({ designation: "sales", tier: "command", portalKey: "focusair" });

    expect(sales[0]).toBe("Dashboard");
    expect(sales.indexOf("Dashboard")).toBeLessThan(sales.indexOf("Inbox"));
  });

  it("gives the Boss Overview, Inbox, Sales, Financials, Clients & Partners, Settings — in that order", () => {
    const boss = labels({ designation: "boss", tier: "command", portalKey: "admin" });
    expect(boss).toEqual(["Overview", "Inbox", "Sales", "Financials", "Clients & Partners", "Settings"]);
  });

  /**
   * 🔴 The accounts rail IS the deliverable of guide §11: five surfaces named after the job, in the order the
   * work happens, replacing 23 views spread over six destinations. Pinning it here because the failure mode is
   * silent — a stray rail entry re-opens the junk drawer and nothing tells anyone.
   */
  it("lays the accounts desk out by the job, in the order the work happens", () => {
    const accounts = labels({ designation: "accounts", tier: "command", portalKey: "accounts" });

    expect(accounts).toEqual([
      "Today", "Money in", "Money out", "Close the month", "How we're doing",
      "Inbox", "Clients & Partners", "Settings",
    ]);
  });

  /**
   * ⚠️ Financials is the Boss's read-only register. Accounts reach every one of its nine views from one of the
   * five surfaces, so a tenth way in is how the junk drawer formed the first time.
   */
  it("keeps Financials on the Boss's rail and off the accounts desk's", () => {
    expect(labels({ designation: "boss", tier: "command", portalKey: "admin" })).toContain("Financials");
    expect(labels({ designation: "accounts", tier: "command", portalKey: "accounts" })).not.toContain("Financials");
  });

  /**
   * 🔒 §8.1: Command-tier surfaces are VISIBLE AND **LOCKED** below Command, never silently missing — hiding the
   * item hides the reason to upgrade, so the lock has to explain itself. The five accounts surfaces come back
   * with `locked: true` rather than disappearing.
   */
  it("shows a Tactical accounts login the Command surfaces, locked rather than missing", () => {
    const tactical = visibleNavFor({
      designation: "accounts", tier: "tactical", portalKey: "accounts",
      // Faithful to the real helper: an item with no minimum is satisfied by every tier.
      tierAtLeast: (min) => !min || min === "tactical",
    });

    const locked = tactical.filter((i) => i.locked).map((i) => i.label);

    expect(locked).toEqual(["Today", "Money in", "Money out", "Close the month", "How we're doing"]);
    // Their inbox and the directory are Tactical surfaces and stay usable.
    expect(tactical.find((i) => i.label === "Inbox").locked).toBe(false);
  });
});

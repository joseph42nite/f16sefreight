/**
 * The navigation rail, and the landing route for each login.
 *
 * Implements ui_ux_guide.md §8.1–8.3. **The three gating treatments are different on
 * purpose** and this file encodes which applies where:
 *
 *   role forbids   -> HIDDEN.   An operations user has no path to [Confirm Shipment];
 *                               a disabled control just invites "why can't I?" tickets.
 *   tier forbids   -> LOCKED 🔒. This is the upsell. Hiding it hides the reason to upgrade.
 *   state forbids  -> DISABLED with a reason. A user can fix a state; not their role.
 *
 * `designations: null` means every authenticated tenant user.
 */

/** §8.2 — where each login lands, and why. */
export const LANDING_ROUTE = {
  core: "/master-airway-bill", // document generation IS the product at this tier
  pricing: "/inbox", // the day starts in the mail
  operations: "/kanban", // the day starts with assigned work
  sales: "/sales", // Today's Actions is the worklist
  accounts: "/financials", // the registers
  boss: "/boss", // oversight
};

export const NAV_ITEMS = [
  // ── Shared operational surface ────────────────────────────────────────────
  { path: "/inbox", label: "Inbox", icon: "envelope", designations: ["pricing", "operations"], minTier: "tactical" },
  { path: "/kanban", label: "Kanban", icon: "columns", designations: ["pricing", "operations"], minTier: "tactical" },
  { path: "/enquiries", label: "Enquiries", icon: "list-ul", designations: ["pricing"], minTier: "tactical" },

  // ── Document forms — the only surface Core sees ──────────────────────────
  // 🔴 **FocusAir and FocusSea are PRODUCT names, not page names.** FocusAir is the
  // whole air portal — the thing the branch bought. The page inside it is the master
  // document, exactly as its sibling is the house document. Labelling the page
  // "FocusAir" made the product look like a single form.
  { path: "/master-airway-bill", label: "Master Airway Bill", icon: "file-earmark-text", designations: null, portals: ["focusair"] },
  { path: "/house-way-bill", label: "House Waybill", icon: "files", designations: null, portals: ["focusair"] },
  // The despatch record for what has been generated and sent — it reads air waybills and
  // house waybills, so it belongs to FocusAir and nowhere else. Present in the legacy
  // layout's own menu since before the rail existed, and missing here until 2026-09-03:
  // a page reachable only by typing its URL is a page nobody uses.
  // ⚠️ Air consolidation was missing while SEA consolidation was listed — the same
  // component exists for both modes and only one had a way in. An asymmetry like that
  // reads as "air cannot consolidate", which is not true.
  { path: "/consolidation", label: "Consolidation", icon: "boxes", designations: null, portals: ["focusair"] },
  { path: "/message-log", label: "Message Log", icon: "clock-history", designations: null, portals: ["focusair"] },
  // Sea's master/house/consol forms are not built yet. PRD.md §468 makes FocusSea a
  // nav GROUP (Master / House / Consol) rather than one item, so this resolves into
  // three entries when those land — the same correction, applied to sea.
  { path: "/focus-sea", label: "Master Bill of Lading", icon: "water", designations: null, portals: ["focussea"] },
  { path: "/focus-sea/consol", label: "Consolidation", icon: "boxes", designations: null, portals: ["focussea"] },

  // ── Directories ──────────────────────────────────────────────────────────
  // 🔴 ONE ITEM, not two. Clients are who you invoice and partners are who you pay — two
  // sides of one ledger, and as separate rail entries a directory looked like two
  // unrelated features. The union of both audiences sees it: whichever side a role needs,
  // the page opens on Clients and the tab is one click.
  { path: "/clients-partners", label: "Clients & Partners", icon: "people", designations: ["pricing", "operations", "sales", "accounts", "boss"], minTier: "tactical" },

  // ── Command-tier surfaces. VISIBLE AND LOCKED below Command — §8.1. ──────
  { path: "/sales", label: "Sales", icon: "graph-up", designations: ["sales", "boss"], minTier: "tactical" },
  { path: "/financials", label: "Financials", icon: "cash", designations: ["accounts", "boss"], minTier: "command" },
  { path: "/boss", label: "Overview", icon: "speedometer", designations: ["boss"], minTier: "tactical" },

  // ── Always last ──────────────────────────────────────────────────────────
  // ⚠️ Mailboxes is reached from inside Settings, not from the rail. Connecting a mailbox
  // is a once-per-person act of configuration, and a permanent rail slot for it competes
  // with the surfaces an operator uses every hour. The route still exists for deep links.
  { path: "/settings", label: "Settings", icon: "gear", designations: null },
];

/**
 * What the rail should show this user.
 *
 * Returns each item with a `locked` flag rather than filtering locked items out — §8.1's
 * whole point is that a tier-locked item stays VISIBLE. Role-forbidden items are removed
 * here; tier-forbidden ones come back locked.
 */
export function visibleNavFor({ designation, tier, portalKey, tierAtLeast }) {
  return NAV_ITEMS.filter((item) => {
    // Portal-specific items (FocusAir on air, FocusSea on sea).
    if (item.portals && portalKey && item.portals.indexOf(portalKey) === -1) return false;

    // Core renders NO role navigation at all — a single-user tool shows the document
    // forms and settings, and nothing else. There is deliberately no collapsed "locked"
    // section implying hidden roles: role separation is not a feature Core is missing,
    // it is a concept that does not apply (§8.3).
    if (tier === "core") return !item.designations;

    // Role forbids -> hidden.
    if (item.designations && item.designations.indexOf(designation) === -1) return false;

    return true;
  }).map((item) => ({
    ...item,
    // Tier forbids -> visible but locked. This is the upsell moment.
    locked: !tierAtLeast(item.minTier),
  }));
}

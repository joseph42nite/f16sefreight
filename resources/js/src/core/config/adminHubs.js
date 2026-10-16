/**
 * The platform portal in five hubs (owner, 2026-10-11: "the best way to organise superadmin … so I don't have so many
 * pages to open"). The menu shows the hubs; a hub's pages are tabs across its top. Every page the portal had is kept —
 * it moved under a hub instead of the menu. `hidden` pages (forms, editors) belong to a hub without a tab of their own.
 */
export const ADMIN_HUBS = [
  {
    key: "overview", label: "Overview", icon: "fas fa-chart-line", to: "/superadmin/overview",
    tabs: [
      { label: "Graphs", to: "/superadmin/overview" },
      { label: "Health", to: "/superadmin/monitor" },
      { label: "AI usage", to: "/superadmin/ai-usage" },
      { label: "Mail filing", to: "/superadmin/mail-filing" },
    ],
  },
  {
    key: "tickets", label: "Tickets", icon: "fas fa-life-ring", to: "/superadmin/support-desk",
    tabs: [
      { label: "Support desk", to: "/superadmin/support-desk" },
      { label: "Suggestion feedback", to: "/superadmin/suggestion-feedback" },
    ],
  },
  {
    key: "tenants", label: "Tenants", icon: "fas fa-building", to: "/superadmin/tenants",
    tabs: [
      { label: "Companies & branches", to: "/superadmin/tenants" },
      { label: "People", to: "/superadmin/all-users" },
      { label: "Shipments", to: "/superadmin/client-shipments" },
      { label: "Website contacts", to: "/superadmin/all-contacts" },
    ],
    hidden: ["/superadmin/all-company", "/superadmin/all-branch", "/superadmin/new-company", "/superadmin/new-branch", "/superadmin/new-users"],
  },
  {
    key: "library", label: "Library", icon: "fas fa-book", to: "/superadmin/airlines",
    tabs: [
      { label: "Airlines", to: "/superadmin/airlines" },
      { label: "Domain directory", to: "/superadmin/domain-directory" },
      { label: "Help documents", to: "/superadmin/help-documents" },
      { label: "OCR templates", to: "/superadmin/all-templates" },
      { label: "Blogs", to: "/superadmin/all-blogs" },
    ],
    hidden: ["/superadmin/edit-template", "/superadmin/new-blog"],
  },
  {
    key: "settings", label: "Settings", icon: "fas fa-cog", to: "/superadmin/setting",
    tabs: [
      { label: "Platform", to: "/superadmin/setting" },
      { label: "My account", to: "/superadmin/account" },
    ],
  },
];

/** The hub a path belongs to: by its tabs, then its hidden pages (a form's path carries an id after it). */
export function hubFor(path) {
  const clean = String(path || "").replace(/\/+$/, "");
  const owns = (to) => clean === to || clean.startsWith(to + "/");

  return ADMIN_HUBS.find((h) => h.tabs.some((t) => owns(t.to)) || (h.hidden || []).some(owns)) || null;
}

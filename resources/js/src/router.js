import Vue from "vue";
import store from "@/core/services/store";
import { LANDING_ROUTE } from "@/core/config/navigation";
import { mainSiteUrl, portalFromHost } from "@/core/config/portalHosts";
import Router from "vue-router";
Vue.use(Router);

const router = new Router({
  mode: "history",
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ selector: to.hash, behavior: 'smooth' });
        }, 150);
      });
    }
    return { x: 0, y: 0 };
  },
  routes: [
    //-----------Main Application Layout (Public & User Dashboard)-------------------
    {
      path: "/",
      component: () => import("@/view/layouts/public/MainLayout"),
      children: [
        // Landing & Public Pages
        {
          name: "userlogin",
          path: "/",
          component: () => import("@/view/pages/public/Home"),
          meta: { site: true, logo: 'white' }
        },
        {
          name: "About Us",
          path: "/about-us",
          component: () => import("@/view/pages/public/AboutUs"),
          meta: { site: true, logo: 'blue' }
        },
        {
          name: "Services",
          path: "/services",
          component: () => import("@/view/pages/public/Services"),
          meta: { site: true, logo: 'blue' }
        },
        {
          name: "Solutions",
          path: "/solutions",
          component: () => import("@/view/pages/public/Solutions"),
          meta: { site: true, logo: 'blue' }
        },
        {
          name: "Contact Us",
          path: "/contact-us",
          component: () => import("@/view/pages/public/ContactUs"),
          meta: { site: true, logo: 'blue' }
        },
        {
          name: "Scalable Architecture",
          path: "/scalable-architecture",
          component: () => import("@/view/pages/public/services/ScalableArchitecture"),
          meta: { site: true, logo: 'blue' }
        },
        {
          name: "Cloud Storage",
          path: "/cloud-storage",
          component: () => import("@/view/pages/public/services/CloudStorage"),
          meta: { site: true, logo: 'blue' }
        },
        {
          name: "Privacy",
          path: "/privacy",
          component: () => import("@/view/pages/public/legal/Privacy"),
          meta: { site: true, logo: 'blue' }
        },
        {
          name: "End to End",
          path: "/end-to-end",
          component: () => import("@/view/pages/public/services/EndToEnd"),
          meta: { site: true, logo: 'blue' }
        },
        {
          name: "Product Description",
          path: "/product-description",
          component: () => import("@/view/pages/public/services/ProductDescription"),
          meta: { site: true, logo: 'blue' }
        },
        {
          name: "Blogs and News",
          path: "/blogs-and-news",
          component: () => import("@/view/pages/public/BlogsAndNews"),
          meta: { site: true, logo: 'blue' }
        },
        {
          name: "Blog Post",
          path: "/blog/:slug",
          component: () => import("@/view/pages/public/BlogPost"),
          meta: { site: true, logo: 'blue' }
        },
        {
          name: "Terms&Condition",
          path: "/terms-conditions",
          component: () => import("@/view/pages/public/legal/TermsAndConditions"),
          meta: { site: true, logo: 'blue' }
        },
        {
          name: "Privacy Policy",
          path: "/privacy-policy",
          component: () => import("@/view/pages/public/legal/PrivacyPolicy"),
          meta: { site: true, logo: 'blue' }
        },
        {
          path: '/PasswordForgotForm/:token?/:email?/:userType?',
          name: "Password Forgot Form",
          component: () => import("@/view/pages/public/PasswordForgotForm"),
          meta: { logo: 'blue' }
        },

        // User Dashboard Pages
        {
          // The MASTER air waybill form. `focus-air` stays as an alias because eight
          // legacy files link to it (header, footer, sidebar, the auth landing
          // fallback) — renaming the path would break every one of them for a label
          // change. New links use the canonical path.
          name: "Master Airway Bill",
          path: "master-airway-bill",
          alias: "focus-air",
          component: () => import("@/view/pages/dashboard/FocusAir"),
          meta: { userType: 'user' }
        },
        {
          path: 'edit-airway-bill/:id?',
          name: 'EditAirwayBill',
          component: () => import("@/view/pages/dashboard/FocusAir"),
          meta: { userType: 'user' }
        },
        {
          name: "House Way Bill",
          path: "house-way-bill",
          component: () => import("@/view/pages/dashboard/HouseWayBill"),
          meta: { userType: 'user' }
        },
        {
          name: "Consolidation",
          path: "consolidation",
          component: () => import("@/view/pages/dashboard/Consolidation"),
          meta: { userType: 'user' }
        },
        {
          path: 'edit-houseway-bill/:id?',
          name: 'EditHousewayBill',
          component: () => import("@/view/pages/dashboard/HouseWayBill"),
          meta: { userType: 'user' }
        },
        {
          name: "Message Log",
          path: "message-log",
          component: () => import("@/view/pages/dashboard/MessageLog"),
          meta: { userType: 'user' }
        },
        {
          name: "XML View",
          path: "xml-view/:id?",
          component: () => import("@/view/pages/dashboard/XmlView"),
          meta: { userType: 'user' }
        },
        {
          name: "Settings",
          path: "settings",
          component: () => import("@/view/pages/dashboard/UserSettings"),
          meta: { userType: 'user' }
        },
      ]
    },

    //-----------superadmin route-------------------
    {
      path: "/superadmin/",
      component: () => import("@/view/layouts/admin/Layout"),
      children: [
        {
          // §5.6 — the platform monitor and the support desk. Both read endpoints
          // behind the `superAdmin-api` guard, so they are unreachable from any
          // tenant login however the URL is typed.
          path: "monitor",
          name: "superadmin-monitor",
          component: () => import("@/view/pages/admin/SuperadminMonitor.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "support-desk",
          name: "superadmin-supportdesk",
          component: () => import("@/view/pages/admin/SupportDeskTickets.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          // §5.6 — review of what the platform has learned. Approving applies a domain
          // to EVERY tenant, so it is deliberately a superadmin screen and deliberately
          // a decision rather than an automation.
          path: "domain-directory",
          name: "superadmin-domain-directory",
          component: () => import("@/view/pages/admin/DomainDirectory.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          // Platform reference data: prefix, name and domain, curated once for every
          // tenant rather than re-keyed by each branch.
          // What Gemma 4 on OpenRouter costs: the month against the budget, and the per-user limit.
          path: "help-documents",
          name: "superadmin-help-documents",
          component: () => import("@/view/pages/admin/HelpDocuments.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "ai-usage",
          name: "superadmin-ai-usage",
          component: () => import("@/view/pages/admin/AiUsage.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          // How reps answered the suggested client emails: sent, dismissed and why (user, 2026-09-15).
          // How the regex files mail and how often people change it (user, 2026-09-17).
          path: "mail-filing",
          name: "superadmin-mail-filing",
          component: () => import("@/view/pages/admin/MailFiling.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "suggestion-feedback",
          name: "superadmin-suggestion-feedback",
          component: () => import("@/view/pages/admin/SuggestionFeedback.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "airlines",
          name: "superadmin-airlines",
          component: () => import("@/view/pages/admin/AirlineDirectory.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "all-users",
          name: "superadmin-allusers",
          component: () => import("@/view/pages/admin/AllUsers.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "all-company",
          name: "superadmin-allcompany",
          component: () => import("@/view/pages/admin/AllCompany.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "client-shipments",
          name: "superadmin-clientshipments",
          component: () => import("@/view/pages/admin/ClientShipments.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "all-branch",
          name: "superadmin-allbranch",
          component: () => import("@/view/pages/admin/AllBranch.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "setting",
          name: "superadmin-Setting",
          component: () => import("@/view/pages/admin/Settings.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "new-users/:id?",
          name: "superadmin-newusers",
          component: () => import("@/view/pages/admin/NewUsers.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "new-company/:id?",
          name: "superadmin-newcompany",
          component: () => import("@/view/pages/admin/NewCompany.vue"),
          meta: { userType: 'superadmin' }
        }, {
          path: "new-branch/:id?",
          name: "superadmin-newbranch",
          component: () => import("@/view/pages/admin/NewBranch.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "account",
          name: "superadmin-account",
          component: () => import("@/view/pages/admin/Account.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "all-contacts",
          name: "superadmin-allcontacts",
          component: () => import("@/view/pages/admin/AllContacts.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "all-blogs",
          name: "superadmin-allblogs",
          component: () => import("@/view/pages/admin/AllBlogs.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "new-blog/:id?",
          name: "superadmin-newblog",
          component: () => import("@/view/pages/admin/NewBlog.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "all-templates",
          name: "superadmin-alltemplates",
          component: () => import("@/view/pages/admin/AllSystemTemplates.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "edit-template/:key?",
          name: "superadmin-edittemplate",
          component: () => import("@/view/pages/admin/EditSystemTemplate.vue"),
          meta: { userType: 'superadmin' }
        },
      ]
    },
    {
      path: "/joseph-ceo-938204719284",
      name: "Joseph CEO Card",
      component: () => import("@/view/pages/public/JosephCard.vue"),
      meta: { site: true, logo: 'none' }
    },
    {
      path: "/deepanjan-coo-839204817294",
      name: "Deepanjan COO Card",
      component: () => import("@/view/pages/public/DeepanjanCard.vue"),
      meta: { site: true, logo: 'none' }
    },

    //-----------Freight OS — the operational shell------------------------------
    // Its own layout, NOT the public MainLayout: this is the tool, and it must not
    // carry the marketing header and footer. ui_ux_guide.md §1.1 — density first.
    //
    // 🔴 **THIS BLOCK MUST STAY BELOW THE PUBLIC ROUTES AND ABOVE THE `*` CATCH-ALL.**
    // Its parent path is "/", and vue-router takes the FIRST match — so registering it
    // first shadowed the public "/" entirely, which is where the LOGIN PAGE lives. The
    // result was an empty operational shell with core-tier navigation and no way to
    // sign in: every screen looked broken because nobody could authenticate. Below the
    // public block, "/" resolves to the login and "/inbox" still resolves here.
    {
      path: "/",
      component: () => import("@/view/layouts/freight/AppShell"),
      children: [
        {
          path: "inbox",
          name: "Inbox",
          component: () => import("@/view/pages/freight/JobInbox"),
          // Accounts read their own mail here too (user, 2026-09-19) — remittances, supplier bills, payment queries.
          meta: { userType: 'user', designations: ['pricing', 'operations', 'sales', 'boss', 'accounts'], minTier: 'tactical' }
        },
        {
          // §4.2 — connecting the mailbox the Inbox reads from. Same tier gate as the
          // Inbox itself: there is no reason to let a Core tenant connect a mailbox whose
          // messages they will never be shown.
          // Mailboxes live in Settings now (user, 2026-09-17); old links land there.
          path: "mailboxes",
          redirect: "/settings"
        },
        {
          // Where Microsoft's sign-in lands: the last month of mail coming in (user, 2026-09-16).
          path: "mailbox-import/:id",
          name: "MailboxImport",
          component: () => import("@/view/pages/freight/MailboxImport"),
          meta: { userType: 'user', designations: ['pricing', 'operations', 'sales', 'boss', 'accounts'], minTier: 'tactical' }
        },
        {
          path: "enquiries",
          name: "Enquiries",
          component: () => import("@/view/pages/freight/EnquiryBoard"),
          meta: { userType: 'user', designations: ['pricing', 'sales'], minTier: 'tactical' }
        },
        {
          path: "kanban",
          name: "Kanban",
          component: () => import("@/view/pages/freight/JobBoard"),
          meta: { userType: 'user', designations: ['pricing', 'operations', 'sales'], minTier: 'tactical' }
        },
        {
          // Clients and partners are two sides of one ledger — who you invoice and who you
          // pay — so they share a page. The individual routes stay for deep links.
          path: "clients-partners",
          name: "ClientsAndPartners",
          component: () => import("@/view/pages/freight/ClientsAndPartners"),
          meta: { userType: 'user', minTier: 'tactical' }
        },
        {
          path: "customers",
          name: "Customers",
          component: () => import("@/view/pages/freight/DirectoryTable"),
          props: { endpoint: "/customers" },
          meta: { userType: 'user', designations: ['pricing', 'sales', 'accounts', 'boss'], minTier: 'tactical' }
        },
        {
          path: "partners",
          name: "Partners",
          component: () => import("@/view/pages/freight/DirectoryTable"),
          props: { endpoint: "/partners" },
          meta: { userType: 'user', designations: ['pricing', 'operations', 'accounts', 'boss'], minTier: 'tactical' }
        },
        {
          // FocusSea's master document. §9.2 makes FocusSea a nav GROUP once the
          // house and consol forms exist; this is the first of the three.
          path: "focus-sea",
          name: "Master Bill of Lading",
          component: () => import("@/view/pages/freight/FocusSeaMaster"),
          meta: { userType: 'user' }
        },
        {
          path: "focus-sea/consol",
          name: "Consolidation",
          component: () => import("@/view/pages/freight/FocusSeaConsol"),
          meta: { userType: 'user' }
        },
        {
          path: "sales",
          name: "Sales",
          component: () => import("@/view/pages/freight/SalesDashboard"),
          meta: { userType: 'user', designations: ['sales', 'boss'], minTier: 'tactical' }
        },
        {
          // Cross-mode oversight. No portal scope, so the funnel shows air and sea
          // side by side rather than one at a time.
          path: "boss",
          name: "Overview",
          component: () => import("@/view/pages/freight/BossDashboard"),
          meta: { userType: 'user', designations: ['boss'], minTier: 'tactical' }
        },
        {
          // §9.6 — `command` only, and gated per role rather than per group: the Boss
          // READS the register from admin., accounts WORKS it from accounts.
          // Settings → Finance: the chart of accounts and the rate cards (user, 2026-09-18).
          path: "settings/finance",
          name: "FinanceSettings",
          component: () => import("@/view/pages/freight/FinanceSettings"),
          meta: { userType: 'user', designations: ['accounts', 'boss'], minTier: 'command' }
        },
        {
          // Money in: bill it, collect it, chase it — one pipeline (guide §11.2).
          path: "money-in",
          name: "MoneyIn",
          component: () => import("@/view/pages/freight/MoneyIn"),
          meta: { userType: 'user', designations: ['accounts', 'boss'], minTier: 'command' }
        },
        {
          // The accounts desk's home: what to do today (guide §11.2).
          path: "today",
          name: "AccountsToday",
          component: () => import("@/view/pages/freight/AccountsToday"),
          meta: { userType: 'user', designations: ['accounts', 'boss'], minTier: 'command' }
        },
        {
          // What each shipment, client and lane made.
          path: "profitability",
          name: "Profitability",
          component: () => import("@/view/pages/freight/Profitability"),
          meta: { userType: 'user', designations: ['accounts', 'boss'], minTier: 'command' }
        },
        {
          // The day book, and the drill from a report line to the document behind it.
          path: "journal",
          name: "Journal",
          component: () => import("@/view/pages/freight/Journal"),
          meta: { userType: 'user', designations: ['accounts', 'boss'], minTier: 'command' }
        },
        {
          // Ageing and collections: who owes what, and what has been done about it.
          path: "collections",
          name: "Collections",
          component: () => import("@/view/pages/freight/Collections"),
          meta: { userType: 'user', designations: ['accounts', 'boss'], minTier: 'command' }
        },
        {
          // The billing desk: the five sales documents, receipts, printing and the e-invoice register.
          path: "billing",
          name: "Billing",
          component: () => import("@/view/pages/freight/Billing"),
          meta: { userType: 'user', designations: ['accounts', 'boss'], minTier: 'command' }
        },
        {
          path: "financials",
          name: "Financials",
          component: () => import("@/view/pages/freight/Financials"),
          meta: { userType: 'user', designations: ['accounts', 'boss'], minTier: 'command' }
        },
        {
          // The tier lock lands here rather than nowhere — §8.1: hiding the item
          // would hide the reason to upgrade, so the lock must explain itself.
          path: "upgrade",
          name: "Upgrade",
          component: () => import("@/view/pages/freight/UpgradeTeaser"),
          meta: { userType: 'user' }
        },
      ]
    },

    //-----------A portal's own sign-in page ---------------------------------------
    // focusair.<domain>, focussea.<domain>… open straight onto this, with nothing from the company website
    // (user, 2026-09-15). The website lives on the main domain.
    {
      path: "/sign-in",
      name: "portal-sign-in",
      component: () => import("@/view/pages/public/PortalSignIn.vue"),
    },

    {
      path: "*",
      redirect: "/404"
    },
    {
      // the 404 route, when none of the above matches
      path: "/404",
      name: "404",
      component: () => import("@/view/pages/error/Error-1.vue")
    }
  ],
});

/**
 * Route gating — ui_ux_guide.md §8.1.
 *
 *   role forbids  -> redirect to this login's landing route (the item was hidden anyway;
 *                    a direct URL should not 404, it should take you to your work)
 *   tier forbids  -> redirect to /upgrade, which explains itself
 *
 * 🔴 **CONVENIENCE, NEVER SECURITY.** Every route this guards is also gated server-side
 * by the `portal` middleware and the role gates. Someone bypassing this guard reaches an
 * endpoint that refuses them — this only spares them the round trip.
 */
/**
 * A portal address is the portal only (user, 2026-09-15). On focusair.<domain> and the rest, "/" is the
 * portal's sign-in page (or the app, once signed in) and a company website page goes to the main domain,
 * so a portal never downloads the website.
 */
router.beforeEach((to, from, next) => {
  const portal = portalFromHost(window.location.hostname);

  if (!portal) {
    // The main domain has no portal sign-in page of its own: its header's Sign In asks which portal.
    return to.name === "portal-sign-in" ? next({ path: "/", query: { signin: "1" } }) : next();
  }

  const home = portal === "superadmin" ? "/superadmin/all-users" : LANDING_ROUTE[store.getters.designation] || "/focus-air";

  // Already signed in: the sign-in page is the app.
  if (to.name === "portal-sign-in") return store.getters.isAuthenticated ? next(home) : next();

  if (!(to.meta && to.meta.site)) return next();

  if (to.path === "/") return store.getters.isAuthenticated ? next(home) : next({ name: "portal-sign-in" });

  window.location.href = mainSiteUrl(window.location, to.fullPath);
  return next(false);
});

router.beforeEach((to, from, next) => {
  const meta = to.meta || {};
  if (!meta.designations && !meta.minTier) return next();

  const designation = store.getters.designation;
  const tier = store.getters.tier;

  // Context not resolved yet (a hard refresh before /me returns) — let it through and
  // let the server decide. Guessing here would bounce a legitimate user to /upgrade.
  if (!designation && !tier) return next();

  // TIER BEFORE ROLE, matching the server. On core, designation is inert.
  if (meta.minTier && !store.getters.tierAtLeast(meta.minTier)) {
    return next({ path: "/upgrade", query: { from: to.path } });
  }

  if (meta.designations && meta.designations.indexOf(designation) === -1) {
    return next(LANDING_ROUTE[designation] || "/focus-air");
  }

  return next();
});

export default router;

import Vue from "vue";
import store from "@/core/services/store";
import { LANDING_ROUTE } from "@/core/config/navigation";
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
          meta: { logo: 'white' }
        },
        {
          name: "About Us",
          path: "/about-us",
          component: () => import("@/view/pages/public/AboutUs"),
          meta: { logo: 'blue' }
        },
        {
          name: "Services",
          path: "/services",
          component: () => import("@/view/pages/public/Services"),
          meta: { logo: 'blue' }
        },
        {
          name: "Solutions",
          path: "/solutions",
          component: () => import("@/view/pages/public/Solutions"),
          meta: { logo: 'blue' }
        },
        {
          name: "Contact Us",
          path: "/contact-us",
          component: () => import("@/view/pages/public/ContactUs"),
          meta: { logo: 'blue' }
        },
        {
          name: "Scalable Architecture",
          path: "/scalable-architecture",
          component: () => import("@/view/pages/public/services/ScalableArchitecture"),
          meta: { logo: 'blue' }
        },
        {
          name: "Cloud Storage",
          path: "/cloud-storage",
          component: () => import("@/view/pages/public/services/CloudStorage"),
          meta: { logo: 'blue' }
        },
        {
          name: "Privacy",
          path: "/privacy",
          component: () => import("@/view/pages/public/legal/Privacy"),
          meta: { logo: 'blue' }
        },
        {
          name: "End to End",
          path: "/end-to-end",
          component: () => import("@/view/pages/public/services/EndToEnd"),
          meta: { logo: 'blue' }
        },
        {
          name: "Product Description",
          path: "/product-description",
          component: () => import("@/view/pages/public/services/ProductDescription"),
          meta: { logo: 'blue' }
        },
        {
          name: "Blogs and News",
          path: "/blogs-and-news",
          component: () => import("@/view/pages/public/BlogsAndNews"),
          meta: { logo: 'blue' }
        },
        {
          name: "Blog Post",
          path: "/blog/:slug",
          component: () => import("@/view/pages/public/BlogPost"),
          meta: { logo: 'blue' }
        },
        {
          name: "Terms&Condition",
          path: "/terms-conditions",
          component: () => import("@/view/pages/public/legal/TermsAndConditions"),
          meta: { logo: 'blue' }
        },
        {
          name: "Privacy Policy",
          path: "/privacy-policy",
          component: () => import("@/view/pages/public/legal/PrivacyPolicy"),
          meta: { logo: 'blue' }
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
      meta: { logo: 'none' }
    },
    {
      path: "/deepanjan-coo-839204817294",
      name: "Deepanjan COO Card",
      component: () => import("@/view/pages/public/DeepanjanCard.vue"),
      meta: { logo: 'none' }
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
          meta: { userType: 'user', designations: ['pricing', 'operations'], minTier: 'tactical' }
        },
        {
          path: "enquiries",
          name: "Enquiries",
          component: () => import("@/view/pages/freight/EnquiryBoard"),
          meta: { userType: 'user', designations: ['pricing'], minTier: 'tactical' }
        },
        {
          path: "kanban",
          name: "Kanban",
          component: () => import("@/view/pages/freight/JobBoard"),
          meta: { userType: 'user', designations: ['pricing', 'operations'], minTier: 'tactical' }
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

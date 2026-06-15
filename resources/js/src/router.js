import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

export default new Router({
  mode: "history",
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash, behavior: 'smooth' };
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
        {
          path: '/company-selection',
          name: "CompanySelection",
          component: () => import("@/view/pages/public/CompanySelection"),
          meta: { logo: 'blue' }
        },

        // User Dashboard Pages
        {
          name: "Mail/Inbox",
          path: "inbox",
          component: () => import("@/view/pages/dashboard/JobInbox"),
          meta: { userType: 'user' }
        },
        {
          name: "Kanban Board",
          path: "kanban",
          component: () => import("@/view/pages/dashboard/KanbanBoard"),
          meta: { userType: 'user' }
        },
        {
          name: "Financials",
          path: "financials",
          component: () => import("@/view/pages/dashboard/Financials"),
          meta: { userType: 'user' }
        },
        {
          name: "Analytics",
          path: "analytics",
          component: () => import("@/view/pages/dashboard/AnalyticsDashboard"),
          meta: { userType: 'user' }
        },
        {
          name: "Settings",
          path: "settings",
          component: () => import("@/view/pages/dashboard/Settings"),
          meta: { userType: 'user' }
        },
        {
          name: "Focus Air",
          path: "focus-air",
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
          name: "Focus Sea Master",
          path: "focus-sea-master",
          component: () => import("@/view/pages/dashboard/FocusSeaMaster"),
          meta: { userType: 'user' }
        },
        {
          name: "Focus Sea House",
          path: "focus-sea-house",
          component: () => import("@/view/pages/dashboard/FocusSeaHouse"),
          meta: { userType: 'user' }
        },
        {
          name: "Focus Sea Consol",
          path: "focus-sea-consol",
          component: () => import("@/view/pages/dashboard/FocusSeaConsol"),
          meta: { userType: 'user' }
        },
        {
          name: "Focus Air Import",
          path: "focus-air-import",
          component: () => import("@/view/pages/dashboard/FocusAirImport"),
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
          path: "boss-dashboard",
          name: "superadmin-boss-dashboard",
          component: () => import("@/view/pages/admin/BossDashboard.vue"),
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
          path: "all-branch",
          name: "superadmin-allbranch",
          component: () => import("@/view/pages/admin/AllBranch.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "branch-users",
          name: "superadmin-branchusers",
          component: () => import("@/view/pages/admin/BranchUsers.vue"),
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
        {
          path: "client-awb-tracking",
          name: "superadmin-client-awb-tracking",
          component: () => import("@/view/pages/admin/ClientAwbTracking.vue"),
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

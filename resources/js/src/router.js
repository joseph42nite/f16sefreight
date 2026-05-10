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
          name: "Small Business",
          path: "/small-business",
          component: () => import("@/view/pages/public/services/SmallBusiness"),
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
          path: "rate",
          name: "user-rate",
          component: () => import("@/view/pages/dashboard/Rate.vue"),
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
          path: "rate-import",
          name: "superadmin-ImportExcel",
          component: () => import("@/view/pages/admin/ImportRates.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "location-import",
          name: "superadmin-ImportLocation",
          component: () => import("@/view/pages/admin/ImportLocation.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "ams-import",
          name: "superadmin-ImportAms",
          component: () => import("@/view/pages/admin/ImportAms.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "setting",
          name: "superadmin-Setting",
          component: () => import("@/view/pages/admin/Settings.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "delete-rate",
          name: "superadmin-DeleteRate",
          component: () => import("@/view/pages/admin/DeleteRate.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "delete-ams",
          name: "superadmin-DeleteAms",
          component: () => import("@/view/pages/admin/DeleteAms.vue"),
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

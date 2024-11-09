import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
export default new Router({
  mode: "history",
  routes: [
    //-----------users route-------------------
    {
      path: "/",
      redirect: "/focusakash",
      component: () => import("@/view/layout/Layout"),
      children: [
        {
          path: "focusakash",
          name: "user-rate",
          component: () => import("@/view/pages/Rate.vue"),
          meta: { userType: 'user' }
        },
        {
          name: "Web Doc",
          path: "/web-doc",
          component: () =>import("@/view/pages/WebDoc"),
        },
        {
          name: "House Way Bill",
          path: "/house-way-bill",
          component: () =>import("@/view/pages/HouseWayBill"),
        },
        {
          path: '/edit-houseway-bill/:id?',
          name: 'EditHousewayBill',
          component: () => import("@/view/pages/HouseWayBill"),
        },
        {
          name: "Message Log",
          path: "/message-log",
          component: () =>import("@/view/pages/MessageLog"),
        },
        {
          name: "Test",
          path: "/test-view",
          component: () =>import("@/view/pages/Test"),
        },
      ]
    },
    //-----------superadmin route-------------------
    {
      path: "/superadmin/",
      component: () => import("@/view/layout-superadmin/Layout"),
      children: [
        {
          path: "all-users",
          name: "superadmin-allusers",
          component: () => import("@/view/superadmin/AllUsers.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "rate-import",
          name: "superadmin-ImportExcel",
          component: () => import("@/view/superadmin/ImportExcel.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "location-import",
          name: "superadmin-ImportLocation",
          component: () => import("@/view/superadmin/ImportLocation.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "ams-import",
          name: "superadmin-ImportAms",
          component: () => import("@/view/superadmin/ImportAms.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "setting",
          name: "superadmin-Setting",
          component: () => import("@/view/superadmin/Setting.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "delete-rate",
          name: "superadmin-DeleteRate",
          component: () => import("@/view/superadmin/DeleteRate.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "delete-ams",
          name: "superadmin-DeleteAms",
          component: () => import("@/view/superadmin/DeleteAms.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "new-users/:id?",
          name: "superadmin-newusers",
          component: () => import("@/view/superadmin/NewUsers.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "account",
          name: "superadmin-account",
          component: () => import("@/view/superadmin/Account.vue"),
          meta: { userType: 'superadmin' }
        },
        {
          path: "all-contacts",
          name: "superadmin-allcontacts",
          component: () => import("@/view/superadmin/AllContact.vue"),
          meta: { userType: 'superadmin' }
        },
      ]
    },
    //-----------for user login-------------------
    {
      path: "/",
      component: () => import("@/view/pages/auth/login_pages/Login-1"),
      children: [
        {
          name: "userlogin",
          path: "/",
          component: () => import("@/view/pages/auth/login_pages/Login-1"),
        },
      ]
    },
    {
      path: '/PasswordForgotForm/:token?/:email?/:userType?',
      name: "Password Forgot Form",
      component: () => import("@/view/PasswordForgotForm"),
    },
    {
      name: "About Us",
      path: "/about-us",
      component: () =>import("@/view/pages/AboutUs"),
    },
    {
      name: "Terms&Condition",
      path: "/terms-conditions",
      component: () =>import("@/view/pages/Terms-Condition"),
    },
    {
      name: "Contact Us",
      path: "/contact-us",
      component: () =>import("@/view/pages/ContactUs"),
    },
    // {
    //   name: "Web Doc",
    //   path: "/web-doc",
    //   component: () =>import("@/view/pages/WebDoc"),
    // },
    //-----------for admin login-------------------
    // {
    //   path: "/admin/",
    //   component: () => import("@/view/admin/auth/login_pages/Login-1"),
    //   children: [
    //     {
    //       name: "adminlogin",
    //       path: "login",
    //       component: () => import("@/view/admin/auth/login_pages/Login-1"),
    //     },
    //   ]
    // },
    //-----------for super admin login-------------------
    // {
    //   path: "/superadmin/",
    //   component: () => import("@/view/superadmin/auth/login_pages/Login-1"),
    //   children: [
    //     {
    //       name: "superadminlogin",
    //       path: "login",
    //       component: () => import("@/view/superadmin/auth/login_pages/Login-1"),
    //     },
    //   ]
    // },
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
  ]
});

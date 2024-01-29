import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
export default new Router({
  mode: "history",
  routes: [
    //-----------users route-------------------
    {
      path: "/",
      component: () => import("@/view/layout/Layout"),
      children: [
        {
          path: "user-details/:id?/:page_count?/:start?/:end?/:status?",
          name: "user-user-details",
          component: () => import("@/view/pages/UserDetails.vue"),
          meta: { userType: 'user' }
        },
        {
          path: "account",
          name: "user-account",
          component: () => import("@/view/pages/Account.vue"),
          meta: { userType: 'user' }
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
      ]
    },
    //-----------for user login-------------------
    {
      path: "/",
      component: () => import("@/view/pages/auth/login_pages/Login-1"),
      children: [
        {
          name: "userlogin",
          path: "/login",
          component: () => import("@/view/pages/auth/login_pages/Login-1"),
        },
      ]
    },
    {
      path: '/PasswordForgotForm/:token?/:email?/:userType?',
      name: "Password Forgot Form",
      component: () => import("@/view/PasswordForgotForm"),
    },
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

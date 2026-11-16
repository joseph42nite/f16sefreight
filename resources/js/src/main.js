if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
import Vue from "vue";

import App from "./App.vue";
import router from "./router";
window.$ = window.jQuery = require("jquery");
import store from "@/core/services/store";
import consoleRecorder from "@/core/services/console.recorder";
import ApiService from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";
import { VERIFY_AUTH, LOGOUT, SET_ERROR } from "@/core/services/store/auth.module";
import { LANDING_ROUTE } from "@/core/config/navigation";
import { RESET_LAYOUT_CONFIG } from "@/core/services/store/config.module";

import VueMeta from 'vue-meta';

Vue.config.productionTip = false;

Vue.use(VueMeta);

// Click Outside Directive
Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});

import { Form, HasError, AlertError } from "vform";
window.Form = Form;

// Start recording console errors immediately — a bug report is only as good as the
// logs that were captured BEFORE somebody thought to file one.
consoleRecorder.install();
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);


import "@/core/plugins/bootstrap-vue";
import "@/core/plugins/perfect-scrollbar";
import "@/core/plugins/inline-svg";
// The theme's own scripts are the platform admin layout's alone and load with it (frontend audit, FP2); the chart
// library loads with the one chart component that draws with it.

// API service init
ApiService.init();

// A call refused because the session is over (FK2): sign out here and say why on the sign-in page, instead of leaving
// each screen to show its own error until the next navigation. The token is gone after the first, so one redirect.
ApiService.onUnauthorized = (reason) => {
  store.dispatch(LOGOUT)
    .then(() => { if (reason) store.commit(SET_ERROR, reason); })
    .then(() => router.push({ name: "userlogin" }).catch(() => {}));
};

// Remove this to disable mock API
// MockService.init();

router.beforeEach((to, from, next) => {
  // If user is authenticated and tries to access the landing page "/", redirect to their dashboard
  if (to.path === '/' && store.getters.isAuthenticated) {
    const role = JwtService.getRole();
    if (role === 'user') {
      // Where this person's day starts, as at sign-in (FK5): everyone used to be sent to the waybill screen.
      return next(LANDING_ROUTE[store.getters.designation] || '/focus-air');
    } else if (role === 'superAdmin') {
      return next('/superadmin/overview');
    }
  }

  // Ensure we checked auth before each page load.
  if (!to.matched.some((record) => record.meta.userType)) {
    next();
 }
 else{
  let userType=to.meta.userType;

  // A page for the OTHER kind of account (frontend audit, FS13): a tenant who opened a /superadmin address was
  // checked as platform staff, refused, and signed out of their own session. They are sent back to their own
  // start instead; the server still refuses everything behind such a page.
  const role = JwtService.getRole();
  const token = JwtService.getToken();
  const wrongKind = token && token !== 'undefined'
    && ((role === 'user' && userType === 'superadmin') || (role === 'superAdmin' && userType === 'user'));

  if (wrongKind) {
    return next(role === 'user' ? (LANDING_ROUTE[store.getters.designation] || '/focus-air') : '/superadmin/overview');
  }
  // Waited for (FK1): the page is not entered until the session has been checked. `false` means the person was
  // signed out and is already on the way to the sign-in page.
  store.dispatch(VERIFY_AUTH,{userType}).then((ok) => (ok === false ? next(false) : next()));
 }
  // reset config to initial state
  store.dispatch(RESET_LAYOUT_CONFIG);
});

new Vue({
  router,
  store,
  // vuetify,
  render: h => h(App)
}).$mount("#app");

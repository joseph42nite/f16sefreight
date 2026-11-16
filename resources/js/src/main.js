if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
import Vue from "vue";

import App from "./App.vue";
import router from "./router";
window.$ = window.jQuery = require("jquery");
import store from "@/core/services/store";
import VueApexCharts from "vue-apexcharts";
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
Vue.component("apexchart", VueApexCharts);

// Start recording console errors immediately — a bug report is only as good as the
// logs that were captured BEFORE somebody thought to file one.
consoleRecorder.install();
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);


import "@/core/plugins/bootstrap-vue";
import "@/core/plugins/perfect-scrollbar";
import "@/core/plugins/inline-svg";
import "@/core/plugins/metronic";

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
  // i18n,
  // vuetify,
  render: h => h(App)
}).$mount("#app");

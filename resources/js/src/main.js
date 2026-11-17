if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import store from "@/core/services/store";
import consoleRecorder from "@/core/services/console.recorder";
import ApiService from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";
import { VERIFY_AUTH, LOGOUT, SET_ERROR } from "@/core/services/store/auth.module";
import { LANDING_ROUTE } from "@/core/config/navigation";
import { makeAuthGuard } from "@/core/services/authGuard";
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

// Who may enter which page (core/services/authGuard.js, where it is tested). The layout config is reset on every
// navigation, as it always was.
const authGuard = makeAuthGuard({
  isAuthenticated: () => store.getters.isAuthenticated,
  getRole: JwtService.getRole,
  getToken: JwtService.getToken,
  userStart: () => LANDING_ROUTE[store.getters.designation] || "/focus-air",
  verify: (userType) => store.dispatch(VERIFY_AUTH, { userType }),
});

router.beforeEach((to, from, next) => {
  authGuard(to, from, next);
  store.dispatch(RESET_LAYOUT_CONFIG);
});

new Vue({
  router,
  store,
  // vuetify,
  render: h => h(App)
}).$mount("#app");

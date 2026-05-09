if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
import Vue from "vue";
import VueExcelXlsx from "vue-excel-xlsx";
import App from "./App.vue";
import router from "./router";
window.$ = window.jQuery = require("jquery");
import store from "@/core/services/store";
import ApiService from "@/core/services/api.service";
import { VERIFY_AUTH } from "@/core/services/store/auth.module";
import { RESET_LAYOUT_CONFIG } from "@/core/services/store/config.module";
import VueFlip from 'vue-flip';
import VueMeta from 'vue-meta';

Vue.config.productionTip = false;
Vue.use(VueExcelXlsx);
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
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);
Vue.component('VueFlip', VueFlip);
//moment for time formate
import moment from 'moment';
Vue.prototype.moment = moment;

import "@/core/plugins/bootstrap-vue";
import "@/core/plugins/perfect-scrollbar";
import "@/core/plugins/inline-svg";
import "@/core/plugins/metronic";
import "@/core/plugins/formvalidation";
import "@/core/plugins/treeselect";
// API service init
ApiService.init();

// Remove this to disable mock API
// MockService.init();

router.beforeEach((to, from, next) => {
  // Ensure we checked auth before each page load.
  if (!to.matched.some((record) => record.meta.userType)) {
    next();
 }
 else{
  let userType=to.meta.userType;
  Promise.all([store.dispatch(VERIFY_AUTH,{userType})]).then(next);
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

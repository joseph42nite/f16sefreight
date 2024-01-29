import Vue from "vue";
import VueExcelXlsx from "vue-excel-xlsx";
import App from "./App.vue";
import router from "./router";
window.$ = window.jQuery = require("jquery");
import store from "@/core/services/store";
import ApiService from "@/core/services/api.service";
import { VERIFY_AUTH } from "@/core/services/store/auth.module";
import { RESET_LAYOUT_CONFIG } from "@/core/services/store/config.module";

Vue.config.productionTip = false;
Vue.use(VueExcelXlsx);

import { Form, HasError, AlertError } from "vform";
window.Form = Form;
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);
//moment for time formate
import moment from 'moment';
Vue.prototype.moment = moment;

import "@/core/plugins/bootstrap-vue";
import "@/core/plugins/perfect-scrollbar";
import "@/core/plugins/inline-svg";
import "@/core/plugins/metronic";
import "@/core/plugins/formvalidation";

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
  
  // Scroll page to top on every route change
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

new Vue({
  router,
  store,
  // i18n,
  // vuetify,
  render: h => h(App)
}).$mount("#app");

import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth.module";
import context from "./context.module";
import htmlClass from "./htmlclass.module";
import config from "./config.module";
import breadcrumbs from "./breadcrumbs.module";
import profile from "./profile.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    context,
    auth,
    htmlClass,
    config,
    breadcrumbs,
    profile
  }
});

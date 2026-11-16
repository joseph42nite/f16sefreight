import Vue from "vue";
import { BootstrapVue } from "bootstrap-vue";
import icons from "./bootstrap-icons.generated";

// Install BootstrapVue
Vue.use(BootstrapVue);

// 🔴 Only the icons the app names, not the whole set (2026-11-15 frontend audit, FP3): the library's own icons
// plugin registered all 1,371 for every visitor. A b-icon finds its picture among the registered components, so
// each one used has to be registered — the list is written by build/used-icons.js before every compile, from the
// source. An icon that is not in it draws as an empty box, and tests/js/usedIcons.spec.js fails first.
Object.keys(icons).forEach((name) => Vue.component(name, icons[name]));

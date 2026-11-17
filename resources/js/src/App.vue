<template>
  <div class="h-100 main-hide">
     <router-view></router-view>
  </div>
</template>

<style lang="scss">
// Centralized font imports — only the weights actually used across the app
// Roboto: used by Header and dashboard pages
@import "~@fontsource/roboto/400.css";
@import "~@fontsource/roboto/500.css";
@import "~@fontsource/roboto/700.css";

// Inter: used by nav, footer, blog, public pages. All seven weights the pages ask for are served from our own
// site: two card pages used to pull the family from Google Fonts, and because their styles land in the one shared
// stylesheet, every page of every portal waited on that outside request before it could paint. A weight costs a
// few lines here; its file is fetched only by a page that uses it.
@import "~@fontsource/inter/300.css";
@import "~@fontsource/inter/400.css";
@import "~@fontsource/inter/500.css";
@import "~@fontsource/inter/600.css";
@import "~@fontsource/inter/700.css";
@import "~@fontsource/inter/800.css";
@import "~@fontsource/inter/900.css";

html {
  scroll-behavior: smooth;
}
// 3rd party plugins css
@import "~bootstrap-vue/dist/bootstrap-vue.css";
@import "~perfect-scrollbar/css/perfect-scrollbar.css";
// Solid and regular only (FP3): no page uses a brand icon, and `all.css` carried all three families.
@import "~@fortawesome/fontawesome-free/css/fontawesome.css";
@import "~@fortawesome/fontawesome-free/css/solid.css";
@import "~@fortawesome/fontawesome-free/css/regular.css";

// Main demo style scss
@import "assets/sass/style.vue";
</style>
<style scoped>
.main-hide{
  overflow-x: hidden;
}
</style>
<script>
import { OVERRIDE_LAYOUT_CONFIG } from "@/core/services/store/config.module";

export default {
  name: "MetronicVue",
  mounted() {
    /**
     * this is to override the layout config using saved data from localStorage
     * remove this to use config only from static json (@/core/config/layout.config.json)
     */
    this.$store.dispatch(OVERRIDE_LAYOUT_CONFIG);
    
    // Explicitly destroy the root preloader once the application is fully hydrated
    this.$nextTick(() => {
        const loader = document.getElementById('app-preloader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                if(loader.parentNode) loader.parentNode.removeChild(loader);
            }, 600);
        }
    });
  }
};
</script>

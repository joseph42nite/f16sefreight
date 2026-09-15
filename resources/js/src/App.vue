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

// Inter: used by nav, footer, blog, public pages
@import "~@fontsource/inter/400.css";
@import "~@fontsource/inter/500.css";
@import "~@fontsource/inter/600.css";
@import "~@fontsource/inter/700.css";

html {
  scroll-behavior: smooth;
}
// 3rd party plugins css
@import "~bootstrap-vue/dist/bootstrap-vue.css";
@import "~perfect-scrollbar/css/perfect-scrollbar.css";
@import "~@fortawesome/fontawesome-free/css/all.css";

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

<template>
  <div
    id="kt_header_mobile"
    class="header-mobile align-items-center"
    v-bind:class="headerClasses"
  >
    <!--begin::Logo (left-aligned)-->
    <router-link to="/superadmin/all-company" class="mobile-brand-logo">
      <img src="/media/assets/logos/white-logo.png" alt="F16s" class="mobile-brand-logo-img">
    </router-link>
    <!--end::Logo-->

    <!--begin::Aside Mobile Toggle (right)-->
    <button
      v-if="asideEnabled"
      class="btn p-0 burger-icon burger-icon-right"
      id="kt_aside_mobile_toggle"
    >
      <span></span>
    </button>
    <!--end::Aside Mobile Toggle-->
  </div>
</template>

<style>
/* Clean, branded mobile header (global — overrides Metronic theme classes) */
#kt_header_mobile.header-mobile {
  background-color: #1B2134 !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15) !important;
}
#kt_header_mobile .mobile-brand-logo {
  display: flex;
  align-items: center;
}
#kt_header_mobile .mobile-brand-logo-img {
  height: 34px;
  width: auto;
  display: block;
}
/* Burger lines -> white so they read on the dark bar */
#kt_header_mobile .burger-icon span,
#kt_header_mobile .burger-icon span::before,
#kt_header_mobile .burger-icon span::after {
  background-color: #ffffff !important;
}
</style>

<script>
import { mapGetters } from "vuex";
import KTLayoutHeaderTopbar from "@/assets/js/layout/base/header-topbar.js";

export default {
  name: "KTHeaderMobile",
  components: {},
  mounted() {
    // Init Header Topbar For Mobile Mode
    KTLayoutHeaderTopbar.init(this.$refs["kt_header_mobile_topbar_toggle"]);
  },
  computed: {
    ...mapGetters(["layoutConfig", "getClasses"]),

    /**
     * Get header logo
     * @returns {string}
     */
    headerLogo() {
      return process.env.BASE_URL + this.layoutConfig("self.logo.dark");
    },

    /**
     * Get classes for mobile header
     * @returns {null|*}
     */
    headerClasses() {
      const classes = this.getClasses("header_mobile");
      if (typeof classes !== "undefined") {
        return classes.join(" ");
      }
      return null;
    },

    /**
     * Check if the left aside menu is enabled
     * @returns {boolean}
     */
    asideEnabled() {
      return !!this.layoutConfig("aside.self.display");
    }
  }
};
</script>

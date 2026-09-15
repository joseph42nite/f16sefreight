<template>
  <div class="d-flex flex-column flex-root" v-if="isAuthenticated">
    <!-- begin:: Header Mobile -->
    <KTHeaderMobile></KTHeaderMobile>
    <!-- end:: Header Mobile -->

    <!-- begin::Body -->
    <div class="d-flex flex-row flex-column-fluid page">
      <!-- begin:: Aside Left -->
      <KTAside v-if="asideEnabled"></KTAside>
      <!-- end:: Aside Left -->

      <div id="kt_wrapper" class="d-flex flex-column flex-row-fluid wrapper">

        <!-- begin:: Content -->
        <div
          id="kt_content"
          class="content d-flex flex-column flex-column-fluid"
        >
          <!-- begin:: Content Body -->
          <div class="d-flex flex-column-fluid">
            <div
              :class="{
                'container-fluid': contentFluid,
                container: !contentFluid
              }"
            >
              <transition name="fade-in-up" mode="out-in" @after-enter="scrollToTop">
                <router-view />
              </transition>
            </div>
          </div>
        </div>
        <KTFooter></KTFooter>
      </div>
    </div>
    <KTScrollTop></KTScrollTop>
  </div>
</template>
<style>
#kt_content{
  background: #F0F2F5 !important;
}
@media (min-width: 992px){
.header-fixed.subheader-fixed.subheader-enabled .wrapper {
    padding-top: 0 !important; 
}
.header-fixed .wrapper {
    padding-top: 0 !important; 
}
.aside-fixed .wrapper {
    padding-left: 215px !important;
}
.content {
    padding: 15px 0 !important;
}
}
@media (max-width: 991.98px){
  .container, .container-fluid{
    padding: 10px !important;
  }
}
</style>
<script>
import { mapGetters } from "vuex";
import KTAside from "@/view/layouts/admin/aside/Aside.vue";
import KTHeaderMobile from "@/view/layouts/admin/header/HeaderMobile.vue";
import KTFooter from "@/view/layouts/admin/footer/Footer.vue";
import HtmlClass from "@/core/services/htmlclass.service";
import KTScrollTop from "@/view/layouts/admin/extras/ScrollTop";
import {
  ADD_BODY_CLASSNAME,
  REMOVE_BODY_CLASSNAME
} from "@/core/services/store/htmlclass.module.js";

export default {
  name: "Layout",
  components: {
    KTAside,
    KTHeaderMobile,
    KTFooter,
    KTScrollTop
  },
  beforeMount() {
    // show page loading
    this.$store.dispatch(ADD_BODY_CLASSNAME, "page-loading");

    // initialize html element classes
    HtmlClass.init(this.layoutConfig());
  },
  mounted() {
    // check if current user is authenticated
    if (!this.isAuthenticated) {
      this.$router.push({ name: "superadminlogin" });
    }

    // Simulate the delay page loading
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  },
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "layoutConfig"
    ]),

    /**
     * Check if container width is fluid
     * @returns {boolean}
     */
    contentFluid() {
      return this.layoutConfig("content.width") === "fluid";
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

<template>
  <div class="layout-wrapper">
    <!-- Static Header stays outside transitions -->
    <KTHeader></KTHeader>

    <!-- Content of the page that changes based on routes -->
    <transition name="fade-in-up" mode="out-in" @after-enter="scrollToTop">
      <keep-alive :include="['Home', 'FocusAir', 'HouseWayBill', 'MessageLog']">
        <router-view />
      </keep-alive>
    </transition>
    
    <!-- Include FOOTER -->
    <KTFooter></KTFooter>
  </div>
</template>

<style scoped>
.layout-wrapper {
  background: linear-gradient(180deg, #d0e6f8 0%, #ffffff 100%);
  min-height: 100vh;
}
</style>

<script>
import { mapGetters } from "vuex";
import Header from "@/view/layouts/public/Header.vue";
import Footer from "@/view/layouts/public/Footer.vue";


export default {
  name: "MainLayout",
  components: {
    KTHeader: Header,
    KTFooter: Footer
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  },
  computed: {
    ...mapGetters(["isAuthenticated","currentUser"]),
  }
};
</script>

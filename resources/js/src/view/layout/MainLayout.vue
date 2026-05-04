<template>
  <div class="layout-wrapper">
    <div v-if="isAuthenticated">
      <!-- Static Header stays outside transitions -->
      <Header></Header>

      <!-- Content of the page that changes based on routes -->
      <transition name="fade-in-up" mode="out-in" @after-enter="scrollToTop">
        <router-view />
      </transition>
      
      <!-- Include FOOTER -->
      <Footer></Footer>
    </div>
    <div v-else>
      <!-- Static Header stays outside transitions -->
      <Header></Header>

      <!-- Content of the page that changes based on routes -->
      <transition name="fade-in-up" mode="out-in" @after-enter="scrollToTop">
        <router-view />
      </transition>
      
      <!-- Include FOOTER -->
      <Footer></Footer>
    </div>
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
import Header from "@/view/layout/Header.vue";
import Footer from "@/view/layout/Footer.vue";


export default {
  name: "MainLayout",
  components: {
    Header,
    Footer
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

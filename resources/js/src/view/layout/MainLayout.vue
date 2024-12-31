<template>
  <div v-if="isAuthenticated">
    <!-- Include Header -->
    <Header></Header>
    <!-- Content of the page that changes based on routes -->
    <transition name="fade-in-up">
      <router-view />
    </transition>
    <!-- Include FOOTER -->
    <Footer></Footer>
  </div>
  <div v-else>
    <!-- Include Header -->
    <Header></Header>
    <!-- Content of the page that changes based on routes -->
    <transition name="fade-in-up">
      <router-view />
    </transition>
    <!-- Include FOOTER -->
    <Footer></Footer>
  </div>
</template>

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
  mounted() {
    // check if current user is authenticated
    console.log(this.currentUser);
    if (!this.isAuthenticated) {
      this.$router.push({ name: "userlogin" });
    }
  },
  computed: {
    ...mapGetters(["isAuthenticated","currentUser"]),
  }
};
</script>

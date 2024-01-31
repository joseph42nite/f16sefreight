<template>
  <div v-if="isAuthenticated">
    <div class="container">
      <div class="row">
        <div class="w-100">
          <b-navbar toggleable="lg" type="dark" variant="info">
            <b-navbar-brand href="#">NavBar</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
              <b-navbar-nav>
                <b-nav-item href="#">Link</b-nav-item>
              </b-navbar-nav>
              <!-- Right aligned nav items -->
              <b-navbar-nav class="ml-auto">
                <b-navbar-nav>
                  <b-nav-item>Dhiraj Thakur</b-nav-item>
                </b-navbar-nav>
              </b-navbar-nav>
            </b-collapse>
          </b-navbar>
        </div>
        <transition name="fade-in-up">
          <router-view />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { LOGOUT } from "@/core/services/store/auth.module";
export default {
  name: "Layout",
  mounted() {
    // check if current user is authenticated
    if (!this.isAuthenticated) {
      this.$router.push({ name: "userlogin" });
    }
  },
  methods: {},
  computed: {
    ...mapGetters(["isAuthenticated",]),
  }
};
</script>
<style></style>
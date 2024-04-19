<template>
  <div v-if="isAuthenticated">
  <!-- @mouseover="isHovered = true" @mouseleave="isHovered = false" -->
    <div class="wrap">
      <b-navbar toggleable="lg" type="dark" variant="info">
        <div class="container-fluid">
          <div class="navbar-header">
            <b-navbar-brand href="https://f16sefs.in/">
              <!-- isHovered ? blackLogoSrc :  -->
              <img :src="logoSrc" alt="f16s logo" id="main-logo">
            </b-navbar-brand>
          </div>

          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
              <b-nav-item to="/" class="nav-link-custom text-white">Home</b-nav-item>
              <b-nav-item to="/about-us" class="nav-link-custom text-white">About Us</b-nav-item>
              <b-nav-item to="/contact-us" class="nav-link-custom text-white">Contact Us</b-nav-item>
            </b-navbar-nav>

            <b-navbar-nav class="ml-auto m_desk">
              <b-nav-item>
                <button class="btn logout" style="background-color: rgb(115 21 12);">
                  <router-link to="#" @click.native="logout" v-slot="{ href, navigate, isActive, isExactActive }">
                    <li
                      aria-haspopup="true"
                      data-menu-toggle="hover"
                      class="menu-item"
                      :class="[
                        isActive && 'menu-item-active',
                        isExactActive && 'menu-item-active',
                      ]"
                    >
                    <a :href="href" class="menu-link" @click="navigate" style="text-decoration: none;">
                     
                      <span class="menu-text">Logout</span>
                    </a>
                    </li>
                  </router-link>
                </button>
              </b-nav-item>
              <b-nav-item class="mt-2 nav-link-custom text-white" style="font-size: 18px;">
                Hi, {{currentUser.name}}
              </b-nav-item>
            </b-navbar-nav>
            <div class="mt-10 m_mob">
                <button class="btn logout" style="background-color: rgb(115 21 12);" @click="logout()">
                  <a href="#" class="menu-link" style="text-decoration: none;"><span class="menu-text">Logout</span></a>
                </button>
              <span class="text-white" style="font-size: 18px; margin-left: 5%;">Hi, {{currentUser.name}}</span>
            </div>
          </b-collapse>
        </div>
      </b-navbar>
    </div>
    <transition name="fade-in-up">
      <router-view />
    </transition>
  </div>
    <!-- </div> -->
  <!-- </div> -->
</template>

<script>
import { mapGetters } from "vuex";
import { LOGOUT } from "@/core/services/store/auth.module";
export default {
  name: "Layout",
  data(){
    return{
    logoSrc: "/media/custome/logo-1.png",
    blackLogoSrc: "/media/custome/logo-2.png",
    isHovered: false,
    }
  },
  mounted() {
    // check if current user is authenticated
    if (!this.isAuthenticated) {
      this.$router.push({ name: "userlogin" });
    }
  },
  methods: {
    toggleLogo(isHovered) {
      this.logoSrc = isHovered ? this.blackLogoSrc : "/media/custome/logo-1.png";
    },
    hasActiveChildren(match) {
      return this.$route["path"].indexOf(match) !== -1;
    },
    logout() {
      this.$store.dispatch(LOGOUT).then(() => window.location.href='/' );
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated","currentUser"]),
  }
};
</script>
<style scoped>
.navbar {
  background-color: rgb(50, 4, 0) !important;
}
.navbar-header {
  margin-left: 55px;
  margin-top: 10px;
}
.nav-link-custom:hover {
  color: red !important;
}
.navbar-nav .nav-link{
  color: white !important;
}
.nav-link-custom{
  font-size: medium;
}
/* .wrap:hover {
  background-color: #923B33;
}
.wrap:hover.menu-text{
  color:#923B33;
}
.wrap:hover .btn.logout {
  background-color: white !important;
  color: #923B33 !important;
}
.wrap:hover .btn.logout .menu-text{
  color: #923B33 !important;
} */
/* .logout:hover {
  background-color: white !important;
  color: #923B33 !important;
} */
a.menu-link{
text-decoration: none !important;
color: black;
}
.menu-text{
color: White;
}
#main-logo{
  width: 130px;
}
.m_mob{
  display:none;
}
@media (max-width: 768px) {
  .m_mob{
  display:block;
}
.m_desk{
  display:none;
}
  .container {
    margin-top: 5%;
    margin-bottom: 5%;
  }
  #main-logo{
    width: 110px;
  }
  .navbar-header {
  margin-left: 10px;
  margin-top: 20px;
}
.nav-link-custom{
  margin-left: 5px;
}
}
</style>
<template>
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
          <b-navbar-nav class="ml-auto nav-menu">
            <b-nav-item to="/" class="nav-link-custom text-white">Home</b-nav-item>
            <b-nav-item to="/about-us" class="nav-link-custom text-white">About Us</b-nav-item>
            <!-- <b-nav-item to="/contact-us" class="nav-link-custom text-white">User Guide</b-nav-item>
            <b-nav-item to="/contact-us" class="nav-link-custom text-white">FAQs</b-nav-item>
            <b-nav-item to="/contact-us" class="nav-link-custom text-white">Tutorial</b-nav-item> -->
            <b-nav-item to="/contact-us" class="nav-link-custom text-white">Contact Us</b-nav-item>
            <b-nav-item to="/web-doc" class="nav-link-custom text-white">Web Doc</b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto align-items-center content-gap m_desk">
            <b-nav-item class="nav-link-custom text-uppercase" style="font-size: 18px;">
              {{currentUser.origin_airport_code}}
            </b-nav-item>
            <b-nav-item class="nav-link-custom text-uppercase">
              <img :src="avatarLogoSrc" alt="avatar logo" id="avatar-logo">
            </b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto align-items-center content-gap m_desk">
            <b-nav-item class="nav-link-custom text-uppercase">
              <span class="text-danger" style="font-size: 12px;">Hi, {{currentUser.name}}</span>
            </b-nav-item>
            <b-nav-item class="nav-link-custom text-uppercase" style="font-size: 18px;">
              <button class="btn logout" style="background-color: rgb(115 21 12);" @click="logout()">
                <a href="#" class="menu-link" style="text-decoration: none;"><span class="menu-text">Logout</span></a>
              </button>
            </b-nav-item>
          </b-navbar-nav>

        </b-collapse>
      </div>
    </b-navbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { LOGOUT } from "@/core/services/store/auth.module";
export default {
  name: "Header",
  data(){
    return{
    logoSrc: "/media/custome/logo-1.png",
    blackLogoSrc: "/media/custome/logo-2.png",
    avatarLogoSrc: "/media/custome/user-avatar.png",
    isHovered: false,
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
    ...mapGetters(["currentUser"]),
  }
};
</script>
<style scoped>
.navbar {
  height: auto;
  background-color: #D0E6F8; /* For browsers that do not support gradients */
  background-image: linear-gradient(#D0E6F8, #fff);
}
.nav-menu {
  padding: 12px 41px 12px 41px;
  gap: 40px;
  border-radius: 39px;
  opacity: 0px;
  background-color: #9499B212; /* For browsers that do not support gradients */
  background-image: linear-gradient(#9499B212, #22328A12);
}
.nav-link {
  padding: 0px !important;
  color: #355594 !important;
}
.content-gap {
  gap:30px;
}
.navbar-header {
  /* margin-left: 55px;
  margin-top: 10px; */
}
.nav-link-custom:hover {
  color: red !important;
}
.nav-link-custom{
  font-size: 14px;
  line-height: 20px;
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
#avatar-logo{
  width: 35px;
  height: auto;
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
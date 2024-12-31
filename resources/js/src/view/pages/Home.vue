<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
            <b-navbar-brand href="#">NavBar</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item href="#">Link</b-nav-item>
                <b-nav-item href="#" disabled>Disabled</b-nav-item>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-nav-form>
                <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
                </b-nav-form>

                <b-nav-item-dropdown text="Lang" right>
                <b-dropdown-item href="#">EN</b-dropdown-item>
                <b-dropdown-item href="#">ES</b-dropdown-item>
                <b-dropdown-item href="#">RU</b-dropdown-item>
                <b-dropdown-item href="#">FA</b-dropdown-item>
                </b-nav-item-dropdown>

                <b-nav-item-dropdown right>
                <!-- Using 'button-content' slot -->
                <template #button-content>
                    <em>User</em>
                </template>
                <b-dropdown-item href="#">Profile</b-dropdown-item>
                <b-dropdown-item href="#">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
  </template>
  
  <script>
//   import { mapGetters } from "vuex";
//   import { LOGOUT } from "@/core/services/store/auth.module";
  export default {
    name: "Home",
    data(){
      return{
    //   logoSrc: "/media/custome/logo-1.png",
    //   blackLogoSrc: "/media/custome/logo-2.png",
    //   avatarLogoSrc: "/media/custome/user-avatar.png",
      isHovered: false,
      }
    },
    methods: {
    //   toggleLogo(isHovered) {
    //     this.logoSrc = isHovered ? this.blackLogoSrc : "/media/custome/logo-1.png";
    //   },
    //   hasActiveChildren(match) {
    //     return this.$route["path"].indexOf(match) !== -1;
    //   },
    //   logout() {
    //     this.$store.dispatch(LOGOUT).then(() => window.location.href='/' );
    //   },
    },
    // computed: {
    //   ...mapGetters(["currentUser"]),
    // }
  };
  </script>
  <style scoped>
  .navbar {
    /* height: auto;
    background-color: #D0E6F8;
    background-image: linear-gradient(#D0E6F8, #fff); */
  }
  .nav-menu {
    /* padding: 12px 41px 12px 41px;
    gap: 40px;
    border-radius: 39px; */
    /* opacity: 0px; */
    /* background-color: #9499B212; */
    /* background-image: linear-gradient(#9499B212, #22328A12); */
  }
  /* .nav-link {
    padding: 0px !important;
    color: #355594 !important;
  }
  .content-gap {
    gap:30px;
  } */
  .navbar-header {
    /* margin-left: 55px;
    margin-top: 10px; */
  }
  /* .nav-link-custom:hover {
    color: red !important;
  }
  .nav-link-custom{
    font-size: 14px;
    line-height: 20px; 
  }*/

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

  
  /* a.menu-link{
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
  } */
  </style>
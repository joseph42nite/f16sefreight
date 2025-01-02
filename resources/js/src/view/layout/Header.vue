<template>
  <div class="wrap">
    <b-navbar toggleable="md">
      <div class="container-fluid">
        <div class="navbar-header">
          <b-navbar-brand href="https://f16sefs.in/">
            <img :src="logoSrc" alt="f16s logo" id="main-logo">
          </b-navbar-brand>
        </div>
        <!-- Profile Avatar for Small Devices, Visible Before Toggle -->
        <b-navbar-nav class="d-flex flex-row align-items-center content-gap d-md-none ml-auto">
          <b-nav-item class="nav-link-custom text-uppercase" style="font-size: 18px;">
            {{currentUser.origin_airport_code}}
          </b-nav-item>
          <b-nav-item-dropdown>
            <template #button-content>
              <span><img :src="avatarLogoSrc" alt="avatar logo" id="avatar-logo"></span>
            </template>
            <b-dropdown-item>
              <span class="text-capitalize" style="font-size: 12px;">{{currentUser.name}}</span>
            </b-dropdown-item>
            <b-dropdown-item @click="logout()">
              <span style="font-size: 12px;">Sign out</span>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto nav-menu text-center">
            <b-nav-item to="/" class="nav-link-custom text-white">Home</b-nav-item>
            <b-nav-item to="/about-us" class="nav-link-custom text-white">About Us</b-nav-item>
            <!-- <b-nav-item to="/contact-us" class="nav-link-custom text-white">User Guide</b-nav-item>
            <b-nav-item to="/contact-us" class="nav-link-custom text-white">FAQs</b-nav-item>
            <b-nav-item to="/contact-us" class="nav-link-custom text-white">Tutorial</b-nav-item> -->
            <b-nav-item to="/contact-us" class="nav-link-custom text-white">Contact Us</b-nav-item>
            <b-nav-item to="/web-doc" class="nav-link-custom text-white">Web Doc</b-nav-item>
          </b-navbar-nav>

          <!-- Profile Avatar and User Info for Larger Devices -->
          <!-- If loged-in user -->
          <b-navbar-nav v-if="isAuthenticated" class="ml-auto align-items-center content-gap d-none d-md-flex">
            <b-nav-item class="nav-link-custom text-uppercase" style="font-size: 18px;">
              {{currentUser.origin_airport_code}}
            </b-nav-item>
            <b-nav-item-dropdown>
              <template #button-content>
                <span><img :src="avatarLogoSrc" alt="avatar logo" id="avatar-logo"></span>
              </template>
              <b-dropdown-item>
                <span class="text-capitalize" style="font-size: 12px;">{{currentUser.name}}</span>
              </b-dropdown-item>
              <b-dropdown-item @click="logout()">
                <span style="font-size: 12px;">Sign out</span>
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
          <!-- If not loged-in user -->
          <b-navbar-nav v-else class="ml-auto align-items-center content-gap d-none d-md-flex">
            <b-nav-item class="nav-link-custom">
              <button class="sign-in-btn" @click="firstPopUp('login_signin')" >Sign in</button>
            </b-nav-item>
            <b-nav-item class="nav-link-custom">
              <span class="whats-new-btn">What's Free?</span>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>

        <b-modal id="login-modal" v-model="show_modal" :hide-header="true" :hide-footer="true">
          <div class="d-flex flex-column-fluid flex-center">
            <!--begin::Signin-->
            <div class="login-form login-signin w-100" v-if="check_show.login_signin">
              <form class="form" novalidate="novalidate" id="kt_login_signin_form" @submit.prevent="login()">
                <div class="pb-5 pt-lg-0 pt-5 text-center">
                  <h1 style="color: #355594;">Sign In to F16s</h1>
                </div>
                <div class="p-3 text-center" v-if="errors == 'Unauthorized'"><span class="text-danger h6">Invalid email or password</span></div>
                <div class="p-3 text-center" v-else-if="errors == 'Blocked'"><span class="text-danger h6">Your account is blocked. Contact admin</span></div>
                <div class="p-3 text-center" v-else-if="errors == 'Daily_Limit'"><span class="text-danger h6">Your daily login limit is exceeded. Login again tomorrow</span></div>
                <div class="p-3 text-center" v-else-if="errors == 'Expired'"><span class="text-danger h6">Your plan is expired. Please renew the plan</span></div>
                <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                label-for="input-horizontal"
                class="align-items-center">
                <template #label>
                    <div class="d-flex justify-content-end" style="width:60px;">
                      <span>User ID:</span>
                      <span style="color: red;">*</span>
                    </div>
                  </template>
                  <b-form-input id="login_email" class="form-control form-control-solid h-auto py-4 px-2" type="text" name="email" ref="email" placeholder="Enter Email ID"></b-form-input>
                </b-form-group>
               
                <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                  label-for="input-horizontal"
                  class="align-items-center">
                  <template #label>
                    <div class="d-flex justify-content-end" style="width:60px;">
                      <span>Password:</span>
                      <span style="color: red;">*</span>
                    </div>
                  </template>
                  <div class="form-group d-flex align-items-center">
                    <b-form-input id="login_password" class="form-control form-control-solid h-auto py-4 px-2 login_password" :type="showPass?'password':'text'" name="password" ref="password" autocomplete="off" placeholder="Enter Password"></b-form-input>
                    <span class="show_pass" @click="showPass=!showPass"><span v-if="showPass">Show</span><span v-else>Hide</span></span>
                  </div>
                </b-form-group>

                <div>
                  <button class="btn font-weight-bolder font-size-h6 py-3 w-100 mt-7 text-white btn-color" type="submit">Login
                  </button>
                </div>
              </form>
            </div>
            <!--END::Signin-->
          </div>
        </b-modal>
      </div>
    </b-navbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { LOGIN, LOGOUT } from "@/core/services/store/auth.module";
export default {
  name: "Header",
  data(){
    return{
      show_modal:false,
      user_form:{
        email: "",
        password: "",
      },
      check_show:{
        login_signin:false,
      },
      showPass:true,
      avatarLogoSrc: "/media/custome/user-avatar.png",
    }
  },
  methods: {
    hasActiveChildren(match) {
      return this.$route["path"].indexOf(match) !== -1;
    },
    
    firstPopUp(show_form){
      this.show_modal=true;
      this.check_show[show_form]=true;
    },

    login(){
      const email=$('#login_email').val();
      const password=$('#login_password').val();
      this.$store.dispatch(LOGIN, {email, password})
    },
    logout() {
      this.$store.dispatch(LOGOUT).then(() => window.location.href='/' );
    },
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    }),
    ...mapGetters(["isAuthenticated","currentUser"]),

    logoSrc() {
      const routeLogo = this.$route.meta.logo;
      
      // Set the logo based on the meta value
      if (routeLogo === 'blue') {
        return "/media/custome/blue-logo.svg";
      } else if (routeLogo === 'white') {
        return "/media/custome/white-logo.svg";
      } else {
        // Default logo (if needed)
        return "/media/custome/white-logo.svg";
      }
    },

  }
};
</script>
<style scoped>
.navbar {
  height: auto;
  /* background-color: #D0E6F8; /* For browsers that do not support gradients */
  /* background-image: linear-gradient(#D0E6F8, #D0E6F8); */
  padding: 54px 0px !important;
}
.nav-menu {
  padding: 12px 41px 12px 41px;
  gap: 40px;
  border-radius: 39px;
  /* opacity: 0px; */
  background-color: #9499B212; /* For browsers that do not support gradients */
  background-image: linear-gradient(#9499B212, #22328A12);
}
.nav-link {
  padding: 0px !important;
  color: #355594 !important;
}
.content-gap {
  gap:18px;
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

a.menu-link{
text-decoration: none !important;
color: black;
}
.menu-text{
color: White;
}
#main-logo{
  width: 100px;
}
#avatar-logo{
  width: 35px;
  height: auto;
}
.show_pass {
  position: absolute;
  left: 87%;
}
.m_mob{
  display:none;
}
.sign-in-btn {
  font-size: 12px;
  border: 1px solid #355594;
  border-radius: 30px;
  padding: 10px 30px;
  background: #ffffff00 !important;
}
.sign-in-btn:hover {
  color:#fff !important;
  background-color: #355594;
  background:#355594 !important;
}
.whats-new-btn {
  font-size: 12px;
  color:#fff;
  border: 1px solid #355594;
  background-color: #355594;
  background:#355594;
  border-radius: 30px;
  padding: 14px 16px;
}
.whats-new-btn:hover {
  color:#355594 !important;
  background-color: #35559400;
  background:#35559400;
}
.form-control {
  background-color: #f3f6f900 !important;
}
.btn-color {
  background: #923B33;
}
@media (max-width: 992px) {
  .nav-menu[data-v-5ab8085e] {
    gap: 25px;
  }
  .sign-in-btn {
    padding: 12px 20px;
  }
  .whats-new-btn {
    padding: 12px 16px;
  }
  .show_pass {
    left: 88%;
  }
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
    padding-left: 15px;
  }
  .navbar-header {
  /* margin-left: 10px;
    margin-top: 20px; */
  }
  .nav-menu {
    gap: 15px;
  }
  .content-gap {
    gap:15px;
  }
  .navbar-collapse {
    padding: 0px 15px;
  }
  .navbar {
    padding: 20px 0px 50px !important;
  }
}

</style>

<style>
.nav-link:after {
  content: none !important;
}
.dropdown-menu {
  position: absolute !important;
    left: -85px !important;
    border-radius: 15px !important;
}
.navbar-light .navbar-toggler {
    color: #355594;
    border-color: #0000;
}
</style>
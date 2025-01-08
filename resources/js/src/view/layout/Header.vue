<template>
  <div class="wrap">
    <b-navbar toggleable="md">
      <div class="container-fluid">
        <div class="navbar-header">
          <b-navbar-brand href="https://f16sefs.in/">
            <img :src="logoSrc" alt="f16s logo" id="main-logo">
          </b-navbar-brand>
        </div>
        <!-- Profile Avatar for Small Devices < (767px), Visible Before Toggle -->
        <!-- If loged-in user -->
        <b-navbar-nav v-if="isAuthenticated" class="d-flex flex-row align-items-center content-gap d-md-none ml-auto">
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
            <!-- <b-nav-item to="/" class="nav-link-custom text-white">Home</b-nav-item> -->
            <b-nav-item to="/about-us" class="nav-link-custom text-white">About Us</b-nav-item>
            <b-nav-item to="/user-guid" class="nav-link-custom text-white">Services</b-nav-item>
            <b-nav-item to="/faq" class="nav-link-custom text-white">FAQs</b-nav-item>
            <b-nav-item to="/tutorial" class="nav-link-custom text-white">Solutions</b-nav-item>
            <b-nav-item to="/contact-us" class="nav-link-custom text-white">Contact Us</b-nav-item>
            <b-nav-item to="/web-doc" v-if="isAuthenticated" class="nav-link-custom text-white">Web Doc</b-nav-item>
            <!-- SignIn and what's free button for Small Devices < (767px), Visible here -->
            <!-- If not loged-in user -->
            <b-nav-item v-if="!isAuthenticated" class="nav-link-custom d-md-none">
              <button class="sign-in-btn" @click="firstPopUp('login_signin')">Sign in</button>
            </b-nav-item>
            <b-nav-item v-if="!isAuthenticated" class="nav-link-custom d-md-none">
              <button class="whats-new-btn">What's Free?</button>
            </b-nav-item>
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
              <button class="sign-in-btn" @click="firstPopUp('login_signin')">Sign in</button>
            </b-nav-item>
            <b-nav-item class="nav-link-custom">
              <button class="whats-new-btn">What's Free?</button>
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
                    <div class="d-flex justify-content-end custom-label" style="width:60px;">
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
                    <div class="d-flex justify-content-end custom-label" style="width:60px;">
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
  padding: 54px 0px !important;
}
.nav-menu {
  padding: 12px 41px 12px 41px;
  gap: 50px;
  border-radius: 39px;
  background: linear-gradient(360deg, rgba(148, 153, 178, 0.07) 0%, rgba(34, 50, 138, 0.07) 100%);
  backdrop-filter: blur(90px);
}
.nav-link {
  padding: 0px !important;
  color: #355594 !important;
}
.content-gap {
  gap:18px;
}

.nav-link-custom:hover {
  color: red !important;
}
.nav-link-custom{
  font-size: 14px;
  line-height: 25px;
  font-weight: 400;
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
.sign-in-btn {
  font-size: 12px;
  line-height: 16px;
  border: 1px solid #355594;
  border-radius: 30px;
  padding: 12px 30px;
  background: transparent !important;
}
.sign-in-btn:hover {
  color:#fff !important;
  background-color: #355594;
  background:#355594 !important;
}
.whats-new-btn {
  font-size: 12px;
  line-height: 16px;
  color:#fff;
  border: 1px solid #355594;
  background:#355594;
  border-radius: 30px;
  padding: 12px 16px;
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
  .nav-menu {
    gap: 18px;
  }
  .sign-in-btn {
    padding: 12px 24px;
  }
  .whats-new-btn {
    padding: 12px 16px;
  }
  .show_pass {
    left: 88%;
  }
}
@media (max-width: 920px) {
  .nav-menu {
    gap: 12px;
  }
  .sign-in-btn {
    font-size: 11px;
    padding: 12px 20px;
  }
  .whats-new-btn {
    font-size: 11px;
    padding: 12px 14px;
  }
  .nav-link-custom {
    font-size: 13px;
    line-height: 23px;
  }
}
@media (max-width: 768px) {
  #main-logo{
    width: 110px;
    padding-left: 15px;
  }
  .nav-menu {
    gap: 15px;
  }
  .content-gap {
    gap:20px;
  }
  .navbar-collapse {
    padding: 0px 15px;
  }
  .navbar {
    padding: 20px 0px 50px !important;
  }
  .custom-label {
    justify-content: start !important;
    width: auto !important;
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
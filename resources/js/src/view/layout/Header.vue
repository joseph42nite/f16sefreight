<template>
  <div class="wrap">
    <b-navbar toggleable="md">
      <div class="container-fluid">
        <div class="navbar-header">
          <b-navbar-brand href="/" style="">
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
            <div  class="head-btn d-md-none">
              <b-nav-item v-if="!isAuthenticated" class="nav-link-custom d-md-none">
                <button class="sign-in-btn" @click="firstPopUp('login_signin')">Sign in</button>
              </b-nav-item>
              <b-nav-item v-if="!isAuthenticated" class="nav-link-custom d-md-none">
                <button class="whats-new-btn">What's Free?</button>
              </b-nav-item>
            </div>
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
        <!-- Sign In Modal box -->
        <b-modal id="login-modal" v-model="show_login_modal" :hide-header="true" :hide-footer="true">
          <div class="d-flex flex-column-fluid flex-center">
            <!--begin::Signin-->
            <div class="login-form login-signin w-100">
              <form class="form" novalidate="novalidate" id="kt_login_signin_form" @submit.prevent="login()">
                <div class="pb-5 pt-lg-0 pt-5 text-center">
                  <h1 class="title-text my-6 my-md-12">Sign In to F16s</h1>
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
                  <div class="form-group d-flex align-items-center mb-0">
                    <b-form-input id="login_password" class="form-control form-control-solid h-auto py-4 px-2 login_password" :type="showPass?'password':'text'" name="password" ref="password" autocomplete="off" placeholder="Enter Password"></b-form-input>
                    <span class="show_pass" @click="showPass=!showPass"><span v-if="showPass">Show</span><span v-else>Hide</span></span>
                  </div>
                </b-form-group>

                <div class="d-flex justify-content-center">
                  <button class="my-2 my-md-6 btn-color" type="submit">Sign in</button>
                </div>
                <div class="d-flex justify-content-center mb-4 mb-md-8 mt-3 mt-md-6">
                  <p class="bottom-text">Can’t recall your User ID or Password?<br /> 
                    <span class="contact-support"><a href="#" style="color: #355594;">Contact Support</a></span></p>
                </div>
              </form>
            </div>
            <!--END::Signin-->
          </div>
        </b-modal>
        <!-- Otp verification Modal box -->
        <b-modal id="login-modal" v-model="otp_verification_modal" :hide-header="true" :hide-footer="true">
          <div class="d-flex flex-column-fluid flex-center">
            <!--begin::Signin-->
            <div class="login-form login-signin w-100">
              <form class="form" novalidate="novalidate" id="kt_login_signin_form" @submit.prevent="login()">
                <div class="text-center my-6 my-md-12">
                  <h1 class="title-text">One Time Password</h1>
                  <p class="">You will receive a verification code on your email at l******@f16s.in</p>
                </div>
                <div class="p-3 text-center" v-if="errors == 'Unauthorized'"><span class="text-danger h6">Invalid email or password</span></div>
                <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                label-for="input-horizontal"
                class="align-items-center">
                <template #label>
                    <div class="d-flex justify-content-end custom-label" style="width:60px;">
                      <span>OTP:</span>
                      <span style="color: red;">*</span>
                    </div>
                  </template>
                  <b-form-input id="otp" class="form-control form-control-solid h-auto py-4 px-2" type="text" name="otp" ref="otp" placeholder="E.g: 801801"></b-form-input>
                </b-form-group>

                <div class="d-flex justify-content-center">
                  <button class="my-2 my-md-6 btn-color" type="submit">Sign In</button>
                </div>
                <div class="d-flex justify-content-center my-3 my-md-6">
                  <p class="bottom-text">Problem receiving OTP? 
                    <span class="contact-support"><a href="#" style="color: #355594;">Resend Email</a></span></p>
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
      show_login_modal:false,
      otp_verification_modal: false,
      user_form:{
        email: "",
        password: "",
        otp: '',
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
      this.show_login_modal=true;
    },

    login(){
      const email=$('#login_email').val();
      const password=$('#login_password').val();
      this.$store.dispatch(LOGIN, {email, password})
      // this.show_login_modal = false;
      // this.otp_verification_modal = true;
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
        return "/media/custome/white-logo.png";
      } else {
        // Default logo (if needed)
        return "/media/custome/white-logo.png";
      }
    },

  }
};
</script>
<style scoped>
.navbar-header {
  width: 10%;
}
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
  width: 100%;
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
  font-size: 14px;
  line-height: 24px;
  border: 1px solid #355594;
  border-radius: 30px;
  padding: 12px 30px;
  background: transparent !important;
  color: #355594;
}
.sign-in-btn:hover {
  color:#fff !important;
  background-color: #355594;
  background:#355594 !important;
}
.whats-new-btn {
  font-size: 14px;
  line-height: 20px;
  color:#fff;
  border: 1px solid #355594;
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
    background: #0000;
    font-size: 14px;
    font-weight: 400;
    line-height: 25px;
    text-align: center;
    color: #A6A6A6;
    border: 1px solid #A6A6A6;
    backdrop-filter: blur(90px);
    border-radius: 30px;
    padding: 10px 40px;
}
.bottom-text {
  color: #4C4C4C;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  text-align: center;

}
.contact-support {
  color: #355594;
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
  text-align: center;
  text-decoration-line: underline;
  cursor: pointer;

}
/* Login Model box css */
.title-text {
  font-size: 24px;
  font-weight: 500;
  line-height: 22px;
  text-align: center;
  color:#355594;
}
.form-control, .form-control-solid {
    background: transparent !important;
    border: 1px solid #A6A6A6 !important;
}
.form-control-solid:active {
    background-color: #f3f6f9 !important;
}

@media (max-width: 992px) {
  .navbar-header {
    width: 14%;
  }
  .nav-menu {
    gap: 30px;
  }
  .sign-in-btn {
    padding: 8px 28px; 
  }
  .whats-new-btn {
    padding: 10px 12px;
  }
  .show_pass {
    left: 88%;
  }
}
@media (max-width: 920px) {
  .nav-menu {
    gap: 12px;
  }
  .nav-link-custom {
    font-size: 13px;
    line-height: 23px;
  }
}
@media (max-width: 768px) {
  .navbar-header {
    width: 18%;
  }
  #main-logo{
    width: 100%;
    padding-left: 15px;
  }
  .nav-menu {
    gap: 15px;
  }
  .head-btn {
    display: flex;
    justify-content: center;
    flex-direction: row;
    column-gap: 20px;
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
@media (max-width: 576px) {
  .navbar-header {
    width: 24%;
  }
}
@media (max-width: 480px) {
  .navbar-header {
    width: 28%;
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
.modal-content {
    background-color: #F3F6F9 !important;
    backdrop-filter: blur(130px) !important;
    box-shadow: 5px 4px 25px 0px #0000001F !important;
    border-radius: 40px !important;
    padding: 2.5rem;
}
.modal-body {
    padding: 0px !important;
}
</style>
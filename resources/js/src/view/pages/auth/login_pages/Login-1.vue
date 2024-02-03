<template>
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
                <b-nav-item @click="show_modal=true">Login</b-nav-item>
              </b-navbar-nav>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
    </div>
    <!-- login modal -->
    <b-modal id="login-modal" v-model="show_modal" :hide-footer="true">
      <div class="d-flex flex-column-fluid flex-center">
        <!--begin::Signin-->
        <div class="login-form login-signin w-100">
          <form class="form" novalidate="novalidate" id="kt_login_signin_form" @submit.prevent="login()">
            <div class="pb-5 pt-lg-0 pt-5 text-center">
              <h1>Login</h1>
              <!-- <img src="/media/custome/login/main-logo.png" alt="main login image" class="img-fluid" width="100" height="100"> -->
            </div>
            <div class="p-3 text-center" v-if="errors == 'Unauthorized'"><span class="text-danger h6">Invalid email or
                password</span></div>
            <div class="form-group">
              <input class="form-control form-control-solid h-auto py-4 px-2" type="text" name="email" ref="email"
                v-model="form.email" placeholder="Email address" />
            </div>
            <div class="form-group">
              <input class="form-control form-control-solid h-auto py-4 px-2 rounded-lg" type="password" name="password"
                ref="password" v-model="form.password" autocomplete="off" placeholder="Password" />
            </div>
            <div class="">
              <a class="text-muted font-weight-bolder float-right" id="kt_login_forgot" @click="showForm('.login-forgot','.login-signin')" style="cursor: pointer;">Forgot
                Password ?</a>
            </div>
            <div>
              <button class="btn font-weight-bolder font-size-h6 py-3 w-100 mt-7 text-white btn-color" type="submit">Login
              </button>
            </div>
          </form>
        </div>
        <!--end::Signin-->
        <!--begin::Forgot-->
        <div class="login-forgot" style="display: none;">
          <!--begin::Form-->
          <form class="form" novalidate="novalidate" id="kt_login_forgot_form" ref="kt_login_forgot_form"
            @submit.prevent="requestResetPassword">
            <div class="pb-5 pt-lg-0 pt-5">
              <h4 class="font-weight-bolder text-dark font-size-h4 font-size-h1-lg">
                Forgotten Password ?
              </h4>
              <p class="text-muted font-weight-bold font-size-h5">
                Enter your email to reset your password
              </p>
            </div>
            <div class="text-success mt-2 ml-2 h5" v-if="email_send">Password reset link has been sent to your email.
            </div>
            <div class="text-danger mt-2 ml-2" v-if="check_email">Invalid email.</div>
            <div class="form-group">
              <input class="form-control form-control-solid h-auto py-3 px-2 rounded-lg font-size-h6" type="email"
                placeholder="Email address" name="email" autocomplete="off" id="forget_email" />
            </div>
            <div class="form-group d-flex flex-wrap pb-lg-0">
              <button type="submit" id="kt_login_forgot_submit"
                class="btn font-weight-bolder font-size-h6 px-12 btn-color text-white py-3 my-3 mr-4">
                Send Password Reset Link
              </button>
              <button type="button" id="kt_login_forgot_cancel"
                class="btn font-weight-bolder font-size-h6 px-12 btn-color text-white py-3 my-3"
                @click="showForm('.login-signin','.login-forgot')">
                Cancel
              </button>
            </div>
          </form>
        </div>
        <!--end::Forgot-->
      </div>
    </b-modal>
  </div>
</template>

<!-- Load login custom page styles -->
<style lang="scss">
@import "@/assets/sass/pages/login/login-1.scss";
</style>

<script>
import axios from 'axios';
import { mapGetters, mapState } from "vuex";
import { LOGIN, LOGOUT } from "@/core/services/store/auth.module";

export default {
  name: "login-1",
  data() {
    return {
      forget_email:'dsgc',
      show_modal:false,
      email_send: false,
      check_email: false,
      // Remove this dummy login info
      form: {
        email: "",
        password: ""
      }
    };
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    }),
    ...mapGetters(["currentUser"]),

    backgroundImage() {
      return (
        process.env.BASE_URL + "media/svg/illustrations/login-visual-1.svg"
      );
    }
  },
  mounted() {
  },
  methods: {
    showForm(show_form,hide_form) {
      $(show_form).css('display','block');
      $(hide_form).css('display','none');
    },
    requestResetPassword() {
      const forget_email=$('#forget_email').val();
      axios.post("/Forgotpassword", { email: forget_email }).then(result => {
        this.email_send = true;
        this.check_email = false;
      })
        .catch(err => {
          this.check_email = true;
          this.email_send = false;
        })
    },
    login(){
      const email=this.form.email;
      const password=this.form.password;
      this.$store.dispatch(LOGIN, {email, password})
    }
  },
};
</script>
<style scoped>
.btn-color {
  background: #00A1E4;
}

.image-div {
  height: 100%;
}

.text-al {
  text-align: -webkit-center;
}

@media (min-width: 720px) {}

@media (max-width: 720px) {
  .login-content {
    padding: 5%;
  }

  .image-div {
    height: 70%;
  }
}
</style>

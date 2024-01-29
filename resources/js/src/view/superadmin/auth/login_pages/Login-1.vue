<template>
  <div class="d-flex flex-column flex-root">
    <div
      class="login login-1 d-flex flex-column flex-lg-row flex-column-fluid"
      :class="{
        'login-signin-on': this.state == 'signin',
        'login-signup-on': this.state == 'signup',
        'login-forgot-on': this.state == 'forgot'
      }"
      id="kt_login"
    >
      <!--begin::Aside-->
      <div class="login-aside">
       <img src="/media/custome/login/login-image.png" alt="login image" class="img-fluid1">
      </div>
      <!--begin::Aside-->
      <!--begin::Content-->
        <div class="login-content flex-row-fluid d-flex flex-column justify-content-center position-relative p-8">
        <div class="d-flex flex-column-fluid flex-center">
          <!--begin::Signin-->
          <div class="login-form login-signin">
            <form class="form" novalidate="novalidate" id="kt_login_signin_form">
              <div class="pb-5 pt-lg-0 pt-5 text-center">
                 <img src="/media/custome/login/main-login.svg" alt="main login image" class="img-fluid" width="100" height="100">
              </div>
              <div class="p-3 text-center" v-if="errors=='Unauthorized'"><span class="text-danger h6">Invalid email or password</span></div>
              <div class="form-group">
                  <input
                    class="form-control form-control-solid h-auto py-4 px-2"
                    type="text"
                    name="email"
                    ref="email"
                    v-model="form.email"
                    placeholder="Super Admin Username"
                  />
              </div>
              <div class="form-group">
                <input
                    class="form-control form-control-solid h-auto py-4 px-2 rounded-lg"
                    type="password"
                    name="password"
                    ref="password"
                    v-model="form.password"
                    autocomplete="off"
                    placeholder="Password"
                  />
              </div>
              <div class="">
                  <input type="checkbox" style="margin-top: 4px;" /> <span class="text-muted font-weight-bolder">Remember me</span>
                  <a class="text-muted font-weight-bolder float-right" id="kt_login_forgot" @click="showForm('forgot')">Forgot Password ?</a>
              </div>
              <div>
                <button ref="kt_login_signin_submit" class="btn font-weight-bolder font-size-h6 py-3 w-100 mt-7 text-white btn-color">
                  Login
                </button>
              </div>
            </form>
          </div>
          <!--end::Signin-->
          <!--begin::Forgot-->
          <div class="login-form login-forgot">
            <!--begin::Form-->
            <form
              class="form"
              novalidate="novalidate"
              id="kt_login_forgot_form"
              ref="kt_login_forgot_form"
              @submit.prevent="requestResetPassword"
            >
              <div class="pb-5 pt-lg-0 pt-5">
                <h4
                  class="font-weight-bolder text-dark font-size-h4 font-size-h1-lg"
                >
                  Forgotten Password ?
                </h4>
                <p class="text-muted font-weight-bold font-size-h5">
                  Enter your email to reset your password
                </p>
              </div>
              <div class="text-success mt-2 ml-2 h4" v-if="email_send">Reset Email is send successfully, please check your inbox.</div>
              <div class="text-danger mt-2 ml-2" v-if="check_email">Invalid email.</div>
              <div class="form-group">
                <input
                  class="form-control form-control-solid h-auto py-3 px-2 rounded-lg font-size-h6"
                  type="email"
                  placeholder="Email"
                  name="email"
                  autocomplete="off"
                  v-model="email"
                />
              </div>
              <div class="form-group d-flex flex-wrap pb-lg-0">
                <button
                  type="submit"
                  id="kt_login_forgot_submit"
                  class="btn font-weight-bolder font-size-h6 px-12 btn-color text-white py-3 my-3 mr-4"
                >
                  Send Password Reset Link
                </button>
                <button
                  type="button"
                  id="kt_login_forgot_cancel"
                  class="btn font-weight-bolder font-size-h6 px-12 btn-color text-white py-3 my-3"
                  @click="showForm('signin')"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <!--end::Forgot-->
        </div>
        <!--begin::Content footer-->
        
        <!--end::Content footer-->
        </div>
      <!--end::Content-->
    </div>
  </div>
</template>

<!-- Load login custom page styles -->
<style lang="scss">
@import "@/assets/sass/pages/login/login-1.scss";
</style>

<script>
import formValidation from "@/assets/plugins/formvalidation/dist/es6/core/Core";
import axios from 'axios';
// FormValidation plugins
import Trigger from "@/assets/plugins/formvalidation/dist/es6/plugins/Trigger";
import Bootstrap from "@/assets/plugins/formvalidation/dist/es6/plugins/Bootstrap";
import SubmitButton from "@/assets/plugins/formvalidation/dist/es6/plugins/SubmitButton";

import KTUtil from "@/assets/js/components/util";
import { mapGetters, mapState } from "vuex";
import { SuperAdminLOGIN, LOGOUT} from "@/core/services/store/auth.module";
import Swal from "sweetalert2";

export default {
  name: "login-1",
  data() {
    return {
      state: "signin",
      email_send: false,
      check_email:false,
      email:'',
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
    const signin_form = KTUtil.getById("kt_login_signin_form");
    this.fv = formValidation(signin_form, {
      fields: {
        email: {
          validators: {
            notEmpty: {
              message: "Username is required"
            }
          }
        },
        password: {
          validators: {
            notEmpty: {
              message: "Password is required"
            }
          }
        }
      },
      plugins: {
        trigger: new Trigger(),
        submitButton: new SubmitButton(),
        bootstrap: new Bootstrap()
      }
    });
    this.fv.on("core.form.valid", () => {
      var email = this.form.email;
      var password = this.form.password;

      // clear existing errors
      this.$store.dispatch(LOGOUT);

      // send login request
        this.$store
          .dispatch(SuperAdminLOGIN, { email, password })
          // go to which page after successfully login
          .then(() => this.$router.push('/superadmin/check-eligibilty'))
          .catch(() => {});
    });

    this.fv.on("core.form.invalid", () => {
      Swal.fire({
        title: "",
        text: "Please, provide correct data!",
        icon: "error",
        confirmButtonClass: "btn btn-secondary",
        heightAuto: false
      });
    });
  },
  methods: {
    showForm(form) {
      this.state = form;
      var form_name = "kt_login_" + form + "_form";
      KTUtil.animateClass(
        KTUtil.getById(form_name),
        "animate__animated animate__backInUp"
      );
    },
    requestResetPassword() {
        axios.post("/Forgotpassword/super_admins", {email: this.email}).then(result => {
            this.email_send=true;
            this.check_email=false;
        })
        .catch(err=>{
          this.check_email=true;
          this.email_send=false;
        })
    } 
  }
};
</script>
<style scoped>
.btn-color{
  background:#00A1E4;
}
@media (min-width: 720px){
 .login-content{
   margin: auto;
 }
 .img-fluid1{
   max-width: 116% !important;
 }
}
@media (max-width: 720px){
 .img-fluid1{
   max-width: 109% !important;
 }
 .login-aside{
  margin-left: -10%;
}
}
</style>

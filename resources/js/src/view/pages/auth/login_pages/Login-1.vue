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
                <b-nav-item @click="firstPopUp('login_signin','login_signup')">Login</b-nav-item>
                <b-nav-item @click="firstPopUp('login_signup','login_signin')">SignUp</b-nav-item>
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
        <div class="login-form login-signin w-100" v-if="check_show.login_signin">
          <form class="form" novalidate="novalidate" id="kt_login_signin_form" @submit.prevent="login()">
            <div class="pb-5 pt-lg-0 pt-5 text-center">
              <h1>Login</h1>
              <!-- <img src="/media/custome/login/main-logo.png" alt="main login image" class="img-fluid" width="100" height="100"> -->
            </div>
            <div class="p-3 text-center" v-if="errors == 'Unauthorized'"><span class="text-danger h6">Invalid email or
                password</span></div>
            <div class="p-3 text-center" v-else-if="errors == 'Blocked'"><span class="text-danger h6">You can't login. Contact admin</span></div>
            <div class="form-group">
              <input class="form-control form-control-solid h-auto py-4 px-2" type="text" name="email" ref="email" placeholder="Email address" id="login_email" />
            </div>
            <div class="form-group">
              <input class="form-control form-control-solid h-auto py-4 px-2 rounded-lg" type="password" name="password" ref="password" autocomplete="off" placeholder="Password" id="login_password" />
            </div>
            <div class="d-flex" style="float: right;">
              <a class="text-muted font-weight-bolder float-right" id="kt_login_forgot" @click="showForm('login_forgot','login_signin','login_signup')" style="cursor: pointer;">Forgot
                Password ?</a>&nbsp;/&nbsp;
                <a class="text-muted font-weight-bolder float-right" id="kt_login_forgot" @click="showForm('login_signup','login_signin','login_forgot')" style="cursor: pointer;">SignUp</a>
            </div>
            <div>
              <button class="btn font-weight-bolder font-size-h6 py-3 w-100 mt-7 text-white btn-color" type="submit">Login
              </button>
            </div>
          </form>
        </div>
        <!--end::Signin-->
        <!--begin::Forgot-->
        <div class="login-forgot" v-if="check_show.login_forgot">
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
                @click="showForm('login_signin','login_forgot','login_signup')">
                Cancel
              </button>
            </div>
          </form>
        </div>
        <!--end::Forgot-->
        <!--begin::Signin-->
        <div class="login-form login-signup w-100" v-if="check_show.login_signup">
          <form class="form" novalidate="novalidate" id="kt_login_signin_form" @submit.prevent="register()">
            <div class="pb-5 pt-lg-0 pt-5 text-center">
              <h1>SignUp Here</h1>
            </div>
            <div class="form-group">
              <input class="form-control form-control-solid h-auto py-4 px-2" type="text" name="name" ref="name"
                id="r_name" placeholder="Enter your name" />
                <span id="name" class="error-cls"></span>
            </div>
            <div class="form-group">
              <input class="form-control form-control-solid h-auto py-4 px-2" type="text" name="email" ref="email"
                id="r_email" placeholder="Enter email address" />
                <span id="email" class="error-cls"></span>
            </div>
            <div class="form-group">
              <input class="form-control form-control-solid h-auto py-4 px-2" type="text" name="company_name" ref="company_name"
                id="r_company_name" placeholder="Enter Compnay name"/>
                <span id="company_name" class="error-cls"></span>
            </div>
            <div class="form-group">
              <treeselect :options="location" :value="user_form.origin_airport_code" v-model="user_form.origin_airport_code" :multiple="false" :searchable="true" placeholder="Select Origin City" :normalizer="normalizer"></treeselect>
                <span id="company_name" class="error-cls"></span>
            </div>
            <div class="form-group">
              <input class="form-control form-control-solid h-auto py-4 px-2 rounded-lg" type="password" name="password"
                ref="password" id="r_password" autocomplete="off" placeholder="Password"/>
            </div>
            <span id="password" class="error-cls"></span>
            <div class="">
              <a class="text-muted font-weight-bolder float-right" id="kt_login_forgot" @click="showForm('login_signin','login_forgot','login_signup')" style="cursor: pointer;">Login</a>
            </div>
            <div>
              <button class="btn font-weight-bolder font-size-h6 py-3 w-100 mt-7 text-white btn-color" type="submit">SignUp
              </button>
            </div>
          </form>
        </div>
        <!--end::Signin-->
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
import ApiService from "@/core/services/api.service";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "login-1",
  data() {
    return {
      forget_email:'',
      show_modal:false,
      email_send: false,
      check_email: false,
      user_form:{
        name: "",
        email: "",
        company_name:'',
        password: "",
        origin_airport_code:null,
      },
      check_show:{
        login_signin:false,
        login_signup:false,
        login_forgot:false,
      },
      location:[],
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
    showForm(show_form,hide_form1,hide_form2) {
       this.check_show[show_form]=true;
       this.check_show[hide_form1]=false;
       this.check_show[hide_form2]=false;
    },
    firstPopUp(show_form,hide_form){
      this.show_modal=true;
      console.log(this.location.length);
      if(show_form=='login_signup' && !this.location.length){
        this.getLocation();
      }
      this.check_show[show_form]=true;
      this.check_show[hide_form]=false;
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
      const email=$('#login_email').val();
      const password=$('#login_password').val();
      this.$store.dispatch(LOGIN, {email, password})
    },
    register(){
      this.user_form.name=$('#r_name').val();
      this.user_form.email=$('#r_email').val();
      this.user_form.company_name=$('#r_company_name').val();
      this.user_form.password=$('#r_password').val();
      axios.post("/register",this.user_form)
      .then(result => {
        const email=this.user_form.email;
        const password=this.user_form.password
        if(result.data.status)
        this.$store.dispatch(LOGIN, {email, password})
      })
      .catch(({ response }) => {
        let errors_1=response.data.errors;
        let dummpy_user_from=this.user_form;
        for (const [key, value] of Object.entries(errors_1)) {
            $(`#${key}`).html(value);
            delete dummpy_user_from[key];
        }
        for (const [key, value] of Object.entries(dummpy_user_from)) {
             $(`#${key}`).html("");
        } 
      });
    },
    getLocation(){
      ApiService.get(`/get-location`)
        .then(({ data }) => {
          data.forEach((element) => {
            this.location.push({
              value: element["iata_code"],
              name: element["iata_code"] + " (" + element["destination"] + ")",
            });
          });
        })
    },
    normalizer(node) {
      return {
        id: node.value,
        label: node.name,
      };
    },
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
.error-cls{
  color: #E84342;
}
</style>

<template>
  <div class="bg-white">
    <div class="home-banner">
      <div class="wrap" @mouseover="isHovered = true" @mouseleave="isHovered = false">
        <b-navbar toggleable="lg" type="dark" variant="info">
          <div class="container-fluid">
            <div class="navbar-header">
              <b-navbar-brand href="#">
                <img :src="isHovered ? blackLogoSrc : logoSrc" alt="f16s logo" style="width: 100%;">
              </b-navbar-brand>
            </div>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
              <b-navbar-nav class="ml-auto">
                <b-nav-item to="/login" class="nav-link-custom">Home</b-nav-item>
                <b-nav-item to="/about-us" class="nav-link-custom">About Us</b-nav-item>
                <b-nav-item to="/contact-us" class="nav-link-custom">Contact Us</b-nav-item>
              </b-navbar-nav>

              <b-navbar-nav class="ml-auto">
                <b-nav-item>
                  <button @click="firstPopUp('login_signin','login_signup')" class="plain-button">Login</button>
                </b-nav-item>
                <b-nav-item>
                  <button @click="firstPopUp('login_signup','login_signin')" class="btn btn-danger">Sign up</button>
                </b-nav-item>
              </b-navbar-nav>
            </b-collapse>
          </div>
        </b-navbar>
        <div class="banner"></div>
      </div>
      <div class="p-2-3 text-white container p-0" style="margin-top: 15%;">
        <div class="home-block" style="width:100%; max-width: 45rem; padding: 0 15px;">
          <h1 class="text-white h1_text" style="font-weight:500; font-size: 56px; margin-bottom: 10px;">Reshaping The Future Of Freight Forwarding</h1>
          <h4 class="mt-3 mt-lg-5">For Online Rates Click On The Below </h4>
          <div class="mt-4 mt-lg-10"><router-link to="/login"><button class="login-btn">Focus Aakash</button></router-link></div>
        </div>
      </div>
    </div>
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
            <div class="p-3 text-center" v-else-if="errors == 'Blocked'"><span class="text-danger h6">You can't login.
                Contact admin</span></div>
            <div class="form-group">
              <input class="form-control form-control-solid h-auto py-4 px-2" type="text" name="email" ref="email"
                placeholder="Email address" id="login_email" />
            </div>
            <div class="form-group">
              <input class="form-control form-control-solid h-auto py-4 px-2 rounded-lg" type="password" name="password"
                ref="password" autocomplete="off" placeholder="Password" id="login_password" />
            </div>
            <div class="d-flex" style="float: right;">
              <a class="text-muted font-weight-bolder float-right" id="kt_login_forgot"
                @click="showForm('login_forgot', 'login_signin', 'login_signup')" style="cursor: pointer;">Forgot
                Password ?</a>&nbsp;/&nbsp;
              <a class="text-muted font-weight-bolder float-right" id="kt_login_forgot"
                @click="showForm('login_signup', 'login_signin', 'login_forgot')" style="cursor: pointer;">SignUp</a>
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
                @click="showForm('login_signin', 'login_forgot', 'login_signup')">
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
              <input class="form-control form-control-solid h-auto py-4 px-2" type="text" name="company_name"
                ref="company_name" id="r_company_name" placeholder="Enter Compnay name" />
              <span id="company_name" class="error-cls"></span>
            </div>
            <div class="form-group">
              <treeselect :options="location" :value="user_form.origin_airport_code"
                v-model="user_form.origin_airport_code" :multiple="false" :searchable="true"
                placeholder="Select Origin City" :normalizer="normalizer"></treeselect>
              <span id="company_name" class="error-cls"></span>
            </div>
            <div class="form-group">
              <input class="form-control form-control-solid h-auto py-4 px-2 rounded-lg" type="password" name="password"
                ref="password" id="r_password" autocomplete="off" placeholder="Password" />
            </div>
            <span id="password" class="error-cls"></span>
            <div class="">
              <a class="text-muted font-weight-bolder float-right" id="kt_login_forgot"
                @click="showForm('login_signin', 'login_forgot', 'login_signup')" style="cursor: pointer;">Login</a>
            </div>
            <div>
              <button class="btn font-weight-bolder font-size-h6 py-3 w-100 mt-7 text-white btn-color"
                type="submit">SignUp
              </button>
            </div>
          </form>
        </div>
        <!--end::Signin-->
      </div>
    </b-modal>


    <template>
      <div class="container" style="background-color: rgba(213, 179, 176, 0.2); margin-top: 10rem; border-radius: 13px;box-shadow: 0px 0px 10px #80808080;">
        <h1 class="text-center pt-lg-20 font-weight-black text-black fa-4x">We'd Love To Hear From You</h1>
        <div class="container">
          <div class="row">
            <div class="col-md-8 mt-10">
              <div class="contact">
                  <div>
                    <div v-if="showSuccessMessage" class="alert alert-success" role="alert">
                      Thanks for contacting us will reached you soon!
                    </div>
                    <b-form @submit="onSubmit">
                      <label class="sr-only" for="input-5">First Name</label>
                      <b-input-group class="mb-5 mr-sm-2 mb-sm-0 mt-10">
                      <b-form-input
                        id="input-5"
                       
                        placeholder="First Name" v-model="form.first_name" 
                        :class="{ 'is-invalid': form.errors.has('first_name') }"
                      ></b-form-input>
                    </b-input-group>
                      <label class="sr-only" for="input-4">Last Name</label>
                      <b-input-group class="mb-5 mr-sm-2 mb-sm-0 mt-10">
                        <b-form-input id="input-4" placeholder="Last Name" v-model="form.last_name" :class="{ 'is-invalid': form.errors.has('last_name') }"></b-form-input>
                      </b-input-group>
                      <label class="sr-only" for="input-1">Email</label>
                      <b-form-input
                        id="input-1"
                        class="mb-5 mr-sm-5 mb-sm-0 mt-10"
                        placeholder="Email" v-model="form.email" :class="{ 'is-invalid': form.errors.has('email') }">
                      </b-form-input>

                      <label class="sr-only" for="input-2">Phone</label>
                      <b-input-group class="mb-5 mr-sm-2 mb-sm-0 mt-10">
                        <b-form-input id="input-2" placeholder="Phone" v-model="form.phone" :class="{ 'is-invalid': form.errors.has('phone') }"></b-form-input>
                      </b-input-group>
                      <b-form-textarea class="mt-10" style="grid-column: span 2 !important;"
                        id="textarea"
                        placeholder="Message"
                        rows="3"
                        max-rows="6" v-model="form.message" :class="{ 'is-invalid': form.errors.has('message') }"
                      ></b-form-textarea>
                      <p class="mt-10 mb-10" style="width: 70%;">
                        <button class="login-btn" type="submit">Submit</button>
                      </p>
                    </b-form>
                  </div>
              </div>
            </div>

            <!-- Right side: Contact Information -->
            <div class="col-md-4 mt-20 mb-20">
              <div class="company-info">
                <img src="/media/custome/contact/location.png" alt="Location icon">
                <h3 class="mx-5 fw-bold mt-5">Bengaluru <br>
                2nd Cross, Bidarahalli, Virognagar Post, Bangalore- 560 049</h3>
                <img src="/media/custome/contact/contact.png" alt="Contact Icon">
                <h3 class="mx-5 fw-bold mt-5">(+91) 8660320019</h3>
                <img src="/media/custome/contact/mail.png" alt="Mail Icon">
                <h3 class="mx-5 fw-bold mt-5"><a href="mailto:ops_blr@f16sefs.in" style="color: black;text-decoration: underline;">ops_blr@f16sefs.in</a></h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template>
      <div style="padding-bottom: 6rem;">
        <h1 class="text-center pt-lg-20 font-weight-black text-black fa-4x mb-10 mt-10">Our Headquaters</h1>
        <div class="container mb-10">
          <iframe
        width="100%"
        height="600"
        frameborder="0"
        style="border:0;border-radius: 13px;"
        src="https://maps.google.com/maps?q=bangalore&t=&z=13&ie=UTF8&iwloc=&output=embed"
        allowfullscreen
      ></iframe>
        </div>
      </div>
    </template>

    <!-- footer -->
    <template>
      <div class="mt-10" style="background-color: #320400;">
        <div class="container">
          <div class="row back-b text-white p-8">
            <div class="col-3 col-md-3 mt-5">
              <!-- <h1 class="logo_text">F16s</h1> -->
              <!-- <h6 style="font-size: smaller;line-height:normal;">Making best even better</h6> -->
              <img src="/media/custome/footer_logo.png" alt="f16s logo" style="width: 45%;">
              <div class="mt-6">
                <img src="/media/custome/home/linkedin.png" alt="">
              </div>
            </div>
            <div class="col-3 col-md-3 mt-5 justify-content">
              <h2>QUICK LINKS</h2>
              <ul>
                <li><router-link to="/login">Home</router-link></li>
                <li><router-link to="/about-us">About Us</router-link></li>
                <li><router-link to="/rate">Rates</router-link></li>
                <li><router-link to="/contact-us">Contact Us</router-link></li>
              </ul>
            </div>
            <div class="col-3 col-md-3 mt-5 justify-content">
              <h2>Explore</h2>
              <ul>
                <li><router-link to="/about-us">Our Mission</router-link></li>
                <li><router-link to="/login">Our Focus Areas</router-link></li>
                <li><router-link to="/login">Our airline affiliations</router-link></li>
                <li><router-link to="/contact-us">Contact Us</router-link></li>
              </ul>
            </div>
            <div class="col-3 col-md-3 mt-5 item-align-right">
              <!-- <h2>CONTACT US</h2> -->
              <div class="row d-flex">
                <div class="col-sm-1 mx-3">
                  <img src="/media/custome/home/location.png" width="60" alt="Location">
                </div>
                <div class="col-sm-1 mx-3">
                  <img src="/media/custome/home/contact.png" width="60" alt="Location">
                </div>
                <div class="col-sm-1 mx-3">
                  <img src="/media/custome/home/email.png" width="60" alt="Location">
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5">
            <hr style="border-top: 1px solid rgba(255, 255, 255, 0.15);">
            <div class="row text-white">
              <div class="col-4">
                <h6>© 2024 by F16s EFS Pvt Ltd</h6>
              </div>
              <div class="col-4 text-center">
                <h6>Cookie Policy</h6>
              </div>
              <div class="col-4 text-right">
                <h6>Privacy Policy</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
  
  <!-- Load login custom page styles -->
<style lang="scss">
@import "@/assets/sass/pages/login/login-1.scss";
@import url("https://fonts.googleapis.com/css?family=Raleway:100,400,800");
@import url("https://fonts.googleapis.com/css?family=Audiowide:100,400,800");
</style>
  
<script>
import axios from 'axios';
import { mapGetters, mapState } from "vuex";
import { LOGIN, LOGOUT } from "@/core/services/store/auth.module";
import ApiService from "@/core/services/api.service";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  // name: "About Us",
  data() {
    return {
      forget_email: '',
      show_modal: false,
      email_send: false,
      check_email: false,
      user_form: {
        name: "",
        email: "",
        company_name: '',
        password: "",
        origin_airport_code: null,
      },
      check_show: {
        login_signin: false,
        login_signup: false,
        login_forgot: false,
      },
      logoSrc: "/media/custome/logo.png",
      blackLogoSrc: "/media/custome/black-logo.png",
      isHovered: false,
      form: new Form ({
        // id: '',
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        message: ''
      }),
      showSuccessMessage: false,
      location: [],
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
    showForm(show_form, hide_form1, hide_form2) {
      this.check_show[show_form] = true;
      this.check_show[hide_form1] = false;
      this.check_show[hide_form2] = false;
    },
    firstPopUp(show_form, hide_form) {
      this.show_modal = true;
      // console.log(this.location.length);
      if (show_form == 'login_signup' && !this.location.length) {
        this.getLocation();
      }
      this.check_show[show_form] = true;
      this.check_show[hide_form] = false;
    },
    requestResetPassword() {
      const forget_email = $('#forget_email').val();
      axios.post("/Forgotpassword", { email: forget_email }).then(result => {
        this.email_send = true;
        this.check_email = false;
      })
        .catch(err => {
          this.check_email = true;
          this.email_send = false;
        })
    },
    login() {
      const email = $('#login_email').val();
      const password = $('#login_password').val();
      this.$store.dispatch(LOGIN, { email, password })
    },
    register() {
      this.user_form.name = $('#r_name').val();
      this.user_form.email = $('#r_email').val();
      this.user_form.company_name = $('#r_company_name').val();
      this.user_form.password = $('#r_password').val();
      axios.post("/register", this.user_form)
        .then(result => {
          const email = this.user_form.email;
          const password = this.user_form.password
          if (result.data.status)
            this.$store.dispatch(LOGIN, { email, password })
        })
        .catch(({ response }) => {
          let errors_1 = response.data.errors;
          let dummpy_user_from = this.user_form;
          for (const [key, value] of Object.entries(errors_1)) {
            $(`#${key}`).html(value);
            delete dummpy_user_from[key];
          }
          for (const [key, value] of Object.entries(dummpy_user_from)) {
            $(`#${key}`).html("");
          }
        });
    },
    getLocation() {
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
    onSubmit(event) {
      event.preventDefault();
        axios.post('/contact', this.form.data())
        .then(({ data }) => {
            console.log('contact created successfully:', data);
            this.showSuccessMessage = true;
            setTimeout(() => {
              this.showSuccessMessage = false;
            }, 5000);
            this.form.reset();
        })
        .catch(error => {
            console.error('Error creating contact:', error.response.data);
        });
    },
    toggleLogo(isHovered) {
      this.logoSrc = isHovered ? this.blackLogoSrc : "/media/custome/logo.png";
    }, 
  },
};
</script>
<style scoped>
.navbar {
  background-color: transparent !important;
}
.navbar-header {
  margin-left: 55px;
  margin-top: 10px;
}
.nav-link-custom:hover {
  color: red !important;
}
@media (max-width: 768px) {
  .container {
    margin-top: 5%;
    margin-bottom: 5%;
  }
  .navbar-header {
  margin-left: 10px;
  margin-top: 20px;
}
}
@media (max-width: 576px) {
  .container {
    padding-left: 15px;
    padding-right: 15px;
  }
}

@media (min-width: 992px) {
  .mt-lg-20 {
    margin-top: 20%;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 32px;
  }
  
  p {
    font-size: 18px;
  }
}

@media (max-width: 767px) {
  .pt-lg-20 {
    padding-top: 20px;
  }

  .mt-15 {
    margin-top: 15px;
  }

  .mt-10 {
    margin-top: 10px;
  }
}

@media (max-width: 575px) {
  .row.justify-content-md-center {
    justify-content: center;
  }

  .col-sm-4 {
    text-align: center;
  }
}
@media (max-width: 767px) {
  .col-md-5 {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .fa-4x{
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
  }
  .fa-2x {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }
}

  @media (min-width: 768px) and (max-width: 1024px) {
    .fa-2x {
      margin: 15px;
    }
  }
.wrap:hover{
  background-color: #923B33;
}
.wrap:hover .btn.btn-danger {
  background-color: white;
  color: #923B33;
}
.plain-button {
  border: none;
  background: none;
  margin-top: 7%;
  text-align: center;
  color: white;
  cursor: pointer;
}
.btn-color {
  background: #923B33;
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

.error-cls {
  color: #E84342;
}

.body {
  background-color: white;
}

.home-banner {
  /* The image used */
  background-image: url("/media/custome/contact_us.png");
  /* Full height */
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: rgba(0, 0, 0, 10);
  opacity: 8.0;
}

.h1_text {
  font-family: 'Raleway';
  line-height: 80px;
}

.logo_text {
  font-family: 'Audiowide';
  font-size: 48px;
  font-weight: 400;
}

/* .home-block{
      background: rgba(0, 0, 0, 0.8);
      padding: 2.5% 3% 2.5% 1.8%;
  } */
.p-2-3 {
  padding: 1% 3%;
}
/* .wrap:hover{
  background: #923B33;
  width: auto;
  padding: 0%;
} */
.login-btn {
  background: #923B33;
  border: 0;
  padding: 1.5% 6%;
  border-radius: 10px;
  color: white;
  font-size: 20px;
  font-weight: 600;
}
.login-btn:hover {
    background: #b18480;
}
.login-btn1 {
  background: #923B33;
  border: 0;
  padding: 1% 4%;
  border-radius: 10px;
  color: white;
  font-size: 20px;
  font-weight: 600;
}

.container {
  position: relative;
}

ul li {
  /* font-size: 18px; */
  cursor: pointer;
  padding-left: 4px;
}

ul {
  list-style-type: none;
  padding-left: 0px;
}

ul li a {
  color: white !important;
}

.half-half-container {
  overflow: hidden;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.half-half {
  height: 45px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.block {
  margin: 20px auto;
  /* width: 150px;
    height: 100px; */
  text-align: center;
  /* padding: 15px; */
  font-size: 20px;
}

.card {
  display: flex;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
  height: 350px;
  transition: .4s all ease-in;
  border: none;
  margin: 25px auto;
  border-radius: 13px;
  box-shadow: 0px 0px 10px #80808080;
  background-color: rgba(213, 179, 176, 0.3);
  padding: 2rem;
}

/* .card-img-top{
    box-shadow: 0 0 25px rgba(0,0,0,.05);
  } */

/* .wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
  } */
.responsive-bg-w-text {
  display: flex;
  background: url("/media/custome/home/footer_image.png");
  /* background-size: cover; */
  height: 0;
  padding-bottom: 20.66%;

  align-items: center;
  justify-content: center;
}

.responsive-bg-w-text>.header {
  display: inline;
  color: white;
  margin-top: 12.66%;
}

.top-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  backdrop-filter: blur(6px);
}

.menu-top {
  height: 100px;
  position: relative;
  z-index: 1;
  /* border-bottom:solid 1px;
    border-top:solid 1px; */
  width: 100%;
  color: white;
  display: grid;
  /* grid-template-columns: repeat(3,1fr); */
  grid-template-areas:
    'logo menu_name menu'

}

.logo {
  grid-area: logo
}

.menu_name {
  grid-area: menu_name;
  /* text-transform:uppercase; */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  /* font-size:clamp(22px,20px, 30px); */
  mix-blend-mode: difference;
  background-blend-mode: difference;
}

.menu {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
}

.menu ul {
  display: flex;
}

.logo img {
  height: 100px;
}

.bottomright {
  position: absolute;
  /* bottom: 8px; */
  font-size: 18px;
}

* {
  font-family: "Poppins", sans-serif;
}

.brand {
  text-align: center;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.brand span {
  color: #ffffff;
}

.wrapper>* {
  padding: 1em;
}

.company-info {
  border-radius: 13px;
  border: 1px solid #e7e7e7;
  padding: 1em;
  background-color: white;
  box-shadow: 0px 0px 10px #9b919180;
}

.company-info h3,
.company-info ul {
  text-align: center;
  margin: 0 0 1rem 0;
}
.contact {
  border-radius: 10px;
}
.contact form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
}
.contact form label {
  display: block;
}

.contact form p {
  margin: 0;
}
.contact form .full {
  grid-column: 1 / 3;
}
.contact form button{
  width: 100%;
  padding: 1em;
  border: 1px solid #e7e7e7;
  border-radius: 4px;
}
.contact form input,
.contact form textarea {
  width: 100%;
  padding: 2em;
  border: 1px solid #e7e7e7;
  border-radius: 4px;
}

.contact form textarea {
  resize: none;
}

.contact form button {
  border: 0;
  color: #e4e4e4;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: bold;
}

.contact form button:hover,
.contact form button:focus {
  border: 1px solid #e7e7e7;
  color: #ffffff;
  outline: 0;
  transition: background-color 2s ease-out;
}
@media only screen and (min-width: 700px) {
  .wrapper {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }

  .wrapper>* {
    padding: 2em;
  }

  .company-info {
    border-radius: 13px;
  }

  .contact {
    border-radius: 13px;
  }

  .company-info h3,
  .company-info ul,
  .brand {
    text-align: left;
  }
}
</style>
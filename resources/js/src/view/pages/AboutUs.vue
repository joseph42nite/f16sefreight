<template>
    <div class="bg-white">
      <div class="home-banner" id="about-us">
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
                  <b-nav-item to="/login" class="nav-link-custom">Home</b-nav-item>
                  <b-nav-item to="/about-us" class="nav-link-custom">About Us</b-nav-item>
                  <b-nav-item to="/contact-us" class="nav-link-custom">Contact Us</b-nav-item>
                </b-navbar-nav>

                <b-navbar-nav class="ml-auto login-desk" >
                  <b-nav-item>
                    <button @click="firstPopUp('login_signin','login_signup')" class="plain-button">Login</button>
                  </b-nav-item>
                  <b-nav-item>
                    <button @click="firstPopUp('login_signup','login_signin')" class="plain-button">Sign up</button>
                  </b-nav-item>
                </b-navbar-nav>

              <div class="login-mobile">
                <button @click="firstPopUp('login_signin','login_signup')" class="plain-button">Login</button>
                <button @click="firstPopUp('login_signup','login_signin')" class="plain-button">Sign up</button>
              </div>
              </b-collapse>
            </div>
          </b-navbar>
          <div class="banner"></div>
        </div>
        <div class="p-2-3 text-white container p-0" style="margin-top: 15%;">
          <div class="home-block" style="width:100%; padding: 0 15px;">
            <div class="col-12 col-lg-6 fa-4x p-0 fa4x">
              <!-- Reshaping The Future Of Freight Forwarding -->
              About Us
            </div>
            <h4 class="mt-3 mt-lg-5 px-8 px-lg-0">For Online Rates Click On The Below </h4>
            <div class="mt-4 mt-lg-10 px-8 px-lg-0"><button class="login-btn1" @click="firstPopUp('login_signin','login_signup')">Focus Aakash</button></div>
          </div>
        </div>
      </div>
      <b-modal id="login-modal" v-model="show_modal" :hide-footer="true" style="background-color: rgba(213, 179, 176, 0.2);">
        <div class="d-flex flex-column-fluid flex-center">
          <!--begin::Signin-->
          <div class="login-form login-signin w-100" v-if="check_show.login_signin">
            <form class="form" novalidate="novalidate" id="kt_login_signin_form" @submit.prevent="login()">
              <div class="pb-5 pt-lg-0 pt-5 text-center">
                <h1>Login</h1>
              </div>
              <div class="p-3 text-center" v-if="errors == 'Unauthorized'"><span class="text-danger h6">Invalid email or
                  password</span></div>
              <div class="p-3 text-center" v-else-if="errors == 'Blocked'"><span class="text-danger h6">You can't login. Contact admin</span></div>
              <div class="form-group">
                <input class="form-control form-control-solid h-auto py-4 px-2" type="text" name="email" ref="email" placeholder="Email address" id="login_email" />
              </div>
              <div class="form-group d-flex form-control form-control-solid h-auto py-4 px-2 rounded-lg">
                <input :type="showPass?'password':'text'" name="password" ref="password" autocomplete="off" placeholder="Password" class="login_password" id="login_password" />
                <span class="show_pass" @click="showPass=!showPass"><span v-if="showPass">Show</span><span v-else>Hide</span></span>
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
              <div class="form-group d-flex form-control form-control-solid h-auto py-4 px-2 rounded-lg">
                <input :type="showPass?'password':'text'" name="password" ref="password" autocomplete="off" placeholder="Password" class="login_password" id="r_password" />
                <span class="show_pass" @click="showPass=!showPass"><span v-if="showPass">Show</span><span v-else>Hide</span></span>
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
      <template>
        <div class="container" style="margin-top: 8%;margin-bottom: 5%;">
          <div class="row">
            <div class="col-lg-6 col-md-12 order-md-1 item-align-center">
              <h1 class="pt-lg-30 my-5 font-weight-black text-black fa-4x">About F16s</h1>
              <p class="fa-2x mt-3 mt-lg-10">
                We offer a comprehensive array of services, from data management to analytics and shipment procurement management. You can count on the utmost professionalism in all that we do.
              </p>
            </div>
            <div class="col-lg-6 col-md-12 order-md-1 mt-lg-0" style="margin-top: 5%;padding-top: 5%;">
              <img src="/media/custome/about/section.png" alt="flight_plan" class="img-fluid" width="100%">
            </div>
          </div>
        </div>
      </template>

  
      <template>
        <div style="padding-bottom: 5rem;" id="mission-section">
          <h1 class="text-center pt-lg-20 font-weight-black text-black fa-4x f2">Our Mission, Vision And Values</h1>
          <div class="container mb-10">
            <div class="row">
              <div class="col-md-4">
                <div class="card mb-3">
                  <div class="d-flex align-items-center">
                    <div>
                      <h1 class="text-center fa-3x mt-8 mb-8 mx-2">Mission</h1>
                    </div>
                    <div class="ml-auto">
                      <img src="/media/custome/about/Group.png" width="60" height="60" alt="Mission" class="mt-8 mb-8">
                    </div>
                  </div>
                  <div style="font-size: 22px;font-weight: 400;">
                    F16s E-Freight Solutions is committed to making a positive impact, exactly how they took F15 fighter jets and made it better for combat.
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card mb-3">
                  <div class="d-flex align-items-center">
                    <div>
                      <h1 class="text-center fa-3x mt-8 mb-8 mx-2">Vision</h1>
                    </div>
                    <div class="ml-auto">
                      <img src="/media/custome/about/Vector.png" width="60" height="60" alt="Mission" class="mt-8 mb-8">
                    </div>
                  </div>
                  <div style="font-size: 22px;font-weight: 400;">
                    F16s e-Freight Solutions aims at being a seamless interaction between freight forwarders and airlines. 
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card mb-3">
                  <div class="d-flex align-items-center">
                    <div>
                      <h1 class="text-center fa-3x mt-8 mb-8 mx-2">Values</h1>
                    </div>
                    <div class="ml-auto">
                      <img src="/media/custome/about/Loyalty.png" width="60" height="60" alt="Mission" class="mt-8 mb-8">
                    </div>
                  </div>
                  <div style="font-size: 22px;font-weight: 400;">
                    <ul style="list-style: disc inside;">
                      <li>Commitment to Excellence</li>
                      <li>Integrity at the Core</li>
                      <li>Client-Centric Approach</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      </template>
  
      <template>
        <div class="mt-lg-30 mb-lg-30">
          <div class="responsive-bg-w-text">
             <div class="header">
                <h1 class="text-center font-weight-black text-black fa-4x">Get moving now!</h1>
                <p class="text-center" style="font-size: 20px;">Discover the power of efficiency</p>
                <div class="item-center block">
              <router-link to="/contact-us">
                <button class="login-btn">Contact</button>
              </router-link>
            </div>
             </div>
             
          </div>
        </div>
      </template>
      
      <!-- footer -->
      <template>
        <div style="background-color: #320400;">
          <div class="container">
          <div class="row back-b text-white p-8">
            <div class="col-3 col-md- mt-5">
              <a href="https://f16sefs.in/"><img src="/media/custome/footer_logo.png" alt="f16s logo" id="logo-footer"></a>
              <div class="mt-6">
                <a href="https://www.linkedin.com/in/joseph-george-b99616147?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank"><img src="/media/custome/home/linkedin.png" alt="Linkedin"></a>
              </div>
            </div>
            <div class="col-3 col-md-3 mt-5 justify-content">
              <h2>QUICK LINKS</h2>
              <ul>
                <li @click="scrollToMission('#home')"><router-link to="/login">Home</router-link></li>
                <li @click="scrollToMission('#about-us')"><router-link to="/about-us">About Us</router-link></li>
                <li @click="scrollToMission('#contact-us')"><router-link to="/contact-us">Contact Us</router-link></li>
              </ul>
            </div>
            <div class="col-3 col-md-3 mt-5 justify-content">
              <h2>Explore</h2>
              <ul>
                <li @click="scrollToMission('#our-mission')"><router-link to="/#our-mission">Our Mission</router-link></li>
                <li @click="scrollToMission('#focus-areas')"><router-link to="/login">Our Focus Areas</router-link></li>
                <li @click="scrollToMission('#airline-affiliations')"><router-link to="/login">Our Airline Affiliations</router-link></li>
              </ul>
            </div>
            <div class="col-3 col-md-3 mt-5 item-align-right">
              <div class="row d-flex">
                <div class="col-sm-1 mx-3">
                  <a>
                    <img src="/media/custome/home/location.png" width="60" alt="Location">
                  </a>
                </div>
                <div class="col-sm-1 mx-3">
                  <a href="tel:8660320019" style="color: black;">
                    <img src="/media/custome/home/contact.png" width="60" alt="Contact">
                  </a>
                </div>
                <div class="col-sm-1 mx-3">
                  <a href="mailto:joseph@f16sefs.in">
                    <img src="/media/custome/home/email.png" width="60" alt="Email">
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div  class="mt-5">
            <hr style="border-top: 1px solid rgba(255, 255, 255, 0.15);">
            <div class="row text-white">
              <div class="col-12 text-center">
                <a href="https://f16sefs.in/" style="color: white;"><h6>© 2024 by F16s EFS Pvt Ltd </h6></a>
              </div>
              <!-- <div class="col-4 text-center">
                <h6>Cookie Policy</h6>
              </div>
              <div class="col-4 text-right">
                <h6>Privacy Policy</h6>
              </div> -->
            </div>
          </div>
        </div>
        </div>
      </template>
      <div id="whatsapp-float">
        <a :href="'//api.whatsapp.com/send?phone=918660320019&text=Type your query here%0A'" target="_blank" rel="noopener noreferrer">
            <img src="media/custome/w4.png" alt="WhatsApp">
        </a>
    </div> 
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
  // import { directive } from 'vue/types/umd';
  
  export default {
    // name: "About Us",
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
        logoSrc: "/media/custome/logo-1.png",
        blackLogoSrc: "/media/custome/logo-2.png",
        isHovered: false,
        location:[],
        showPass:true,
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
      this.$router.afterEach((to, from) => {
      const sectionId = to.hash;
      if (sectionId) {
        this.scrollToMission(sectionId);
      }
    });
    },
    methods: {
      showForm(show_form,hide_form1,hide_form2) {
         this.check_show[show_form]=true;
         this.check_show[hide_form1]=false;
         this.check_show[hide_form2]=false;
      },
      firstPopUp(show_form,hide_form){
        this.show_modal=true;
        // console.log(this.location.length);
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
      toggleLogo(isHovered) {
        this.logoSrc = isHovered ? this.blackLogoSrc : "/media/custome/logo-1.png";
      },
    scrollToMission(sectionId) {
      const section = document.querySelector(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
      // this.$router.push({ hash: sectionId });
    }
    },
      // components: { directive }
  };
  </script>
  <style scoped>
  #whatsapp-float {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000; /* Ensure it's above other content */
    }

    #whatsapp-float img {
        width: 60px; /* Adjust size as needed */
        height: auto; /* Maintain aspect ratio */
        border-radius: 50%; /* Circular shape */
        transition: transform 0.2s; /* Smooth animation */
    }

    #whatsapp-float img:hover {
        transform: scale(1.1); /* Scale up on hover */
    }
/* .wrap:hover{
  background-color: #923B33;
}
.wrap:hover .btn.btn-danger {
  background-color: white;
  color: #923B33;
} */
.navbar {
  background-color: transparent !important;
}
.navbar-header {
  margin-left: 55px;
  margin-top: 10px;
}
.nav-link-custom{
font-size: medium;
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
@media (min-width: 768px) and (max-width: 1024px) {
  .responsive-bg-w-text {
    padding-bottom: 15%;
  }
}

@media (max-width: 767px) {
  .responsive-bg-w-text {
    padding-top: 30%;
    padding-bottom: 40%;
    font-size: 9px;
  }
  .responsive-bg-w-text > .header {
    margin-top: 15%;
  }
  .responsive-bg-w-text .block{
    padding-bottom: 15%;
  }
  #main-logo{
    width: 115px !important;
  }
  #logo-footer{
    width: 125% !important;
  }
  .wrap:hover{
  background-color: rgb(50, 4, 0) !important;
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
  .f2{
    font-size: 26px;
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
  .login-mobile{
    display:block !important;
  }
  .login-desk{
    display:none;
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
.plain-button {
  border: none;
  background: none;
  margin-top: 7%;
  text-align: center;
  color: white;
  cursor: pointer;
  font-size: 16px;
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
  .error-cls{
    color: #E84342;
  }
  
  .body{
  background-color: white;
  }
  .home-banner { 
    /* The image used */
    background-image: url("/media/custome/about/about_banner.png");
    /* Full height */
    height: 100vh;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: rgba(0, 0, 0, 10);
    opacity: 8.0;
  }
  .h1_text{
    font-family:'Raleway';
    line-height: 80px;
  }
  .logo_text{
    font-family: 'Audiowide';
    font-size: 48px;
    font-weight: 400;
  }
  /* .wrap:hover{
  background: #923B33;
} */
 
  .p-2-3{
      padding: 1% 3%;
  }
  .login-btn{
      background: #923B33;
      border: 0;
      padding: 1.5% 6%;
      border-radius: 10px;
      color: white;
      font-size: 20px;
      font-weight: 600;
  }
  .login-btn1{
    background: #923B33;
    border: 0;
    padding: 1% 3%;
    border-radius: 10px;
    color: white;
    font-size: 20px;
    font-weight: 600;
}
#main-logo{
    width: 135px;
  }
.login-btn1:hover{
  background: #b18480;
}
  .login-btn:hover {
    background: #b18480;
}
  .container {
  position: relative;
}
  ul li{
    /* font-size: 18px; */
    cursor: pointer;
    padding-left: 4px;
  }
  ul{
    list-style-type: none;
    padding-left: 0px;
  }
  ul li a{
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
  .card
  {
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
  
  .wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
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
  .menu-top{
    height:100px;
    position:relative;
    z-index:1;
    /* border-bottom:solid 1px;
    border-top:solid 1px; */
    width:100%;
    color:white;
    display:grid;
    /* grid-template-columns: repeat(3,1fr); */
    grid-template-areas:
      'logo menu_name menu'
      
  }
  .logo{
  grid-area:logo
  }
  .menu_name{
    grid-area:menu_name;
    /* text-transform:uppercase; */
    display:flex;
    justify-content:center;
    align-items:center;
    color:white;
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
  .logo img{
    height:100px;
  }
  .bottomright {
  position: absolute;
  /* bottom: 8px; */
  font-size: 18px;
}
.login_password{
  border: none;
  background: #F3F6F9;
  outline: none;
  width: 100%;
}
.show_pass{
  color: #0984e3;
  cursor: pointer;
}
.login_password::placeholder {
  color: #B5B5C3;
}
#logo-footer{
    width: 45%;
  }
  .login-mobile{
  display:none;
}
</style>
  <!-- 14% 10% 10% 10% / 100% 10% 10% 42%
 -->
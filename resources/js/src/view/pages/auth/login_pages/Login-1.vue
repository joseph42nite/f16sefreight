<template>
  <div class="bg-white">
    <div class="home-banner">
      <div class="wrap">
        <nav class="navbar navbar-expand-lg navbar-dark bg-transparent w-100">
          <div class="container-fluid">
            <div class="p-2-3 text-white">
              <h1 class="logo_text">F16s</h1>
              <h6 style="font-size: smaller;line-height:normal;">Making best even better</h6>
            </div>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse menu" id="navbarSupportedContent">
              <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                <li class="nav-item mx-3">
                  <router-link to="/about-us" class="text-white">About Us</router-link>
                </li>
                <li class="nav-item mx-3">
                  <router-link to="/contact-us" class="text-white">Contact Us</router-link>
                </li>
                <!-- <li class="nav-item mx-3">
                    <router-link to="/rules/about" class="text-white">Rate</router-link>
                </li> -->
              </ul>
              <ul>
                <li><button @click="firstPopUp('login_signin','login_signup')" class="btn btn-danger">Login</button></li>
                <li><button @click="firstPopUp('login_signup','login_signin')" class="btn btn-danger">Sign up</button></li>
              </ul>
            </div>
          </div>
        </nav>
        <div class="banner"></div>
      </div>
      <div class="p-2-3 text-white container p-0" style="margin-top: 3%;">
        <div class="home-block" style="width:45%">
          <h1 class="text-white h1_text" style="font-weight:500;font-size: 56px;">Reshaping The Future Of Freight Forwarding</h1>
          <h4 class="mt-5">For Online Rates Click On The Below </h4>
          <div class="mt-10"><router-link to="/login"><button class="login-btn">Focus Akash</button></router-link></div>
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
    <template>
      <div style="margin-top: 13rem;margin-bottom: 13rem;">
        <div>
          <div class="col-md-6 m-0 p-0">
            <div class="" style="background-color:#D5B3B0; height: 45px !important; border-top-right-radius: 10px;border-bottom-right-radius: 10px;">
              <div class="col-md-11" style="background-color: #A45B54; height: 45px !important;border-top-right-radius: 10px;border-bottom-right-radius: 10px;"></div>
            </div>
          </div>
          <div class="mt-5">
            <b-card img-src="/media/custome/home/second.png" img-alt="Card image" img-left class="mb-3 border-0">
              <h1 class="fw-bolder" style="font-weight: 600; font-size: 42px;">Overview</h1>
              <b-card-text style="font-weight: 400; font-size: 20px;" class="mt-10">
                Welcome to F16s, where innovation meets efficiency in the world of freight forwarding. Our commitment to reshaping the future of logistics is at the core of everything we do. As a pioneering force in the industry, we seamlessly connect businesses to a world of possibilities through our cutting-edge solutions.
              </b-card-text>
            </b-card>
          </div>
          <div style="margin-top: 13rem;" class="row">
            <div class="col-md-6">
            </div>
            <div class="col-md-6 m-0 p-0">
              <div class="row d-flex">
                <div class="col-md-12 half-half" style="background-color: #BDCEEE;padding-left: 30rem;">
                  <div class="col-md-12 half-half" style="background-color: #224E9F;"></div>
                </div>
              </div>
            </div>
            <div class="mt-5">
              <b-card img-src="/media/custome/home/third.png" img-alt="Card image" img-right class="border-0">
                <h1 class="fw-bolder" style="font-weight: 600; font-size: 42px;">Mission Statement</h1>
                <b-card-text style="font-weight: 400; font-size: 20px;" class="mt-10">
                  We do right by freight forwarders in India.
                  F16s E-Freight Solutions is committed to making a positive impact, exactly how they took F15 fighter jets and made it better for combat.
                  <div class="mt-10"><router-link to="/login"><button class="login-btn">Learn More</button></router-link></div>
                </b-card-text>
              </b-card>
            </div>
          </div>

        </div>
      </div>
    </template>

    <template>
      <div style="background-color: rgba(213, 179, 176, 0.2); padding-bottom: 10rem;">
        <h1 class="text-center pt-lg-20 font-weight-black text-black fa-4x">Our Focus Areas</h1>
        <div class="col-md-6 block">
          <p>We bring our expertise to multiple sectors, developing the industry's future and redefining what is possible, one project at a time.</p>
        </div>
        <div class="container mb-10">
          <div class="row">
            <div class="col-md-4">
              <div class="card1 mb-3">
                <img class="card-img-top" src="/media/custome/home/card1.png" alt="Card image cap" style="object-fit: cover">
                <div class="product-detail">
                  <h5 class="card-title heading text-center fa-2x mt-8 mb-8">FWB/FHL Transmission</h5>
                  <div class="text-center text-white mx-5 mt-10" style="font-size: 20px;font-weight: 300;">
                    <p>With close to 100+ airline affiliations with F16s, we provide seamless EDI transfer for freight forwarders in India. FHL, FWB and E-AWS can be done through our services. Our staffs are trained IATA personnel, and due to our remote working style we have complete data security. </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card1 mb-3">
                <img class="card-img-top" src="/media/custome/home/card3.png" alt="Card image cap" style="object-fit: cover">
                  <div class="product-detail">
                    <h5 class="card-title heading text-center fa-2x mt-8 mb-8">E- Freight rates</h5>
                    <div class="text-center text-white mx-5 mt-10" style="font-size: 20px;font-weight: 300;">
                    <p>With close to 100+ airline affiliations with F16s, we provide seamless EDI transfer for freight forwarders in India. FHL, FWB and E-AWS can be done through our services. Our staffs are trained IATA personnel, and due to our remote working style we have complete data security. </p>
                  </div>
                  </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card1 mb-3">
                <img class="card-img-top" src="/media/custome/home/card2.png"  alt="Card image cap" style="object-fit: cover">
                <div class="product-detail">
                  <h5 class="card-title heading text-center fa-2x mt-8 mb-8">Cargo And Community</h5>
                  <div class="text-center text-white mx-5 mt-10" style="font-size: 20px;font-weight: 300;">
                    <p>We also are working towards building a cargo community in india, so this highly unorganized sector sees the light of effective communications between different related pages with our online portal.</p>
                  </div> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template>
      <div class="container">
        <div class="row">
          <div class="col-5 item-align-center" style="margin-top: 23%;">
            <h1 class="justify-content pt-lg-20 font-weight-black text-black fa-4x">We build, we plan, we deliver</h1>
            <p class="fa-2x mt-2">We offer a comprehensive array of services, from the data management to analytics and shipment procurement management. You can count on the utmost professionalism in all that we do.</p>
          </div>
          <div class="col-7" style="margin-top: 5%;">
            <img src="/media/custome/home/flight_plan.png" alt="flight_plan" height="90%" class="vh-60">
          </div>
        </div>
      </div>
    </template>

    <template>
      <div style="background-color: rgba(213, 179, 176, 0.2);padding-bottom: 5rem;">
        <div class="container">
          <h1 class="text-center pt-lg-20 font-weight-black text-black fa-4x">Our airline affiliations</h1>
          <div class="col-md-6 block">
            <p>Global Reach, Trusted Alliances: Connecting Your Cargo with Renowned Airlines and 90+ airlines</p>
          </div>
          <div class="row justify-content-md-center mt-15">
            <div class="col-sm-4 mt-15">
              <img src="/media/custome/home/emirates_logo.png" width="300" alt="amirates_logo">
            </div>
            <div class="col-sm-4 mt-15">
              <img src="/media/custome/home/qatar_logo.png" width="300" alt="amirates_logo">
            </div>
            <div class="col-sm-4 mt-15">
              <img src="/media/custome/home/airfrance_logo.png" width="300" alt="airfrance_logo">
            </div>
            <div class="col-sm-4 mt-15">
              <img src="/media/custome/home/turkish_logo.png" width="300" alt="turkish_logo">
            </div>
            <div class="col-sm-4 mt-15">
              <img src="/media/custome/home/lufthansa_logo.png" width="300" alt="lufthansa_logo">
            </div>
          </div>
          <div class="mt-10 item-center block">
            <router-link to="/login">
              <button class="login-btn">Read More</button>
            </router-link>
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
            <router-link to="/login">
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
          <div class="col-3 col-md-3">
            <h1 class="logo_text">F16s</h1>
            <h6 style="font-size: smaller;line-height:normal;">Making best even better</h6>
            <!-- <img src="/media/custome/orange-logo.png" alt="orange logo" style="width: 50%;"> -->
            <div class="mt-6">
              <img src="/media/custome/home/linkedin.png" alt="Linkedin">
            </div>
          </div>
          <div class="col-3 col-md-3 mt-5 justify-content">
            <h2>QUICK LINKS</h2>
            <ul>
              <li><router-link to="/rules/about">Home</router-link></li>
              <li><router-link to="/rules/terms">About Us</router-link></li>
              <li><router-link to="/rules/product">Rates</router-link></li>
              <li><router-link to="/rules/privacy">Contact Us</router-link></li>
            </ul>
          </div>
          <div class="col-3 col-md-3 mt-5 justify-content">
            <h2>Explore</h2>
            <ul>
              <li><router-link to="/rules/about">Our Mission</router-link></li>
              <li><router-link to="/rules/terms">Our Focus Areas</router-link></li>
              <li><router-link to="/rules/product">Our airline affiliations</router-link></li>
              <li><router-link to="/rules/privacy">Contact Us</router-link></li>
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
        <div  class="mt-5">
          <hr style="border-top: 1px solid rgba(255, 255, 255, 0.15);">
          <div class="row text-white">
            <div class="col-4">
              <h6>© 2024 by F16s EFS Pvt Ltd</h6>
            </div>
            <div class="col-4 text-center">
              <h6>Cookie Policy</h6>
            </div>
            <div class="col-4 text-right">
              <h6>Privacy Policy </h6>
            </div>
          </div>
        </div>
        <!-- <div class="row back-b text-white justify-content-center p-3">
        <strong class="text-white"><i class="fas fa-copyright"></i> Copyright reserved Orangetheory Fitness</strong>
        </div> -->
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
// import { directive } from 'vue/types/umd';

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
  },
    // components: { directive }
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

.body{
background-color: white;
}
.home-banner { 
  /* The image used */
  background-image: url("/media/custome/home_banner.png");
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
/* .home-block{
    background: rgba(0, 0, 0, 0.8);
    padding: 2.5% 3% 2.5% 1.8%;
} */
.p-2-3{
    padding: 2% 3%;
}
/* .wrap:hover{
  background: #923B33;
} */
.login-btn{
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
.card1 
{
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
  height: 400px;
  transition: .4s all ease-in;
  border: none;
  margin: 25px auto;
  border-radius: 13px;
}

.card-img-top{
  box-shadow: 0 0 25px rgba(0,0,0,.05);
}

.carousel-control-next-icon 
{
  padding: 0 4px 0 0; 
}
.product_price 
{
  float:right;
	color:#6b7270;
	font-size: 20px;
	font-weight:400;
}
.product-detail {
  max-width: 400px;
  position: absolute;
  height: 75px;
  /* left: 15px;
  right: 15px; */
  bottom: 1px;
  overflow: hidden;
  /* padding: 15px; */
  /* background-color: rgb(9 9 9 / 90%); */
  background-color: white;
  transition: all 0.35s;
  text-align: center;
  box-sizing: border-box;
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
}
.card1 .product-detail h5
{
  text-transform: uppercase;
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
  margin: 3px 0;
  /* color: black; */
}

.card1 .product-detail .subheading {
  font-weight: 400;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  color: rgba(0,0,0,0.6);
}

.card1:hover .product-detail {
  height: calc(100%);
  border-radius: 13px;
  background-color: rgb(9 9 9 / 90%);
  color: white;
}
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
</style>

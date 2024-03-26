<template>
  <div class="bg-white">
    <!-- <div class="home-banner">
      <div class="wrap" @mouseover="isHovered = true" @mouseleave="isHovered = false">
        <nav class="navbar navbar-expand-lg navbar-dark bg-transparent w-100">
          <div class="container-fluid">
            <div class="p-2-3 text-white">
              <img :src="isHovered ? blackLogoSrc : logoSrc" alt="orange logo" style="width: 100%;">
            </div>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse menu" id="navbarSupportedContent">
              <ul class="navbar-nav mx-auto mb-2 mb-lg-0" style="font-size: medium;">
                <li class="nav-item mx-3">
                  <router-link to="/about-us" class="text-white">About Us</router-link>
                </li>
                <li class="nav-item mx-3">
                  <router-link to="/contact-us" class="text-white">Contact Us</router-link>
                </li>
              </ul>
              <ul style="font-size: medium;" class="navbar-nav">
                <li class="nav-item">
                  <button @click="firstPopUp('login_signin','login_signup')" class="plain-button">Login</button>
                </li>
                <li class="nav-item">
                  <button @click="firstPopUp('login_signup','login_signin')" class="btn btn-danger">Sign up</button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div class="banner"></div>
      </div>
      <div class="p-2-3 text-white container p-0" style="margin-top: 15%;">
        <div class="home-block" style="width:100%; max-width: 45rem;">
          <h1 class="text-white h1_text" style="font-weight:500;font-size: 56px;">Reshaping The Future Of Freight Forwarding</h1>
          <h4 class="mt-5">For Online Rates Click On The Below </h4>
          <div class="mt-10"><router-link to="/login"><button class="login-btn">Focus Aakash</button></router-link></div>
        </div>
      </div>
    </div> -->
  <!-- <div class="home-banner">
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
            <b-navbar-nav class="mx-auto">
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
  </div> -->
  <div class="home-banner" id="home">
    <div class="wrap" @mouseover="isHovered = true" @mouseleave="isHovered = false">
      <b-navbar toggleable="lg" type="dark" variant="info">
        <div class="container-fluid">
          <div class="navbar-header">
            <b-navbar-brand href="https://f16sefs.in/">
              <img :src="isHovered ? blackLogoSrc : logoSrc" alt="f16s logo" style="width: 100%;">
            </b-navbar-brand>
          </div>

          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
              <b-nav-item to="/about-us" class="nav-link-custom">About Us</b-nav-item>
              <b-nav-item to="/contact-us" class="nav-link-custom">Contact Us</b-nav-item>
            </b-navbar-nav>

            <b-navbar-nav class="ml-auto">
              <b-nav-item>
                <button @click="firstPopUp('login_signin','login_signup')" class="btn btn-danger">Login</button>
              </b-nav-item>
              <b-nav-item>
                <button @click="firstPopUp('login_signup','login_signin')" class="plain-button">Sign up</button>
              </b-nav-item>
            </b-navbar-nav>
          </b-collapse>
        </div>
      </b-navbar>
      <div class="banner"></div>
    </div>
    <div class="p-2-3 text-white container p-0" style="margin-top: 15%;">
      <div class="home-block" style="width:100%;padding: 0 5px;">
        <div class="col-12 col-lg-6 fa-4x p-0 fa4x">
          Reshaping The Future Of Freight Forwarding
        </div>
        <!-- <h1 class="text-white h1_text" style="font-weight:500; font-size: 56px; margin-bottom: 10px;">Reshaping The Future Of Freight Forwarding</h1> -->
        <h4 class="mt-3 mt-lg-5 px-8 px-lg-0">For Online Rates Click On The Below </h4>
        <div class="mt-4 mt-lg-10 px-8 px-lg-0"><button class="login-btn1" @click="firstPopUp('login_signin','login_signup')">Focus Aakash</button></div>
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
            <div class="p-3 text-center" v-if="errors == 'Unauthorized'"><span class="text-danger h6">Invalid email or password</span></div>
            <div class="p-3 text-center" v-else-if="errors == 'Blocked'"><span class="text-danger h6">You can't login. Contact admin</span></div>
            <div class="p-3 text-center" v-else-if="errors == 'Expired'"><span class="text-danger h6">Your plan is expired. Please renew the plan</span></div>
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
              <b-input-group class="input-group-merge">
                <div class="custom-dropdown" ref="dropdownContainer" @click="toggleDropdown">
                  <input type="text" v-model="searchQuery" placeholder="Search source" id="from_id" class="form-control source-input">
                  <div v-if="isDropdownOpen" class="dropdown-options">
                    <div v-for="(item, index) in filteredLocations" :key="index" @click="selectOption(item)" class="option">{{ item.iata_code }} ({{ item.destination }})</div>
                  </div>
                </div>
              </b-input-group>
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
      <div class="" style="margin-top: 10%; margin-bottom: 10%;">
        <!-- <div class="row align-items-center flex-column flex-md-row">
          <div class="col-md-5 col-12 m-0 p-0">
            <div class="d-flex justify-content-between align-items-center" style="height: 45px; border-top-right-radius: 10px; border-bottom-right-radius: 10px;background-color:#D5B3B0; height: 45px">
              <div class="col-md-10" style="background-color: #A45B54; height: 45px; border-top-right-radius: 10px; border-bottom-right-radius: 10px;"></div>
            </div>
          </div>
          <div class="col-1 m-0 p-0 ml-4">
              <img src="/media/custome/home/flight1.png" alt="" width="70" height="70" class="img-fluid">
          </div>
        </div> -->
        <div class="row align-items-center flex-column flex-md-row d-md-flex d-none d-sm-block">
          <div class="col-md-5 col-12 m-0 p-0">
            <div class="d-flex justify-content-between align-items-center" style="height: 45px; border-top-right-radius: 10px; border-bottom-right-radius: 10px;background-color:#D5B3B0; height: 45px">
              <div class="col-md-10" style="background-color: #A45B54; height: 45px; border-top-right-radius: 10px; border-bottom-right-radius: 10px;"></div>
            </div>
          </div>
          <div class="col-1 m-0 p-0 ml-4">
            <img src="/media/custome/home/flight1.png" alt="" width="70" height="70" class="img-fluid">
          </div>
        </div>


        <div class="row">
          <div class="col-lg-6 mt-2">
            <img class="w-100 shadow" src="/media/custome/home/second.png" style="border-top-right-radius: 15px;border-bottom-right-radius: 15px;"/>
          </div>
          <div class="col-lg-6">
            <div class="col-md-10 px-10 mt-0">
              <h1 class="fw-bolder fa-4x" style="font-weight: 600;">Overview</h1>
                <p style="font-weight: 400; font-size: 22px;" class="mt-10">Welcome to F16s, where innovation meets efficiency in the world of freight forwarding. Our commitment to reshaping the future of logistics is at the core of everything we do. As a pioneering force in the industry, we seamlessly connect businesses to a world of possibilities through our cutting-edge solutions.</p>
              </div>
          </div>
        </div>
        <div style="margin-top: 13rem;" class="row align-items-center flex-column flex-md-row d-md-flex d-none d-sm-block">
          <div class="col-md-6">
          </div>
          <div class="col-sm-1 m-0 p-0">
            <img src="/media/custome/home/flight2.png" alt="" width="70" height="70">
          </div>
          <div class="col-5 mb-5">
            <div class="" style="background-color:#BDCEEE; height: 45px !important; border-top-left-radius: 10px;border-bottom-left-radius: 10px;padding-left: 10%;">
              <div class="col-md-12" style="background-color: #224E9F; height: 45px !important;border-top-left-radius: 10px;border-bottom-left-radius: 10px;"></div>
            </div>
          </div>
        </div>
        <div class="row" id="our-mission">
          <div class=" col-lg-6">
            <div class="container col-10 px-10 mt-0">
              <h1 class="fw-bolder fa-4x" style="font-weight: 600;">Mission Statement</h1>
                <p style="font-weight: 400; font-size: 22px;" class="mt-10"> We do right by freight forwarders in India.
                    F16s E-Freight Solutions is committed to making a positive impact, exactly how they took F15 fighter jets and made it better for combat.</p>
                <div class="mt-10"><router-link to="/login"><button class="login-btn">Learn More</button></router-link></div>
            </div>
          </div>
          <div class="col-lg-6">
            <img class="w-100 shadow" src="/media/custome/home/third.png" style="border-bottom-left-radius: 15px;border-top-left-radius: 15px;"/>
          </div>
        </div>
      </div>
    </template>

    <template>
      <div style="background-color: rgba(213, 179, 176, 0.2); padding-bottom: 10rem; min-height: 100vh;" id="focus-areas">
        <h1 class="text-center pt-lg-20 font-weight-black text-black fa-4x">Our Focus Areas</h1>
        <div class="col-md-6 block">
          <p>We bring our expertise to multiple sectors, developing the industry's future and redefining what is possible, one project at a time.</p>
        </div>
        <div class="container mb-10">
          <div class="row">
            <div class="col-md-4">
              <div class="card1 mb-3">
                <img class="card-img-top" src="/media/custome/home/card1.png" alt="Card image cap" style="object-fit: cover">
                <div class="product-detail custom-mr">
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
                  <div class="product-detail custom-mr">
                    <h5 class="card-title heading text-center fa-2x mt-8 mb-8">E- Freight rates</h5>
                    <div class="text-center text-white mx-5 mt-10" style="font-size: 20px;font-weight: 300;">
                    <!-- <p>With close to 100+ airline affiliations with F16s, we provide seamless EDI transfer for freight forwarders in India. FHL, FWB and E-AWS can be done through our services. Our staffs are trained IATA personnel, and due to our remote working style we have complete data security. </p> -->
                    <p>With sophisticated planning, we have developed a service for the IATA agents to reduce their operational timing from 1 minute to 15 secs. Our team has developed a portal where you can check the rates, get the surcharges and AMS all at once. Reducing the redundant part of the job that consumes valuable time.</p>
                  </div>
                  </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card1 mb-3">
                <img class="card-img-top" src="/media/custome/home/card2.png"  alt="Card image cap" style="object-fit: cover">
                <div class="product-detail custom-mr">
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
      <div class="position-relative">
        <div class="row align-items-center">
          <div class="col-1"></div>
          <div class="col-md-5 mb-4 mb-md-0">
            <h1 class="pt-lg-20 font-weight-black text-black fa-4x fa4x">We Build, We Plan, We Deliver</h1>
            <p class="fa-2x mt-2">
              We offer a comprehensive array of services, from data management to analytics and shipment procurement management. You can count on the utmost professionalism in all that we do.
            </p>
          </div>
          <div class="col-md-6" style="right:0">
            <img src="/media/custome/home/flight_plan.png" alt="flight_plan" class="img-fluid" style="max-height: 100%; width: 100%; margin-right: 0;"> <!-- Adjust margin-right as needed -->
          </div>
        </div>
      </div>
    </template>

    <template>
      <div style="background-color: rgba(213, 179, 176, 0.2);padding-bottom: 5rem;" id="airline-affiliations">
        <div class="container">
          <h1 class="text-center pt-lg-20 font-weight-black text-black fa-4x">Our Airline Affiliations</h1>
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
              <button class="login-btn1">Read More</button>
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
          <div class="col-3 col-md-3 mt-5">
            <a href="https://f16sefs.in/"><img src="/media/custome/footer_logo.png" alt="f16s logo" style="width: 45%;"></a>
            <div class="mt-6">
              <img src="/media/custome/home/linkedin.png" alt="Linkedin">
            </div>
          </div>
          <div class="col-3 col-md-3 mt-5 justify-content">
            <h2>QUICK LINKS</h2>
            <ul>
              <li @click="scrollToMission('#home')"><router-link to="/login">Home</router-link></li>
              <li @click="scrollToMission('#about-us')"><router-link to="/about-us">About Us</router-link></li>
              <!-- <li @click="scrollToMission('#home')"><router-link to="/login">Rates</router-link></li> -->
              <li @click="scrollToMission('#contact-us')"><router-link to="/contact-us">Contact Us</router-link></li>
            </ul>
          </div>
          <div class="col-3 col-md-3 mt-5 justify-content">
            <h2>Explore</h2>
            <ul>
                <li @click="scrollToMission('#our-mission')"><router-link to="/login">Our Mission</router-link></li>
                <li @click="scrollToMission('#focus-areas')"><router-link to="/login">Our Focus Areas</router-link></li>
                <li @click="scrollToMission('#airline-affiliations')"><router-link to="/login">Our Airline Affiliations</router-link></li>
                <!-- <li @click="scrollToMission('#contact-us')"><router-link to="/contact-us">Contact Us</router-link></li> -->
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
            <div class="col-4">
              <a href="https://f16sefs.in/" style="color: white;"><h6>© 2024 by F16s EFS Pvt Ltd </h6></a>
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
      searchQuery: '',
      isDropdownOpen: false,
      logoSrc: "/media/custome/logo.png",
      blackLogoSrc: "/media/custome/black-logo.png",
      isHovered: false,
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
    },
    filteredLocations() {
      if (!this.searchQuery) {
        return this.location;
      }
      const query = this.searchQuery.toLowerCase();
      return this.location.filter(item => {
          return (
              item.iata_code.toLowerCase().includes(query)
          );
      });
    }
  },
  mounted() {
    this.$router.afterEach((to, from) => {
      const sectionId = to.hash;
      if (sectionId) {
        this.scrollToMission(sectionId);
      }
    });
    window.addEventListener('click', this.closeDropdown);
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectOption(item) {
      this.user_form.origin_airport_code = item.iata_code;
      let source_name= item.destination;
      let final_set=this.user_form.origin_airport_code+"("+source_name+")";
      this.searchQuery=final_set;
    },
    closeDropdown(event) {
      const dropdownContainer = this.$refs.dropdownContainer;
      if (!dropdownContainer.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    },
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
          this.location=data;
        })
    },
    toggleLogo(isHovered) {
      this.logoSrc = isHovered ? this.blackLogoSrc : "/media/custome/logo.png";
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
.nav-link-custom{
  font-size: medium;
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
  font-size: 16px;
}
.btn-color {
  background: #923B33;
}

.image-div {
  height: 100%;
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
.text-al {
  text-align: -webkit-center;
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
    /* margin-left: 20px; */
    margin-right: 20px;
  }
  .fa-2x {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }
  .fa4x{
    margin-left: 20px;
  }
}
  @media (min-width: 768px) and (max-width: 1024px) {
    .fa-2x {
      margin: 15px;
    }
  }
  @media (max-width: 576px) { /* Adjust this breakpoint as needed */
    .custom-mr {
        margin-right: 10px !important;
    }
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
.login-btn1:hover{
  background: #b18480;
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
    padding: 1% 3%;
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
.login-btn1{
    background: #923B33;
    border: 0;
    padding: 1% 3%;
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
  bottom: 1px;
  overflow: hidden;
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
@media (min-width: 768px) and (max-width: 1024px) {
  .responsive-bg-w-text {
    padding-bottom: 15%;
  }
}
@media(min-width:1000px)and (max-width: 1200px){
  .card1 
{
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
  /* height: 400px; */
  transition: .4s all ease-in;
  border: none;
  margin: 25px auto;
  min-width: 300px;
  border-radius: 13px;
}
.product-detail{
  position: relative;
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
.custom-dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
  border-radius: 5px;
}
.source-input{
  background-color: #EBEDF3 !important;
  border-color: #EBEDF3;
  color: #3F4254;
}
.form-control {
  width: 100%;
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 200px; /* Adjust as needed */
  overflow-y: auto;
}

.option {
  padding: 5px 10px;
  cursor: pointer;
}

.option:hover {
  background-color: #f0f0f0;
}
</style>

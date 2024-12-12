<template>
    <b-container fluid class="footer py-14">
        <b-row>
            <b-container>
                <b-row>
                    <b-col md="12" class="footer-col footer-logo">
                        <router-link to="https://f16sefs.in/">
                            <img :src="FooterLogoSrc" alt="f16s Footer Logo" id="main-footer-logo">
                        </router-link>
                    </b-col>
                </b-row>
                <b-row class="border-top-bottom">
                    <!-- Column 1 -->
                    <b-col md="3" class="footer-col">
                        <div style="margin-left:80px;">
                            <h5>Company</h5>
                            <ul class="list-unstyled">
                                <li><b-link href="#">About</b-link></li>
                                <li><b-link href="#">FAQ</b-link></li>
                                <li><b-link href="#">License</b-link></li>
                                <li><b-link href="#">Terms & Conditions</b-link></li>
                                <li><b-link href="#">Privacy Policy</b-link></li>
                            </ul>
                        </div>
                    </b-col>
                    <!-- Column 2 -->
                    <b-col md="3" class="footer-col">
                        <div style="margin-left:80px;">
                            <h5>Resources</h5>
                            <ul class="list-unstyled">
                                <li><b-link href="#">Blogs</b-link></li>
                                <li><b-link href="#">Press</b-link></li>
                                <li><b-link href="#">Contact</b-link></li>
                                <li><b-link href="#">FAQs</b-link></li>
                            </ul>
                        </div>
                    </b-col>
                    <!-- Column 3 -->
                    <b-col md="3" class="footer-col">
                        <div style="margin-left:80px;">
                            <h5>Sevices</h5>
                            <ul class="list-unstyled">
                                <li><b-link href="#">Focus Air</b-link></li>
                                <li><b-link href="#">Focus Sea</b-link></li>
                                <li><b-link href="#">Focus Road</b-link></li>
                            </ul>
                        </div>
                    </b-col>
                    <!-- Column 4 -->
                    <b-col md="3" class="footer-col">
                        <div style="margin-left:80px;">
                            <h5>Contact Info</h5>
                            <ul class="list-unstyled">
                                <li><b-link href="#">call</b-link></li>
                                <li><b-link href="#">email</b-link></li>
                                <li><b-link href="#">Address</b-link></li>
                            </ul>
                        </div>
                    </b-col>
                </b-row>
                <b-row class="pt-6 align-items-center">
                    <!-- Column 1 -->
                    <b-col md="6" class="">
                        <div>
                            © 2024, F16s All Rights Reserved.
                        </div>
                    </b-col>
                    <!-- Column 2 -->
                    <b-col md="6" class="">
                        <div class="d-flex justify-content-end">
                            <router-link to="#">
                                <img :src="YouTubeLogoSrc" alt="f16s Footer Logo" id="social-icon">
                            </router-link>
                            <router-link to="#">
                                <img :src="LinkedInLogoSrc" alt="f16s Footer Logo" class="linkedin-icon" id="social-icon">
                            </router-link>
                            <router-link to="#">
                                <img :src="FaceBookLogoSrc" alt="f16s Footer Logo" id="social-icon">
                            </router-link>
                        </div>
                    </b-col>
                </b-row>
            </b-container>
        </b-row>
    </b-container>
  </template>
  
  <script>
  export default {
    name: "Footer",
    data(){
        return{
            FooterLogoSrc: "/media/custome/Footer-logo.svg",
            YouTubeLogoSrc: "/media/custome/social-icon/youtube.svg",
            LinkedInLogoSrc: "/media/custome/social-icon/linkedIn.svg",
            FaceBookLogoSrc: "/media/custome/social-icon/facebook.svg",
        }
    },
  };
  </script>
  
  <style scoped>
  #main-footer-logo {
    width: 80px;
  }
  .footer-logo {
    padding: 0px !important;
  }
  .border-top-bottom {
    border-top: 1px solid #BABDCE !important;
    border-bottom: 1px solid #BABDCE !important;
  }
  .footer {
    height: auto;
    background-color: #DAEFFF; /* For browsers that do not support gradients */
    background-image: linear-gradient(#FFFFFF, #DAEFFF);
  }
  .footer h5 {
    font-size: 14px;
    margin-bottom: 25px;
    color: #818498;
    margin-top: 40px;
  }
  .footer p,
  .footer ul {
    font-size: 14px;
  }
  .footer a {
    color: #36364A;
    text-decoration: none;
  }
  .footer a:hover {
    text-decoration: underline !important;
  }
  .footer-col {
    margin-bottom: 15px;
  }
  .footer-col li {
    margin-bottom: 10px;
  }
  #social-icon {
    width: 25px;
  }
  .linkedin-icon {
    margin: 0px 25px;
  }
  </style>
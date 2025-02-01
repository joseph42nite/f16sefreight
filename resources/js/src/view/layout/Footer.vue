<template>
    <b-container fluid class="footer py-14">
        <b-container>
            <!-- Footer Logo Row -->
            <b-row>
                <b-col md="12" class="p-0 mb-6">
                    <router-link to="/">
                        <img :src="FooterLogoSrc" alt="f16s Footer Logo" id="main-footer-logo" class="img-fluid">
                    </router-link>
                </b-col>
            </b-row>
    
            <!-- Footer Links Rows -->
            <b-row align-h="center" align-v="center" class="border-top-bottom">
                <b-col cols="11" md="10">
                    <b-row>
                        <!-- Column 1 (Company) -->
                        <b-col cols="6" sm="3" md="3">
                            <div class="my-sm-14 mt-7 list-group">
                                <h5 class="mb-sm-8 mb-5">Company</h5>
                                <ul class="list-unstyled">
                                    <li class="mb-sm-6 mb-3"><b-link to="/about-us">About</b-link></li>
                                    <li class="mb-sm-6 mb-3"><b-link href="#faq-section">FAQ</b-link></li>
                                    <!-- <li class="mb-sm-6 mb-3"><b-link href="/license">License</b-link></li>
                                    <li class="mb-sm-6 mb-3"><b-link href="term-and-condition">Terms & Conditions</b-link></li>
                                    <li class="mb-sm-6 mb-3"><b-link href="privacy-policy">Privacy Policy</b-link></li> -->
                                </ul>
                            </div>
                        </b-col>
                
                        <!-- Column 2 (Resources) -->
                        <b-col cols="6" sm="3" md="3">
                            <div class="my-sm-14 mt-7 list-group">
                                <h5 class="mb-sm-8 mb-5">Resources</h5>
                                <ul class="list-unstyled">
                                    <!-- <li class="mb-sm-6 mb-3"><b-link href="#">Blogs</b-link></li>
                                    <li class="mb-sm-6 mb-3"><b-link href="#">Press</b-link></li> -->
                                    <li class="mb-sm-6 mb-3"><b-link to="/contact-us">Contact Us</b-link></li>
                                    <!-- <li class="mb-sm-6 mb-3"><b-link href="#">FAQs</b-link></li> -->
                                </ul>
                            </div>
                        </b-col>
                
                        <!-- Column 3 (Services) -->
                        <b-col cols="6" sm="3" md="3">
                            <div class="my-sm-14 mt-7 list-group">
                                <h5 class="mb-sm-8 mb-5">Services</h5>
                                <ul class="list-unstyled">
                                    <li class="mb-sm-6 mb-3"><b-link href="#">Focus Air</b-link></li>
                                    <li class="mb-sm-6 mb-3"><b-link href="#">Focus Sea</b-link></li>
                                    <li class="mb-sm-6 mb-3"><b-link href="#">Focus Road</b-link></li>
                                </ul>
                            </div>
                        </b-col>
                
                        <!-- Column 4 (Contact Info) -->
                        <b-col cols="6" sm="3" md="3">
                            <div class="my-sm-14 mt-7 list-group">
                                <h5 class="mb-sm-8 mb-5">Contact Info</h5>
                                <ul class="list-unstyled">
                                    <li class="mb-sm-6 mb-3"><b-link href="tel:+918660320019">Call</b-link></li>
                                    <!-- <li class="mb-sm-6 mb-3 contactInfo-phone">
                                        <a href="tel:+918660320019" style="text-decoration: none; color: inherit;">
                                            +91 8660320019
                                        </a>
                                    </li> -->
                                    <li class="mb-sm-6 mb-3"><b-link href="mailto:joseph@f16sefreight.com">Email</b-link></li>
                                    <!-- <li class="mb-sm-6 mb-3 contactInfo-email">
                                        <a href="mailto:joseph@f16sefreight.com" style="text-decoration: none; color: inherit;">
                                            joseph@f16sefreight.com
                                        </a>
                                    </li> -->
                                    <li class="mb-sm-6 mb-3"><b-link>Address</b-link></li>
                                    <!-- <li class="mb-sm-6 mb-3 contactInfo-address">
                                        <a href="#" style="text-decoration: none; color: inherit;">
                                            www.f16sefreight.com
                                        </a>
                                    </li> -->
                                </ul>
                            </div>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <!-- Footer Bottom Row (Copyright & Social Icons) -->
            <b-row class="pt-6">
                <!-- Column 1 (Copyright) -->
                <b-col xs="6" class="">
                    <div>© 2024, F16s All Rights Reserved.</div>
                </b-col>
                <!-- Column 2 (Social Media Links) -->
                <b-col xs="6" class="d-flex justify-content-end">
                    <router-link to="#" class="mx-2">
                    <img :src="YouTubeLogoSrc" alt="YouTube Logo" id="social-icon" class="" style="margin-top: 18%;">
                    </router-link>
                    <router-link to="#" class="mx-2">
                    <img :src="LinkedInLogoSrc" alt="LinkedIn Logo" id="social-icon" class="">
                    </router-link>
                    <router-link to="#" class="mx-2">
                    <img :src="FaceBookLogoSrc" alt="Facebook Logo" id="social-icon" class="">
                    </router-link>
                </b-col>
            </b-row>
        </b-container>
    </b-container>
</template>
  
  <script>
  export default {
    name: "Footer",
    data(){
        return{
            FooterLogoSrc: "/media/custome/blue-logo.png",
            YouTubeLogoSrc: "/media/custome/social-icon/youtube.svg",
            LinkedInLogoSrc: "/media/custome/social-icon/linkedIn.svg",
            FaceBookLogoSrc: "/media/custome/social-icon/facebook.svg",
        }
    },
  };
  </script>
  
<style scoped>
    @import url(http://fonts.googleapis.com/css?family=Inter:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900);

    /* /////////////////////////////////////////////////////////////////////////////////////////////////////// */
    html, body, html * {
        font-family: 'Inter', sans-serif !important;
    }
    #main-footer-logo {
        width: 80px;
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
        line-height: 24px;
        color: #818498;
        font-weight: 400;
    }
    .footer p,
    .footer ul {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #36364A;
    }
    .footer a {
        color: #36364A;
        text-decoration: none;
    }
    .footer a:hover {
        text-decoration: underline !important;
    }
    #social-icon {
        width: 80%;
        margin: auto;
        display: flex;
    }
    .linkedin-icon {
        margin: 0px 25px;
    }
    .contactInfo-phone,
    .contactInfo-email,
    .contactInfo-address {
        font-size: 12px;
    }
    @media (max-width: 576px) {
        .list-group {
            text-align: center;
        }
    }
    @media (max-width: 767px) {
        .contactInfo-phone,
        .contactInfo-email,
        .contactInfo-address {
            font-size: 12px;
        }   
    }
  </style>
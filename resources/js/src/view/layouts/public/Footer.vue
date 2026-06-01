<template>
    <footer class="footer-wrapper pt-15 pb-10">
        <b-container>
            <b-row class="mb-10">
                <!-- LOGO & TAGLINE -->
                <b-col md="4" cols="12" class="mb-10 mb-md-0 text-center text-md-left">
                    <router-link to="/">
                        <img src="/media/assets/logos/blue-logo.png" alt="f16s logo" class="footer-logo mb-6">
                    </router-link>
                    <p class="footer-desc mx-auto mx-md-0">
                        Providing smart data solutions and seamless freight documentation for the global logistics industry.
                    </p>
                </b-col>

                <!-- LINKS COLUMNS -->
                <b-col md="8" cols="12">
                    <b-row class="text-center text-md-left">
                        <b-col sm="4" cols="6" class="mb-10 mb-sm-0">
                            <h5 class="footer-heading">Company</h5>
                            <ul class="list-unstyled footer-links">
                                <li><router-link to="/about-us">About Us</router-link></li>
                                <li><router-link to="/#faq-section">FAQs</router-link></li>
                                <li><router-link to="/blogs-and-news">News & Insights</router-link></li>
                                <li><router-link to="/contact-us">Contact</router-link></li>
                            </ul>
                        </b-col>
                        <b-col sm="4" cols="6" class="mb-8 mb-sm-0">
                            <h5 class="footer-heading">Services</h5>
                            <ul class="list-unstyled footer-links">
                                <li><router-link to="/product-description">Focus Air</router-link></li>
                                <li><router-link to="/product-description">Focus Sea</router-link></li>
                                <li><router-link to="/product-description">Focus Road</router-link></li>
                            </ul>
                        </b-col>
                        <b-col sm="4" cols="12" class="mb-0">
                            <h5 class="footer-heading">Support</h5>
                            <ul class="list-unstyled footer-links">
                                <li><router-link to="/contact-us">Help Center</router-link></li>
                                <li><router-link to="/terms-conditions">Terms of Service</router-link></li>
                                <li><router-link to="/privacy-policy">Privacy Policy</router-link></li>
                            </ul>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>

            <div class="footer-bottom pt-10 d-flex flex-column flex-md-row justify-content-between align-items-center">
                <div class="copyright mb-4 mb-md-0">
                    © 2026 F16s E-Freight Solutions. All rights reserved.
                </div>
                <div class="social-links d-flex gap-4">
                    <a href="https://www.youtube.com/@F16sE-FreightSolutions" target="_blank" rel="noopener noreferrer" title="F16s on YouTube"><b-icon icon="youtube" font-scale="1.5"></b-icon></a>
                    <a href="https://www.linkedin.com/company/101762356/" target="_blank" rel="noopener noreferrer" title="F16s on LinkedIn"><b-icon icon="linkedin" font-scale="1.5"></b-icon></a>
                    <a href="#"><b-icon icon="facebook" font-scale="1.5"></b-icon></a>
                </div>
            </div>
        </b-container>
    </footer>
</template>

<script>
export default {
    name: "Footer"
};
</script>

<style scoped>

.footer-wrapper {
    background: linear-gradient(180deg, #FFFFFF 0%, #F0F7FF 100%);
    border-top: 1px solid #E6F0FF;
    font-family: 'Inter', sans-serif;
}

.footer-logo {
    height: 60px;
}

.footer-desc {
    color: #5A6B8A;
    font-size: 15px;
    line-height: 1.6;
    max-width: 300px;
}

.footer-heading {
    font-size: 16px;
    font-weight: 700;
    color: #355594;
    margin-bottom: 25px;
}

.footer-links li {
    margin-bottom: 12px;
}

.footer-links a {
    color: #5A6B8A;
    text-decoration: none;
    font-size: 15px;
    transition: color 0.3s ease;
}

.footer-links a:hover {
    color: #355594;
}

.footer-bottom {
    border-top: 1px solid #E6F0FF;
    color: #818498;
    font-size: 14px;
    padding-top: 1.5rem;
}

@media (max-width: 991px) {
    .footer-wrapper {
        padding-top: 4rem;
        padding-bottom: 3rem;
    }
    .footer-logo {
        height: 50px;
    }
    .footer-heading {
        margin-bottom: 15px;
    }
}

@media (max-width: 767px) {
    .footer-links li {
        margin-bottom: 8px;
    }
}

.social-links a {
    color: #355594;
    transition: transform 0.3s ease;
}

.social-links a:hover {
    transform: translateY(-3px);
    color: #2a4476;
}

.gap-4 {
    gap: 1.5rem;
}
</style>
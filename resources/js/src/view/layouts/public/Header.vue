<template>
    <div class="wrap">
        <b-navbar toggleable="lg">
            <div class="container-fluid d-flex align-items-center justify-content-between">
                <div class="navbar-header-logo">
                    <b-navbar-brand href="/" style="">
                        <img :src="logoSrc" alt="f16s logo" id="main-logo" />
                    </b-navbar-brand>
                </div>
                <!-- Group Avatar & Toggler for reliable right-aligned stack -->
                <div class="d-flex align-items-center ml-auto order-lg-3">
                    <!-- Profile Avatar for Small Devices < (767px), Visible Before Toggle -->
                    <!-- If loged-in user -->
                    <b-navbar-nav
                        v-if="isAuthenticated"
                        class="d-flex flex-row align-items-center content-gap d-lg-none mr-4"
                    >
                        <b-nav-item-dropdown right no-caret>
                            <template #button-content>
                                <div class="avatar-wrapper">
                                    <img :src="avatarLogoSrc" alt="User profile" id="avatar-logo" />
                                </div>
                            </template>
                            <b-dropdown-item disabled>
                                <div class="d-flex align-items-center">
                                    <b-icon icon="geo-alt" class="mr-2" variant="primary"></b-icon>
                                    <span style="font-size: 12px; color: #355594;">Origin: <strong>{{ currentUser.origin_airport_code }}</strong></span>
                                </div>
                            </b-dropdown-item>
                            <b-dropdown-divider></b-dropdown-divider>
                            <b-dropdown-item @click="logout()">
                                <div class="d-flex align-items-center">
                                    <b-icon icon="box-arrow-right" class="mr-2" variant="danger"></b-icon>
                                    <span style="font-size: 12px;">Sign out</span>
                                </div>
                            </b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>

                    <b-navbar-toggle target="nav-collapse" aria-label="Toggle navigation menu"></b-navbar-toggle>
                </div>

                <b-collapse id="nav-collapse" is-nav>
                    <div class="nav-header-menu" style="">
                        <b-navbar-nav class="nav-menu text-center">
                            <!-- <b-nav-item to="/" class="nav-link-custom text-white">Home</b-nav-item> -->
                            <b-nav-item to="/about-us" class="nav-link-custom"
                                >About Us</b-nav-item
                            >
                            <b-nav-item to="/services" class="nav-link-custom"
                                >Services</b-nav-item
                            >
                            <!-- <b-nav-item to="/faq" class="nav-link-custom">FAQs</b-nav-item> -->
                            <b-nav-item to="/solutions" class="nav-link-custom"
                                >Solutions</b-nav-item
                            >
                            <b-nav-item to="/contact-us" class="nav-link-custom"
                                >Contact Us</b-nav-item
                            >
                            <!-- <b-nav-item to="/focus-air" v-if="isAuthenticated" class="nav-link-custom text-white">Web Doc</b-nav-item> -->
                            <!-- SignIn and what's free button for Small Devices < (767px), Visible here -->
                            <!-- If not loged-in user -->
                            <div class="head-btn d-lg-none">
                                <b-nav-item
                                    v-if="!isAuthenticated"
                                    class="nav-link-custom d-lg-none"
                                >
                                    <button
                                        class="sign-in-btn"
                                        @click="firstPopUp('login_signin')"
                                        aria-label="Sign in to your account"
                                    >
                                        Sign in
                                    </button>
                                </b-nav-item>
                                <b-nav-item
                                    v-if="!isAuthenticated"
                                    to="/product-description"
                                    class="nav-link-custom d-lg-none"
                                >
                                    <button class="whats-new-btn">
                                        Learn more
                                    </button>
                                </b-nav-item>
                            </div>
                        </b-navbar-nav>
                    </div>
                    <!-- Profile Avatar and User Info for Larger Devices -->
                    <!-- If loged-in user -->
                    <div
                        v-if="isAuthenticated"
                        class="nav-header-right"
                        style=""
                    >
                        <b-navbar-nav
                            class="align-items-center content-gap d-none d-lg-flex"
                        >
                            <b-nav-item-dropdown right no-caret>
                                <template #button-content>
                                    <div class="avatar-wrapper">
                                        <img :src="avatarLogoSrc" alt="User profile" id="avatar-logo" />
                                    </div>
                                </template>
                                <b-dropdown-item disabled>
                                    <div class="d-flex align-items-center">
                                        <b-icon icon="geo-alt" class="mr-2" variant="primary"></b-icon>
                                        <span style="font-size: 12px; color: #355594;">Origin: <strong>{{ currentUser.origin_airport_code }}</strong></span>
                                    </div>
                                </b-dropdown-item>
                                <b-dropdown-divider></b-dropdown-divider>
                                <b-dropdown-item @click="logout()">
                                    <div class="d-flex align-items-center">
                                        <b-icon icon="box-arrow-right" class="mr-2" variant="danger"></b-icon>
                                        <span style="font-size: 12px;">Sign out</span>
                                    </div>
                                </b-dropdown-item>
                            </b-nav-item-dropdown>
                        </b-navbar-nav>
                    </div>
                    <!-- If not loged-in user -->
                    <div v-else class="nav-header-right" style="">
                        <b-navbar-nav
                            class="align-items-center content-gap d-none d-lg-flex"
                        >
                            <b-nav-item class="nav-link-custom">
                                <button
                                    class="sign-in-btn"
                                    @click="firstPopUp('login_signin')"
                                    aria-label="Sign in to your account"
                                >
                                    Sign In
                                </button>
                            </b-nav-item>
                             <b-nav-item to="/product-description" class="nav-link-custom">
                                <button class="whats-new-btn">
                                    Learn More
                                </button>
                            </b-nav-item>
                        </b-navbar-nav>
                    </div>
                </b-collapse>

                <auth-modals :show-login.sync="show_login_modal" :show-otp.sync="otp_verification_modal"></auth-modals>
            </div>
        </b-navbar>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { LOGOUT } from "@/core/services/store/auth.module";
import AuthModals from "@/view/layouts/public/AuthModals.vue";

export default {
    name: "Header",
    components: {
        AuthModals
    },
    data() {
        return {
            show_login_modal: false,
            otp_verification_modal: false,
            avatarLogoSrc: "/media/assets/ui/user-avatar.png",
        };
    },
    methods: {
        hasActiveChildren(match) {
            return this.$route["path"].indexOf(match) !== -1;
        },

        firstPopUp() {
            this.show_login_modal = true;
        },

        logout() {
            this.$store
                .dispatch(LOGOUT)
                .then(() => (window.location.href = "/"));
        },
    },
    computed: {
        ...mapGetters(["isAuthenticated", "currentUser"]),

        logoSrc() {
            return "/media/assets/logos/f16s-logo.svg";
        },
    },
};
</script>
<style scoped>
@import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900);
html,
body * {
    font-family: "Roboto", sans-serif !important;
}
.navbar-header-logo {
    flex: 0 0 auto;
    max-width: 250px;
}
.nav-header-menu {
    flex: 1;
    display: flex;
    justify-content: center;
}
@media (min-width: 992px) {
    .navbar .container {
        position: relative;
    }
    .nav-header-menu {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        margin: 0 !important;
        z-index: 5;
    }
}
.nav-header-right {
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
}
.navbar {
  height: auto;
  padding: 30px 40px 40px 40px !important;
  margin-bottom: 20px;
}
.nav-menu {
    padding: 8px 30px;
    gap: 30px;
    border-radius: 50px;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
.nav-link {
    padding: 0px !important;
    color: #355594 !important;
}
.content-gap {
    gap: 18px;
}

.nav-link-custom:hover {
    color: #2a4476 !important;
}
.nav-link-custom {
    font-size: 15px;
    line-height: 30px;
    font-weight: 500;
    font-family: "Inter", sans-serif !important;
}

a.menu-link {
    text-decoration: none !important;
    color: black;
}
.menu-text {
    color: White;
}
#main-logo {
    height: 60px;
    width: auto;
    transition: transform 0.3s ease;
}
#main-logo:hover {
    transform: scale(1.05);
}
#avatar-logo {
    width: 35px;
    height: auto;
    border-radius: 50%;
    border: 2px solid rgba(53, 85, 148, 0.1);
}
.nav-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}
.action-btn {
    background: rgba(53, 85, 148, 0.05);
    border: none;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    color: #355594;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
}
.action-btn:hover {
    background: rgba(53, 85, 148, 0.1);
    color: #1e3a6e;
    transform: translateY(-1px);
}
.pulse-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 8px;
    height: 8px;
    background: #ef4444;
    border-radius: 50%;
    border: 2px solid white;
}
.airport-badge {
    background: rgba(53, 85, 148, 0.08);
    color: #355594;
    padding: 6px 14px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.05em;
    border: 1px solid rgba(53, 85, 148, 0.1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.show_pass {
    position: absolute;
    left: 87%;
}
.sign-in-btn {
    background: transparent !important;
    border: 1px solid #355594;
    color: #355594 !important;
    border-radius: 50px;
    padding: 10px 25px;
    font-family: "Inter", sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
}
.sign-in-btn:hover {
    background: rgba(53, 85, 148, 0.05) !important;
}
.whats-new-btn {
  background: #355594 !important;
  border: none;
  color: white !important;
  border-radius: 50px;
  padding: 10px 25px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  transition: all 0.3s ease;
}
.whats-new-btn:hover {
  background: #2a4476 !important;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(53, 85, 148, 0.3);
}
.navbar, .wrap {
    background: transparent !important;
}
.form-control {
    background-color: #f3f6f900 !important;
}
.btn-color {
    background: #0000;
    font-size: 14px;
    font-weight: 400;
    line-height: 25px;
    text-align: center;
    color: #a6a6a6;
    border: 1px solid #a6a6a6;
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-radius: 30px;
    padding: 10px 40px;
}
.bottom-text {
    color: #4c4c4c;
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
    text-align: center;
}
.contact-support {
    color: #355594;
    font-size: 12px;
    font-weight: 500;
    line-height: 15px;
    text-align: center;
    text-decoration-line: underline;
    cursor: pointer;
}
/* Split Layout */
.modal-split-layout { display: flex; flex-direction: row; min-height: 500px; position: relative; }
.ultra-close-btn { position: absolute; top: 25px; right: 25px; width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.05); border: none; color: #5A6B8A; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer; z-index: 50; transition: all 0.3s ease; }
.ultra-close-btn:hover { background: #ef4444; color: white; transform: rotate(90deg); }
.modal-left-pane { flex: 0 0 40%; padding: 4rem 3.5rem; position: relative; overflow: hidden; color: white; display: flex; flex-direction: column; }
.login-pane { background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%); }
.otp-pane { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.pane-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; }
.pane-icon-wrapper { width: 80px; height: 80px; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 24px; display: flex; align-items: center; justify-content: center; color: white; border: 1px solid rgba(255,255,255,0.2); }
.pane-title { font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.5px; line-height: 1.1; }
.pane-subtitle { font-size: 1.1rem; line-height: 1.7; opacity: 0.85; }
.pane-feature { display: flex; align-items: center; margin-bottom: 1rem; font-size: 1rem; font-weight: 500; }
.pane-decoration { position: absolute; bottom: -150px; left: -150px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%); border-radius: 50%; z-index: 1; }
.modal-right-pane { flex: 0 0 60%; background: white; position: relative; }
.form-scroll-container { height: 100%; overflow-y: auto; padding: 4rem; }
.form-section-title { font-size: 1.8rem; font-weight: 700; color: #1e3a6e; letter-spacing: -0.5px; text-align: center; }
.floating-input-group { position: relative; width: 100%; }
.floating-input { width: 100%; background: #f8fafc; border: 1px solid transparent; border-bottom: 2px solid #e2e8f0; border-radius: 12px 12px 0 0; padding: 24px 16px 8px 16px; font-size: 1rem; color: #1e3a6e; font-weight: 500; transition: all 0.3s ease; font-family: 'Inter', sans-serif; }
.floating-input:focus { background: #f0f7ff; border-bottom-color: #355594; outline: none; }
.floating-label { position: absolute; left: 16px; top: 16px; font-size: 1rem; color: #64748b; pointer-events: none; transition: all 0.2s ease; font-weight: 500; }
.floating-input:focus ~ .floating-label, .floating-input:not(:placeholder-shown) ~ .floating-label { top: 6px; font-size: 0.75rem; color: #355594; font-weight: 600; }
.pass-toggle { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #355594; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; cursor: pointer; }
.forgot-pwd { font-size: 0.85rem; color: #355594; font-weight: 600; text-decoration: none; }
.ultra-submit-btn { background: #355594; border: none; border-radius: 999px; padding: 10px 10px 10px 22px; font-size: 1.1rem; display: inline-flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 10px 25px rgba(53, 85, 148, 0.25); cursor: pointer; width: auto; max-width: none; }
.ultra-submit-btn:hover { background: #28447a; transform: translateY(-2px); box-shadow: 0 15px 35px rgba(53, 85, 148, 0.35); }
.ultra-submit-btn span { color: white; font-weight: 500; margin-right: 14px; }
.ultra-submit-btn .btn-icon { background: white; color: #355594; border-radius: 50%; width: 32px !important; height: 32px !important; padding: 6px; margin-left: 0 !important; }
.form-note { font-size: 0.9rem; color: #64748b; }
.error-alert { background: rgba(239, 68, 68, 0.08); color: #dc2626; padding: 12px; border-radius: 8px; font-size: 0.9rem; text-align: center; border: 1px solid rgba(239, 68, 68, 0.15); font-weight: 500; }
@media (max-width: 991px) { .modal-split-layout { flex-direction: column; min-height: auto; } .modal-left-pane { flex: 0 0 auto; padding: 3rem 2rem; } .pane-title { font-size: 1.8rem; } .pane-icon-wrapper { width: 60px; height: 60px; margin-bottom: 1.5rem !important; } .modal-right-pane { flex: 0 0 auto; } .form-scroll-container { padding: 3rem 2rem; height: auto; max-height: 60vh; } .ultra-close-btn { top: 15px; right: 15px; background: rgba(255,255,255,0.2); color: white; } }

@media (max-width: 1250px) {
    .nav-menu {
        gap: 20px;
        padding: 8px 25px;
    }
}

@media (max-width: 1199px) {
    .navbar {
        padding: 20px 30px !important;
    }
    #main-logo {
        height: 52px;
    }
    .nav-menu {
        gap: 12px;
        padding: 6px 20px;
    }
    .nav-link-custom {
        font-size: 14px;
    }
    .sign-in-btn, .whats-new-btn {
        padding: 8px 20px;
        font-size: 13px;
    }
}

@media (max-width: 1080px) {
    .navbar {
        padding: 15px 20px !important;
    }
    #main-logo {
        height: 48px;
    }
    .nav-menu {
        gap: 8px;
        padding: 6px 15px;
    }
    .content-gap {
        gap: 12px;
    }
}

@media (max-width: 991px) {
    .navbar {
        padding: 20px 20px !important;
    }
    .nav-header-menu {
        width: 100%;
        margin-top: 20px;
        position: relative !important;
        left: 0 !important;
        top: 0 !important;
        transform: none !important;
    }
    .head-btn {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
        margin-top: 10px;
    }
    .nav-menu {
        flex-direction: column;
        border-radius: 20px;
        padding: 20px;
        background: #ffffff;
        backdrop-filter: none;
        width: 100%;
        gap: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .nav-header-right {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 20px;
        align-items: center;
    }
    .nav-link-custom {
        font-size: 16px !important;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .dropdown-menu {
        position: static !important;
        float: none;
        text-align: center;
        border: none;
        box-shadow: none;
        background: transparent;
        margin-top: 10px;
    }
}

@media (max-width: 767px) {
    .navbar-header-logo {
        max-width: 180px;
    }
    #main-logo {
        height: 45px;
    }
}
</style>

<style>
.navbar-collapse,
.collapse {
    width: 90%;
}
.nav-link:after {
    content: none !important;
}
.dropdown-menu {
    position: absolute !important;
    left: -85px !important;
    border-radius: 15px !important;
}
.navbar-light .navbar-toggler {
    color: #355594;
    border-color: #0000;
}
.ultra-premium-modal .modal-dialog {
    max-width: 1000px !important;
    margin: 1.75rem auto;
}

.ultra-premium-modal .modal-content {
    background: transparent !important;
    border: none !important;
    border-radius: 32px !important;
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.25) !important;
    font-family: 'Inter', sans-serif !important;
    overflow: hidden;
    animation: fadeInUp 0.4s ease;
}

.ultra-premium-modal .modal-body {
    padding: 0 !important;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>

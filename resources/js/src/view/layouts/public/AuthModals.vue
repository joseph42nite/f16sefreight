<template>
    <div>
        <!-- Sign In & Onboarding Modal box -->
        <b-modal id="login-modal" v-model="internal_show_login" :hide-header="true" :hide-footer="true" centered size="xl" modal-class="ultra-premium-modal">
            <div class="modal-split-layout">
                <button class="ultra-close-btn" @click="internal_show_login = false">
                    <b-icon icon="x"></b-icon>
                </button>
                <div class="modal-left-pane" :class="authMode === 'login' ? 'login-pane' : 'onboard-pane'">
                    <div class="pane-content">
                        <div class="pane-icon-wrapper mb-8">
                            <b-icon :icon="authMode === 'login' ? 'shield-lock' : 'building'" font-scale="2.5"></b-icon>
                        </div>
                        <h2 class="pane-title">{{ authMode === 'login' ? 'Welcome Back' : 'Get Started' }}</h2>
                        <p class="pane-subtitle">
                            {{ authMode === 'login' ? 'Securely access your F16s dashboard to manage your freight operations, AWBs, and EDI connectivity.' : 'Create your company profile and register your admin credentials to start managing global shipments.' }}
                        </p>
                        
                        <div class="pane-footer mt-auto">
                            <div class="pane-feature">
                                <b-icon icon="lightning" class="mr-3"></b-icon>
                                <span>Lightning Fast Processing</span>
                            </div>
                            <div class="pane-feature">
                                <b-icon icon="globe2" class="mr-3"></b-icon>
                                <span>Global Airline Network</span>
                            </div>
                        </div>
                    </div>
                    <div class="pane-decoration"></div>
                </div>
                
                <div class="modal-right-pane">
                    <div class="form-scroll-container">
                        <!-- LOGIN FORM -->
                        <form v-if="authMode === 'login'" @submit.prevent="login" class="ultra-form">
                            <h3 class="form-section-title mb-6">Sign In</h3>
                            
                            <!-- Error Messages -->
                            <div v-if="errors && typeof errors === 'string'" class="error-alert mb-5">
                                <span v-if="errors === 'Unauthorized'">Invalid email or password</span>
                                <span v-else-if="errors === 'Blocked'">Account blocked. Contact admin.</span>
                                <span v-else-if="errors === 'Daily_Limit'">Daily login limit exceeded.</span>
                                <span v-else-if="errors === 'Expired'">Plan expired. Please renew.</span>
                                <span v-else>{{ errors }}</span>
                            </div>

                            <!-- Quick Demo Logins -->
                            <div class="demo-logins-section mb-6 text-center">
                                <label class="small text-muted font-weight-bold d-block mb-3">QUICK DEMO ACCESSIBILITY PILLS</label>
                                
                                <!-- Core Section -->
                                <div class="demo-group mb-3 d-flex align-items-center justify-content-center" style="gap: 8px;">
                                    <span class="badge badge-secondary px-2 py-1" style="font-size: 10px; width: 68px; display: inline-block;">Core</span>
                                    <b-button size="sm" variant="outline-primary" class="demo-pill py-0 px-3 font-weight-bold" style="font-size: 11px; border-radius: 12px; height: 24px;" @click="autoFillDemo('core@f16s.com')">
                                        Core Operator
                                    </b-button>
                                </div>
                                
                                <!-- Tactical Section -->
                                <div class="demo-group mb-3 d-flex align-items-center justify-content-center" style="gap: 8px;">
                                    <span class="badge badge-success px-2 py-1" style="font-size: 10px; width: 68px; display: inline-block;">Tactical</span>
                                    <div class="d-inline-flex flex-wrap" style="gap: 6px;">
                                        <b-button size="sm" variant="outline-success" class="demo-pill py-0 px-2 font-weight-bold" style="font-size: 11px; border-radius: 12px; height: 24px;" @click="autoFillDemo('tactical.ops@f16s.com')">Ops</b-button>
                                        <b-button size="sm" variant="outline-success" class="demo-pill py-0 px-2 font-weight-bold" style="font-size: 11px; border-radius: 12px; height: 24px;" @click="autoFillDemo('tactical.pricing@f16s.com')">Pricing</b-button>
                                        <b-button size="sm" variant="outline-success" class="demo-pill py-0 px-2 font-weight-bold" style="font-size: 11px; border-radius: 12px; height: 24px;" @click="autoFillDemo('tactical.sales@f16s.com')">Sales</b-button>
                                        <b-button size="sm" variant="outline-success" class="demo-pill py-0 px-2 font-weight-bold" style="font-size: 11px; border-radius: 12px; height: 24px;" @click="autoFillDemo('tactical.boss@f16s.com')">Boss</b-button>
                                    </div>
                                </div>
                                
                                <!-- Command Section -->
                                <div class="demo-group d-flex align-items-center justify-content-center" style="gap: 8px;">
                                    <span class="badge badge-info px-2 py-1 text-white" style="font-size: 10px; width: 68px; display: inline-block;">Command</span>
                                    <div class="d-inline-flex flex-wrap" style="gap: 6px;">
                                        <b-button size="sm" variant="outline-info" class="demo-pill py-0 px-2 font-weight-bold" style="font-size: 11px; border-radius: 12px; height: 24px;" @click="autoFillDemo('command.ops@f16s.com')">Ops</b-button>
                                        <b-button size="sm" variant="outline-info" class="demo-pill py-0 px-2 font-weight-bold" style="font-size: 11px; border-radius: 12px; height: 24px;" @click="autoFillDemo('command.pricing@f16s.com')">Pricing</b-button>
                                        <b-button size="sm" variant="outline-info" class="demo-pill py-0 px-2 font-weight-bold" style="font-size: 11px; border-radius: 12px; height: 24px;" @click="autoFillDemo('command.sales@f16s.com')">Sales</b-button>
                                        <b-button size="sm" variant="outline-info" class="demo-pill py-0 px-2 font-weight-bold" style="font-size: 11px; border-radius: 12px; height: 24px;" @click="autoFillDemo('command.accounts@f16s.com')">Accounts</b-button>
                                        <b-button size="sm" variant="outline-info" class="demo-pill py-0 px-2 font-weight-bold" style="font-size: 11px; border-radius: 12px; height: 24px;" @click="autoFillDemo('command.boss@f16s.com')">Boss</b-button>
                                    </div>
                                </div>
                            </div>

                            <b-row>
                                <b-col md="12" class="mb-6">
                                    <div class="floating-input-group">
                                        <input type="text" class="floating-input" v-model="user_form.email" placeholder=" " required />
                                        <label class="floating-label">User ID / Email</label>
                                    </div>
                                </b-col>
                                <b-col md="12" class="mb-4">
                                    <div class="floating-input-group">
                                        <input :type="showPass ? 'password' : 'text'" class="floating-input pr-5" v-model="user_form.password" autocomplete="off" placeholder=" " required />
                                        <label class="floating-label">Password</label>
                                        <button type="button" class="pass-toggle" @click="showPass = !showPass">
                                            {{ showPass ? "Show" : "Hide" }}
                                        </button>
                                    </div>
                                    <div class="text-right mt-2 d-flex justify-content-between" style="width: 100%;">
                                        <a href="#" @click.prevent="authMode = 'signup'" class="forgot-pwd">Create an Account</a>
                                        <router-link to="/contact-us" class="forgot-pwd" @click.native="internal_show_login = false">Forgot Password?</router-link>
                                    </div>
                                </b-col>
                            </b-row>
                            
                            <div class="form-actions mt-6 d-flex flex-column align-items-center w-100">
                                <button type="submit" class="ultra-submit-btn" :disabled="loading">
                                    <span v-if="!loading">Sign In</span>
                                    <b-spinner v-else small label="Loading..."></b-spinner>
                                    <b-icon v-if="!loading" icon="arrow-right" class="btn-icon"></b-icon>
                                </button>
                                <p class="form-note mt-4">
                                    Need help? <router-link to="/contact-us?modal=query" class="text-primary font-weight-bold" @click.native="internal_show_login = false">Contact Support</router-link>
                                </p>
                            </div>
                        </form>

                        <!-- REGISTRATION/ONBOARDING FORM -->
                        <form v-else @submit.prevent="onboard" class="ultra-form">
                            <h3 class="form-section-title mb-6">Register Company</h3>
                            
                            <!-- Error Messages -->
                            <div v-if="signupErrors" class="error-alert mb-5">
                                <span>{{ signupErrors }}</span>
                            </div>

                            <b-row>
                                <b-col md="6" class="mb-4">
                                    <div class="floating-input-group">
                                        <input type="text" class="floating-input" v-model="signup_form.company_name" placeholder=" " required />
                                        <label class="floating-label">Company Name</label>
                                    </div>
                                </b-col>
                                <b-col md="6" class="mb-4">
                                    <b-form-group label="Plan Tier" label-class="small text-muted font-weight-bold mb-1">
                                        <b-form-select v-model="signup_form.tier" size="sm" style="height: 42px; border-radius: 8px;">
                                            <option value="viper_core">Viper Core (Free)</option>
                                            <option value="viper_tactical">Viper Tactical</option>
                                            <option value="viper_command">Viper Command</option>
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col md="6" class="mb-4">
                                    <div class="floating-input-group">
                                        <input type="text" class="floating-input" v-model="signup_form.name" placeholder=" " required />
                                        <label class="floating-label">Admin Full Name</label>
                                    </div>
                                </b-col>
                                <b-col md="6" class="mb-4">
                                    <div class="floating-input-group">
                                        <input type="email" class="floating-input" v-model="signup_form.email" placeholder=" " required />
                                        <label class="floating-label">Admin Email Address</label>
                                    </div>
                                </b-col>
                                <b-col md="6" class="mb-4">
                                    <div class="floating-input-group">
                                        <input type="password" class="floating-input" v-model="signup_form.password" placeholder=" " required />
                                        <label class="floating-label">Password</label>
                                    </div>
                                </b-col>
                                <b-col md="6" class="mb-4">
                                    <div class="floating-input-group">
                                        <input type="text" class="floating-input" v-model="signup_form.pima_address" placeholder=" " required />
                                        <label class="floating-label">Pima Routing Address</label>
                                    </div>
                                </b-col>
                                <b-col md="6" class="mb-4">
                                    <div class="floating-input-group">
                                        <input type="text" class="floating-input" v-model="signup_form.origin_airport_code" placeholder=" " required />
                                        <label class="floating-label">Origin Airport Code (e.g. DXB)</label>
                                    </div>
                                </b-col>
                                <b-col md="6" class="mb-4">
                                    <b-form-group label="Designated Origin Port" label-class="small text-muted font-weight-bold mb-1">
                                        <b-form-select v-model="signup_form.default_port_id" size="sm" style="height: 42px; border-radius: 8px;" required>
                                            <option :value="null">-- Select Origin Port --</option>
                                            <option v-for="port in ports" :key="port.id" :value="port.id">
                                                {{ port.locode }} - {{ port.port_name }}
                                            </option>
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            
                            <div class="form-actions mt-4 d-flex flex-column align-items-center w-100">
                                <button type="submit" class="ultra-submit-btn" :disabled="signupLoading">
                                    <span v-if="!signupLoading">Onboard Company</span>
                                    <b-spinner v-else small label="Processing..."></b-spinner>
                                    <b-icon v-if="!signupLoading" icon="arrow-right" class="btn-icon"></b-icon>
                                </button>
                                <p class="form-note mt-4">
                                    Already have an account? <a href="#" @click.prevent="authMode = 'login'" class="text-primary font-weight-bold">Sign In</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </b-modal>

        <!-- Otp verification Modal box -->
        <b-modal id="otp-modal" v-model="internal_show_otp" :hide-header="true" :hide-footer="true" centered size="xl" modal-class="ultra-premium-modal">
            <div class="modal-split-layout">
                <button class="ultra-close-btn" @click="internal_show_otp = false">
                    <b-icon icon="x"></b-icon>
                </button>
                <div class="modal-left-pane otp-pane">
                    <div class="pane-content">
                        <div class="pane-icon-wrapper mb-8">
                            <b-icon icon="shield-check" font-scale="2.5"></b-icon>
                        </div>
                        <h2 class="pane-title">Verify Identity</h2>
                        <p class="pane-subtitle">For your security, we've sent a one-time verification code to your registered email address.</p>
                        
                        <div class="pane-footer mt-auto">
                            <div class="pane-feature">
                                <b-icon icon="lock" class="mr-3"></b-icon>
                                <span>Bank-grade Security</span>
                            </div>
                        </div>
                    </div>
                    <div class="pane-decoration"></div>
                </div>
                
                <div class="modal-right-pane">
                    <div class="form-scroll-container">
                        <form @submit.prevent="login" class="ultra-form">
                            <h3 class="form-section-title mb-6">Enter OTP</h3>
                            <b-row>
                                <b-col md="12" class="mb-6">
                                    <div class="floating-input-group">
                                        <input type="text" class="floating-input" v-model="user_form.otp" placeholder=" " required />
                                        <label class="floating-label">Verification Code (E.g: 801801)</label>
                                    </div>
                                </b-col>
                            </b-row>
                            
                            <div class="form-actions mt-6 d-flex flex-column align-items-center w-100">
                                <button type="submit" class="ultra-submit-btn" :disabled="loading">
                                    <span v-if="!loading">Verify & Proceed</span>
                                    <b-spinner v-else small label="Verifying..."></b-spinner>
                                    <b-icon v-if="!loading" icon="arrow-right" class="btn-icon"></b-icon>
                                </button>
                                <p class="form-note mt-4">
                                    Problem receiving OTP? <a href="#" class="text-primary font-weight-bold">Resend Email</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { LOGIN } from "@/core/services/store/auth.module";
import ApiService from "@/core/services/api.service";

export default {
    name: "AuthModals",
    props: {
        showLogin: { type: Boolean, default: false },
        showOtp: { type: Boolean, default: false }
    },
    data() {
        return {
            authMode: "login", // "login" or "signup"
            ports: [],
            signupLoading: false,
            signupErrors: null,
            signup_form: {
                company_name: "",
                tier: "viper_command",
                name: "",
                email: "",
                password: "",
                pima_address: "",
                origin_airport_code: "",
                default_port_id: null
            },
            user_form: {
                email: "",
                password: "",
                otp: "",
            },
            showPass: true,
            loading: false,
        };
    },
    computed: {
        ...mapState({
            errors: (state) => state.auth.errors,
        }),
        internal_show_login: {
            get() { return this.showLogin; },
            set(val) { this.$emit('update:showLogin', val); }
        },
        internal_show_otp: {
            get() { return this.showOtp; },
            set(val) { this.$emit('update:showOtp', val); }
        }
    },
    mounted() {
        this.fetchPorts();
    },
    methods: {
        autoFillDemo(email) {
            this.user_form.email = email;
            this.user_form.password = "password";
            this.login();
        },
        fetchPorts() {
            ApiService.get("/ports")
                .then(res => {
                    this.ports = res.data;
                })
                .catch(err => console.error("Failed to load ports:", err));
        },
        login() {
            this.loading = true;
            const { email, password, otp } = this.user_form;

            this.$store
                .dispatch(LOGIN, { email, password, otp })
                .then(() => {
                    this.internal_show_login = false;
                    this.internal_show_otp = false;
                })
                .catch(() => {
                    // Error is handled via mapState errors
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onboard() {
            if (!this.signup_form.default_port_id) {
                this.signupErrors = "Please select a designated origin port.";
                return;
            }
            this.signupLoading = true;
            this.signupErrors = null;
            ApiService.post("/register-onboarding", this.signup_form)
                .then(res => {
                    this.$bvToast.toast("Company registered and admin user created successfully!", {
                        title: "Success",
                        variant: "success",
                        solid: true
                    });
                    
                    // Auto-login after successful onboarding
                    const { email, password } = this.signup_form;
                    this.user_form.email = email;
                    this.user_form.password = password;
                    this.authMode = 'login';
                    this.login();
                })
                .catch(err => {
                    console.error("Onboarding failed:", err);
                    const errorsObj = err.response?.data?.errors;
                    if (errorsObj) {
                        this.signupErrors = Object.values(errorsObj).flat().join(" ");
                    } else {
                        this.signupErrors = err.response?.data?.error || "Registration failed. Check your inputs.";
                    }
                })
                .finally(() => {
                    this.signupLoading = false;
                });
        }
    }
};
</script>

<style scoped>
/* Modal specific local styles */
.modal-split-layout { display: flex; flex-direction: row; min-height: 500px; position: relative; }
.ultra-close-btn { position: absolute; top: 25px; right: 25px; width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.05); border: none; color: #5A6B8A; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer; z-index: 50; transition: all 0.3s ease; }
.ultra-close-btn:hover { background: #ef4444; color: white; transform: rotate(90deg); }
.modal-left-pane { flex: 0 0 40%; padding: 4rem 3.5rem; position: relative; overflow: hidden; color: white; display: flex; flex-direction: column; transition: all 0.3s ease; }
.login-pane { background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%); }
.onboard-pane { background: linear-gradient(135deg, #1e3a6e 0%, #0d9488 100%); }
.otp-pane { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.pane-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; }
.pane-icon-wrapper { width: 80px; height: 80px; background: rgba(255,255,255,0.25); border-radius: 24px; display: flex; align-items: center; justify-content: center; color: white; border: 1px solid rgba(255,255,255,0.2); }
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
.ultra-submit-btn { background: #355594; border: none; border-radius: 999px; padding: 10px 10px 10px 22px; font-size: 1.1rem; display: inline-flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 10px 25px rgba(53, 85, 148, 0.25); cursor: pointer; width: auto; }
.ultra-submit-btn:hover { background: #28447a; transform: translateY(-2px); box-shadow: 0 15px 35px rgba(53, 85, 148, 0.35); }
.ultra-submit-btn span { color: white; font-weight: 500; margin-right: 14px; }
.ultra-submit-btn .btn-icon { background: white; color: #355594; border-radius: 50%; width: 32px !important; height: 32px !important; padding: 6px; margin-left: 0 !important; }
.form-note { font-size: 0.9rem; color: #64748b; }
.error-alert { background: rgba(239, 68, 68, 0.08); color: #dc2626; padding: 12px; border-radius: 8px; font-size: 0.9rem; text-align: center; border: 1px solid rgba(239, 68, 68, 0.15); font-weight: 500; }

@media (max-width: 991px) {
    .modal-split-layout { flex-direction: column; min-height: auto; }
    .modal-left-pane { flex: 0 0 auto; padding: 3rem 2rem; }
    .pane-title { font-size: 1.8rem; }
    .modal-right-pane { flex: 0 0 auto; }
    .form-scroll-container { padding: 3rem 2rem; height: auto; max-height: 60vh; }
}
</style>

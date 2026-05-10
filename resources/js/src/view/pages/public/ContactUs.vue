<template>
  <b-container fluid class="main-wrapper p-0">
    <!-- DECORATIVE ELLIPSES -->
    <div class="decorative-ellipses d-none d-lg-block">
        <div class="ellipse ellipse-tl"></div>
        <div class="ellipse ellipse-tr"></div>
        <div class="ellipse ellipse-br"></div>
    </div>


    <b-container class="content-container pb-30">
      
      <!-- HERO SECTION -->
      <section class="contact-hero-section mt-12 mt-lg-20 mb-20 text-center">
        <span class="section-eyebrow">Get in Touch</span>
        <h1 class="section-title mb-6">How can we help you today?</h1>
        <p class="section-subtitle mb-10 mx-auto" style="max-width: 700px;">
            Whether you need technical support, a customized pricing quote, or just want to share feedback, our team is standing by to assist you. Select an option below to get started.
        </p>
      </section>

      <!-- CONTACT OPTIONS GRID -->
      <section class="contact-options-section mb-30">
        <b-row class="justify-content-center">
            <!-- Query Card -->
            <b-col lg="4" md="6" class="mb-8">
                <div class="feature-card-wrapper" v-b-modal.show-query-modal role="button" tabindex="0">
                    <div class="feature-card-glow"></div>
                    <b-card class="feature-card h-100 border-0">
                        <div class="feature-icon-container mb-8 mx-auto">
                            <div class="icon-circle"></div>
                            <b-icon icon="chat-square-dots" font-scale="2" class="feature-icon-svg" aria-hidden="true"></b-icon>
                        </div>
                        <h3 class="feature-title">Have a Dispute or Query?</h3>
                        <p class="feature-desc">Facing any issues or have a query regarding our services? We’re committed to resolving them quickly. A Ticket Number will be generated for tracking.</p>
                        <div class="feature-footer mt-auto pt-6">
                            <div class="feature-link">
                                <span>Submit Query</span>
                                <b-icon icon="arrow-right" class="btn-icon" aria-hidden="true"></b-icon>
                            </div>
                        </div>
                    </b-card>
                </div>
            </b-col>

            <!-- Quote Card -->
            <b-col lg="4" md="6" class="mb-8">
                <div class="feature-card-wrapper" v-b-modal.show-quote-modal role="button" tabindex="0">
                    <div class="feature-card-glow"></div>
                    <b-card class="feature-card h-100 border-0">
                        <div class="feature-icon-container mb-8 mx-auto">
                            <div class="icon-circle"></div>
                            <b-icon icon="calculator" font-scale="2" class="feature-icon-svg" aria-hidden="true"></b-icon>
                        </div>
                        <h3 class="feature-title">Get a Customized Quote</h3>
                        <p class="feature-desc">Looking for the best pricing option for your business? Fill in the details, and we’ll provide a personalized quote tailored exactly to your operational needs.</p>
                        <div class="feature-footer mt-auto pt-6">
                            <div class="feature-link">
                                <span>Request Quote</span>
                                <b-icon icon="arrow-right" class="btn-icon" aria-hidden="true"></b-icon>
                            </div>
                        </div>
                    </b-card>
                </div>
            </b-col>

            <!-- Feedback Card -->
            <b-col lg="4" md="6" class="mb-8">
                <div class="feature-card-wrapper" v-b-modal.show-feedback-modal role="button" tabindex="0">
                    <div class="feature-card-glow"></div>
                    <b-card class="feature-card h-100 border-0">
                        <div class="feature-icon-container mb-8 mx-auto">
                            <div class="icon-circle"></div>
                            <b-icon icon="briefcase" font-scale="2" class="feature-icon-svg" aria-hidden="true"></b-icon>
                        </div>
                        <h3 class="feature-title">Feedback & Opportunities</h3>
                        <p class="feature-desc">Share your feedback with us or let us know if you’re interested in joining our growing team. We highly appreciate your input and talent!</p>
                        <div class="feature-footer mt-auto pt-6">
                            <div class="feature-link">
                                <span>Send Feedback</span>
                                <b-icon icon="arrow-right" class="btn-icon" aria-hidden="true"></b-icon>
                            </div>
                        </div>
                    </b-card>
                </div>
            </b-col>
        </b-row>
      </section>

    </b-container>

    <!-- QUERY MODAL (ULTRA PREMIUM SPLIT) -->
    <b-modal id="show-query-modal" hide-header hide-footer centered size="xl" modal-class="ultra-premium-modal">
        <div class="modal-split-layout">
            <button class="ultra-close-btn" @click="$bvModal.hide('show-query-modal')">
                <b-icon icon="x"></b-icon>
            </button>
            <div class="modal-left-pane query-pane">
                <div class="pane-content">
                    <div class="pane-icon-wrapper mb-8">
                        <b-icon icon="chat-left-dots" font-scale="2.5"></b-icon>
                    </div>
                    <h2 class="pane-title">Submit a Query</h2>
                    <p class="pane-subtitle">We’re here to help. Fill out the details and our support team will resolve your issue quickly.</p>
                    
                    <div class="pane-footer mt-auto">
                        <div class="pane-feature">
                            <b-icon icon="clock-history" class="me-3"></b-icon>
                            <span>24/7 Dedicated Support</span>
                        </div>
                        <div class="pane-feature">
                            <b-icon icon="shield-check" class="me-3"></b-icon>
                            <span>Priority Resolution</span>
                        </div>
                    </div>
                </div>
                <!-- Decorative element -->
                <div class="pane-decoration"></div>
            </div>
            
            <div class="modal-right-pane">
                <div class="form-scroll-container">
                    <form class="ultra-form">
                        <h3 class="form-section-title mb-6">Query Details</h3>
                        <b-row>
                            <b-col md="6" class="mb-5">
                                <div class="floating-input-group">
                                    <input type="text" class="floating-input" placeholder=" " required />
                                    <label class="floating-label">Full Name</label>
                                </div>
                            </b-col>
                            <b-col md="6" class="mb-5">
                                <div class="floating-input-group">
                                    <input type="email" class="floating-input" placeholder=" " required />
                                    <label class="floating-label">Email Address</label>
                                </div>
                            </b-col>
                            <b-col md="6" class="mb-5">
                                <div class="floating-input-group">
                                    <input type="text" class="floating-input" placeholder=" " required />
                                    <label class="floating-label">Company Name</label>
                                </div>
                            </b-col>
                            <b-col md="6" class="mb-5">
                                <div class="floating-input-group">
                                    <input type="text" class="floating-input" placeholder=" " />
                                    <label class="floating-label">User ID (Optional)</label>
                                </div>
                            </b-col>
                            <b-col md="12" class="mb-5">
                                <div class="floating-input-group">
                                    <input type="text" class="floating-input" placeholder=" " />
                                    <label class="floating-label">Ticket Number (if existing)</label>
                                </div>
                            </b-col>
                            <b-col md="12" class="mb-8">
                                <div class="floating-input-group">
                                    <textarea class="floating-input" rows="4" placeholder=" " required></textarea>
                                    <label class="floating-label">Detailed Description</label>
                                </div>
                            </b-col>
                        </b-row>
                        
                        <div class="form-actions mt-4">
                            <button type="button" class="ultra-submit-btn">
                                <span>Submit Request</span>
                                <b-icon icon="arrow-right" class="btn-icon"></b-icon>
                            </button>
                            <p class="form-note mt-4">You'll receive a confirmation email with your Ticket Number.</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </b-modal>

    <!-- QUOTE MODAL (ULTRA PREMIUM SPLIT) -->
    <b-modal id="show-quote-modal" hide-header hide-footer centered size="xl" modal-class="ultra-premium-modal">
        <div class="modal-split-layout">
            <button class="ultra-close-btn" @click="$bvModal.hide('show-quote-modal')">
                <b-icon icon="x"></b-icon>
            </button>
            <div class="modal-left-pane quote-pane">
                <div class="pane-content">
                    <div class="pane-icon-wrapper mb-8">
                        <b-icon icon="calculator" font-scale="2.5"></b-icon>
                    </div>
                    <h2 class="pane-title">Request a Custom Quote</h2>
                    <p class="pane-subtitle">Looking for the perfect pricing plan? Tell us about your operations and we'll tailor a quote specifically for your business.</p>
                    
                    <div class="pane-footer mt-auto">
                        <div class="pane-feature">
                            <b-icon icon="graph-up-arrow" class="me-3"></b-icon>
                            <span>Scalable Solutions</span>
                        </div>
                        <div class="pane-feature">
                            <b-icon icon="tags" class="me-3"></b-icon>
                            <span>Competitive Pricing</span>
                        </div>
                    </div>
                </div>
                <!-- Decorative element -->
                <div class="pane-decoration"></div>
            </div>
            
            <div class="modal-right-pane">
                <div class="form-scroll-container">
                    <form class="ultra-form" @submit.prevent="handleSubmit">
                        <h3 class="form-section-title mb-6">Business Profile</h3>
                        <b-row>
                            <b-col md="6" class="mb-5">
                                <div class="floating-input-group">
                                    <input type="text" class="floating-input" placeholder=" " required />
                                    <label class="floating-label">Full Name</label>
                                </div>
                            </b-col>
                            <b-col md="6" class="mb-5">
                                <div class="floating-input-group">
                                    <input type="email" class="floating-input" placeholder=" " required />
                                    <label class="floating-label">Work Email</label>
                                </div>
                            </b-col>
                            <b-col md="6" class="mb-5">
                                <div class="floating-input-group">
                                    <input type="text" class="floating-input" placeholder=" " required />
                                    <label class="floating-label">Phone Number</label>
                                </div>
                            </b-col>
                            <b-col md="6" class="mb-5">
                                <div class="floating-input-group">
                                    <input type="text" class="floating-input" placeholder=" " required />
                                    <label class="floating-label">Designation</label>
                                </div>
                            </b-col>
                            <b-col md="12" class="mb-5">
                                <div class="floating-input-group">
                                    <input type="text" class="floating-input" placeholder=" " required />
                                    <label class="floating-label">Company Name</label>
                                </div>
                            </b-col>
                            <b-col md="6" class="mb-5">
                                <div class="floating-input-group">
                                    <input type="number" class="floating-input" placeholder=" " required />
                                    <label class="floating-label">Number of Employees</label>
                                </div>
                            </b-col>
                            <b-col md="6" class="mb-8">
                                <div class="floating-input-group">
                                    <select class="floating-input floating-select" v-model="selectedProductTypeOptions" required>
                                        <option value="" disabled selected></option>
                                        <option v-for="(opt, idx) in productTypeOptions" :key="idx" :value="opt.value">{{ opt.text }}</option>
                                    </select>
                                    <label class="floating-label">Product of Interest</label>
                                    <b-icon icon="chevron-down" class="select-icon"></b-icon>
                                </div>
                            </b-col>
                        </b-row>
                        
                        <div class="form-actions mt-4">
                            <button type="submit" class="ultra-submit-btn">
                                <span>Get Your Quote</span>
                                <b-icon icon="arrow-right" class="btn-icon"></b-icon>
                            </button>
                            <p class="form-note mt-4">An expert will contact you within 1 business day.</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </b-modal>

    <!-- FEEDBACK MODAL (ULTRA PREMIUM SPLIT) -->
    <b-modal id="show-feedback-modal" hide-header hide-footer centered size="xl" modal-class="ultra-premium-modal">
        <div class="modal-split-layout">
            <button class="ultra-close-btn" @click="$bvModal.hide('show-feedback-modal')">
                <b-icon icon="x"></b-icon>
            </button>
            <div class="modal-left-pane feedback-pane">
                <div class="pane-content">
                    <div class="pane-icon-wrapper mb-8">
                        <b-icon icon="star" font-scale="2.5"></b-icon>
                    </div>
                    <h2 class="pane-title">We Value Your Input</h2>
                    <p class="pane-subtitle">Whether you're sharing feedback to help us improve or looking for exciting job opportunities, we want to hear from you.</p>
                    
                    <div class="pane-footer mt-auto">
                        <div class="pane-feature">
                            <b-icon icon="heart" class="me-3"></b-icon>
                            <span>Community Driven</span>
                        </div>
                        <div class="pane-feature">
                            <b-icon icon="briefcase" class="me-3"></b-icon>
                            <span>Growing Fast</span>
                        </div>
                    </div>
                </div>
                <!-- Decorative element -->
                <div class="pane-decoration"></div>
            </div>
            
            <div class="modal-right-pane">
                <div class="form-scroll-container">
                    <form class="ultra-form">
                        <h3 class="form-section-title mb-6">Drop us a line</h3>
                        <b-row>
                            <b-col md="6" class="mb-5">
                                <div class="floating-input-group">
                                    <input type="text" class="floating-input" placeholder=" " required />
                                    <label class="floating-label">Full Name</label>
                                </div>
                            </b-col>
                            <b-col md="6" class="mb-5">
                                <div class="floating-input-group">
                                    <input type="email" class="floating-input" placeholder=" " required />
                                    <label class="floating-label">Email Address</label>
                                </div>
                            </b-col>
                            <b-col md="6" class="mb-5">
                                <div class="floating-input-group">
                                    <input type="text" class="floating-input" placeholder=" " />
                                    <label class="floating-label">Company (Optional)</label>
                                </div>
                            </b-col>
                            <b-col md="6" class="mb-5">
                                <div class="floating-input-group">
                                    <select class="floating-input floating-select" v-model="selectedQueryTypeOptions" required>
                                        <option value="" disabled selected></option>
                                        <option value="Feedback">Platform Feedback</option>
                                        <option value="Job enquiry">Job Enquiry</option>
                                        <option value="Partnership">Partnership</option>
                                    </select>
                                    <label class="floating-label">Topic</label>
                                    <b-icon icon="chevron-down" class="select-icon"></b-icon>
                                </div>
                            </b-col>
                            <b-col md="12" class="mb-8">
                                <div class="floating-input-group">
                                    <textarea class="floating-input" rows="4" placeholder=" " required></textarea>
                                    <label class="floating-label">Your Message</label>
                                </div>
                            </b-col>
                        </b-row>
                        
                        <div class="form-actions mt-4">
                            <button type="button" class="ultra-submit-btn">
                                <span>Send Message</span>
                                <b-icon icon="arrow-right" class="btn-icon"></b-icon>
                            </button>
                            <p class="form-note mt-4">Thanks for taking the time to connect with us.</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </b-modal>

  </b-container>
</template>

<script>

export default {
    name: "ContactUs",
    metaInfo: {
        title: "Contact F16s | Support, Quotes & Partnerships",
        meta: [
            { name: 'description', content: 'Get in touch with the F16s expert team for technical support, customized pricing quotes, or partnership opportunities. We are here to help your logistics business grow.' },
            { property: 'og:title', content: 'Contact F16s | Support, Quotes & Partnerships' },
            { property: 'og:description', content: 'Get in touch with the F16s expert team for technical support, customized pricing quotes, or partnership opportunities. We are here to help your logistics business grow.' }
        ]
    },
    components: {
    },
    data() {
        return {
            productTypeOptions: [
                { value: 'Focus Air - Basic Plan', text: 'Focus Air - Basic Plan' },
                { value: 'Focus Air - Pro Plan', text: 'Focus Air - Pro Plan' }
            ],
            selectedProductTypeOptions: "",
            selectedQueryTypeOptions: ""
        };
    },
    methods: {
        handleSubmit() {
            // Handle quote submission logic
            console.log("Form submitted");
        }
    },
    mounted() {
        if (this.$route.query.modal === 'quote') {
            this.$bvModal.show('show-quote-modal');
        }
    }
};
</script>



<style>
/* ULTRA PREMIUM MODAL REDESIGN */
.ultra-premium-modal .modal-dialog {
    max-width: 1100px !important;
    margin: 1.75rem auto;
}

.ultra-premium-modal .modal-content {
    background: transparent !important;
    border: none !important;
    border-radius: 32px !important;
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.25) !important;
    font-family: 'Inter', sans-serif !important;
    overflow: hidden;
}

.ultra-premium-modal .modal-body {
    padding: 0 !important;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
}

/* Split Layout */
.modal-split-layout {
    display: flex;
    flex-direction: row;
    min-height: 700px;
    position: relative;
}

.ultra-close-btn {
    position: absolute;
    top: 25px;
    right: 25px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(0,0,0,0.05);
    border: none;
    color: #5A6B8A;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 50;
    transition: all 0.3s ease;
}
.ultra-close-btn:hover {
    background: #ef4444;
    color: white;
    transform: rotate(90deg);
}

/* Left Pane Styles */
.modal-left-pane {
    flex: 0 0 40%;
    padding: 4rem 3.5rem;
    position: relative;
    overflow: hidden;
    color: white;
    display: flex;
    flex-direction: column;
}

/* Different gradients for different modals */
.query-pane {
    background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%);
}
.quote-pane {
    background: linear-gradient(135deg, #2a4476 0%, #4a72c9 100%);
}
.feedback-pane {
    background: linear-gradient(135deg, #1c3361 0%, #3a5c9f 100%);
}

.pane-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.pane-icon-wrapper {
    width: 80px;
    height: 80px;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border: 1px solid rgba(255,255,255,0.2);
}

.pane-title {
    font-size: 2.25rem;
    font-weight: 800;
    margin-bottom: 1rem;
    letter-spacing: -0.5px;
    line-height: 1.1;
}

.pane-subtitle {
    font-size: 1.1rem;
    line-height: 1.7;
    opacity: 0.85;
}

.pane-feature {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 1rem;
    font-weight: 500;
}
.pane-feature:last-child {
    margin-bottom: 0;
}

.pane-decoration {
    position: absolute;
    bottom: -150px;
    left: -150px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
    border-radius: 50%;
    z-index: 1;
}

/* Right Pane Styles */
.modal-right-pane {
    flex: 0 0 60%;
    background: white;
    position: relative;
}

.form-scroll-container {
    height: 100%;
    overflow-y: auto;
    padding: 4.5rem 4rem;
}

/* Custom Scrollbar for form */
.form-scroll-container::-webkit-scrollbar {
    width: 6px;
}
.form-scroll-container::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.02);
}
.form-scroll-container::-webkit-scrollbar-thumb {
    background: rgba(53, 85, 148, 0.2);
    border-radius: 10px;
}

.form-section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e3a6e;
    letter-spacing: -0.5px;
}

/* Floating Input Group */
.floating-input-group {
    position: relative;
    width: 100%;
}

.floating-input {
    width: 100%;
    background: #f8fafc;
    border: 1px solid transparent;
    border-bottom: 2px solid #e2e8f0;
    border-radius: 12px 12px 0 0;
    padding: 24px 16px 8px 16px;
    font-size: 1rem;
    color: #1e3a6e;
    font-weight: 500;
    transition: all 0.3s ease;
    font-family: 'Inter', sans-serif;
}

.floating-input:focus {
    background: #f0f7ff;
    border-bottom-color: #355594;
    outline: none;
}

textarea.floating-input {
    min-height: 120px;
    resize: vertical;
}

.floating-label {
    position: absolute;
    left: 16px;
    top: 16px;
    font-size: 1rem;
    color: #64748b;
    pointer-events: none;
    transition: all 0.2s ease;
    font-weight: 500;
}

/* Floating label active state */
.floating-input:focus ~ .floating-label,
.floating-input:not(:placeholder-shown) ~ .floating-label,
.floating-select:valid ~ .floating-label {
    top: 6px;
    font-size: 0.75rem;
    color: #355594;
    font-weight: 600;
}

/* Custom Select tweaks */
.floating-select {
    appearance: none;
    cursor: pointer;
}
.select-icon {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
    pointer-events: none;
}

/* Submit Action Area */
.form-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.ultra-submit-btn { background: #355594; border: none; border-radius: 999px; padding: 10px 10px 10px 22px; font-size: 1.1rem; display: inline-flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 10px 25px rgba(53, 85, 148, 0.25); cursor: pointer; width: auto; max-width: none; }
.ultra-submit-btn:hover { background: #28447a; transform: translateY(-2px); box-shadow: 0 15px 35px rgba(53, 85, 148, 0.35); }
.ultra-submit-btn span { color: white; font-weight: 500; margin-right: 14px; }
.ultra-submit-btn .btn-icon { background: white; color: #355594; border-radius: 50%; width: 32px !important; height: 32px !important; padding: 6px; margin-left: 0 !important; }

.form-note {
    font-size: 0.85rem;
    color: #94a3b8;
    font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 991px) {
    .modal-split-layout {
        flex-direction: column;
        min-height: auto;
    }
    .modal-left-pane {
        flex: 0 0 auto;
        padding: 3rem 2rem;
    }
    .pane-title {
        font-size: 1.8rem;
    }
    .pane-icon-wrapper {
        width: 60px;
        height: 60px;
        margin-bottom: 1.5rem !important;
    }
    .modal-right-pane {
        flex: 0 0 auto;
    }
    .form-scroll-container {
        padding: 3rem 2rem;
        height: auto;
        max-height: 60vh;
    }
    .ultra-close-btn {
        top: 15px;
        right: 15px;
        background: rgba(255,255,255,0.2);
        color: white;
    }
}
</style>
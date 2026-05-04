<template>
  <b-container fluid class="main-wrapper p-0">
    <!-- DECORATIVE ELLIPSES -->
    <div class="decorative-ellipses d-none d-lg-block">
        <div class="ellipse ellipse-tl"></div>
        <div class="ellipse ellipse-tr"></div>
        <div class="ellipse ellipse-br"></div>
    </div>


    <b-container class="content-container pt-12 pb-24">
      <!-- HERO -->
      <section class="sb-hero text-center mb-16 mt-8">
        <span class="section-eyebrow">For Forwarders</span>
        <h1 class="section-title">Small Business</h1>
        <p class="section-subtitle mt-4 mx-auto" style="max-width: 700px;">
          Streamlined Logistics Solutions For Small Freight Forwarders.<br>
          We help small and independent freight forwarders elevate their operational efficiency with powerful, affordable automation tools.
        </p>
        
        <!-- VIDEO PLACEHOLDER -->
        <div class="video-placeholder-wrap mt-10">
          <div class="video-placeholder">
            <div class="video-placeholder-glow"></div>
            <div class="play-btn">
              <b-icon icon="play-fill" class="play-icon"></b-icon>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURES -->
      <section class="sb-features mb-25 mt-16">
        <b-row class="justify-content-center text-center">
          <b-col lg="4" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8">
                  <div class="icon-circle"></div>
                  <img src="/media/custome/affordable-awb.svg" alt="Affordable AWB Transfer" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Affordable AWB Transfer</h3>
                <p class="feature-desc mt-3">Process your waybills seamlessly and cost-effectively. Our platform provides smart tools designed specifically for the budgets of independent forwarders.</p>
              </b-card>
            </div>
          </b-col>
          <b-col lg="4" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8">
                  <div class="icon-circle"></div>
                  <img src="/media/custome/database-management.svg" alt="Database Management" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Database Management</h3>
                <p class="feature-desc mt-3">Keep all your critical freight data in one secure, accessible place. Easily search, retrieve, and manage your past AWBs without any hassle.</p>
              </b-card>
            </div>
          </b-col>
          <b-col lg="4" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8">
                  <div class="icon-circle"></div>
                  <img src="/media/custome/edi-smart-tracking.svg" alt="EDI for Smart Tracking" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">EDI for Smart Tracking</h3>
                <p class="feature-desc mt-3">Connect directly with airlines using standard EDI messaging. Enjoy real-time tracking and automated status updates for all your shipments.</p>
              </b-card>
            </div>
          </b-col>
        </b-row>
      </section>

      <!-- PLANS -->
      <section class="sb-plans-section mb-25">
        <div class="text-center mb-12">
            <span class="section-eyebrow">Pricing</span>
            <h2 class="section-title">Plans</h2>
        </div>
        <b-row class="justify-content-center g-4">
          <!-- Basic Plan -->
          <b-col lg="5" md="6" class="mb-8">
            <div class="feature-card-wrapper plan-wrapper">
              <div class="feature-card-glow"></div>
              <div class="feature-card plan-card">
                <div class="plan-header">
                  <h3 class="feature-title mb-0">Basic plan</h3>
                  <div class="plan-icon-ring"></div>
                </div>
                <div class="plan-body">
                  <p class="feature-desc plan-desc">Affordable starting point for manual users and independent forwarders.</p>
                  <ul class="plan-features">
                    <li><b-icon icon="check2" class="me-2 check-icon"></b-icon> Full Documentation Suite</li>
                    <li><b-icon icon="check2" class="me-2 check-icon"></b-icon> Multi-user access for different stations</li>
                    <li><b-icon icon="check2" class="me-2 check-icon"></b-icon> Secure Document Storage</li>
                    <li><b-icon icon="check2" class="me-2 check-icon"></b-icon> Printing for MAWB & HAWB</li>
                  </ul>
                </div>
                <div class="plan-footer text-center">
                  <b-button to="/contact-us?modal=quote" class="hero-btn">
                      <span>Book Now</span>
                      <b-icon icon="arrow-right" class="btn-icon ms-2"></b-icon>
                  </b-button>
                </div>
              </div>
            </div>
          </b-col>

          <!-- Pro Plan -->
          <b-col lg="5" md="6" class="mb-8">
            <div class="feature-card-wrapper plan-wrapper">
              <div class="feature-card-glow pro-glow"></div>
              <div class="feature-card plan-card pro-card">
                <div class="plan-header">
                  <h3 class="feature-title mb-0">Pro plan</h3>
                  <div class="plan-icon-ring pro-ring"></div>
                </div>
                <div class="plan-body">
                  <p class="feature-desc plan-desc">Advanced features for fast growing businesses and high volume forwarders.</p>
                  <ul class="plan-features">
                    <li><b-icon icon="check2" class="me-2 check-icon"></b-icon> <strong>All Basic features included</strong></li>
                    <li><b-icon icon="check2" class="me-2 check-icon"></b-icon> 150+ Airline Direct Connectivity</li>
                    <li><b-icon icon="check2" class="me-2 check-icon"></b-icon> Real-time Shipment Tracking</li>
                    <li><b-icon icon="check2" class="me-2 check-icon"></b-icon> Dedicated Customer Support</li>
                    <li><b-icon icon="check2" class="me-2 check-icon"></b-icon> Unlimited User Accounts</li>
                  </ul>
                </div>
                <div class="plan-footer text-center">
                  <b-button to="/contact-us?modal=quote" class="hero-btn">
                      <span>Book Now</span>
                      <b-icon icon="arrow-right" class="btn-icon ms-2"></b-icon>
                  </b-button>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </section>

      <!-- CTA -->
      <section class="sb-cta-section mb-25 text-center">
        <div class="feature-card-wrapper cta-wrapper">
            <div class="feature-card-glow"></div>
            <div class="feature-card cta-card align-items-center">
              <h2 class="section-title">Not sure which plan suits your business?</h2>
              <p class="section-subtitle mt-4 mb-8" style="max-width: 800px;">Contact us for a tailored demo. We'll help you explore our features and choose the best plan to optimize your workflow and grow your business with confidence.</p>
              <b-button to="/contact-us" class="hero-btn">
                <span>Contact Us</span>
                <b-icon icon="arrow-right" class="btn-icon ms-2"></b-icon>
              </b-button>
            </div>
        </div>
      </section>

      <!-- FAQS -->
      <section class="sb-faq-section mb-16">
        <div class="text-center mb-12">
            <span class="section-eyebrow">Support</span>
            <h2 class="section-title">FAQs</h2>
        </div>
        <b-row class="justify-content-center">
          <b-col lg="8">
            <div class="faq-accordion-list">
              <article v-for="(faq, idx) in accordions" :key="idx" 
                    class="faq-item" :class="{'is-open': faq.isOpen}">
                <div class="faq-header" @click="toggleAccordion(idx)" 
                      role="button" :aria-expanded="faq.isOpen.toString()"
                      :aria-controls="`faq-content-${idx}`">
                    <h3 class="faq-question">{{ faq.title }}</h3>
                    <div class="faq-toggle-icon">
                        <div class="icon-line horizontal"></div>
                        <div class="icon-line vertical" :class="{'is-hidden': faq.isOpen}"></div>
                    </div>
                </div>
                <b-collapse v-model="faq.isOpen" :id="`faq-content-${idx}`">
                    <div class="faq-body">
                        <p>{{ faq.content }}</p>
                    </div>
                </b-collapse>
              </article>
            </div>
          </b-col>
        </b-row>
      </section>

    </b-container>
  </b-container>
</template>

<script>

export default {
  name: "SmallBusiness",
  components: { },
  data() {
    return {
      accordions: [
        { title: "What features are included in the basic plan?", content: "The basic plan includes our full documentation suite, multi-user access for different stations, secure document storage, and printing capabilities for MAWB and HAWB.", isOpen: false },
        { title: "How many users can I add on the pro plan?", content: "The pro plan offers unlimited user accounts with role-based access control.", isOpen: false },
        { title: "Is there a setup fee for F16s?", content: "No, we do not charge any hidden setup fees. You only pay the subscription fee for your selected plan.", isOpen: false },
        { title: "Can I upgrade from Basic to Pro later?", content: "Yes, you can seamlessly upgrade your plan at any time through your account settings.", isOpen: false }
      ]
    }
  },
  methods: {
    toggleAccordion(index) {
        this.accordions[index].isOpen = !this.accordions[index].isOpen;
    }
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.main-wrapper {
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow-x: hidden;
}

/* Decorative background elements */
.decorative-ellipses .ellipse {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    z-index: 0;
    opacity: 0.5;
}
.ellipse-tl { width: 400px; height: 400px; background: #D0E6F8; top: -100px; left: -100px; }
.ellipse-tr { width: 300px; height: 300px; background: #E6F0FF; top: 20%; right: -50px; }
.ellipse-br { width: 500px; height: 500px; background: #F0F7FF; bottom: 10%; left: 20%; }

.content-container {
    position: relative;
    z-index: 10;
}

/* Typography Standardized */
.section-title {
    font-size: 3rem;
    font-weight: 800;
    color: #1e3a8a;
    letter-spacing: -1px;
    margin-bottom: 0.5rem;
}
.section-subtitle {
    font-size: 1.15rem;
    color: #4A5E80;
    line-height: 1.6;
}
.section-eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    font-weight: 700;
    color: #355594;
    opacity: 0.6;
    margin-bottom: 1rem;
    display: block;
}

/* Hero Button */
.hero-btn {
    background: #355594;
    border: none;
    border-radius: 999px;
    padding: 10px 10px 10px 22px;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s ease;
    text-decoration: none;
}
.hero-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.25);
    color: white;
}
.hero-btn span {
    color: white;
    font-weight: 500;
    margin-right: 14px;
}
.hero-btn .btn-icon {
    background: white;
    color: #355594;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    padding: 8px;
}

/* Video Placeholder */
.video-placeholder-wrap {
    display: flex;
    justify-content: center;
}
.video-placeholder {
    width: 100%;
    max-width: 800px;
    height: 400px;
    border-radius: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 20px 40px rgba(53, 85, 148, 0.1);
    transition: all 0.4s ease;
    overflow: hidden;
}
.video-placeholder-glow {
    position: absolute;
    inset: -50px;
    background: radial-gradient(circle, rgba(53, 85, 148, 0.1) 0%, transparent 70%);
    z-index: 0;
    transition: opacity 0.4s ease;
    opacity: 0.5;
}
.video-placeholder:hover {
    transform: translateY(-5px);
    box-shadow: 0 30px 60px rgba(53, 85, 148, 0.15);
}
.video-placeholder:hover .video-placeholder-glow {
    opacity: 1;
}
.play-btn {
    position: relative;
    z-index: 1;
    width: 80px;
    height: 80px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.2);
    transition: transform 0.3s ease;
}
.video-placeholder:hover .play-btn {
    transform: scale(1.1);
}
.play-icon {
    font-size: 2.5rem;
    color: #355594;
    margin-left: 6px;
}

/* Feature Cards (Glassmorphism) */
.feature-card-wrapper {
    position: relative;
    height: 100%;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.feature-card-glow {
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #355594, #ABC0FF);
    border-radius: 34px;
    opacity: 0;
    filter: blur(15px);
    transition: opacity 0.4s ease;
    z-index: 0;
}
.feature-card {
    position: relative;
    z-index: 1;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 32px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%);
    backdrop-filter: blur(20px);
    padding: 2.5rem;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    display: flex;
    flex-direction: column;
    box-shadow: 
        0 4px 10px rgba(0, 0, 0, 0.02),
        inset 0 0 0 1px rgba(255, 255, 255, 0.6);
}
.feature-card :deep(.card-body) {
    padding: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
}
.feature-icon-container {
    position: relative;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 2.5rem auto;
}
.icon-circle {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #F0F7FF;
    border-radius: 32px;
    transform: rotate(45deg);
    transition: all 0.4s ease;
    box-shadow: 0 10px 20px rgba(53, 85, 148, 0.05);
}
.feature-icon {
    position: relative;
    z-index: 2;
    max-width: 64px;
    max-height: 64px;
    transition: all 0.5s ease;
}
.feature-title {
    color: #1e3a6e;
    font-weight: 800;
    font-size: 1.4rem;
    margin-bottom: 1.25rem;
    letter-spacing: -0.5px;
}
.feature-desc {
    color: #5A6B8A;
    font-size: 1rem;
    line-height: 1.7;
    margin-bottom: 2rem;
    opacity: 0.9;
}

/* Hover States for Feature Cards */
.feature-card-wrapper:hover {
    transform: translateY(-8px);
}
.feature-card-wrapper:hover .feature-card-glow {
    opacity: 0.25;
}
.feature-card-wrapper:hover .feature-card {
    background: rgba(255, 255, 255, 0.95);
    border-color: #ABC0FF;
    box-shadow: 0 20px 40px rgba(53, 85, 148, 0.1);
}
.feature-card-wrapper:hover .icon-circle {
    background: #355594;
    transform: rotate(45deg) scale(1.05);
}
.feature-card-wrapper:hover .feature-icon {
    filter: brightness(0) invert(1);
}

/* Plans Section Specific */
.plan-wrapper {
    max-width: 100%;
}
.plan-card {
    text-align: left;
    align-items: flex-start;
}
.plan-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 1.5rem;
}
.plan-icon-ring {
    width: 24px;
    height: 24px;
    border: 3px solid #d0e6f8;
    border-radius: 50%;
}
.plan-desc {
    min-height: 48px;
    margin-bottom: 2rem;
}
.plan-features {
    list-style: none;
    padding: 0;
    margin: 0;
    flex-grow: 1;
}
.plan-features li {
    font-size: 0.95rem;
    color: #374151;
    margin-bottom: 1rem;
    display: flex;
    align-items: flex-start;
}
.check-icon {
    margin-top: 3px;
    color: #355594 !important;
    font-size: 1.2rem;
}
.plan-footer {
    width: 100%;
    margin-top: 2rem;
}
.pro-glow {
    background: linear-gradient(135deg, #1e3a6e, #355594);
    opacity: 0.15;
}
.pro-card {
    border-color: #ABC0FF;
}
.pro-ring {
    border-color: #355594;
    background: #355594;
}

/* CTA Specific */
.cta-wrapper {
    max-width: 900px;
    margin: 0 auto;
}
.cta-card {
    padding: 4rem 2rem;
    text-align: center;
}

/* FAQs Specific */
.faq-accordion-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.faq-item {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
}
.faq-item:hover {
    background: rgba(255, 255, 255, 0.9);
    border-color: #ABC0FF;
}
.faq-item.is-open {
    border-color: #355594;
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.08);
}
.faq-header {
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
}
.faq-question {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e3a6e;
    margin: 0;
    padding-right: 2rem;
}
.faq-toggle-icon {
    position: relative;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}
.icon-line {
    position: absolute;
    background-color: #355594;
    transition: transform 0.3s ease, opacity 0.3s ease;
    border-radius: 2px;
}
.icon-line.horizontal {
    width: 20px;
    height: 2px;
    top: 9px;
    left: 0;
}
.icon-line.vertical {
    width: 2px;
    height: 20px;
    top: 0;
    left: 9px;
}
.icon-line.vertical.is-hidden {
    transform: scaleY(0);
    opacity: 0;
}
.faq-body {
    padding: 0 1.5rem 1.5rem;
    color: #4A5E80;
    line-height: 1.7;
}
.faq-body p {
    margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
    .section-title {
        font-size: 2.25rem;
    }
    .video-placeholder {
        height: 250px;
    }
    .cta-card {
        padding: 2.5rem 1.5rem;
    }
    .feature-card {
        padding: 1.5rem;
    }
}
</style>

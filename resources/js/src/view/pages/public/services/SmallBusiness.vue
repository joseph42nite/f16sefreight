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
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/affordable-awb.svg" alt="Affordable AWB Transfer" class="img-fluid feature-icon">
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
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/database-management.svg" alt="Database Management" class="img-fluid feature-icon">
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
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/edi-smart-tracking.svg" alt="EDI for Smart Tracking" class="img-fluid feature-icon">
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
                      <div class="btn-icon">
                          <b-icon icon="arrow-right"></b-icon>
                      </div>
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
                      <div class="btn-icon">
                          <b-icon icon="arrow-right"></b-icon>
                      </div>
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
                <div class="btn-icon">
                    <b-icon icon="arrow-right"></b-icon>
                </div>
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
  metaInfo: {
    title: "Logistics Solutions for Small Business | F16s E-Freight",
    meta: [
      { name: 'description', content: 'Elevate your small freight forwarding business with F16s. Affordable AWB transfer, secure database management, and EDI tracking tools designed for independent forwarders.' },
      { property: 'og:title', content: 'Logistics Solutions for Small Business | F16s E-Freight' },
      { property: 'og:description', content: 'Elevate your small freight forwarding business with F16s. Affordable AWB transfer, secure database management, and EDI tracking tools designed for independent forwarders.' }
    ]
  },
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



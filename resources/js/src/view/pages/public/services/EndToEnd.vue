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
      <section class="ete-hero text-center mb-16 mt-8">
        <span class="section-eyebrow">End-to-End Freight Solutions, We've Got You Covered</span>
        <h1 class="section-title">End to End Service</h1>
        <p class="section-subtitle mt-4 mx-auto" style="max-width: 800px;">
          At F16s, we offer comprehensive end-to-end solutions for all your freight forwarding needs. From documentation to tracking and final delivery, our integrated services streamline your operations and help you manage every stage of the logistics process.
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

      <!-- FEATURES GRID -->
      <section class="ete-features mb-25 mt-16">
        <b-row class="justify-content-center text-center">
          <!-- AWB Transfer -->
          <b-col lg="4" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/affordable-awb.svg" alt="AWB Transfer and Documentation" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">AWB Transfer and Documentation</h3>
                <p class="feature-desc mt-3">Seamlessly manage your Air Waybills and other shipping documents, reducing manual work and ensuring compliance with industry standards.</p>
              </b-card>
            </div>
          </b-col>

          <!-- Data Management -->
          <b-col lg="4" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/database-management.svg" alt="Data Management and ERP Solutions" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Data Management and ERP Solutions</h3>
                <p class="feature-desc mt-3">Our cloud-based systems allow you to securely store, manage, and access all your freight data. With real-time insights, you can track performance, identify areas for improvement, and scale as your business grows.</p>
              </b-card>
            </div>
          </b-col>

          <!-- Automated Workflow -->
          <b-col lg="4" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/automated-workflow.svg" alt="Automated Workflow" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Automated Workflow</h3>
                <p class="feature-desc mt-3">Automate your freight processes with advanced tools that handle everything from documentation to customer communication, saving time and reducing errors.</p>
              </b-card>
            </div>
          </b-col>

          <!-- Real-Time Tracking -->
          <b-col lg="4" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/real-time.svg" alt="Real-Time Tracking and Visibility" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Real-Time Tracking and Visibility</h3>
                <p class="feature-desc mt-3">Keep track of shipments from departure to arrival with live tracking features that offer full transparency and control over your freight movement.</p>
              </b-card>
            </div>
          </b-col>

          <!-- Customer Support -->
          <b-col lg="4" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/customer-support.svg" alt="Customer Support at Every Step" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Customer Support at Every Step</h3>
                <p class="feature-desc mt-3">Our expert team is here to assist you in every stage of the process. Whether you need help with setup, troubleshooting, or optimizing your operations, we're ready to provide the support you need.</p>
              </b-card>
            </div>
          </b-col>
        </b-row>
      </section>

      <!-- CTA SECTION -->
      <section class="ete-cta-section mb-25 text-center">
        <div class="feature-card-wrapper cta-wrapper">
            <div class="feature-card-glow"></div>
            <div class="feature-card cta-card align-items-center">
              <h2 class="section-title">Talk to an expert</h2>
              <p class="section-subtitle mt-4 mb-8" style="max-width: 800px;">
                With F16s, you can focus on growing your business while we handle the logistics. Contact us today to find out how our end-to-end service can simplify your operations.
              </p>
              
              <b-button to="/contact-us" class="hero-btn">
                <span>Contact us</span>
                <div class="btn-icon">
                  <b-icon icon="arrow-right"></b-icon>
                </div>
              </b-button>
            </div>
        </div>
      </section>

      <!-- FAQS -->
      <section class="ete-faq-section mb-16">
        <div class="text-center mb-12">
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
  name: "EndToEnd",
  metaInfo: {
    title: "End-to-End Freight Services | F16s E-Freight Solutions",
    meta: [
      { name: 'description', content: 'Comprehensive end-to-end logistics automation. From AWB generation and airline connectivity to real-time tracking and final delivery.' },
      { property: 'og:title', content: 'End-to-End Freight Services | F16s E-Freight Solutions' },
      { property: 'og:description', content: 'Comprehensive end-to-end logistics automation. From AWB generation and airline connectivity to real-time tracking and final delivery.' }
    ]
  },
  components: { },
  data() {
    return {
      accordions: [
        { title: "What exactly does 'end-to-end' cover in your platform?", content: "Our end-to-end service covers the entire digital lifecycle of a shipment—from initial AWB generation and airline connectivity to real-time tracking and final status updates.", isOpen: false },
        { title: "Can I integrate F16s with my existing internal ERP?", content: "Yes, our platform is built for connectivity. We offer flexible EDI and API options to ensure that your data flows seamlessly between F16s and your existing business management tools.", isOpen: false },
        { title: "Is real-time tracking available for all air freight shipments?", content: "Yes, through our direct integrations with 150+ airlines, we provide real-time status updates and visibility for all Air Waybills processed through our system.", isOpen: false },
        { title: "Does the service help with customs documentation?", content: "Our platform automates the generation of MAWB, HAWB, and consolidation manifests, ensuring all required documentation is accurate and ready for customs processing.", isOpen: false }
      ]
    }
  },
  methods: {
    toggleAccordion(index) {
        this.accordions[index].isOpen = !this.accordions[index].isOpen;
    }
  }
}
</script>



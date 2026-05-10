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
      <section class="cs-hero text-center mb-16 mt-8">
        <span class="section-eyebrow">Data Infrastructure</span>
        <h1 class="section-title">Cloud Storage</h1>
        <p class="section-subtitle mt-4 mx-auto" style="max-width: 700px;">
          Secure, scalable, and reliable cloud solutions designed for the modern logistics landscape. Keep your critical data safe and accessible everywhere.
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
      <section class="cs-features mb-25 mt-16">
        <b-row class="justify-content-center text-center">
          <!-- Top-Tier Security -->
          <b-col lg="4" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/top-tier-security.svg" alt="Top-Tier Security" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Top-Tier Security</h3>
                <p class="feature-desc mt-3">We use state-of-the-art encryption and security protocols to safeguard your data from unauthorized access. Whether it’s sensitive shipment information or customer records, you can trust that your data is secure at every step.</p>
              </b-card>
            </div>
          </b-col>

          <!-- Reliable Uptime -->
          <b-col lg="4" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/reliable-uptime.svg" alt="Reliable Uptime" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Reliable Uptime</h3>
                <p class="feature-desc mt-3">Our cloud infrastructure is built for maximum stability, ensuring your operations are never disrupted by downtime. With F16s, your data is stored in a secure, fully redundant system that guarantees continuous access.</p>
              </b-card>
            </div>
          </b-col>

          <!-- Auto-Backups -->
          <b-col lg="4" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/autobackups.svg" alt="Auto - Backups" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Auto - Backups</h3>
                <p class="feature-desc mt-3">We provide regular automated backups, so you’ll never have to worry about losing important data. Even in the unlikely event of a system issue, your information is protected and recoverable.</p>
              </b-card>
            </div>
          </b-col>

          <!-- Data Privacy -->
          <b-col lg="4" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/dataprivacy.svg" alt="Data Privacy" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Data Privacy</h3>
                <p class="feature-desc mt-3">Our cloud services adhere to international data privacy standards, ensuring your operations stay compliant with regulations, while giving you peace of mind that your clients' data is handled responsibly.</p>
              </b-card>
            </div>
          </b-col>

          <!-- Scalable Performance -->
          <b-col lg="4" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/scalable-performance.svg" alt="Scalable Performance" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Scalable Performance</h3>
                <p class="feature-desc mt-3">Whether you're a small business just getting started or a rapidly growing operation, our cloud service scales with your needs. As your business expands, F16s ensures your data systems grow seamlessly without compromising performance.</p>
              </b-card>
            </div>
          </b-col>
        </b-row>
      </section>

      <!-- GROWTH FOCUS SECTION -->
      <section class="cs-growth-section mb-25 text-center">
          <h2 class="section-title mb-6">Stay Focused on Growth, Leave Data Security to Us</h2>
          <p class="section-subtitle mx-auto" style="max-width: 900px;">
              With F16s’ advanced cloud service, you can rest assured that your data is always secure, accessible, and ready to support your business. No matter how large or complex your operations become, our robust cloud solutions will keep you moving forward without disruption.
          </p>
      </section>

      <!-- EXPERT CTA SECTION (Standardized to SB Design) -->
      <section class="cs-cta-section mb-25 text-center">
        <div class="feature-card-wrapper cta-wrapper">
            <div class="feature-card-glow"></div>
            <div class="feature-card cta-card align-items-center">
              <span class="section-eyebrow">Consultation</span>
              <h2 class="section-title">Have questions about data security? Talk to an Expert</h2>
              <p class="section-subtitle mt-4 mb-10" style="max-width: 800px;">
                At F16s, we’re committed to helping you understand how our cloud solutions can protect and strengthen your business. Our experts provide personalized guidance on <strong>security measures</strong>, <strong>encryption & backups</strong>, and <strong>international data compliance</strong>.
              </p>

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
      <section class="cs-faq-section mb-16">
        <div class="text-center mb-12">
            <span class="section-eyebrow">FAQ</span>
            <h2 class="section-title">Common Questions</h2>
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
  name: "CloudStorage",
  metaInfo: {
    title: "Secure Cloud Storage for Logistics | F16s E-Freight",
    meta: [
      { name: 'description', content: 'Reliable, scalable cloud infrastructure for modern logistics. Secure your freight data with auto-backups, enterprise encryption, and 99.9% uptime.' },
      { property: 'og:title', content: 'Secure Cloud Storage for Logistics | F16s E-Freight' },
      { property: 'og:description', content: 'Reliable, scalable cloud infrastructure for modern logistics. Secure your freight data with auto-backups, enterprise encryption, and 99.9% uptime.' }
    ]
  },
  components: { },
  data() {
    return {
      accordions: [
        { title: "Is my data encrypted in the cloud?", content: "Yes, all data stored in the F16s cloud is protected with enterprise-grade end-to-end encryption, ensuring that only authorized users can access your sensitive information.", isOpen: false },
        { title: "How often are backups performed?", content: "We perform automated daily backups of all your documents and data, ensuring that your records are always recoverable in case of any system issues.", isOpen: false },
        { title: "What happens if I exceed my storage limit?", content: "Our cloud infrastructure is designed to be scalable. If your business grows beyond your current plan's capacity, we offer flexible upgrade options to accommodate your expanding data needs.", isOpen: false },
        { title: "How reliable is the F16s cloud infrastructure?", content: "We maintain a 99.9% uptime guarantee, using fully redundant systems to ensure that your freight operations are never disrupted by technical downtime.", isOpen: false }
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



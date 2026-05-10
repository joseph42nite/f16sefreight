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
      <section class="privacy-hero text-center mb-16 mt-8">
        <span class="section-eyebrow">Your Privacy, Our Priority</span>
        <h1 class="section-title">Privacy</h1>
        <p class="section-subtitle mt-4 mx-auto" style="max-width: 800px;">
          At F16s, we take your privacy seriously. We ensure that your sensitive business information is handled with the highest level of confidentiality and care. Our privacy practices include:
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
      <section class="privacy-features mb-25 mt-16">
        <b-row class="justify-content-center text-center">
          <!-- Strict Access Controls -->
          <b-col lg="3" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/strict-access.svg" alt="Strict Access Controls" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Strict Access Controls</h3>
                <p class="feature-desc mt-3">We implement stringent access controls, ensuring only authorized personnel can view or manage your data. This ensures that your business information stays private and protected.</p>
              </b-card>
            </div>
          </b-col>

          <!-- Privacy Regulations -->
          <b-col lg="3" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/privacy-regu.svg" alt="Privacy Regulations" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Privacy Regulations</h3>
                <p class="feature-desc mt-3">F16s adheres to global data privacy standards, such as GDPR and other local regulations, guaranteeing that your business stays compliant with the laws in your region.</p>
              </b-card>
            </div>
          </b-col>

          <!-- Data Encryption -->
          <b-col lg="3" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/data-encription.svg" alt="Data Encryption" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Data Encryption</h3>
                <p class="feature-desc mt-3">All data transmitted through our systems is encrypted, ensuring that it remains secure from unauthorized access at all times.</p>
              </b-card>
            </div>
          </b-col>

          <!-- Transparent Data Handling -->
          <b-col lg="3" md="6" class="mb-8">
            <div class="feature-card-wrapper">
              <div class="feature-card-glow"></div>
              <b-card class="feature-card h-100 align-items-center">
                <div class="feature-icon-container mb-8 mx-auto">
                  <div class="icon-circle"></div>
                  <img src="/media/assets/vectors/trasparent-data.svg" alt="Transparent Data Handling" class="img-fluid feature-icon">
                </div>
                <h3 class="feature-title mt-4">Transparent Data Handling</h3>
                <p class="feature-desc mt-3">We are transparent about how we collect, use, and store your information. You can trust that your data is used solely for operational purposes, with no unnecessary exposure.</p>
              </b-card>
            </div>
          </b-col>
        </b-row>
      </section>

      <!-- CTA SECTION -->
      <section class="privacy-cta-section mb-25 text-center">
        <div class="feature-card-wrapper cta-wrapper">
            <div class="feature-card-glow"></div>
            <div class="feature-card cta-card align-items-center">
              <h2 class="section-title">Concerned about Privacy?</h2>
              <p class="section-subtitle mt-4 mb-8" style="max-width: 800px;">
                Contact us to learn more about how F16s protects your business data and maintains your privacy.
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
      <section class="privacy-faq-section mb-16">
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
  name: "Privacy",
  metaInfo: {
    title: "Privacy & Data Security | F16s E-Freight Solutions",
    meta: [
      { name: 'description', content: 'F16s prioritizes your privacy with strict access controls, global data compliance (GDPR), and enterprise-grade encryption for all your freight documentation.' },
      { property: 'og:title', content: 'Privacy & Data Security | F16s E-Freight Solutions' },
      { property: 'og:description', content: 'F16s prioritizes your privacy with strict access controls, global data compliance (GDPR), and enterprise-grade encryption for all your freight documentation.' }
    ]
  },
  components: { },
  data() {
    return {
      accordions: [
        { title: "Who has access to my company's sensitive data?", content: "At F16s, we implement strict role-based access controls. Only explicitly authorized personnel within your organization and our essential security team can access specific data points.", isOpen: false },
        { title: "Is my data shared with third parties or airlines?", content: "Your data is used exclusively for processing your requested freight operations. We never sell, share, or expose your business intelligence to third parties without your direct operational intent.", isOpen: false },
        { title: "How does F16s comply with global privacy regulations?", content: "We adhere to international data protection standards, including GDPR. Our systems are designed with privacy-by-design principles to ensure compliance across different global regions.", isOpen: false },
        { title: "Can I request permanent deletion of my data?", content: "Yes, upon account closure or specific request, we provide permanent data deletion services in accordance with our data retention policies and legal requirements.", isOpen: false }
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


